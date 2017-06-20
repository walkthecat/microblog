const mongodb = require('./db');

class User {
    constructor(user) {
        this.name = user.name;
        this.password = user.password;
    }
    // 存入 Mongodb 的文档 
    save(callback) {
        let user = {
            name: this.name,
            password: this.password
        };
        mongodb.open((err, db) => {
            if (err) {
                return callback(err);
            }
            // 读取 users 集合
            db.collection('users', (err, collection) => {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                // 为 name 属性添加索引
                collection.createIndex('name', {
                    unique: true
                });
                // 写入 user 文档
                collection.insert(user, {
                    safe: true
                }, (err, user) => {
                    mongodb.close();
                    callback(err, user);
                });
            });
        });
    }

    static get(username, callback) {
        mongodb.open((err, db) => {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 读取 users 集合
            db.collection('users', (err, collection) => {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                // 查找 name 属性为 username 的文档
                collection.findOne({
                    name: username
                }, (err, doc) => {
                    mongodb.close();
                    if (doc) {
                        // 封装文档为 User 对象
                        let user = new User(doc);
                        callback(err, user);
                    } else {
                        callback(err, null);
                    }
                });
            });
        });
    }
}


module.exports = User;