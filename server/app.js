const Koa = require('koa2')
const Router = require('koa-router')
// const IO = require('koa-socket')

const app = new Koa()

const bodyParser = require('koa-bodyparser')
// var router = new Router()
const {
    connect,
    initSchemas,
    initAdmin,
    initClient
} = require('./database/init')

//初始化session
const session = require('koa-session')
app.keys = ['some secret hurr']
const CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}
app.use(session(CONFIG, app))

const static = require('koa-static')
const path = require('path')
let statics = path.resolve(__dirname, '../client/dist');
// console.log(statics)
// 配置静态web服务的中间件
app.use(static(statics))

;
(async () => {
    await connect()

    initSchemas()
    await initAdmin()
    await initClient()
    const router = require('./router')

    app.use(bodyParser())

    app
        .use(router.routes())
        .use(router.allowedMethods())
    // await userMiddlewares(app)

    //开启socket
    // const io = new IO({
    //     ioOptions: {
    //         pingTimeout: 10000,
    //         pingInterval: 5000,
    //     },
    // });

    // 注入应用
    // io.attach(app);

    var server = require('http').Server(app.callback())
    var io = require('socket.io')(server)


    //导入socket表
    const mongoose = require('mongoose')
    const Socket = mongoose.model('Socket')

    //聊天表
    const GuestChat = mongoose.model('GuestChat')
    const Guest = mongoose.model('Guest')
    const logout = require('./middlewares/logout')

    io.on('connection', async (socket) => {
        // console.log(socket)
        let browser = '';
        let ip = '';
        let socket_id = '';
        socket_id = socket.id
        ip = socket.request.connection.remoteAddress
        // console.log()
        for (var i in socket.handshake.headers) {
            if (i == 'user-agent') {
                browser = socket.handshake.headers[i]
            }
        }

        // console.log(browser, ip, socket_id)

        socket.on('send', async (data) => {

            if (data.from && data.message && data.to && data.name) {
                //顾客发来的消息
                if (data.status == 'guest') {
                    const guestchat = new GuestChat({
                        guest_id: data.from,
                        send_client_id: data.to,
                        from: data.from,
                        to: data.to,
                        meg: data.message,
                        name: data.name,
                        toname: data.toname,
                    })

                    let saveData = await guestchat.save()

                    if (saveData) {
                        //接受方id接收
                        // console.log(data)

                        let sendMeg = {
                            message: data.message,
                            name: data.name,
                            id: data.from,
                            _id: saveData._id,
                            guest_id: {
                                name: data.name,
                                _id: data.from,
                            }
                        }
                        io.emit('rev' + data.to, sendMeg)
                    } else {
                        //接受失败，返回参数给发送方
                        let errorBody = {
                            code: 1,
                            message: '发送出现位置错误'
                        }
                        io.emit('rev' + ctx.data.from, errorBody)
                    }
                } else {
                    //客服发送的消息
                    const guestchat = new GuestChat({
                        guest_id: data.to,
                        send_client_id: data.from,
                        from: data.from,
                        to: data.to,
                        meg: data.message,
                        name: data.name,
                        toname: data.toname,
                    })

                    let saveData = await guestchat.save()

                    if (saveData) {
                        // console.log(data)
                        let sendMeg = {
                            message: data.message,
                            name: data.name,
                            _id: saveData._id,
                        }
                        io.emit('rev' + data.to, sendMeg)
                    } else {
                        //接受失败，返回参数给发送方
                        let errorBody = {
                            code: 1,
                            message: '发送出现位置错误'
                        }
                        io.emit(data.from, errorBody)
                    }
                }
            }
        })
    })


    server.listen(3005)
})()