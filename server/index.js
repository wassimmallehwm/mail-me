const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var path = require('path');
const PORT = process.env.PORT || 4000;
require('dotenv').config();

const dbSeeder = require('./utils/databaseSeeder');
const useRouter = require('./routers/user.routes');
const userRequestRouter = require('./routers/user-request.routes');
const mailRouter = require('./routers/mail.routes');
const accountsRouter = require('./routers/accounts.routes');
const menusRouter = require('./routers/menu.routes');
const rolesRouter = require('./routers/roles.routes');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('resources'));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));  

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', async () => {
    console.log('Connected to DataBase');
    await dbSeeder();
})

app.use('/api/users', useRouter);
app.use('/api/mails', mailRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/menus', menusRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/requests', userRequestRouter);

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});