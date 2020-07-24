<template>
    <div>
        <div class="loginBox">
            <!--   图标   -->
            <div class="iconBox">
                <img src="../assets/logo.png" class="img">
            </div>
            <!--   图标   -->

            <!--   登陆表单  -->
            <el-form label-width="80px"class="loginForm" :model="loginData" :rules="loginFormRules" ref="loginRef">
                <!--   用户名  -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginData.username"></el-input>
                </el-form-item>
                <!--   密码  -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginData.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" class="btnLog" @click="checkLoginRules">登陆</el-button>
                    <el-button type="info" class="btnRes" @click="resetLogin">重置</el-button>
                </el-form-item>
            </el-form>
            <!--   登陆表单  -->

        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        components: {

        },
        data(){
            return{
                loginData:{
                    username:"admin",
                    password:"123456"
                },
                loginFormRules:{
                    username:[{
                        required:true,message:"请输入登录名称",trigger:"blur"
                    },
                        {
                            min:3,max:10,message:"请输入长度在3-10位的登录名称",trigger:"blur"
                        }
                    ],
                    password:[{
                        required:true,message:"请输入密码",trigger:"blur"
                    },{
                        min:6,max:10,message:"请输入长度在6-12位的密码",trigger:"blur"
                    }]
                }
            }
        },
        methods:{
            resetLogin(){
                // console.log(this.$refs)
                this.$refs.loginRef.resetFields()
            },
            checkLoginRules(){
                this.$refs.loginRef.validate(async valid=>{
                    // console.log(val)
                    if (!valid) return;
                    const { data: res } = await this.$http.post("login",this.loginData)
                    if (res.meta.status !== 200) return this.$message.error("登陆失败");
                    this.$message.success("登陆成功");
                    //保存token
                    window.sessionStorage.setItem("token",res.data.token)
                    //跳转页面
                    this.$router.push("/home")

                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .iconBox{
        width: 130px;
        height: 130px;
        margin: 0 auto;
        padding: 10px;
        transform: translate(0,-38%);

        border-radius: 50%;
        border: #ebedea solid 1px;
        overflow: hidden;
        box-shadow: 0 0 10px #ebedea;
        background-color: #fff;

        .img{
            width: 100%;
            height: 100%;
            background-color: #ebedea;
            border-radius: 50%;


        }

    }

    .loginBox{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%,-50%) ;
        .loginForm{
            transform: translate(-12.5%,-20%);
            width: 110%;
        }
    }

    .btns{

        display: flex;
        justify-content: flex-end;
    }

</style>