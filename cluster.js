const cluster = require('cluster');
const os = require('os');

// 获取CPU 的数量
let numCpus = os.cpus().length;

let workers = {};
if (cluster.isMaster) {
    // 主进程分支
    cluster.on('death', (worker) => {
        // 当一个工作进程结束时，重启工作进程
        delete workers[worker.pid];
        worker = cluster.fork();
        workers[worker.process.pid] = worker;
    });
    // 初始开启与CPU 数量相同的工作进程
    for (let i = 0; i < numCpus; i++) {
        let worker = cluster.fork();
        workers[worker.process.pid] = worker;
    }
} else {
    // 工作进程分支，启动服务器
    let app = require('./app');
    app.listen(3000);
}
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', () => {
    for (let pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});