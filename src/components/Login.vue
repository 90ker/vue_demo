<template>
    <div class="login">
        <div class="login_box">
            <img src="https://i1.hdslb.com/bfs/face/c3071c4324567a1af9af4cf71e63d329bd3985ac.jpg@70w_70h_1c_100q.webp">
                <el-form :model="form" :rules="formRule" ref="formRef">
                    <el-form-item prop="username">
                        <el-input 
                            v-model="form.username"
                            placeholder="用户名" 
                            prefix-icon="el-icon-user-solid"/>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input 
                            v-model="form.password"
                            placeholder="密码"
                            type="password">
                            <i slot="prefix" class="el-input__icon el-icon-lock"/>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="this.login">登录</el-button>
                        <el-button type="info" @click="this.reset">注册</el-button>
                    </el-form-item>
                </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form:{
                username:'admin',
                password:'123456'
            },
            formRule:{
                username:[
                    {required:true, message:"还没写账号!",trigger:"blur"},
                    {min:2 ,max:5 , message:"2-5个字呢",trigger:"blur"}
                ],
                password:[
                    {required:true, message:"还没写密码!",trigger:"blur"},
                    {min:6 , message:"至少6个字呢",trigger:"blur"}
                ]
            }
        }
    },
    methods:{
        login(){
            this.$refs.formRef.validate(async (then)=>{
                if(!then) return;
                let {data:{meta:{status},token}}= await this.$http.post("login",this.form)
                if (status!=200) return this.$message.error("失败咯")
                this.$message.success("请进")
                window.sessionStorage.setItem("token",token)
                this.$router.push("/home")
            })
        },
        reset(){
            this.$refs.formRef.resetFields();
        }

    }
}
</script>
<style lang="less" scoped>
.login{
    background-color: antiquewhite;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items:center;
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        align-items: center;
        img{
            width: 70px;
            height: 70px;
            border-radius: 50%;
            box-shadow: 0 0 10px #000;
        }
        .btns{
            display: flex;
            justify-content: center;
        }
    }
}
</style>