const { sendEmail, mailBody } = require("../utils/mail");
var path = require('path');
const User = require("../models/user.model");

module.exports.sendMail = async (req, res) => {
    try{
        var {receiver, sender, senderId, subject, mailBody} = req.body;
        const date = new Date();
        const url = "https://wassimmalleh.com/api/mails/read/" + senderId + "/" + date.getTime();
        const html = "<img style='width: 1px; height: 1px; z-index: -9' src='" + url + "'>" + mailBody;
        var mailOptions = {
            to: receiver,
            from: process.env.SENDER,
            subject: sender + " - " + subject,
            html
        };
        const pushMail = async (error, info) => {
            if(!error){
                const user = await User.findOne({username: senderId});
                const mail = {
                    body: mailBody,
                    to: receiver,
                    createdAt: date
                }
                user.mails.push(mail);
                await user.save();
                return res.json(true);
            } else {
                return res.status(400).json({error})
            }
        }
        sendEmail(mailOptions, pushMail);
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

module.exports.sendReadMail = async (req, res) => {
    try{
        let receiver;
        const {senderId, date} = req.params;
        const user = await User.findOne({username: senderId});
        user.mails.map(mail => {
            var tempObj = Object.assign({}, mail);
            var temp = tempObj._doc;
            if(temp.createdAt.getTime() == date){
                temp.read = true;
                temp.readNumber++;
                receiver = temp.to;
            }
            return temp;
        })
        user.markModified('mails');
        await user.save();
        var mailOptions = {
            to: user.email,
            from: process.env.SENDER,
            subject: "MAIL-ME",
            pwd: process.env.PASSWD,
            text: 'The email you sent to ' + receiver + ' has been read'
            //html: resetPasswordMailTemplate(user.name, token)
        };
        const pushMail = async (error, info) => {
            if(!error){
                return res.sendFile(path.resolve("resources/1907.jpg"));
            } else {
                return res.status(400).json({error})
            }
        }
        sendEmail(mailOptions, pushMail);
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

module.exports.mails = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user});
        res.status(200).json(user.mails);
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

module.exports.mailById = async (req, res) => {
    try{
        const {mailId} = req.params;
        const user = await User.findOne({_id: req.user});
        const mail = user.mails.find(m => m._id == mailId);
        res.status(200).json(mail);
    } catch(e){
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

// module.exports.img = async (req, res) => {
//     try{
        
//         return res.sendFile(path.resolve("resources/1907.jpg"));
//     } catch(err){
//         console.log(err);
//         res.status(500).json({error: err.message});
//     }
// }