const AppConfig = require('../models/app.config.model');

module.exports.findConfig = async (req, res) => {
    try {
        const config = await AppConfig.findOne().select('guestUrl -_id').exec()
        res.status(200).json(config);
    } catch (e) {
        console.log('ERROR', e);
    }
}

module.exports.update = async (req, res) => {
    try {
        const config = await AppConfig.findOne();
        await AppConfig.updateOne({_id: config._id}, req.body);
        res.status(200).json({success: true});
    } catch (e) {
        console.log('ERROR', e);
    }
}