const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10
//顾客表
const guest = new Schema({
    name: {
        type: String,
        required: true
    },
    pwd: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    ip: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    from: {
        type: String,
        default: ''
    },
    opeen_id: {
        type: String,
        default: ''
    }
})

//密码加严
guest.pre('save', function (next) {
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

guest.methods = {
    //比对密码是否正确
    comparepwd: (_pwd, pwd) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_pwd, pwd, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    }
}

mongoose.model('Guest', guest)