<template>
    <div class="login">
        <h1>客服系统后台登陆</h1>
        <el-form :model="formLogin">
            <el-form-item label="用户名:">
                <el-input v-model="formLogin.user"></el-input>
            </el-form-item>
            <el-form-item label="密码:">
                <el-input v-model="formLogin.pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="login">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
export default {
    data() {
        return {
            formLogin: {
                user: '',
                pwd: ''
            }
        }
    },
    methods: {
        login() {
            if (this.formLogin.user != "" && this.formLogin.pwd != "") {
                this.$http.post('/login', {
                    user: this.formLogin.user,
                    pwd: this.formLogin.pwd,
                    loginStatus: 'admin'
                }).then(res => {
                    if (res.data.code == 0 || res.data.code == 1) {
                        sessionStorage.setItem('user', JSON.stringify(res.data.data))
                        this.$router.push('/server')
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
            } else {
                this.$message.warning('请填写完整的用户名和密码')
            }
        }
    }
}
</script>

<style lang="less">
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  transform: translate(-50%, -60%);
  text-align: center;
  .btn {
    float: right;
  }
}
</style>
