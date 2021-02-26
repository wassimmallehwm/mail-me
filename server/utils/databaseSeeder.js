const AppConfig = require('../models/app.config.model');
const Role = require('../models/role.model');
const Menu = require('../models/menu.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const createAppConfig = async () => {
    const appconfig = new AppConfig();
    appconfig.version = '1.0.0';
    await appconfig.save();
}

const createAdmin = async (role) => {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash("password", salt);
    const user = new User();
    user.email = "admin@admin.com";
    user.password = hashedPassword;
    user.username = "admin";
    user.accounts = [{ label: "Default", email: "admin@admin.com" }];
    user.role = role._id;
    await user.save();
}

const createMenus = async (adminRole, guestRole) => {
    const home = new Menu();
    home.label = 'Home';
    home.url = '/';
    home.symbole = 'home';
    home.roles = [adminRole._id, guestRole._id];
    home.isArtificial = false;
    home.hasContent = true;
    await home.save();

    const mails = new Menu();
    mails.label = 'Mails';
    mails.url = '/mails';
    mails.symbole = 'mail';
    mails.roles = [adminRole._id, guestRole._id];
    mails.isArtificial = false;
    mails.hasContent = true;
    await mails.save();

    const accounts = new Menu();
    accounts.label = 'Accounts';
    accounts.url = '/accounts';
    accounts.symbole = 'users';
    accounts.roles = [adminRole._id, guestRole._id];
    accounts.isArtificial = false;
    accounts.hasContent = true;
    await accounts.save();

    const menus = new Menu();
    menus.label = 'Menus';
    menus.url = '/menus';
    menus.symbole = 'menus';
    menus.roles = [adminRole._id];
    menus.isArtificial = false;
    menus.hasContent = true;
    await menus.save();
}

const createCollections = async () => {
    const admin = new Role();
    admin.label = 'ADMIN';
    const adminRole = await admin.save();

    const guest = new Role();
    guest.label = 'GUEST';
    const guestRole = await guest.save();

    await createAdmin(adminRole);
    await createMenus(adminRole, guestRole);
}


const addUsersMenu = async () => {
    const role = await Role.findOne({ label : 'ADMIN' });
    const users = new Menu();
    users.label = 'Users';
    users.url = '/users';
    users.symbole = 'users';
    users.roles = [role._id];
    users.isArtificial = false;
    users.hasContent = true;
    await users.save();
}





const changeMenuIcon = async () => {
   const accounts = Menu.findOne({label: 'Accounts'})
   accounts.symbole = 'cog';
   await accounts.save();
}


const changeAppVersion = async (oldVersion, version) => {
    const appData = await AppConfig.findOne({version: oldVersion})
    appData.version = version;
    appData.save();
}

const v1_0To1_1 = async () => {
    await addUsersMenu();
    await changeMenuIcon();
    await changeAppVersion('1.0.0', '1.1.0');
}


const migration = async (data) => {
    if(data.version === '1.0.0'){
        await v1_0To1_1();
    }
}

const dbSeeder = async () => {
    AppConfig.find().then(
        async res => {
            if (res && res.length > 0) {
                console.log('App already initialized !')
                await migration(res[0]);
                return;
            } else {
                console.log('Initializing App ...')
                await createAppConfig();
                await createCollections();
                console.log('Initializing initialized successfully !')
            }
        },
        error => {
            console.log(error);
        }
    )
}


module.exports = dbSeeder;