const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');


const getConv = async (senderId, receiverId) => {
    const result = await Conversation.findOne({
        members: {$all : [senderId, receiverId]}
    })
    .populate({ path: 'members', model: 'User', select: 'username firstname lastname imagePath' })
    .exec();
    return result
}

const createConv = async (senderId, receiverId) => {
    const conv = new Conversation({
        members:[senderId, receiverId]
    });
    const result = await conv.save();
    return result
}

module.exports.create = async (req, res) => {
    try{
        const conversation = await createConv(req.body.senderId, req.body.receiverId);
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

module.exports.createAndFind = async (req, res) => {
    try{
        const conversation = await getConv(req.body.senderId, req.body.receiverId)
        if(conversation) {
            res.status(200).json(conversation);
        } else {
            await createConv(req.body.senderId, req.body.receiverId);
            const newConv = await getConv(req.body.senderId, req.body.receiverId);
            res.status(200).json({
                created : true,
                conversation :newConv
            });
        }
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send({error: err.message})
    }
}