const AppConfig = require('../models/app.config.model');
const Role = require('../models/role.model');
const Menu = require('../models/menu.model');
const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');


module.exports.v1_2_0To1_3_0 = async (callback) => {

    // const adminRole = await Role.findOne({label: 'ADMIN'}).select('_id').lean();

    // const settings = {
    //     label: 'Settings',
    //     url : '/settings',
    //     roles : [adminRole._id]
    // }

    // await Menu.updateOne({label: 'Accounts'}, settings);

    // const config = await AppConfig.findOne();
    // config.guestUrl = "https://flowcv.me/wassimmalleh";
    // await config.save()

    // await Conversation.updateMany({}, {enabled: true})

    // await Message.updateMany({}, {seen: new Date()})

    // const users = await User.find();
    // users.forEach(user => {
    //     user.images = [user.imagePath]
    //     user.save().then(() => {console.log("success")})
    // })


    await callback('1.2.0', '1.3.0');
}