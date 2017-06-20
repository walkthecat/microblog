## 根据《Node.js开发指南》做的练习
    
    涉及到的版本为
    express4.x + bootstrap 3.3.7 + mongodb 3.4

### 说明

1. 使用include代替partials
2. 日志移入log文件夹，增加日志切割，时间本地化
3. db.js中由于新版本不支持DEFAULT_PORT，所以直接用MongoDB默认端口27017代替
4. app.js中启用app.set('env', 'production');即可变为生产模式

### 运行

单线程

    node ./bin/www 或 npm start

多线程

    node cluster

### 疑惑点

在路由传递posts数组到ejs模板的时候会出现问题。只能在路由端对posts数组再套个中括号。问题点暂时不明。