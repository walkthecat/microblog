const mongodb = require('./db');

class Post {
    constructor(username, post, time) {
        this.user = username;
        this.post = post;
        if (time) {
            this.time = time;
        } else {
            this.time = new Date();
        }

    }

    static get(username, callback) {
        mongodb.open((err, db) => {
            if (err) {
                callback(err);
            }
            // 读取 posts 集合
            db.collection('posts', (err, collection) => {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                // 查找 user 属性为 username 的文档，如果 username 是 null 则匹配全部
                let query = {};
                if (username) {
                    query.user = username;
                }
                collection.find(query).sort({
                    time: -1
                }).toArray((err, docs) => {
                    mongodb.close();
                    if (err) {
                        callback(err, null);
                    }
                    // 封装 posts 为 Post 对象
                    let posts = [];
                    docs.forEach((doc, index) => {
                        let post = new Post(doc.user, doc.post, doc.time);
                        posts.push(post);
                    });
                    callback(null, posts);
                });
            });
        });
    }

    save(callback) {
        let post = {
            user: this.user,
            post: this.post,
            time: this.time,
        };
        mongodb.open((err, db) => {
            if (err) {
                callback(err);
            }
            // 读取 posts 集合
            db.collection('posts', (err, collection) => {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                // 为 user 属性添加索引
                collection.createIndex('user');
                // 写入 post 文档
                collection.insert(post, {
                    safe: true
                }, (err, post) => {
                    mongodb.close();
                    callback(err, post);
                });
            });
        });
    }

}

module.exports = Post;