<template>
    <div class="chatView" :style="bannerImg">
        <div class="chat-container">
            <div class="module-main">
                <div v-if="isClient" class="bar">
                    <img @click="goBack()" class="back" src="../../assets/back-off-o.png" />
                </div>
                    <chat-aside-concat v-if="isClient" :concat="concat" @changeIndex="changeIndex" />
                    <div class="chat-main" ref="scrollMegMain">
                        <div class="chat-headerBar">
                            <h2>{{chatClientName}}</h2>
                        </div>
                        <div class="chat-messageList" ref="scorllMeg" id="scorllMeg">
                            <chat-list v-for="(item, i) in megList" :concat="item" :key="i" />
                        </div>

                        <chat-login v-if="!isLogin" @isLogin="isNowLogin" />

                        <div v-else class="chat-chatInput">
                            <div @click="showEmojiNow" class="component-iconButton" style="width: 44px; height: 44px;">
                                <i class="iconfont icon-emoji_icon" style="font-size: 32px; line-height: 44px;"></i>
                            </div>
                            <div class="component-iconButton" style="width: 44px; height: 44px;">
                                <i class="iconfont icon-gengduo" style="font-size: 32px; line-height: 44px;"></i>
                            </div><input @keyup.13="showKey($event)" type="text" v-model="meg" placeholder="点我输入" maxlength="2048" autofoucus="true">
                            <div @click="sendMeg" class="component-iconButton" style="width: 44px; height: 44px;">
                                <i class="iconfont icon-fasong" style="font-size: 32px; line-height: 44px;"></i>
                            </div>
                            <div class="aite-panel"></div>
                            <transition name="el-zoom-in-bottom">
                                <div class="emoji-item" v-show="showEmoji">
                                    <li @click="selectEmoji(index)" v-for="(item,index) in emoji" :key="index">{{item}}</li>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import chatAsideConcat from './chatComponents/chatAsideConcat'
import chatList from './chatComponents/chatList'
import chatLogin from './chatComponents/chatLogin'
import { getUserStatus } from '@/assets/utils'
import io from 'socket.io-client'

export default {
    components: {
        chatAsideConcat,
        chatList,
        chatLogin
    },
    data() {
        return {
            bannerImg: {
                backgroundImage: "url(" + require("../../../static/banner.jpg") + ")",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            },
            concat: [],
            megList: [],
            isLogin: false,
            //接收方的名字
            chatClientName: '',
            //接收方的id
            chatClientId: '',
            chatClient: [],
            meName: '',
            meChat: [],
            meg: "",
            socket: "",
            isGuest: false,
            nowIndex: 0,
            allMeg: [],
            IsendYou: [],
            isClient: false,
            emoji: [],
            showEmoji: false,
        }
    },
    watch: {
        '$store.state.clientMegList'(val) {
            // console.log(val)

            //客服情况
            for (let i in val) {
                for (let j in val[i]) {
                    console.log(val[i][j])
                    if (val[i][j].from == val[i][j].guest_id._id) {
                        this.IsendYou.push(val[i][j].guest_id)
                        break;
                    }
                }
            }
            // console.log(this.IsendYou)
            this.chatClientName = this.IsendYou[this.nowIndex].name
            this.chatClientId = this.IsendYou[this.nowIndex]._id
            this.megList = val[this.nowIndex]
            this.allMeg = val
            // this.$nextTick(() => {
            //     this.$refs.scorllMeg.scrollTop = this.$refs.scorllMeg.scrollHeight
            // })
        },
        //这是客服才有的监控
        '$store.state.concatList'(val) {
            console.log('chatlist', val)
            this.concat = val
        },
        //顾客消息监控
        '$store.state.guestMegList'(val) {
            // console.log(val[val.length - 1])
            this.megList = val
            if (this.concat.length == 0) {
                this.concat.push(val[val.length - 1])
            } else {
                this.concat[0] = val[val.length - 1]
            }
            this.$nextTick(() => {
                this.$refs.scorllMeg.scrollTop = this.$refs.scorllMeg.scrollHeight
            })
        },
        //顾客对接到的客服
        '$store.state.guestChat'(val) {
            console.log(val)
            this.chatClientName = val.name
            this.chatClientId = val._id
        },
        //让当新消息永远让滚动条在最下面
        'megList'(val) {
            // console.log('更新')
            this.$nextTick(() => {
                this.$refs.scorllMeg.scrollTop = this.$refs.scorllMeg.scrollHeight
            })
        }
    },
    computed: {
        getClientName() {
            return this.$store.getters.getClientName
        }
    },
    async mounted() {

        const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳  '
        this.emoji = emoji.split(' ')
        // console.log(this.$route.query.client)
        if (this.$route.query.client == 'true') {
            this.isClient = true
        } else {
            this.isClient = false
        }
        await this.createSocket()

        this.getCheckClient()
    },
    methods: {
        async createSocket() {
            try {
                const socket = await io()
                this.socket = socket
            } catch (err) {
                console.log(err)
            }
        },
        getSocketOn() {
            console.log(this.meChat._id)
            this.socket.on('rev' + this.meChat._id, (data) => {
                console.log(data)
                //新聊天框增加，客服样板
                if (data.name) {
                    var myDate = new Date();
                    var nowTime = myDate.getHours() + ':' + myDate.getMinutes()
                    var nowMeg = {
                        meg: data.message,
                        name: data.name,
                        time: nowTime,
                        _id: data._id,
                        guest_id: data.guest_id,
                    }
                    if (data.id != void 0) {
                        //是客服这边接受顾客的消息
                        let concat = this.concat
                        //新消息过来
                        if (this.concat.length == 0) {
                            //新建消息列表
                            this.megList.push(nowMeg)

                            //新增用户列表和消息列表
                            let newMegUser = {
                                _id: data.id,
                                meg: data.message,
                                name: data.name,
                                time: nowTime,
                                guest_id: data.guest_id,
                            }
                            let newMegArr = []
                            newMegArr[0] = nowMeg
                            //联系
                            this.concat.push(newMegUser)
                            //消息总
                            this.allMeg.push(newMegArr)
                            this.playMusic()
                            return
                        }

                        //锁定新建
                        let split = false
                        for (var i in concat) {
                            // console.log(concat[i])
                            let guestId;
                            if (concat[i].guest_id != void 0) {
                                guestId = concat[i].guest_id._id
                            } else {
                                guestId = concat[i]._id
                            }
                            if (guestId == data.id) {
                                //存在该用户,提取该聊天记录
                                //判断是否该客服正在与改名顾客聊天
                                if (i == this.nowIndex) {
                                    this.megList.push(nowMeg)
                                }
                                split = false
                                let meg = this.allMeg[i]
                                // console.log(meg)
                                meg.push(nowMeg)
                                this.allMeg[i] = meg
                                //操作用户列表的信息更新
                                /**
                                 * 这里有BUG，不知道为什么数据更新过去了，视图没刷新
                                 */
                                let fixMegUser = {
                                    _id: data.id,
                                    meg: data.message,
                                    name: data.name,
                                    time: nowTime,
                                    guest_id: data.guest_id,
                                }
                                this.concat[i] = fixMegUser
                                // console.log('更新列表', this.concat)
                                break;
                            } else {
                                split = true
                            }
                        }
                        if (split) {
                            console.log('我在这里')
                            //新增用户列表和消息列表
                            let newMegUser = {
                                _id: data.id,
                                meg: data.message,
                                name: data.name,
                                time: nowTime,
                                guest_id: data.guest_id,
                            }
                            let newMegArr = []
                            newMegArr[0] = nowMeg
                            this.concat.push(newMegUser)
                            this.IsendYou.push(data.guest_id)
                            // console.log(this.concat)
                            this.allMeg.push(newMegArr)
                            // console.log(this.allMeg)
                        }
                    } else {
                        //顾客接收到的信息
                        this.megList.push(nowMeg)
                    }
                    this.playMusic()
                    // console.log(this.megList)

                    // console.log(data)
                }

            })
        },
        isNowLogin(bol) {
            this.isLogin = bol
            if (bol) {
                this.getCheckClient()
            }
        },
        sendMeg() {
            var myDate = new Date();
            var nowTime = myDate.getHours() + ':' + myDate.getMinutes()
            var nowMeg = {
                meg: '',
                name: this.meChat.name,
                time: nowTime,
                index: -1,
                _id: this.chatClientId
            }
            // console.log(nowMeg)
            // console.log(nowTime)
            if (this.meg == '') {
                this.$message.warning('请输入点东西！')
            } else {
                nowMeg.meg = this.meg
                console.log(this.isGuest)
                if (this.isGuest) {
                    status = 'guest'
                } else {
                    status = 'admin'
                    nowMeg.index = this.nowIndex
                }
                // console.log(nowMeg)
                this.$store.dispatch('addChat', nowMeg)
                //发送socket到后台
                let sendData = {
                    name: this.meChat.name,
                    from: this.meChat._id,
                    to: this.chatClientId,
                    message: this.meg,
                    status: status,
                    toname: this.chatClientName,
                }
                // console.log(sendData)
                this.socket.emit('send', sendData)
                this.meg = ''
                // this.megList.push()
                // console.log(this.meg)
            }

        },
        showKey() {
            this.sendMeg()
        },
        //列表组件中的时事件，改变数据的索引值
        changeIndex(i) {
            this.nowIndex = i
            this.megList = this.allMeg[this.nowIndex]
            this.chatClientName = this.IsendYou[this.nowIndex].name
            this.chatClientId = this.IsendYou[this.nowIndex]._id
        },
        playMusic() {
            let audio = new Audio('https://pic.ibaotu.com/00/56/52/31Z888piCHeE.mp3')
            audio.play()
        },
        //查聊天记录
        async getCheckClient() {
            let getUser = getUserStatus('chat')
            if (getUser == 'needLogin' && getUser.name == void 0) return
            // console.log(getUser)
            // await this.$store.dispatch('setUser', getUser)
            //顾客登陆
            this.meName = getUser.name
            this.meChat = getUser
            this.getSocketOn()
            if (getUser.company != void 0) {
                this.isGuest = true
                this.isLogin = true
                await this.$store.dispatch('getClientChat', true)
            } else {
                this.isLogin = true
                await this.$store.dispatch('getClientChat', false)
                this.meName = getUser.name
                this.meChat = getUser
            }
        },
        goBack() {
            this.$router.push('/server')
        },
        showEmojiNow() {
            this.showEmoji = !this.showEmoji
        },
        selectEmoji(i) {
            this.meg = this.meg + this.emoji[i]
            this.showEmoji = false
        },
    }
}
</script>


<style lang="less">
.chatView {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .chat-container {
    width: 100%;
    height: 100%;
    position: absolute;
    .module-main {
      width: 100%;
      height: 100%;
      display: flex;
      .bar {
        width: 80px;
        background-color: #4a90e2cc;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        .back {
          position: absolute;
          bottom: 10px;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
      }

      .chat-main {
        display: flex;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        flex-direction: column;
        background-color: rgba(242, 242, 242, 0.6);
        position: relative;
        flex: 1 1 0%;
        overflow: hidden;
        .chat-headerBar {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(209, 209, 209, 0.6);
          padding: 0px 18px;
        }
        .chat-messageList {
          flex: 1 1 0%;
          padding: 8px 10px 0px;
          overflow-y: scroll;
        }
        .chat-chatInput {
          height: 70px;
          background-color: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          border-bottom-right-radius: 10px;
          padding: 0px 20px;
          position: relative;
          p {
            color: rgb(51, 51, 51);
            user-select: none;
            font-size: 14px;
            text-align: center;
            letter-spacing: 1px;
            flex: 1 1 0%;
            b {
              color: rgba(74, 144, 226, 1);
              cursor: pointer;
              font-size: 16px;
            }
          }
          input {
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: rgb(102, 102, 102);
            user-select: auto;
            flex: 1 1 0%;
            margin: 0px 10px;
            padding: 0px 8px;
            outline: none;
            border-width: 1px;
            border-style: solid;
            border-color: rgba(209, 209, 209, 0.5);
            border-image: initial;
          }
          .emoji-item {
            position: absolute;
            top: -150px;
            left: 0px;
            width: 300px;
            z-index: 100;
            height: 150px;
            overflow: auto;
            li {
              width: 20px;
              height: 20px;
              padding: 5px;
              float: left;
              cursor: pointer;
              list-style: none;
            }
          }
        }
      }
    }
  }
}
</style>

