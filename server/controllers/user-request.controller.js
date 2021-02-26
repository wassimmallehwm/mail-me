const User = require('../models/user.model');
const RegisterRequest = require('../models/register.request.model');


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
        const request = await RegisterRequest.findById(id);
        await User.findOneAndUpdate({_id: request.user}, {enabled: true});
        await RegisterRequest.deleteOne({_id: id});
        const reqCount = await RegisterRequest.find().count();
        res.status(200).json(reqCount);
    } catch (e) {
        console.log('ERROR', e);
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