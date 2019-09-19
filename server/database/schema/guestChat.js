const mongoose = require('mongoose')

const Schema = mongoose.Schema
//顾客-客户消息表
const guestChat = new Schema({
    //记录客户的id
    guest_id: {
        type: Schema.ObjectId,
        ref: 'Guest'
    },
    //记录对话客服的id
    send_client_id: {
        type: Schema.ObjectId,
        ref: 'Client'
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //顾客发送的消息
    meg: {
        type: String,
        required: true
    },
    //发送人
    name: {
        type: String,
        required: true
    },
    //接受人
    toname: {
        type: String,
        required: true
    }
})

mongoose.model('GuestChat', guestChat)