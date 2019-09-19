const mongoose = require('mongoose')
const db = 'mongodb://localhost:27018/chat_web'
const glob = require('glob')
const {
    resolve
} = require('path')

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

//创建一个管理员用户
exports.initAdmin = async () => {
    const Client = mongoose.model('Client')
    let userCheck = await Client.findOne({
        name: 'admin'
    })
    if (!userCheck) {
        const client = new Client({
            name: 'admin',
            pwd: '123',
            admin: true,

        })

        await client.save()
    }
}

//创建多个客服
exports.initClient = async () => {
    const Client = mongoose.model('Client')
    // .find({"A":{"$in":[1,2,3]}})
    var createClient = [{
            name: 'client1',
            pwd: '123'
        },
        {
            name: 'client2',
            pwd: '123'
        },
        {
            name: 'client3',
            pwd: '123'
        }
    ]

    for (var i in createClient) {
        let userCheck = await Client.findOne({
            name: createClient[i].name
        })
        if (!userCheck) {
            var client = new Client(createClient[i])
            await client.save()
        }
    }
}

exports.connect = () => {

    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(db)

        mongoose.connection.on('disconnected', () => {
            maxConnectTimes++
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
        })
        mongoose.connection.on('error', err => {
            maxConnectTimes++
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
            // reject(err)
            // console.log(err)
        })

        mongoose.connection.once('open', () => {
            // const Dog = mongoose.model('Dog', {
            //     name: String
            // })
            // const doga = new Dog({
            //     name: '阿尔法'
            // })
            // doga.save().then(() => {
            //     console.log('wang')
            // })
            resolve()
            console.log('Mongodb Connected Success')
        })
    })


}


mongoose.Promise = global.Promise //替换成nodejs的