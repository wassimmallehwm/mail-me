const User = require('../models/user.model');
const Role = require('../models/role.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = require('../utils/imageUpload');
const RegisterRequest = require('../models/register.request.model');
const fs = require('fs');
const socketEvents = require('../utils/socketEvents');

function generateToken(id) {
    return token = jwt.sign({
        _id: id
    }, process.env.JWT_SECRET,
        { expiresIn: '1hr' })
}

const saveUser = async (req, res) => {
    try {
        const { email, password, passwordCheck, username, firstname, lastname, enabled } = req.body;
        if (!email || !password || !passwordCheck)
            throw new Error('Fields missing !')
        if (password != passwordCheck)
            throw new Error('Password and confirm password do not match !')
        const existinguser = await User.findOne({ email: email });
        if (existinguser)
            throw new Error('An account with this email already exists !')
        if (!username)
            username = email

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User();
        user.email = email;
        user.password = hashedPassword;
        user.username = username;
        user.accounts = [{ label: "Default", email }];
        const role = await Role.findOne({ label: 'GUEST' });
        user.role = role._id;
        if (firstname)
            user.firstname = firstname;
        if (lastname)
            user.lastname = lastname;
        if (enabled)
            user.enabled = enabled;
        const result = await user.save();
        return result;
    } catch (e) {
        console.log('ERROR', e.message);
        res.status(400).json({ msg: e.message })
    }
}

function userResponse(data) {
    const {
        _id,
        username,
        firstname,
        lastname,
        email,
        role,
        createdAt,
        imagePath
    } = data;
    const userResp = {
        _id,
        username,
        firstname,
        lastname,
        email,
        role: role._id,
        isAdmin: role.label == "ADMIN" ? true : false,
        createdAt,
        imagePath
    }
    return userResp;
}

module.exports.register = async (req, res) => {
    try {
        const result = await saveUser(req, res);
        if (result) {
            console.log("RESULT : ", result)
            const userRequest = new RegisterRequest();
            userRequest.user = result._id;
            const reqResult = await userRequest.save();
            if (reqResult) {
                req.io.to("ADMIN").emit(socketEvents.requestCreated)
                res.status(201).json(true);
            }
        }
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.add = async (req, res) => {
    try {
        const result = await saveUser(req, res);
        const newUser = await User.findById(result._id).select('_id username createdAt')
            .populate({ path: 'role', model: 'Role', select: 'label' }).exec();
        res.status(201).json(newUser);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "Fields missing !" })

        const user = await User.findOne({ email: email })
            .populate({ path: 'role', model: 'Role', select: 'label' }).exec();
        if (!user)
            return res.status(404).json({ msg: "Account does not exist !" })
        if (!user.enabled)
            return res.status(400).json({ msg: "Account disabled !" })


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(404).json({ msg: "Invalid Credentials !" })

        const token = generateToken(user._id);
        const response = userResponse(user)
        response.token = token;
        res.status(200).json(response);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.refresh = async (req, res) => {
    try {
        const verifUser = jwt.verify(req.header("x-auth-token"), process.env.JWT_SECRET, {
            ignoreExpiration: true
        });
        const user = await User.findById(verifUser._id);
        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.uploadImage = async (req, res) => {
    try {
        upload(req, res, async (err, data) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            const user = await User.findOne({ _id: req.user });
            user.imagePath = req.file.filename;
            user.images.unshift(req.file.filename)
            await user.save();
            return res.status(200).send(req.file)

        })
    } catch (e) {
        console.log('ERROR', e);
    }
}

module.exports.photos = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('images');
        res.status(200).json(user);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.changePic = async (req, res) => {
    try {
        const {image} = req.body
        const user = await User.findById(req.user);
        let imgs = user.images.filter(img => img != image)
        imgs.unshift(image)
        user.images = imgs
        user.imagePath = image
        await user.save();
        res.status(200).json(image);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.removePic = async (req, res) => {
    try {
        const {image} = req.body
        const user = await User.findById(req.user);
        user.images = user.images.filter(img => img != image)
        if(user.imagePath == image)
            user.imagePath = "user_default";
            
        await user.save();
        const filePath = 'public/images/users/' + image;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(200).json(user.imagePath);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        let user = await User.findById(req.user);
        if (!user) {
            res.status(404).send('User no found !')
        } else {
            user = await User.findOneAndUpdate({ _id: req.user }, req.body, { new: true });
            user.password = undefined;
            user.mails = undefined;
            user.accounts = undefined;
            const response = userResponse(user)
            res.status(200).json(response);
        }
    } catch (e) {
        res.status(400).json({ error: 'Error adding a User' })
    }
}

module.exports.edit = async (req, res) => {
    try {
        const userDetails = req.body;
        let user = await User.findOne({ _id: userDetails._id });
        if (!user) {
            res.status(404).send('User no found !')
        } else {
            user = await User.findOneAndUpdate({ _id: userDetails._id }, userDetails, { new: true })
            const response = await User.findById(user._id).select('_id username createdAt')
                .populate({ path: 'role', model: 'Role', select: 'label' }).exec();
            res.status(200).json(response);
        }
    } catch (e) {
        //console.log('ERROR', e);
        res.status(500).send('Error adding a User')
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const { password, newPassword, newPasswordCheck } = req.body;
        let user = await User.findOne({ _id: req.user });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(404).json({ msg: "Invalid Password !" })

        if (newPassword != newPasswordCheck)
            return res.status(400).json({ msg: "Password and Password Check do not match!" })

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json(true);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.findAll = async (req, res) => {
    try {
        const users = await User.find().select('_id username createdAt')
            .populate({ path: 'role', model: 'Role', select: 'label' }).exec();
        res.status(200).json(users);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -mails -accounts -createdAt -updatedAt -__v');
        res.status(200).json(user);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.remove = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Wrong password !" })
        await User.deleteOne({ _id: req.params.id });
        res.status(200).json(true);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'msg': e })
    }
}

module.exports.removeUser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        const request = await RegisterRequest.findOne({ user: req.params.id });
        if (request) {
            request.delete();
            req.io.to("ADMIN").emit(socketEvents.requestDeleted)
        }

        res.status(200).json(true);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'msg': e })
    }
}

module.exports.search = async (req, res) => {
    try {
        const { query } = req.query
        const filter = {
            '_id': { $ne: req.user },
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { firstname: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } }
            ]
        }
        const users = await User.find(filter)
            .select('username firstname lastname imagePath')
            .exec();
        res.status(200).json(users);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}
