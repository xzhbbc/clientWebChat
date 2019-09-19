<template>
    <div>
        <div class="chat-chatInput guest">
            <p>游客朋友你好, 请
                <b @click="login">登录</b>后参与聊天</p>
        </div>
        <transition name="fade">
            <div class="pop-wrap" v-show="nowLogin">
                <div class="el-icon-close close" @click="outLogin()"></div>
                <div class="login-wrap">
                    <el-form :model="ruleForm2" status-icon ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名:" prop="user">
                            <el-input type="text" v-model="ruleForm2.user" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码:" prop="checkPass">
                            <el-input type="password" v-model="ruleForm2.pwd" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item style="float: right">
                            <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
                            <el-button @click="goRegister">注册</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nowLogin: false,
            ruleForm2: {
                user: '',
                pwd: ''
            }
        }
    },
    methods: {
        login() {
            this.nowLogin = true
        },
        outLogin() {
            this.nowLogin = false
        },
        submitForm() {
            if (this.checkUser()) {
                this.$http.post('/login', {
                    user: this.ruleForm2.user,
                    pwd: this.ruleForm2.pwd,
                }).then(res => {
                    if (res.data.code == 0 || res.data.code == 1) {
                        this.nowLogin = false
                        sessionStorage.setItem('user', JSON.stringify(res.data.data))
                        this.$store.dispatch('getClientChat', true)
                        this.$emit('isLogin', true)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        },
        goRegister() {
            if (this.checkUser()) {
                this.$http.post('/register', {
                    user: this.ruleForm2.user,
                    pwd: this.ruleForm2.pwd
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.message)
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            }
        },
        checkUser() {
            if (this.ruleForm2.user != '' && this.ruleForm2.pwd != '') {
                return true
            } else {
                this.$message.warning('请填写完整账号密码')
                return false
            }
        }
    }
}
</script>

<style lang="less">
@keyframes rotate-close {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.chat-chatInput {
  height: 70px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  border-bottom-right-radius: 10px;
  padding: 0px 20px;
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
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.pop-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100vh;
  background-color: rgba(7, 17, 27, 0.8);
  blur: 10px;
  .close {
    font-size: 42px;
    color: #fff;
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 1001;
    cursor: pointer;
  }
  .close:hover {
    animation: rotate-close 0.5s ease-in-out;
  }
  .login-wrap {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    label {
      color: #fff;
    }
  }
}
</style>
