import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import log from './utils/logger.js';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import fileUpload from 'express-fileupload';
import User from './routes/User.js';
import db from './config/database.js';

const app = express();
dotenv.config();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({db:db});

const corsOptions = {
    origin: '*',
    credentails: true,
    optionSuccessStatus: 200,
    port: process.env.PORT || 5000
};

app.use(session({
    secret: process.env.SESS,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto",
    },
    proxy: true
}));

app.use(fileUpload());
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

app.use(User);

app.listen(process.env.PORT, () => {
    log.info(`this server running on http://localhost:${process.env.PORT}`)
})