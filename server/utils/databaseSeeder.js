const AppConfig = require('../models/app.config.model');
const Role = require('../models/role.model');
const Menu = require('../models/menu.model');

const createAppConfig = async () => {
    const appconfig = new AppConfig();
    appconfig.version = '1.0.0';
    await appconfig.save();
}

const createRoles = async () => {
    const admin = new Role();
    admin.label = 'ADMIN';
    await admin.save();
    
    const guest = new Role();
    guest.label = 'GUEST';
    await guest.save();
}

const createMenus = async () => {
    const role = await Role.findOne({label: 'ADMIN'});

    const home = new Menu();
    home.label = 'Home';
    home.url = '/';
    home.symbole = 'home';
    home.roles = [role._id];
    home.isArtificial = false;
    home.hasContent = true;
    await home.save();

    const mails = new Menu();
    mails.label = 'Mails';
    mails.url = '/mails';
    mails.symbole = 'mail';
    mails.roles = [role._id];
    mails.isArtificial = false;
    mails.hasContent = true;
    await mails.save();

    const accounts = new Menu();
    accounts.label = 'Accounts';
    accounts.url = '/accounts';
    accounts.symbole = 'users';
    accounts.roles = [role._id];
    accounts.isArtificial = false;
    accounts.hasContent = true;
    await accounts.save();

    const menus = new Menu();
    menus.label = 'Menus';
    menus.url = '/menus';
    menus.symbole = 'menus';
    menus.roles = [role._id];
    menus.isArtificial = false;
    menus.hasContent = true;
    await menus.save();
}

const dbSeeder = async () => {
    AppConfig.find().then(
        async res => {
            if( res && res.length > 0){
                console.log('App already initialized !')
                return ;
            } else {
                console.log('Initializing App ...')
                await createAppConfig();
                await createRoles();
                await createMenus();
            }
        },
        error => {
            console.log(error);
        }
    )
}


module.exports = dbSeeder;