const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

module.exports.create = async (req, res) => {
    try{
        const message = new Message(req.body);
        await message.save();
        const result = await Message.findById(message._id)
        .populate({
            path: 'sender',
            model: 'User',
            select: 'username firstname lastname imagePath' 
        })
        .exec();
        res.status(201).json(result);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send({error: err.message})
    }
}

module.exports.findByConv = async (req, res) => {
    // try{
    //     const messages = await Message.find({
    //         conversation: req.params.conversation
    //     })
    //     .populate({ path: 'sender', model: 'User', select: 'username firstname lastname imagePath' })
    //     .exec();
    //     res.status(200).json(messages);
    // } catch(e){
    //     console.log('ERROR', e);
    //     res.status(500).send({error: err.message})
    // }

    // const conv = await Conversation.findById(req.params.conversation)

    // await Message.updateOne({seen: undefined, sender: conv.members.find(mem => mem != req.user)}, {seen: new Date()})

    const { page = 1 } = req.query;
    const options = {
        page: parseInt(page, 10),
        sort: {
            'createdAt' : 'desc'
        },
        limit: 15,
        //select: 'label ref createdAt categories images price',
        lean: true,
        populate: { path: 'sender', model: 'User', select: 'username firstname lastname imagePath' }
    };
    const query = {
        conversation: req.params.conversation
    };
    Message.paginate(query, options)
        .then(
            messages => {
                res.status(200).json(messages);
            }
        )
        .catch(
            error => {
                res.status(500).json({error: error.message});
            }
        );
}