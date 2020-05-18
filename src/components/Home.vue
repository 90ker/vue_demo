<template>
  <el-container class="container">
    <el-header>
      <div>
        <img src="https://i1.hdslb.com/bfs/face/c3071c4324567a1af9af4cf71e63d329bd3985ac.jpg@70w_70h_1c_100q.webp" />
        <span>武器竞技场</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'60px':'200px'">
        <div class="toggle" @click="collapse">| | |</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened
          :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i :class=icons[item.id]></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="savePath('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    created() {
      this.getList();
      this.activePath = window.sessionStorage.getItem("activePath")
    },
    data() {
      return {
        list: [],
        icons: {
          125: 'iconfont icon-user',
          103: 'iconfont icon-tijikongjian',
          101: 'iconfont icon-shangpin',
          102: 'iconfont icon-danju',
          145: 'iconfont icon-baobiao'
        },
        isCollapse: false,
        activePath: ''
      };
    },
    methods: {
      quit() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      async getList() {
        const {
          data: {
            meta: { status },
            data
          }
        } = await this.$http.get("menus");
        if (status != 200) return this.$message.error("获取失败");
        this.list = data;
      },
      collapse() {
        this.isCollapse = !this.isCollapse
      },
      savePath(path) {
        window.sessionStorage.setItem("activePath", path)
      }
    }
  };
</script>

<style lang="less" scoped>
  .container {
    height: 100%;

    .el-header {
      background-color: #344844;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;

      div {
        display: flex;
        align-items: center;

        img {
          width: 60px;
          height: 60px;
        }

        span {
          margin-left: 15px;
          color: #aaa;
          font-size: 24px;
        }
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .toggle {
      background-color: #4a5064;
      font-size: 12px;
      line-height: 30px;
      color: #fff;
      text-align: center;
    }

    .el-menu {
      border: none;
    }

    .iconfont {
      margin-right: 10px;
    }
  }
</style>