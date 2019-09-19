const mongoose = require('mongoose')

const Schema = mongoose.Schema

const socket = new Schema({
    createTime: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String,
    },
    //user得id
    user: {
        type: String
    },
    //0为顾客，1为客服
    type: {
        type: Number,
        default: 1
    },
    socket_id: {
        type: String
    },
    browser: {
        type: String,
        default: '',
    },
    environment: {
        type: String,
        default: '',
    }
})

mongoose.model('Socket', socket)