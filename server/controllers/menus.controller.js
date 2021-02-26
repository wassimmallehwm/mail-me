const mongoose = require('mongoose');
const fs = require('fs');
const Menu = require('../models/menu.model');
const Role = require('../models/role.model');

module.exports.create = async (req, res) => {
    try {
        const { label, symbole, roles } = req.body;
        if (!label)
            return res.status(400).json({ msg: "Label is missing !" })
        const exitMenu = await Menu.findOne({ label: label });
        if (exitMenu)
            return res.status(400).json({ msg: "Menu label already exists !" })

        const menu = new Menu();
        menu.label = label;
        menu.symbole = symbole;
        menu.roles = roles;
        await menu.save();
        res.status(201).json(menu);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.update = async (req, res) => {
    try {
        const { _id, label, symbole, roles } = req.body;
        if (!label)
            return res.status(400).json({ msg: "Label is missing !" })

        const menu = await Menu.findOne({ _id });
        menu.label = label;
        menu.symbole = symbole;
        menu.roles = roles;
        await menu.save();
        res.status(200).json(menu);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.submitConfig = async (req, res) => {
    try {
        const { _id, redirectMenu, submitConfigUrl, submitConfigMethod } = req.body;
        if (!redirectMenu || !submitConfigUrl || !submitConfigMethod)
            return res.status(400).json({ msg: "Data is missing !" })

        const menu = await Menu.findOne({ _id });
        menu.redirectMenu = redirectMenu;
        menu.submitConfigUrl = submitConfigUrl;
        menu.submitConfigMethod = submitConfigMethod;
        await menu.save();
        res.status(200).json(menu);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}

module.exports.setForm = async (req, res) => {
    try {
        const { menuId, formData } = req.body;
        fs.writeFile('public/forms/' + menuId + '.txt', formData, { flag: 'w+' }, (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ 'error': "Error while creating form file" })
            }
        });
        const menu = await Menu.findOne({ _id: menuId });
        menu.hasContent = true;
        await menu.save();
        res.status(200).json(true);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ 'error': e })
    }
}


module.exports.getForm = async (req, res) => {
    try {
        const { menuId } = req.body;
        const filePath = 'public/forms/' + menuId + '.txt';
        const menu = await Menu.findOne({ _id: menuId })
            .populate({ path: 'redirectMenu', model: 'Menu', select: 'url' }).exec();
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ 'error': "Error while reading the file" })
                }
                res.status(200).json({ menu, form: data });
            })
        } else {
            res.status(200).json({ menu, form: '[]' });
        }
        //res.status(400).json({ error:  "Error while getting the form"})
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ error: "Error while getting the form" })
    }
}

// module.exports.update = async (req, res) => {
//     try{
//         const {_id, label, email} = req.body;
//         if(!email || !label)
//             return res.status(400).json({msg: "Fields missing !"})
//         const user = await User.findOne({_id: req.user});
//         user.accounts.map(account => {
//             var tempObj = Object.assign({}, account);
//             var temp = tempObj._doc;
//             if(temp._id == _id){
//                 temp.label = label;
//                 temp.email = email;
//             }
//             return temp;
//         })
//         user.markModified('accounts');
//         await user.save();
//         res.status(200).json(user.accounts);
//     } catch(e){
//         console.log('ERROR', e);
//         res.status(500).send('Error uppdating the account')
//     }
// }

module.exports.findAll = async (req, res) => {
    try {
        const menuList = await Menu.find({ enabled: true });
        res.status(200).json(menuList);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).send('Error fetching the user menu')
    }
}

module.exports.findAllArtificial = async (req, res) => {
    try {
        const menuList = await Menu.find({ enabled: true, isArtificial: true });
        //.populate({path: 'roles', model: 'Role', select: '_id label'}).exec();
        res.status(200).json(menuList);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).send('Error fetching the user menu')
    }
}

module.exports.findAllByRole = async (req, res) => {
    const { role } = req.body;
    const userRole = await Role.findOne({ _id: role });
    let query = {
        enabled: true,
        hasContent: true,
        roles: mongoose.Types.ObjectId(role)
    }
    if (userRole.label == 'ADMIN') {
        query.isArtificial = false;
    }
    try {
        const menuList = await Menu.find(query);
        res.status(200).json(menuList);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ error: 'Error fetching the user menu' })
    }
}

module.exports.findAllGuest = async (req, res) => {
    const userRole = await Role.findOne({ label: 'GUEST' });
    let query = {
        enabled: true,
        hasContent: true,
        roles: userRole._id
    }
    try {
        const menuList = await Menu.find(query);
        res.status(200).json(menuList);
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ error: 'Error fetching guest menus' })
    }
}

module.exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        Menu.deleteOne({_id: id}, (err, success) => {
            if (!err) {
                const filePath = 'public/forms/' + id + '.txt';
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                res.status(200).json({ success: "Menu deleted successfully" });
            }
        });
    } catch (e) {
        console.log('ERROR', e);
        res.status(500).json({ error: 'Error deleting the menu' })
    }
}