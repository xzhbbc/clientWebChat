<template>
    <div class="containerClient">
        <h2>对话管理</h2>
        <div class="guest_sel">
            <p class="title">顾客选择：</p>
            <el-select v-model="value" placeholder="请选择" @change="selGuest">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-table class="clientTable" :data="message" style="width: 100%">
            <el-table-column sortable label="创建日期" width="180">
                <template slot-scope="scope">
                    {{scope.row.createdAt.split('T')[0]}}
                </template>
            </el-table-column>
            <el-table-column sortable prop="name" label="发送方" width="180">
            </el-table-column>
            <el-table-column sortable prop="toname" label="接收方" width="180">
            </el-table-column>
            <el-table-column prop="meg" label="信息" width="180">
            </el-table-column>
            <el-table-column sortable label="客服" prop="send_client_id.name" width="180">
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getUserStatus } from '@/assets/utils'

export default {
    data() {
        return {
            message: [],
            options: [{
                value: 'all',
                label: '全部'
            }],
            value: 'all'
        }
    },
    mounted() {
        let getAdmin = getUserStatus()
        this.$http.post('/findMoreChatMeg', {
            id: getAdmin._id,
            admin: getAdmin.admin
        }).then(res => {
            console.log(res.data)
            if (res.data.code == 0) {
                this.message = res.data.meg
                res.data.data.map(item => {
                    item.label = item.name
                    item.value = item._id
                    this.options.push(item)
                })
                // this.options.push(res.data.data)
            } else {
                this.$message.error(res.data.message)
            }
        })
    },
    methods: {
        selGuest() {
            console.log(this.value)
            this.findApiGuest(this.value)
        },
        findApiGuest(val) {
            // console.log(val)
            if (val == 'all') {
                val = ''
            }
            this.$http.post('/findGuestChat', {
                id: val
            }).then(res => {
                if (res.data.code == 0) {
                    this.message = res.data.meg
                    // this.options.push(res.data.data)
                } else {
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style lang="less">
.containerClient {
  width: 98%;
  margin: 0 auto;
  .guest_sel {
    width: 300px;
    height: 50;
    margin: 10px 0;
  }
  .title {
    line-height: 30px;
    float: left;
  }
}
</style>

