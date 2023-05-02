import User from '../models/User.js';
import argon2 from 'argon2';

export async function Login(req, res){
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if(!user) return res.status(404).json({status: 404, msg: "User not found"});

    const matchingPassword = await argon2.verify(user.password, req.body.password);
    if(!matchingPassword) return res.status(400).json({status: 400, msg: "Password do not matches"})

    req.session.userId = user.uuid;
    const { uuid, name, email, url, role } = user;
    res.status(200).json({status:200, result:{uuid:uuid, name:name, email:email, url:url, role:role}})
}

export async function Profile(req, res){
    if(!req.session.userId) return res.status(401).json({status:402, msg:"Please login your account"})
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'url', 'role'],
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({status: 404, msg:"User not found"});
    res.status(200).json({status:200, user});
}

export async function LogOut(req, res) {
    req.session.destroy(err => {
        if(err) return res.status(err).json({status:500, msg:"Internal server error", err: err.message});
        res.status(200).json({status:200, msg:"User logged out"});
    }) 
}