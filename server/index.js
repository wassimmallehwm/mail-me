const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const useRouter = require('./routers/user.routes');
const mailRouter = require('./routers/mail.routes');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('resources'));
app.use(morgan('dev'));  

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to DataBase');
})

app.use('/users', useRouter);
app.use('/mails', mailRouter);

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});