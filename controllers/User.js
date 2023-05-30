import passwordComplexity from "joi-password-complexity";
import { validatePassword } from "../middleware/PasswordValidate.js";
import User from "../models/User.js";
import log from "../utils/logger.js";
import argon2 from 'argon2';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req, res) => {
    const { role } = req;
    try {
            if(role === 'admin' || role === 'seller'){
                const result = await User.findAll();
                res.status(200).json({status: 200, result});
            } else {
                const result = await User.findAll({
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt']
                    }
                });
                res.status(200).json({status: 200, result});
            }
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

    if(password !== confPassword) return res.status(400).json({msg: "password and confirm password do not match"})
    const validatePass = validatePassword(password, confPassword);
    if(validatePass['regex'] === 'false') return res.status(400).json({status: 400, msg: "The password must be at least 8 characters, there is one capital, one number and certain symbols are prohibited"})
    const hashPassword = await argon2.hash(password);

    if(req.role !== 'admin') {  
        if(role === 'admin') {
            res.status(403).json({status: 403, msg: 'Invalid Role'})
            return;
        }
    }

    if(files === null) return res.status(400).json({msg: "No file uploaded!"})
    const file = files.file;
    log.debug(files);
    const size = file.data.length;
    const extend = path.extname(file.name);
    const fileName = file.md5 + extend;
    const url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
    const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif'];

    if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
    if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})

    file.mv(`./public/images/users/${fileName}`, async(err) => {
        if(err) return res.status(500).json({ status:500, msg: err.message });
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
            return false;
        }
    })
}

export const updateUser = async (req, res) => {
    let fileName, hashPassword;
    const files = req.files;
    const { name, email, password, confPassword, role } = req.body;   
    const complextyOptions = { min: 8, max: 10, upperCase: 1, numeric: 1, symbol: 1 }                                              

    const user = await User.findOne({
        where: { uuid: req.params.id }
    });
    if (!user) return res.status(404).json({status: 404, msg: 'User not found'});

    if(password !== confPassword) return res.status(400).json({status: 400, msg: 'Password and confrim password do not match'});

    if(password === null || password === ""){
        hashPassword = user.password;
    }else {
        passwordComplexity(complextyOptions).validate(password);
        hashPassword = await argon2.hash(password);
    }

    if(files === null){
        fileName = user.image;
    }else{
        const file = files.file;
        const size = file.data.length;
        const extend = path.extname(file.name);
        fileName = file.md5 + extend;
        const allowedTypePhotos = ['.png', '.jpg', '.jpeg', '.gif'];

        if(!allowedTypePhotos.includes(extend.toLowerCase())) return res.status(422).json({msg: "Invalid image"})
        if(size > 5000000) return res.status(422).json({msg: "Images must be less than 5MB"})
    
        file.mv(`./public/images/users/${fileName}`, async(err) => {
            if(err) return res.status(500).json({status: 500, msg: "internal server error", err: err.message})
        })
    }

    const url = `${req.protocol}://${req.get("host")}/images/users/${fileName}`;
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
        where: { uuid: req.params.id }
    });
    if(!user) return res.status(404).json({status: 404, msg: 'User not found'});
    
    let fileName = user.image;
    let pathImage = `./public/images/users/${fileName}`
    fs.unlinkSync(pathImage, (err) => {
        if(err) return res.status(500).json({ status: 500, msg: err.message})
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