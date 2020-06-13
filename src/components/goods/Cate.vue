<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="showAddCateDialog">添加角色</el-button>
            <tree-table style="margin-top: 15px;" :data="cateList" :columns="columns" :selection-type="false"
                :expand-type="false" border show-index index-text="#">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen;"></i>
                    <i class="el-icon-error" style="color: red;" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" size="mini" v-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-if="scope.row.cat_level==2">三级</el-tag>
                </template>
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <el-dialog title="添加商品" :visible.sync="addCateDialogVisible" width="30%" >
            <div>
                <el-form :model="addCateForm" :rules="addCateFormRules"
                            ref="addCateFormRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                                        @change="parentCateChanged" clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>

            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        created() {
            this.getCateList()
        },
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                cateList: [],
                total: 0,
                columns: [
                    { label: '分类名称', prop: 'cat_name' },
                    { label: '是否有效', type: 'template', template: 'isok' },
                    { label: '排序', type: 'template', template: 'order' },
                    { label: '操作', type: 'template', template: 'opt' },
                ],
                addCateDialogVisible: false,
                addCateForm:{
                    cat_name:'',
                    cat_pid:0,
                    cat_level:0
                },
                addCateFormRules:{
                    cat_name:[{ required: true, message: "还没写!", trigger: "blur" }]
                },
                parentCateList:[],
                cascaderProps:{
                    value: 'cat_id',
                    label:'cat_name',
                    children:'children',
                    expandTrigger:'hover'
                },
                selectedKeys:'',

                
            }
        },
        methods: {
            async getCateList() {
                const { data: { meta: { status }, data: { result, total } } } = await this.$http.get('categories', { params: this.queryInfo })
                if (status != 200) return this.$message.error('获取失败')
                this.cateList = result
                this.total = total
                this.$message.success("获取成功")
            }, handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCateList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCateList();
            },
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible=true
            },
            async getParentCateList(){
                const {data:{meta:{status},data}} = await this.$http.get('categories',{params:{type:3}})
                if(status!=200) return this.$message.error("获取失败")
                this.parentCateList = data
            },
            parentCateChanged(){
                if(this.selectedKeys.length > 0){
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                }else if(this.selectedKeys.length == 0){
                    this.addCateForm.cat_pid=0
                    this.addCateForm.cat_level=0
                }
            }
        }
    }
</script>
<style>

</style>