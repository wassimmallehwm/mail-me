const User = require('../models/user.model');
const RegisterRequest = require('../models/register.request.model');
const { sendEmail, confirmation } = require('../utils/mail');


module.exports.findAll = async (req, res) => {
    try {
        const requests = await RegisterRequest.find()
        .populate({path: 'user', model: 'User', select: '_id username email'}).exec();
        res.status(200).json(requests);
    } catch (e) {
        console.log('ERROR', e);
    }
}

module.exports.validate = async (req, res) => {
    try {
        const {id} = req.params;
        const request = await RegisterRequest.findById(id)
        .populate({path: 'user', model: 'User', select: '_id username email'}).exec();
        await User.findOneAndUpdate({_id: request.user._id}, {enabled: true});
        await RegisterRequest.deleteOne({_id: id});
        const reqCount = await RegisterRequest.find().count();


        var mailOptions = {
            to: request.user.email,
            from: process.env.SENDER,
            subject: "MAIL-ME - Registration validated",
            pwd: process.env.PASSWD,
            //text: 'The email you sent to ' + receiver + ' has been read'
            html: confirmation(request.user.username)
        };
        const mailCallback = async (error, info) => {
            if(!error){
                res.status(200).json(reqCount);
            } else {
                return res.status(400).json({error})
            }
        }
        sendEmail(mailOptions, mailCallback);
    } catch (error) {
        console.log('ERROR', error);
        return res.status(500).json({error})
    }
}

module.exports.remove = async (req, res) => {
    try {
        const {id} = req.params;
        const request = await RegisterRequest.findById(id);
        await User.deleteOne({_id: request.user});
        await RegisterRequest.deleteOne({_id: id});
        const reqCount = await RegisterRequest.find().count();
        res.status(200).json(reqCount);
    } catch (e) {
        console.log('ERROR', e);
    }
}

module.exports.count = async (req, res) => {
    try {
        const reqCount = await RegisterRequest.find().count();
        res.status(200).json(reqCount);
    } catch (e) {
        console.log('ERROR', e);
    }
}