module.exports = {
    findClient,
    findClientChat,
    fixFastClient,
    findMoreChatMeg,
    findGuestChat,
}

const mongoose = require('mongoose')
const Client = mongoose.model('Client')
const GuestChat = mongoose.model('GuestChat')
const Guest = mongoose.model('Guest')

//找到一位在线的客服
async function findClient(ctx, next) {
    let {
        id
    } = ctx.request.body
    const oldMeg = await GuestChat.findOne({
        guest_id: id
    }).populate('send_client_id')
    //查找该名用户是否有历史聊天记录
    if (oldMeg) {
        //查找历史记录
        let client = oldMeg.send_client_id
        const chatList = await GuestChat.find({
            send_client_id: client._id,
            guest_id: id
        })
        ctx.body = {
            code: 0,
            data: client,
            chat: chatList
        }
    } else {
        //重新查一个客服
        let client = await Client.find({
            status: 'true',
            admin: 'false'
        }).sort({
            fast: 1
        }).limit(1)
        client = client[0]
        // console.log(client)
        if (client) {
            client.pwd = ''
            client.loginAttempts = ''

            //查找该名在线的客服是否与客户有聊天记录
            const chatList = await GuestChat.find({
                send_client_id: client._id,
                guest_id: id
            })
            if (chatList) {
                // console.log(client)
                ctx.body = {
                    code: 0,
                    data: client,
                    chat: chatList
                }
            } else {
                ctx.body = {
                    code: 0,
                    data: client,
                    chat: []
                }
            }
        } else {
            ctx.body = {
                code: 1,
                message: '无空闲客服'
            }
        }
    }

}


//查找某名客服与顾客的聊天记录
async function findClientChat(ctx, next) {
    const {
        id
    } = ctx.request.body

    const guest = await Guest.find({}).limit(10)
    if (guest) {
        let chatList = []
        for (let i in guest) {
            let chat = await GuestChat.find({
                send_client_id: id,
                guest_id: guest[i]._id
            }).populate('guest_id')
            // console.log(chat)
            if (chat.length != 0) {
                chatList.push(chat)
            }
        }
        // console.log(chatList)
        if (chatList.length != 0) {
            ctx.body = {
                code: 0,
                chat: chatList
            }
        } else {
            ctx.body = {
                code: 1,
                message: '没有聊天记录'
            }
        }
    } else {
        ctx.body = {
            code: 1,
            message: '暂无查找到用户'
        }
    }

}

//修改客服的优先级
async function fixFastClient(ctx, next) {
    const {
        fast,
        id,
    } = ctx.request.body

    const client = await Client.findOne({
        fast
    })

    if (client) {
        ctx.body = {
            code: 1,
            message: '已有该级别，请修改成其他级别'
        }
    } else {
        const update = await Client.update({
            _id: id
        }, {
            $set: {
                fast: fast
            }
        })
        if (update) {
            ctx.body = {
                code: 0,
                message: '修改完成'
            }
        } else {
            ctx.body = {
                code: 1,
                message: '修改失败'
            }
        }
    }

}

async function findMoreChatMeg(ctx, next) {
    const {
        id,
        admin
    } = ctx.request.body
    //管理员
    if (admin) {
        if (!checkAdmin(id, admin)) {
            ctx.body = {
                code: 1,
                message: '非法操作'
            }
        }
        const guest = await Guest.find({}, '_id name')
        if (guest) {
            let guestChat = await GuestChat.find({}).populate('guest_id send_client_id')
            if (guestChat) {
                ctx.body = {
                    code: 0,
                    data: guest,
                    meg: guestChat
                }
            } else {
                ctx.body = {
                    code: 1,
                    data: [],
                    message: '无聊天信息'
                }
            }
        } else {
            ctx.body = {
                code: 1,
                data: [],
                message: '暂无顾客使用！'
            }
        }
    } else {
        let guestChat = await GuestChat.find({
            send_client_id: id
        }).populate('guest_id send_client_id')
        if (guestChat) {
            ctx.body = {
                code: 0,
                data: [],
                meg: guestChat
            }
        } else {
            ctx.body = {
                code: 1,
                data: [],
                message: '无聊天信息'
            }
        }
    }
}

async function findGuestChat(ctx, next) {
    let {
        id
    } = ctx.request.body
    console.log(id)
    let findGuestChat = []
    if (id) {
        findGuestChat = await GuestChat.find({
            guest_id: id
        }).populate('guest_id send_client_id')
    } else {
        findGuestChat = await GuestChat.find({}).populate('guest_id send_client_id')
    }

    if (findGuestChat) {
        ctx.body = {
            code: 0,
            meg: findGuestChat
        }
    } else {
        ctx.body = {
            message: '暂无找到该顾客的聊天记录',
            code: 1,
            meg: []
        }
    }
}

async function checkAdmin(id, admin) {
    const findAdmin = await Client.find({
        _id: id,
        admin
    })
    if (findAdmin) return true
    else return false
}