const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');

module.exports.create = async (req, res) => {
    try{
        const conversation = new Conversation({
            members:[req.body.senderId, req.body.receiverId]
        });
        await conversation.save();
        res.status(201).json(conversation);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send({error: err.message})
    }
}

module.exports.findByUser = async (req, res) => {
    try{
        const conversation = await Conversation.find({
            members: {$in : req.params.userId}
        })
        .populate({ path: 'members', model: 'User', select: 'username firstname lastname imagePath' })
        .exec();
        res.status(200).json(conversation);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send({error: err.message})
    }
}