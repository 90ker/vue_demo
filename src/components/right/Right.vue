<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-table :data="rightList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column label="权限等级">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level== '0'" >一级</el-tag>
                        <el-tag v-if="scope.row.level== '1'" type="success">二级</el-tag>
                        <el-tag v-if="scope.row.level== '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        created() {
            this.getRightList()
        },
        data() {
            return {
                rightList: []
            }
        },
        methods: {
            async getRightList() {
                const {
                    data: {
                        meta: { status },
                        data
                    }
                } = await this.$http.get("rights/list")
                if(status!=200) return this.$message.error("请求失败");
                this.rightList = data
            }
        }
    }
</script>
<style>

</style>