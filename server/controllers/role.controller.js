const mongoose = require('mongoose');
const Role = require('../models/role.model');

module.exports.findAll = async (req, res) => {
    try{
        const rolesList = await Role.find({enabled: true});
        res.status(200).json(rolesList);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send('Error fetching the user roles')
    }
}

module.exports.test = async (req, res) => {
    try{
        //const rolesList = await Role.find({enabled: true});
        res.status(200).json(req.body);
    } catch(e){
        console.log('ERROR', e);
        res.status(500).send('Error fetching the user roles')
    }
}