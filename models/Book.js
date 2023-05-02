import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './User.js';

const Book = db.define('book_data',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    desc : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    release:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    price:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    more_information: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    image : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    userId : {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
},{freezTableName: true});

User.hasMany(Book);
Book.belongsTo(User, {foreignKey: 'userId'});

export default Book;