const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function generateToken(id){
    return token = jwt.sign({
        _id: id
    }, process.env.JWT_SECRET,
    {expiresIn: '1hr'})
}

module.exports.register = async (req, res) => {
    try{
        const {email, password, passwordCheck, username} = req.body;
        if(!email || !password || !passwordCheck)
            return res.status(400).json({msg: "Fields missing !"})
        if(password != passwordCheck)
            return res.status(400).json({msg: "Password and Password Check do not match!"})
        const existinguser = await User.findOne({email: email});
        if(existinguser)
            return res.status(400).json({msg: "An account with this email already exists !"})
        if(!username)
            username = email

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User();
        user.email = email;
        user.password = hashedPassword;
        user.username = username;


        const result = await user.save();
        const token = generateToken(result._id);
        result.password = undefined;
        result.mails = undefined;
        res.status(201).json({
            ...result._doc,
            id: result._id,
            token
        });
    } catch(e){
        console.log('ERROR', e);
        res.status(500).json({'error' : e})
    }
}

module.exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password)
            return res.status(400).json({msg: "Fields missing !"})

        const user = await User.findOne({email: email});
        if(!user)
            return res.status(404).json({msg: "Account does not exist !"})

        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(404).json({msg: "Invalid Credentials !"})

        const token = generateToken(user._id);
        user.password = undefined;
        user.mails = undefined;
        res.status(200).json({
            ...user._doc,
            id: user._id,
            token
        });
    } catch(e){
        console.log('ERROR', e);
        res.status(500).json({'error' : e})
    }
}

module.exports.refresh = async (req, res) => {
    try{
        const user = await User.findById(req.user);
        const token = generateToken(req.user);
        user.password = undefined;
        user.mails = undefined;
        res.status(200).json({
            ...user._doc,
            id: user._id,
            token
        });
    } catch(e){
        console.log('ERROR', e);
        res.status(500).json({'error' : e})
    }
}

module.exports.findAll = async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch(e){
        console.log('ERROR', e);
    }
}

module.exports.findOne = async (req, res) => {
    try{
        const User = await User.findById(req.params.id);
        res.json(User);
    } catch(e){
        console.log('ERROR', e);
    }
}


module.exports.update = async (req, res) => {
    try{
        const User = await User.findById(req.params.id);
        if(!User){
            res.status(404).send('User no found !')
        } else {
            result = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.status(201).json(result);
        }
    } catch(e){
        console.log('ERROR', e);
        res.status(400).send('Error adding a User')
    }
}

module.exports.current = async (req, res) => {
    try{
        const user = await User.findById(req.user);
        return res.json({
            displayName: user.displayName,
            id: user._id
        });
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

module.exports.verifyToken = async (req, res) => {
    try{
        const token = req.header("x-auth-token");
        if(!token){
            return res.json(false);
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified){
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if(!user){
            return res.json(false);
        }
        return res.json(true);
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}