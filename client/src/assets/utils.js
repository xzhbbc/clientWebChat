import Vue from 'vue'

export const getUserStatus = (type) => {
  let user = sessionStorage.getItem('user')
  // console.log(user)
  if (user) {
    return JSON.parse(user)
  } else {
    if (type != 'chat') {
      Vue.$message.error('请登录')
      Vue.$router.push('/loginServer')
    } else {
      return 'needLogin'
    }
  }
}
