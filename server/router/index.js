const router = require('koa-router')()

// xxx.com/weapp/demo
//登录相关检验
const userControlers = require('../controllers/user')
const chatControlers = require('../controllers/chat')

router.post('/login', userControlers.login)

router.post('/register', userControlers.register)

router.get('/getClient', userControlers.getAllClient)

//让客服下线
router.post('/downClient', userControlers.downClient)

//查找顾客表
router.get('/getAllGuest', userControlers.getAllGuest)

//修改顾客表
router.post('/fixGuest', userControlers.fixGuest)

//获取在线的客服
router.post('/findUpClient', chatControlers.findClient)
//获取客服的聊天记录
router.post('/findClientChat', chatControlers.findClientChat)
//修改客服的优先级
router.post('/fixFastClient', chatControlers.fixFastClient)

//查找对话表
router.post('/findMoreChatMeg', chatControlers.findMoreChatMeg)
//查找某顾客的对话表
router.post('/findGuestChat', chatControlers.findGuestChat)


module.exports = router