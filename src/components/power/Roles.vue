<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--        卡片视图-->
        <el-card>
<!--            添加角色列表区域-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRolesDialogVisable = true">添加角色</el-button>
                </el-col>
            </el-row>

<!--            角色列表区域-->
            <el-table :data="roleList" border stripe>
<!--               展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop':'','vCenter']">
<!--                        渲染一级权限-->
                        <el-col :span="5">
                            <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
<!--                            渲染二级权限-->
                        <el-col :span="19">
                            <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '':'bdtop','vCenter']">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
<!--                                渲染三级权限-->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="(item3,ir) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>

                        </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                       <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRolesDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>

<!--        分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="setRightDialogVisable"
                width="50%"
        @close="setRightDialogClosed">
<!--            树形控件-->
            <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="allowRights">确 定</el-button>
  </span>
        </el-dialog>

        <!--        添加角色的对话框-->
        <el-dialog
                title="添加角色"
                :visible.sync="addRolesDialogVisable"
                width="50%"
                @close="addRolesDialogClosed">
            <!--            内容主体区域-->
            <el-form :model="addRolesForm" ref="addRolesFormRef" label-width="70px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesForm.roleName">
                    </el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc">
                    </el-input>
                </el-form-item>
            </el-form>
            <!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisable = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
        </el-dialog>

        <!--        修改用户的对话框-->
        <el-dialog
                title="修改角色"
                :visible.sync="editRolesDialogVisible"
                width="50%">
        <!--           修改角色的内容主体区域-->
        <el-form :model="editRolesForm" ref="editRolesFormRef" :rules="editRolesFormRules" label-width="70px" @close="editRolesDialogClosed">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRolesForm.roleName">
                </el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRolesForm.roleDesc">
                </el-input>
            </el-form-item>
        </el-form>
        <!--            底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消
    </el-button>
    <el-button type="primary" @click="editRolesInfo">确 定
    </el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data(){
            return{
                //所有角色列表的数据
                roleList:[],
                //控制分配权限对话框的显示与隐藏
                setRightDialogVisable: false,
                //所有权限的数据
                rightsList:[],
                //树形控件的属性绑定对象
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                //默认被选中的节点id数值
                defKeys:[105],

                //添加角色 表单数据
                addRolesForm: {
                    roleName:'',
                    roleDesc:''
                },

                //控制 对话框 显示与隐藏
                addRolesDialogVisable: false,

                //修改角色 表单数据
                editRolesForm: {
                    roleName:'',
                    roleDesc:''
                },

                //控制 修改角色 显示与隐藏
                editRolesDialogVisible:false,

                //修改表单的验证规则
                editRolesFormRules:{
                    roleName: [{
                        required:true,
                        message:'请输入角色名称',
                        trigger:'blur'}],
                },

                //当前即将分配权限的角色id
                roleId:'',




            }
        },
        created() {
            this.getRoleList()
        },
        methods:{
            //获取权限列表
            async getRoleList(){
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error("请求角色列表失败！")
                }
                this.roleList = res.data
                console.log(this.roleList);
            },

            //删除三级权限
            async removeRightById(role,rightId){
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

                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

                if (res.meta.status !== 200){
                    return this.$message.error('删除权限失败！')
                }

                this.$message.success('成功删除权限')
                // this.getRoleList()
                role.children = res.data
            },

            //展示分配权限对话框
            async showSetRightDialog(role){
                this.roleId = role.id
                const {data:res} = await this.$http.get('rights/tree')

                if (res.meta.status !== 200){
                    return this.$message.error('获取权限数据失败！')
                }

                //保存获取到的权限数据
                this.rightsList = res.data

                //递归获取三级节点的id
                this.getLeafKeys(role,this.defKeys)


                this.setRightDialogVisable = true
            },

            //通过递归形式，获取角色下所有三级权限的id，并保存到defKeys数组中
            getLeafKeys(node,arr){
                //如果当前Node节点不包含children属性，则是三级节点
                if (!node.children){
                    return arr.push(node.id)
                }

                node.children.forEach(item => this.getLeafKeys(item,arr))

            },

            //监听权限对话框的关闭事件
            setRightDialogClosed(){
                this.defKeys = []
            },

            //关闭 添加用户对话框
            addRolesDialogClosed(){
                this.$refs.addRolesFormRef.resetFields()
            },

            //点击按钮，添加新角色
            addRoles(){
                this.$refs.addRolesFormRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return
                    //可以发起添加用户请求
                    const {data:res} =await this.$http.post('roles',this.addRolesForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加角色失败')
                    }
                    this.$message.success('添加角色成功')
                    //隐藏添加用户对话框
                    this.addRolesDialogVisable = false
                    //重新获取用户数据
                    this.getRoleList()

                })
            },

            //重置 编辑角色 的对话框
            editRolesDialogClosed(){
                this.$refs.editRolesFormRef.resetFields()
            },

            //展示 编辑用户 的对话框
            async showEditRolesDialog(id){
                console.log(id);
                const {data : res} = await this.$http.get('roles/'+id)
                if (res.meta.status !== 200){
                    return  this.$message.error('查询角色信息失败！')
                }
                this.editRolesForm = res.data
                this.editRolesDialogVisible = true
            },

            //验证 编辑角色 规则是否通过
            editRolesInfo(){
                this.$refs.editRolesFormRef.validate(async valid => {
                    if (!valid) return
                    //发起 修改用户信息 的数据请求
                    const {data:res} = await this.$http.put('roles/'+this.editRolesForm.roleId,{
                        roleName:this.editRolesForm.roleName,
                        roleDesc:this.editRolesForm.roleDesc
                    })

                    if (res.meta.status !== 200) {
                        return this.message.error('更新角色信息失败')
                    }

                    //关闭对话框
                    this.editRolesDialogVisible = false
                    //刷新数据列表
                    this.getRoleList()
                    //提示修改成功
                    this.$message.success('更新角色信息成功！')
                })
            },

            //删除角色 的操作
            async removeRoleById(id){
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

                const {data:res} = await this.$http.delete('roles/'+id)

                if (res.meta.status !== 200){
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getRoleList()
            },

            //为角色分配权限
            async allowRights(){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // console.log(keys);

                const idStr = keys.join(",")
                const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids : idStr})


                if (res.meta.status !== 200){
                    return this.$message.error('分配权限失败！')
                }
                this.$message.success('分配权限成功！')
                this.getRoleList()
                this.setRightDialogVisable = false



            }

        }
    }
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }

    .bdtop{
        border-top: 1px solid #eee;
    }

    .bdbottom{
        border-bottom: 1px solid #eee;
    }

    .vCenter{
        display: flex;
        align-items: center;
    }
</style>