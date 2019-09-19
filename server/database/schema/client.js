const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const client = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    },
    //true为管理员，false为普通客户
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    //true 为在线，false 为离线
    status: {
        type: Boolean,
        default: false
    },
    lockUntil: Number,
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    fast: Number
})

//mongoose的虚拟字段 isLocked
client.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})


client.pre('save', function (next) {
    //this.isNew 的isNew是Mongoose自带的字段，用于判断是否新数据
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})


//密码加严
client.pre('save', function (next) {
    //this.isModified('pwd') mongdb自带的方法，查看某个字段是否被更改
    //如果是没更改，就跳过这个加严环节(即密码有所变化的时候，做出更改加严)
    if (!this.isModified('pwd')) return next()

    //SALT_WORK_FACTOR长度，这个变量数值越大，构建出来的salt越复杂，需要的计算量越大
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        //拿到salt，再来进行hash加密
        bcrypt.hash(this.pwd, salt, (err, hash) => {
            if (err) return next(err)

            this.pwd = hash

            next()
        })
    })
})

client.methods = {
    //比对密码是否正确
    comparepwd: (_pwd, pwd) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_pwd, pwd, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
    //防止重复登录出错
    incLoginAtteptes: (user) => {
        return new Promise((resolve, reject) => {
            //这里判断，锁定后时间已经过了，重新设置尝试次数
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            }
        })

    }
}

mongoose.model('Client', client)