<template>
    <div>

<!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

<!--        卡片视图-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--        搜索视图-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisable = true">添加用户</el-button>
                </el-col>
            </el-row>

<!--            用户列表区域-->
            <el-table
                    :data="userlist"
                    stripe
                    style="width: 100%">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop=""
                        label="email"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色">
                </el-table-column>
                <el-table-column
                        prop="mg_state"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="操作"
                width="220px">
                    <template slot-scope="scope">
<!--                    修改按钮-->
                    <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row.id)" ></el-button>
<!--                    删除按钮-->
                    <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
<!--                    分配角色按钮-->
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

<!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

<!--        添加用户的对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisable"
                width="50%"
                @close="addDialogClosed">
<!--            内容主体区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username">
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password">
                    </el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile">
                    </el-input>
                </el-form-item>
            </el-form>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>

<!--        修改用户的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%">
<!--           修改用户的内容主体区域-->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" @close="editDialogClosed">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email">
                    </el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile">
                    </el-input>
                </el-form-item>
            </el-form>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消
    </el-button>
    <el-button type="primary" @click="editUserInfo">确 定
    </el-button>
  </span>
        </el-dialog>

<!--        分配角色的对话框-->
        <el-dialog
                title="分配角色"
                :visible.sync="setSomeRoleDialogVisible"
                width="50%"
                @close="setRoleDialogClosed">
            <!--           分配角色的内容主体区域-->
            <div>
                <p>当前的用户： {{userInfo.username}}</p>
                <p>当前的角色： {{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>

            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="setSomeRoleDialogVisible = false">取 消
    </el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定
    </el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Users",
        data(){

            //验证 邮箱 的规则
            var checkEmail = (rule,value,cb) => {
                //验证邮箱的正则表达式
                const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                if (regEmail.test(value)){
                    //合法邮箱
                    return cb()
                }

                cb(new Error('请输入合法邮箱'))
            }
            //验证 手机号 的规则
            var checkMobile = (rule,value,cb) => {
                //验证手机号码的正则表达式
                const regEmail = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                if (regEmail.test(value)){
                    //合法手机号码
                    return cb()
                }

                cb(new Error('请输入合法手机号码'))
            }

            return{
                //获取 用户列表 对象
                queryInfo:{
                    query:'',
                    pagenum: 1,
                    pagesize: 5,
                },
                userlist:[],
                total:0,
                //控制 对话框 显示与隐藏
                addDialogVisable: false,
                //添加用户 表单数据
                addForm: {
                    username:'',
                    password:'',
                    email:'',
                    mobile:''

                },

                //修改用户 表单数据
                editForm: {
                    username:'',
                    password:'',
                    email:'',
                    mobile:''

                },
                //添加表单的 验证规则 对象
                addFormRules:{
                    username:[{
                        required:true,
                        message:'请输入用户名',
                        trigger:'blur'},

                        {
                        min:3,
                        max:10,
                        message:'用户名长度在3~10个字符之间',
                        trigger:'blur'}],
                    password:[
                        {
                            required:true,
                            message:'请输入密码',
                            trigger:'blur'},
                        {
                            min:3,
                            max:10,
                            message:'密码长度在6~15个字符之间',
                            trigger:'blur'}
                    ],
                    email: [{
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'},{validator:checkEmail,trigger: 'blur'}],
                    mobile: [{
                        required:true,
                        message:'请输入手机号码',
                        trigger:'blur'},{validator:checkMobile,trigger: 'blur'}]

                },
                //修改表单的验证规则
                editFormRules:{
                    email: [{
                        required:true,
                        message:'请输入邮箱',
                        trigger:'blur'},{validator:checkEmail,trigger: 'blur'}],
                    mobile: [{
                        required:true,
                        message:'请输入手机号码',
                        trigger:'blur'},{validator:checkMobile,trigger: 'blur'}]
                },
                //控制 修改用户 显示与隐藏
                editDialogVisible:false,

                //控制 分配角色对话框 显示与隐藏
                setSomeRoleDialogVisible:false,

                //分配角色对话框的 用户信息
                userInfo:{},

                //所有角色的列表
                rolesList:[],

                //分配角色中选中 角色的id值
                selectedRoleId:'',


            }
        },
        created() {
            this.getUsersList()
        },
        methods:{
            async getUsersList(){
                const {data: res} = await this.$http.get("users",{params:this.queryInfo})
                if (res.meta.status !== 200) return  this.$message.error("用户信息获取失败！");
                this.userlist = res.data.users
                this.total = res.data.total
                console.log(res);
            },

            //监听 pagesize 改变的事件
            handleSizeChange(newSize){
                // console.log(newSize);
                this.queryInfo.pagesize = newSize;
                this.getUsersList()
            },

            //监听 页码值 改变的事件
            handleCurrentChange(newPage){
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                this.getUsersList()
            },

            //监听 状态 改变事件
            userStateChange(userinfo){
                // console.log(userinfo);
                this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')

            },

            //关闭 添加用户对话框
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮，添加新用户
            addUser(){
                this.$refs.addFormRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return
                    //可以发起添加用户请求
                    const {data:res} =await this.$http.post('users',this.addForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败')
                    }
                    this.$message.success('添加用户成功')
                    //隐藏添加用户对话框
                    this.addDialogVisable = false
                    //重新获取用户数据
                    this.getUsersList()

                })
            },

            //展示 编辑用户 的对话框
            async showEditDialog(id){
                console.log(id);
                const {data : res} = await this.$http.get('users/'+id)
                if (res.meta.status !== 200){
                    return  this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },

            //重置 编辑用户 的对话框
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },

            //验证 编辑用户 规则是否通过
            editUserInfo(){
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    //发起 修改用户信息 的数据请求
                    const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })

                    if (res.meta.status !== 200) {
                        return this.message.error('更新用户信息失败')
                    }

                    //关闭对话框
                    this.editDialogVisible = false
                    //刷新数据列表
                    this.getUsersList()
                    //提示修改成功
                    this.$message.success('更新用户信息成功！')
                })
            },

            //删除用户 的操作
            async removeUserById(id){
                //弹框询问 用户是否确认删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                // console.log(confirmResult);
                //确认删除
                if (confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }

                const {data:res} = await this.$http.delete('users/'+id)

                if (res.meta.status !== 200){
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUsersList()
            },

            //展示 分配角色 的对话框
            async setRole(userInfo){
                this.userInfo = userInfo
                const {data:res} = await this.$http.get('roles')

                if (res.meta.status !== 200){
                    return this.$message.error('获取角色列表失败！')
                }
                this.rolesList = res.data

                this.setSomeRoleDialogVisible = true

            },

            //点击按钮 分配角色
            async saveRoleInfo(){
                if (!this.selectedRoleId){
                    return this.$message.error('请选择要分配的角色')
                }

                const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})

                if (res.meta.status !== 200){
                    return this.$message.error('更新角色失败')
                }

                this.$message.success('更新角色成功！')
                this.getUsersList()
                this.setSomeRoleDialogVisible = false
            },

            //监听分配用户角色对话框的 关闭
            setRoleDialogClosed(){
                this.selectedRoleId = ''
                this.userInfo = {}
            }

        }
    }
</script>

<style scoped>

</style>