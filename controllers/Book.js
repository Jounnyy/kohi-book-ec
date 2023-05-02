import convertRupiah from 'rupiah-format';
import Book from '../models/Book.js';
import log from '../utils/logger.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';

const attributes = [
    'uuid',
    'name',
    'desc',
    'release',
    'genre',
    'image',
    'url',
    'price',
    'more_information'
]

export const getBooks = async(req, res) => {
    let result;
    const { role } = req;

    try{
        if(role === "admin" || role === "seller"){
            result = await Book.findAll({
                attributes: attributes,
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            });
        }else{
            result = await Book.findAll({
                attributes: attributes,
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url', 'role']
                }]
            });
        }
        res.status(200).json({status: 200, result})
    } catch(err){
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error"});
    }
}

export const getBookById = async(req, res) => {
    let result;
    const { role } = req;

    const book = await Book.findOne({
        where: { uuid: req.params.id }
    });
    if(!book) return res.status(404).json({status: 404, msg: "product not found"});
    
    try{
        if(role === "admin" || role === "seller"){
            result = await Book.findOne({
                attributes: attributes,
                where: { id: book.id },
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url']
                }]
            });
        }else{
            result = await Book.findOne({
                attributes: attributes,
                [Op.and] : [
                    { id: book.id  },
                    { userId: req.userId }
                ],
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'image', 'url', 'role']
                }]
            });
        }
        res.status(200).json({status: 200, result})
    } catch(err){
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error"});
    }
}

export const createBook = async(req, res) => {
    const files = req.files;
    const { role } = req;
    const { name, desc, release, genre, price, more_information } = req.body;

    if(role === 'admin' || role === 'seller'){
        if(files === null) return res.status(400).json({ msg: "No file uploaded!" })
        const file = files.file;
        const size = file.data.length;
        const extend = path.extname(file.name);
        const fileName = file.md5 + extend;
        const url = `${req.protocol}://${req.get("host")}/images/product/${fileName}`;
        const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif'];
    
        const priceConvert = convertRupiah.convert(price);
    
        if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
        if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})
    
        if(more_information === null) return res.json("No more information available");
    
        file.mv(`./public/images/product/${fileName}`, async(err) => {
            if(err) return res.status(500).json({ status:500, msg: err.message });

            try {
                await Book.create({
                    name: name,
                    desc: desc,
                    release: release,
                    genre: genre,
                    image: fileName,
                    url: url,
                    price: priceConvert,
                    more_information: more_information,
                    userId: req.userId
                });
                res.status(200).json({status: 200, msg: "data created!"});
            } catch (err) {
                log.error(err);
                res.status(500).json({status: 500, msg: "Internal server Error"});
                return false;
            }
        })
    } else {
        res.status(401).json({ status: 401, msg: "Cannot be accessed, you're to be an seller or administrator." });
    }
}

export const updateBook = async(req, res) => {
    let fileName;
    const files = req.files;
    const { name, desc, release, genre, price, more_information } = req.body;
    const { role } = req;

    const book = await Book.findOne({
        where: { uuid: req.params.id }
    });

    if(!book) return res.status(404).json({ status: 404, msg: 'product not found' });
    
    if(role === 'admin' || role === 'seller'){
        if(files === null) {
            fileName = book.image;
        } else {
            const file = files.file;
            const size = file.data.length;
            const extend = path.extname(file.name);
            fileName = file.md5 + extend;
            const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif'];
            
            if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
            if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})

            file.mv(`./public/images/product/${fileName}`, async(err) => {
                if(err) return res.status(500).json({ status:500, msg: err.message });
            });
        }
        const priceConvert = convertRupiah.convert(price);
        const url = `${req.protocol}://${req.get("host")}/images/product/${fileName}`;

        try {
            await Book.update({
                name: name,
                desc: desc,
                release: release,
                genre: genre,
                image: fileName,
                url: url,
                price: priceConvert,
                more_information: more_information,
                userId: req.userId
            },{
                where: { id: book.id}
            });
            res.status(200).json({status: 200, msg: "product updated successfuly!"});
        } catch (err) {
            log.error(err);
            res.status(500).json({status: 500, msg: "Internal server Error"});
            return false;
        }
    } else {
        res.status(401).json({ status: 401, msg: "Cannot be accessed, you're to be an administrator"});
    }
}

export const deleteBook = async(req, res) => {
    const { role } = req;
    const book = await Book.findOne({
        where: { uuid: req.params.id }
    });
    if(!book) return res.status(404).json({status: 404, msg: 'Product not found'});

    if(role === 'admin' || role === 'seller'){
        let fileName = book.image;
        let pathImage = `./public/images/product/${fileName}`
        fs.unlinkSync(pathImage, (err) => {
            if(err) return res.status(500).json({ status: 500, msg: err.message })
        })
    
        try {
            await Book.destroy({
                where: { id: book.id }
            });
            res.status(200).json({ status: 200, msg: 'Product deleted!'})
        } catch (err) {
            log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error", err: err.message});
        }
    }else{
        res.status(401).json({ status: 401, msg: "Cannot be accessed, you're to be an administrator"});
    }
}