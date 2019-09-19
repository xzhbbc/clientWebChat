<template>
    <div class="guestMeg">
        <h2>顾客信息</h2>
        <el-dialog style="margin: 0 auto" :title="titleName" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="公司" :label-width="formLabelWidth">
                    <el-input v-model="form.company"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="fixNow">确 定</el-button>
            </div>
        </el-dialog>
        <el-table class="clientTable" :data="guest" style="width: 100%">
            <el-table-column label="创建日期" width="180">
                <template slot-scope="scope">
                    {{scope.row.createdAt.split('T')[0]}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="用户名" width="180">
            </el-table-column>
            <el-table-column prop="company" label="公司">
            </el-table-column>
            <el-table-column prop="from" label="来自哪里">
            </el-table-column>
            <el-table-column prop="phone" label="电话">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="fix(scope.row, scope.$index)">修改</el-button>
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
            guest: [],
            dialogFormVisible: false,
            form: {
                company: '',
                phone: '',
            },
            formLabelWidth: '180',
            titleName: '',
            fixIndex: -1,
        }
    },
    mounted() {
        this.$http.get('/getAllGuest').then(res => {
            console.log(res.data.data)
            if (res.data.code == 0) {
                this.guest = res.data.data
            } else {
                this.$message.error(res.data.message)
            }
        })
    },
    methods: {
        fix(row, index) {
            // console.log(index)
            this.fixIndex = index
            console.log(row)
            this.dialogFormVisible = true
            this.form = JSON.parse(JSON.stringify(row))
            this.titleName = row.name
        },
        fixNow() {
            this.dialogFormVisible = false
            // console.log(this.form)
            let getAdmin = getUserStatus()
            // console.log(getAdmin)
            this.$http.post('/fixGuest', {
                id: this.form._id,
                clientId: getAdmin._id,
                phone: this.form.phone,
                company: this.form.company
            }).then(res => {
                // console.log(res.data)
                if (res.data.code == 0) {
                    this.guest[this.fixIndex].company = this.form.company
                    this.guest[this.fixIndex].phone = this.form.phone
                } else {
                    // this.form
                    this.$message.error(res.data.message)
                }
            })
        }
    }
}
</script>

<style>
.guestMeg {
  width: 98%;
  margin: 0 auto;
}
</style>

