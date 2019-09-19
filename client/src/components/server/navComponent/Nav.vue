<template>
    <el-aside class="container-aside" width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1','2']" :router="true">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-setting"></i>管理</template>
                <el-menu-item-group>
                    <el-menu-item index="/clientManage">客服管理</el-menu-item>
                    <el-menu-item index="/chatMeg">
                        会话管理
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-service"></i>对话</template>
                <el-menu-item-group>
                    <el-menu-item index="/chat?client=true">
                        会话
                        <el-badge :value="12" class="item"></el-badge>
                    </el-menu-item>
                    <el-menu-item index="/guestMeg">访客信息</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-setting"></i>系统设置</template>
                <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="3-1">选项1</el-menu-item>
                    <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                    <el-menu-item index="3-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="3-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-submenu>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>


<script>
export default {

}
</script>


<style lang="less">
.container-aside {
  .item {
    margin-top: -10px;
  }
}
</style>
