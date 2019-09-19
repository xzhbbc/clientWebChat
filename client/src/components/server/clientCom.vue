<template>
    <div class="containerClient">
        <h2>客服管理</h2>
        <el-table class="clientTable" :data="getClient" style="width: 100%">
            <el-table-column label="创建日期" width="180">
                <template slot-scope="scope">
                    {{scope.row.meta.createdAt.split('T')[0]}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="用户名" width="180">
            </el-table-column>
            <el-table-column prop="fast" label="优先级(优先级越小的，最优先获取)" width="180">
            </el-table-column>
            <el-table-column label="是否在线" width="180">
                <template slot-scope="scope">
                    <div style="color: green" v-if="Boolean(scope.row.status)">是</div>
                    <div style="color: grey" v-else>否</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="down(scope.row)" type="danger">下线</el-button>
                    <el-button size="mini" @click="open3(scope.row._id)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getUserStatus } from '@/assets/utils'

export default {
    computed: {
        getClient() {
            return this.$store.getters.getClient
        }
    },
    mounted() {
        let getAdmin = getUserStatus().admin
        this.$store.dispatch('getClient', getAdmin)
    },
    methods: {
        open3(id) {
            // console.log(id)
            this.$prompt('请输入优先级', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '必须是数字'
            }).then(({ value }) => {
                this.$http.post('fixFastClient', {
                    id,
                    fast: value
                }).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.success)
                    } else {
                        this.$message.warning(res.data.message)
                    }
                })
                // this.$message({
                //     type: 'success',
                //     message: '你的邮箱是: ' + value
                // });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '取消输入'
                // });
            });
        },
        down(row) {
            let fixid = row._id
            let getAdmin = getUserStatus().admin
            let getId = getUserStatus()._id
            if (getAdmin) {
                this.$http.post('/downClient', {
                    id: getId,
                    fixid
                }).then(res => {
                    console.log(res.data)
                    if (res.data.code == 0) {
                        this.$message.success(res.data.message)
                    } else {
                        this.$message.warning(res.data.message)
                    }
                })
            } else {
                this.$message.warning('你不是该管理员，无法进行操作')
            }
        }
    }
}
</script>

<style lang="less">
.containerClient {
  width: 98%;
  margin: 0 auto;
}
</style>

