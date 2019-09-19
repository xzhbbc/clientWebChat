import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {
  getUserStatus
} from '@/assets/utils'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    client: [],
    //记录发消息方名字
    //客服的
    clientName: '',
    clientChat: [],
    clientMegList: [],
    //顾客的
    guestName: '',
    guestChat: [],
    guestMegList: [],
    setUserLogin: [],
    concatList: []
  },
  actions: {
    getClient({
      commit
    }, bol) {
      commit('GETCLIENT', bol)
    },
    async getClientChat({
      commit
    }, bol) {
      commit('GETCLIENTCHAT', bol)
    },
    async setUser(state, meg) {
      state.setUserLogin = meg
      console.log(state.setUserLogin)
    },
    addChat({
      commit
    }, meg) {
      commit('ADDCHAT', meg)
      // state.clientMegList.push(meg)
    }
  },
  mutations: {
    GETCLIENT(state, bol) {
      axios.get('/getClient?admin=' + !bol).then(res => {
        state.client = res.data
        // console.log(state.client)
      })
    },
    /**
     * 获取历史聊天
     * 1.如果为true 表示为guest登陆。
     * 2.如果为false 表示为admin登陆
     * 
     * guest 如果第一次登陆 将接入到空闲的客服，如果有历史记录，则接入历史记录聊天
     * admin 得到的是历史聊天记录
     */
    GETCLIENTCHAT(state, bol) {
      if (bol) {
        //获取顾客的聊天记录
        let getUser = getUserStatus('chat')
        axios.post('/findUpClient', {
          id: getUser._id
        }).then(res => {
          if (res.data.code === 0) {
            console.log(res.data)
            state.guestName = res.data.data.name
            state.guestChat = res.data.data
            if (res.data.chat.length == 0) return
            state.guestMegList = res.data.chat.map(item => {
              var dateBegin = new Date(item.createdAt); //将-转化为/，使用new Date
              var dateEnd = new Date(); //获取当前时间
              // console.log(dateEnd.getTime(), dateBegin.getTime())
              var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
              var dayDiff = Math.ceil(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
              // console.log(dayDiff)
              if (dayDiff <= 1) {
                item.time = '昨天' + dateBegin.getHours() + ':' + dateBegin.getMinutes()
              } else {
                item.time = (dateBegin.getMonth() + 1) + '月' + dateBegin.getDate() + '日' + dateBegin.getHours() + ':' + dateBegin.getMinutes()
              }
              return item
            })
            console.log(state.guestMegList)
          } else {
            this.guestName = '小智'
          }
        })
      } else {
        //获取客服的聊天记录
        let getUser = getUserStatus()
        axios.post('/findClientChat', {
          id: getUser._id
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 1) return //无消息
          if (res.data.chat[0].length == 0) return
          let saveData = res.data.chat
          let saveGuestList = []
          let concatList = []
          //修复时间显示问题
          for (let i in saveData) {
            saveData[i].map(item => {
              var dateBegin = new Date(item.createdAt); //将-转化为/，使用new Date
              var dateEnd = new Date(); //获取当前时间
              // console.log(dateEnd.getTime(), dateBegin.getTime())
              var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
              var dayDiff = Math.ceil(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
              // console.log(dayDiff)
              if (dayDiff <= 1) {
                item.time = '昨天' + dateBegin.getHours() + ':' + dateBegin.getMinutes()
              } else {
                item.time = (dateBegin.getMonth() + 1) + '月' + dateBegin.getDate() + '日' + dateBegin.getHours() + ':' + dateBegin.getMinutes()
              }
              return item
            })
          }
          //接受用户列表的最新消息
          for (let i in saveData) {
            if (saveData[i] != '') {
              concatList.push(saveData[i][saveData[i].length - 1])
            }
          }
          state.concatList = concatList
          state.clientMegList = saveData
        })
      }
    },
    ADDCHAT(state, meg) {
      // console.log(state.clientMegList)
      if (meg.index >= 0) {
        //客服的
        let nowArr = state.clientMegList[meg.index]
        console.log(state.clientMegList[meg.index])
        nowArr.push(meg)
        state.clientMegList[meg.index] = nowArr
      } else {
        if (state.guestMegList.length == 0) {
          state.guestMegList = []

          state.guestMegList.push(meg)
        } else {
          state.guestMegList.push(meg)
        }
      }
    },
    /**
     * 客服的操作
     * 来了一个新顾客对接客服，更新用户列表
     */
    ADDCONCATLIST(state, newUser) {
      state.concatList.push(newUser)
    },
    /**
     * 客服的操作
     * 来了一个新顾客对接客服,更新消息列表
     */
    addNewMeg(state, newMeg) {
      let newArr = []
      newArr[0] = newMeg
      state.clientMegList.push(newArr)
    }
  },
  getters: {
    getClient: state => state.client,
    getClientName: state => state.clientName,
    getClientChat: state => state.clientChat,
  }
})

export default store
