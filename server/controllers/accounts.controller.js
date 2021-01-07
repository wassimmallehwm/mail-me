const User = require('../models/user.model');

module.exports.create = async (req, res) => {
    try{
        const {label, email} = req.body;
        if(!email || !label)
            return res.status(400).json({msg: "Fields missing !"})
        const user = await User.findOne({_id: req.user});
        const exitAccount = user.accounts.find(acc => acc.label === label || acc.email === email);
        if(exitAccount)
            return res.status(400).json({msg: "Account label already exists !"})

        user.accounts.push({label, email});
        
        user.markModified('accounts');
        await user.save();
        res.status(201).json(user.accounts);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).json({'error' : e})
    }
}

module.exports.update = async (req, res) => {
    try{
        const {_id, label, email} = req.body;
        if(!email || !label)
            return res.status(400).json({msg: "Fields missing !"})
        const user = await User.findOne({_id: req.user});
        user.accounts.map(account => {
            var tempObj = Object.assign({}, account);
            var temp = tempObj._doc;
            if(temp._id == _id){
                temp.label = label;
                temp.email = email;
            }
            return temp;
        })
        user.markModified('accounts');
        await user.save();
        res.status(200).json(user.accounts);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send('Error uppdating the account')
    }
}

module.exports.findAll = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user});
        res.status(200).json(user.accounts);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send('Error fetching the accounts')
    }
}

module.exports.remove = async (req, res) => {
    try{
        const {id} = req.body;
        const user = await User.findOne({_id: req.user});
        user.accounts = user.accounts.filter(acc => acc._id != id);
        user.markModified('accounts');
        await user.save();
        res.status(200).json(user.accounts);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send('Error deleting the account')
    }
}