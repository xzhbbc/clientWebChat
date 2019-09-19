import Vue from 'vue'
import Router from 'vue-router'

import Chat from '@/components/chat/chatView'
import Login from '@/components/login/login'
import Server from '@/components/server/serverIndex'
import GuestMeg from '@/components/server/guestMeg'
import ChatMeg from '@/components/server/chatMeg'

import ClientManage from '@/components/server/clientCom'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/chat',
    name: 'Chat',
    component: Chat
  }, {
    path: '/loginServer',
    name: 'Login',
    component: Login
  }, {
    path: '/server',
    name: 'Server',
    component: Server,
    children: [{
      path: '/clientManage',
      name: 'ClientManage',
      component: ClientManage
    }, {
      path: '/guestMeg',
      name: 'GuestMeg',
      component: GuestMeg
    }, {
      path: '/chatMeg',
      name: 'ChatMeg',
      component: ChatMeg
    }]
  }]
})
