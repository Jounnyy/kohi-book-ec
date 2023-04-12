import User from "../models/User.js";
import log from "../utils/logger.js";
import argon2 from 'argon2';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req, res) => {
    try {
        const result = await User.findAll();
        res.status(200).json({status: 200, result});
    } catch (err) {
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error"});
    }
}

export const getUserById = async (req, res) => {
    try {
        const result = await User.findOne({
            where: {uuid: req.params.id}
        });
        res.status(200).json({status: 200, result});
    } catch (err) {
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error"});
    }
}


export const createUser = async (req, res) => {
    const files = req.files;
    const { name, email, password, confPassword, role } = req.body;

    // hashing password
    if(password !== confPassword) return res.status(400).json({msg: "password and confirm password do not match"})
    const hashPassword = await argon2.hash(password);

    // image handle
    if(files === null) return res.status(400).json({msg: "No file uploaded!"})
    const file = files.file;
    const size = file.data.length;
    const extend = path.extname(file.name);
    const fileName = file.md5 + extend;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif'];

    // validate image
    if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
    if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})

    file.mv(`./public/images/${fileName}`, async(err) => {
        if(err) return res.status(500).json({status:500, msg: err.message});
        try {
            await User.create({
                name: name,
                email: email,
                password: hashPassword,
                image: fileName,
                url: url,
                role: role
            });
            res.status(200).json({status: 200, msg: "data created!"});
        } catch (err) {
            log.error(err);
            res.status(500).json({status: 500, msg: "Internal server Error"});
        }
    })
}

export const updateUser = async (req, res) => {
    let fileName, hashPassword;
    const files = req.files;
    const { name, email, password, confPassword, role } = req.body;

    const user = await User.findOne({
        where: {uuid: req.params.id}
    });
    log.debug(user)
    if (!user) return res.status(404).json({status: 404, msg: 'User not found'});

    if(password === null || password === ""){
        hashPassword = user.password;
    }else {
        hashPassword = await argon2.hash(password)
    }

    if(password !== confPassword) return res.status(400).json({status: 400, msg: 'Password and confrim password do not match'});
    if(files === null){
        fileName = user.image;
    }else{
        const file = files.file;
        const size = file.data.length;
        const extend = path.extname(file.name);
        fileName = file.md5 + extend;
        const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif']

        if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
        if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})
    
        file.mv(`./public/images/${fileName}`, async(err) => {
            if(err) return res.status(500).json({status: 500, msg: "internal server error", err: err.message})
        })
    }

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            image: fileName,
            url: url,
            role: role
        },{
            where: {id: user.id}
        })
        res.status(200).json({status: 200, msg: "user updated successfully"})
    } catch (err) {
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error", err: err.message});
    }
}

export const deleteUser = async(req, res) => {
    const user = await User.findOne({
        where: {uuid: req.params.id}
    });
    if(!user) return res.status(404).json({status: 404, msg: 'User not found'});
    
    let fileName = user.image;
    let pathImage = `../public/images/${fileName}`

    fs.unlinkSync(pathImage, err => {
        if(err) return log.error(err)
    });
    
    try{
        await User.destroy({
            where: {id: user.id}
        })
        res.status(200).json({status: 200, msg: 'User deleted'});
    }catch(err){
        log.error(err);
        res.status(500).json({status: 500, msg: "Internal server Error", err: err.message});
    };
}