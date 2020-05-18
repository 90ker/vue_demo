<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="para.query"
            clearable
            @clear="getList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="list" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editDialogShow(scope.row.id)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
              size="mini"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" v-model="scope.row" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="para.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="para.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="num"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClose">
      <el-form label-width="70px" :model="addUser" :rules="addUserRules" ref="addUserRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOneUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
      <el-form label-width="70px" :model="editUser" :rules="editUserRules" ref="editUserRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOneUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getList();
  },
  data() {
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!regEmail.test(value)) return cb(new Error("请输入正确邮箱"));
      return cb();
    };
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^[1]([3-9])[0-9]{9}$/;
      if (!regMobile.test(value)) return cb(new Error("请输入正确手机"));
      return cb();
    };
    return {
      list: [],
      num: 0,
      para: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUser: {
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          { required: true, message: "还没写账号!", trigger: "blur" },
          { min: 2, max: 5, message: "2-5个字呢", trigger: "blur" }
        ],
        password: [
          { required: true, message: "还没写密码!", trigger: "blur" },
          { min: 6, message: "至少6个字呢", trigger: "blur" }
        ],
        email: [
          { required: true, message: "还没写邮箱!", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "还没写手机!", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editUserRules: {
        email: [
          { required: true, message: "还没写邮箱!", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "还没写手机!", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getList() {
      const {
        data: {
          meta: { status },
          data: { users, total }
        }
      } = await this.$http.get("users", { params: this.para });
      if (status != 200) return this.$message.error("请求失败");
      this.list = users;
      console.log(users);
      this.num = total;
    },
    handleSizeChange(newSize) {
      this.para.pagesize = newSize;
      this.getList();
    },
    handleCurrentChange(newPage) {
      this.para.pagenum = newPage;
      this.getList();
    },
    async userStateChange(user) {
      const {
        data: {
          meta: { status }
        }
      } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      if (status != 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
    },
    addOneUser() {
      this.$refs.addUserRef.validate(async then => {
        if (then) {
          const {
            data: {
              meta: { status }
            }
          } = await this.$http.post("users", this.addUser);
          if (status != 201) return this.$message.error("添加失败");
          this.addDialogVisible = false;
          this.$message.success("添加成功");
          this.getList();
        }
      });
    },
    addDialogClose() {
      this.$refs.addUserRef.resetFields();
    },
    editDialogClose() {
      this.$refs.editUserRef.resetFields();
    },
    async editDialogShow(id) {
      const {
        data: {
          meta: { status },
          data
        }
      } = await this.$http.get(`users/${id}`);
      if (status != 200) return this.$message.error("查询失败");
      this.$message.success("查询成功");
      this.editUser = data;
      this.editDialogVisible = true;
    },
    editOneUser() {
      this.$refs.editUserRef.validate(async then => {
        if (then) {
          const {
            data: {
              meta: { status }
            }
          } = await this.$http.put("users/" + this.editUser.id, {
            email: this.editUser.email,
            mobile: this.editUser.mobile
          });
          if (status != 200) return this.$message.error("修改失败");
          this.editDialogVisible = false;
          this.$message.success("修改成功");
          this.getList();
        }
      });
    },
    deleteUser(id) {
      this.$confirm("要删除吗", "警告", {
        confirmButtonText: "确认",
        deleteButtonText: "取消"
      })
        .then(async confirm=> {
            if(confirm == "confirm"){
                const {
                    data: {
                    meta: { status }
                    }
                } = await this.$http.delete(`users/${id}`);
                if (status != 200) return this.$message.error("删除失败");
                this.$message.success("删除成功");
                this.getList();
            }
        })
        .catch(() => {
          this.$message.error("取消");
        });
    }
  }
};
</script>
<style></style>