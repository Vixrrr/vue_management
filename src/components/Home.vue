<template>
    <div>

        <el-container class="home-container">
            <!--头部区域-->
            <el-header>
                <div>
                    <img src="../assets/glfBW.png" height="60" width="42"/>
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <el-container>

                <!--侧边栏区域-->
                <el-aside :width="isCollapse? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                        <!--侧边栏菜单区域-->
                        <el-menu
                                background-color="#313743"
                                text-color="#fff"
                                active-text-color="#359afe"
                                unique-opened
                                :collapse="isCollapse"
                                :collapse-transition="false"
                                :router="true"
                                :default-active="activePath">
                            <!--一级菜单区域-->
                            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                                <!--一级菜单模板区域-->
                                <template slot="title">
                                    <i :class="iconsObj[item.id]"></i>
                                    <span>{{item.authName}}</span></template>
                                <!--二级菜单区域-->
                                <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
                                    <template slot="title">
                                        <i class="el-icon-menu"></i>
                                        <span>{{subitem.authName}}</span>
                                    </template>

                                </el-menu-item>
                            </el-submenu>
                        </el-menu>
                </el-aside>

                <!--主体区域-->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return {
                menuList:[],
                iconsObj:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao'
                },
                isCollapse:false,
                activePath:""
            }
        },
        created() {
            this.getMusicList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods:{
            logout(){
                window.sessionStorage.clear();
                this.$router.push('/login')
            },
            async getMusicList(){
                const {data:res} = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.message)
                this.menuList = res.data
                console.log(this.menuList);
            },
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            },
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100vh
    }

    .el-header{
        background-color: #363d40;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 8px;
        color: #ffffff;
        span{
            font-size: 20px;
            position: absolute;
            transform: translate(0,100%);
            margin-left: 10px;
        }
    }
    
    .el-aside{
        background-color: #313743;
        .el-menu{
            border-right: 0;
        }
    }
    
    .el-main{
        background-color: #e8ecef;
    }

    .iconfont{
        margin-right: 10px;
    }

    .toggle-button{
        color: #ffffff;
        font-size: 10px;
        line-height: 24px;
        background-color: #475163;
        letter-spacing: 0.2em;
        text-align: center;
        cursor: pointer;


    }
</style>