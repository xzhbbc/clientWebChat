<template>
    <div class="server_index">
        <h1>欢迎
            <span v-if="admin">管理员</span>
            <span v-else>客服</span> {{user}}
        </h1>
        <el-container>
            <aside-nav/>
            <el-container>
                <router-view/>
            </el-container>
        </el-container>
    </div>
</template>


<script>
import asideNav from './navComponent/Nav'
import { getUserStatus } from '@/assets/utils'

export default {
    components: {
        asideNav
    },
    data() {
        return {
            user: '',
            admin: false
        }
    },
    mounted() {
        this.user = getUserStatus().name
        this.admin = getUserStatus().admin
    }
}
</script>

<style lang="less">
.server_index {
}
</style>
