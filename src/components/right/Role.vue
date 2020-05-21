<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary">添加角色</el-button>
            <el-table :data="RoleList" border stripe>
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row v-for="(item1) in scope.row.children" :key="item1.id" :class="['line','juzhong']">
                            <el-col :span="5">
                                <el-tag closable @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row v-for="(item2,index) in item1.children" :key="item2.id"
                                    :class="index==0?'':'line'">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeTag(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">

                                        <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning"
                                            :class="index==0?'':'line'" closable @close="removeTag(scope.row,item3.id)">
                                            {{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" @click="showSetRightDialog(scope.row)" icon="el-icon-setting" size="mini">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="分配权限" :visible.sync="RightDialogVisible" width="50%" 
                    @close="SetRightDialogClose">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox
                        node-key="id" ref="treeRef"
                      default-expand-all  :default-checked-keys="defKeys"/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="RightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        created() {
            this.getRoleList()
        },
        data() {
            return {
                RoleList: [],
                RightDialogVisible: false,
                rightsList:[],
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                defKeys:[],
                roleId:''
            }
        },
        methods: {
            async getRoleList() {
                const {
                    data: {
                        meta: { status },
                        data
                    }
                } = await this.$http.get("roles")
                if (status != 200) return this.$message.error("请求失败");
                this.RoleList = data
            },
            removeTag(row, rightId) {
                this.$confirm("要删除吗", "警告", {
                    confirmButtonText: "确认",
                    deleteButtonText: "取消"
                }).then(async (confirm) => {
                    if (confirm == "confirm") {
                        const { data: { meta: { status }, data } } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
                        if (status != 200) return this.$message.error("没删成功")
                        this.$message.success("删除成功")
                        row.children = data
                    }
                })
            },
            async showSetRightDialog(role) {
                this.roleId=role.id
                const {data:{meta:{status},data}} = await this.$http.get("rights/tree")
                if (status != 200) return this.$message.error("请求失败");
                this.getLeafKeys(role,this.defKeys)
                this.rightsList = data
                this.RightDialogVisible = true
            },
            getLeafKeys(node,arr){
                if(!node.children) return arr.push(node.id) 
                node.children.forEach((leaf)=>{
                    this.getLeafKeys(leaf,arr)
                })
                
            },
            SetRightDialogClose(){
                this.defKeys=[]
            },
            async allotRights(){
                const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
                let rids = keys.join(',')
                const {data: { meta: { status }}} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids})
                if (status != 200) return this.$message.error("更新失败")
                this.$message.success("更新成功")
                this.RightDialogVisible = false
                this.getRoleList()
            }
        }
    }
</script>
<style lang="less" scoped>
    .line {
        border-top: 1px solid #eee;
    }

    .el-tag {
        margin: 7px
    }

    .juzhong {
        display: flex;
        align-items: center;
    }
</style>