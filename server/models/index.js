const Sequelize = require('sequelize');
const dotenv = require('dotenv').config;
if (dotenv.error) throw dotenv.error

const env = process.env.NODE_ENV || 'development'; //production
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Hashtag = require('./hashtag');

const db = {};

console.log('값확인', config);
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);



db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
Hashtag.associate(db);

module.exports = db;