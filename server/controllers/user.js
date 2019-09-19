module.exports = {
    login,
    register,
    getAllClient,
    downClient,
    getAllGuest,
    fixGuest,
}

const mongoose = require('mongoose')
const Client = mongoose.model('Client')
const Guest = mongoose.model('Guest')

//查客服密码是否正确
const checkPassword = async (name, pwd) => {
    let match = false
    const client = await Client.findOne({
        name
    })

    if (client) {
        match = await client.comparepwd(pwd, client.pwd)
        // console.log(match)
        // console.log(client)
        return {
            match,
            client
        }
    } else {
        return false
    }
}

//查顾客密码是否正确
const checkGuestPassword = async (name, pwd) => {
    let match = false
    const guest = await Guest.findOne({
        name
    })
    // console.log(guest)
    if (guest) {
        match = await guest.comparepwd(pwd, guest.pwd)
        // console.log(match)
        // console.log(client)
        return {
            match,
            guest
        }
    } else {
        return false
    }
}

//登陆验证
async function login(ctx, next) {
    const {
        user,
        pwd,
        loginStatus
    } = ctx.request.body

    //客服管理员登陆口
    if (loginStatus == 'admin') {
        const check = await checkPassword(user, pwd)
        // console.log(checkPassword('xzh', '123'))
        // ctx.body = checkPassword('xzh', '123')
        // console.log(check)
        //session 改写成key value形式，key为用户名，value为user_id
        // console.log(ctx.session, 'session')
        // console.log('客服')
        //session有记录的情况下
        // console.log(ctx.session.user)
        if (check.match) {
            check.client.pwd = ''
            if (ctx.session.user != void 0 && ctx.session.user.length != 0 && 0) {
                //暂时废弃
                ctx.body = {
                    message: '已经登陆了，无需再登陆',
                    code: 1,
                    data: JSON.parse(ctx.session.user)
                }
            } else {
                //修改线上状态
                const checkUpdateStatus = await Client.update({
                    _id: check.client._id
                }, {
                    status: 'true'
                })
                if (checkUpdateStatus) {
                    ctx.session.user = JSON.stringify(check.client)
                    ctx.body = {
                        message: '登陆成功',
                        code: 0,
                        data: check.client
                    }
                } else {
                    ctx.body = {
                        code: 2,
                        message: '更新线上状态失败'
                    }
                }
            }
        } else {
            ctx.session.user = ''
            ctx.body = {
                code: 2,
                message: '密码出错噢'
            }
        }
    } else {
        const check = await checkGuestPassword(user, pwd)
        console.log('顾客')
        if (check.match) {
            check.guest.pwd = ''
            if (ctx.session.user != void 0 && ctx.session.user.length != 0 && 0) {
                ctx.body = {
                    message: '已经登陆了，无需再登陆',
                    code: 1,
                    data: JSON.parse(ctx.session.user)
                }
            } else {
                //修改线上状态
                ctx.body = {
                    message: '登陆成功',
                    code: 0,
                    data: check.guest
                }
            }
        } else {
            ctx.session.user = ''
            ctx.body = {
                code: 2,
                message: '密码出错噢'
            }
        }
    }


}


//注册
async function register(ctx, next) {
    const {
        user,
        pwd,
        loginStatus
    } = ctx.request.body

    //游客注册
    if (loginStatus != 'admin') {
        if (user != '' && pwd != '') {
            const findSaved = await Guest.findOne({
                name: user
            })
            if (findSaved) {
                ctx.body = {
                    code: 1,
                    message: '已经存在该名用户，请勿重复注册'
                }
            } else {
                let guest = new Guest({
                    name: user,
                    pwd
                })
                let save = await guest.save()
                if (save) {
                    // console.log(save)
                    ctx.body = {
                        code: 0,
                        data: save,
                        message: '注册成功'
                    }
                } else {
                    ctx.body = {
                        code: 1,
                        message: '注册失败'
                    }
                }
            }
        } else {
            ctx.body = {
                code: 1,
                message: '请正确填写用户名和密码'
            }
        }
    } else {
        //客服注册

    }
    // const client = await Client.findOne({
    //     name
    // })
}

//查找所有客服
async function getAllClient(ctx, next) {
    //查找非管理员
    const allnoAdminClient = await Client.find({
        admin: 'false'
    })

    const allClient = await Client.find({})

    const isAdmin = ctx.query.admin

    if (isAdmin == 'true') {
        ctx.body = allnoAdminClient
        // console.log('在这里')
    } else {
        ctx.body = allClient
    }
    // console.log(isAdmin)
    // console.log(allnoAdminClient)
    // console.log(allClient)
}

//下线管理员
async function downClient(ctx, next) {
    let {
        id,
        fixid
    } = ctx.request.body

    const findAdmin = await Client.findOne({
        _id: id
    })

    if (findAdmin) {
        if (findAdmin.admin) {
            const downClient = await Client.update({
                _id: fixid
            }, {
                $set: {
                    status: false
                }
            })

            if (downClient) {
                ctx.body = {
                    code: 0,
                    message: '操作成功'
                }
            } else {
                ctx.body = {
                    code: 1,
                    message: '操作失败'
                }
            }
        } else {
            ctx.body = {
                code: 1,
                message: '对不起，你没有权限！'
            }
        }
    }
}

//查找所有顾客
async function getAllGuest(ctx, next) {
    const allGuest = await Guest.find({})

    if (allGuest.length != 0) {
        ctx.body = {
            code: 0,
            data: allGuest
        }
    } else {
        ctx.body = {
            code: 1,
            message: '还没有顾客注册账号！'
        }
    }
}

//填写或修改顾客资料
async function fixGuest(ctx, next) {
    let {
        id,
        clientId
    } = ctx.request.body
    let {
        phone,
        company,
        from
    } = ctx.request.body
    let findClient = await Client.findOne({
        _id: clientId
    })

    if (findClient) {
        const fix = await Guest.update({
            _id: id
        }, {
            $set: {
                phone: phone,
                company: company,
                from: from
            }
        })
        console.log(fix)
        if (fix) {
            ctx.body = {
                code: 0,
                message: '修改成功'
            }
        } else {
            ctx.body = {
                code: 1,
                message: '修改失败'
            }
        }
    } else {
        ctx.body = {
            code: 1,
            message: '非法操作'
        }
    }
}