import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import log from '../utils/logger.js';

dotenv.config();

const db = new Sequelize('book-store', process.env.DB_USERNAME, process.env.DB_PASSWORD,{
    dialect: process.env.DATABASE,
    host: 'localhost',
    port: process.env.DB_PORT
});

export default db;

try {
    db.authenticate();
    log.info('database authentication')
} catch (err) {
    log.error(err);
}