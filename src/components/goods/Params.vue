<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

<!--        卡片视图区域-->
        <el-card>
            <el-alert show-icon title="注意：只允许设置第三级分类的参数" type="warning" :closable="false"></el-alert>
<!--            商品分类视图-->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!--                选择商品分类的级联选择器-->
                    <el-cascader
                            expand-trigger="hover"
                            :options="cateList"
                            :props="cateProps"
                            v-model="selectedCateKeys"
                            @change="handleChange"
                            change-on-select>
                    </el-cascader>
                </el-col>
            </el-row>

<!--            tab页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--                添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
<!--                    动态参数表格-->
                    <el-table :data="manyTableData" border stripe>
<!--                        展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
<!--                                循环渲染tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
<!--                                输入的文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
<!--                        索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
<!--                添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only"><el-button type="primary" size="mini" @click="addDialogVisible = true">添加属性</el-button>
 <!--                    静态属性表格-->
                    <el-table :data="onlyTableData" border stripe>
<!--                        展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!--                                循环渲染tag标签-->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!--                                输入的文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
<!--                        索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showEditDialog">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

<!--        添加参数的对话框-->
        <el-dialog
                :title="'添加'+titleText"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed">
<!--            添加参数的表单-->
            <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
        </el-dialog>



        <!--        修改参数的对话框-->
        <el-dialog
                :title="'修改'+titleText"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed">
            <!--            添加参数的表单-->
            <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "Params",
        data(){
            return{
                //商品分类列表
                cateList:[],
                //指定联机选择器的配置对象
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                //指定联机选择器双向绑定到的的数组
                selectedCateKeys:[],
                //被激活的页签的名称
                activeName:'many',

                //动态参数的数据
                manyTableData:[],
                //静态属性的数据
                onlyTableData:[],

                //控制对话框的显示与隐藏
                addDialogVisible:false,
                //添加参数表单数据对象
                addForm:{
                    attr_name:''
                },
                //添加表单的验证规则对象
                addFormRules:{
                    attr_name:[
                        {
                            required:true,
                            message:'请输入参数名称',
                            trigger:'blur'
                        }
                    ]
                },

                //控制修改表单的显示与隐藏
                editDialogVisible:false,
                //添加参数表单数据对象
                editForm:{
                    attr_name:'',
                    attr_id:''
                },
                //添加表单的验证规则对象
                editFormRules:{
                    attr_name:[
                        {
                            required:true,
                            message:'请输入参数名称',
                            trigger:'blur'
                        }
                    ]
                },



            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取所有商品列表
            async getCateList(){
                const {data:res} = await this.$http.get('categories')

                if (res.meta.status !== 200){
                    return this.$message.error('获取商品分类失败！')
                }
                this.cateList = res.data
                console.log(this.cateList);
            },

            //监听级联选择框的改变
            handleChange(){
                this.getParamsData()
            },

            //tab点击事件处理函数
            handleTabClick(){
                this.getParamsData()
            },

            //获取参数列表数据
            async getParamsData(){
                //证明当前所选不是三级分类
                if (this.selectedCateKeys.length !== 3){
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }

                //选中的是三级分类
                console.log(this.selectedCateKeys);
                //根据所选分类的id和当前所处的面板，获取对应的参数
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})

                if (res.meta.status !== 200){
                    return this.$message.error('获取商品分类失败！')
                }
                console.log(res.data);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ?
                    item.attr_vals = item.attr_vals.split(' ') : []
                    //控制文本框的显示与隐藏
                    item.inputVisible = false
                    //文本框中输入的值
                    item.inputValue = ''
                })



                if (this.activeName === 'many'){
                    this.manyTableData = res.data
                }else{
                    this.onlyTableData = res.data
                }
            },

            //添加对话框的关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },

            //点击按钮，添加参数
            addParams(){
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })

                    if (res.meta.status !== 201){
                        return this.$message.error('添加参数失败！')
                    }

                    this.$message.success('添加参数成功！')
                    this.addDialogVisible = false
                    this.getParamsData()
                })
            },

            //展示修改对话框
            async showEditDialog(attr_id){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                    params:{attr_sel:this.activeName}
                })
                this.editDialogVisible = true

                if (res.meta.status !== 200){
                    return this.$message.error('获取参数信息失败！')
                }

                this.$message.success('获取参数信息成功！')
                this.editForm = res.data
                console.log(this.editForm);


            },

            //修改对话框的关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },

            //点击按钮，修改参数信息
            editParams(){
                this.$refs.editFormRef.validate(async valid => {
                    if(!valid) return
                    const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    })

                    if (res.meta.status !== 200){
                        return this.$message.error('修改参数失败！')
                    }

                    this.$message.success('修改参数成功！')
                    this.getParamsData()
                    this.editDialogVisible = false

            })
            },

            //根据id删除对应的参数项
            async removeParams(attr_id){
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

                const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

                if (res.meta.status !== 200){
                    return this.$message.error('删除参数失败！')
                }

                this.$message.success('删除参数成功！')
                this.getParamsData()

            },

            //添加tag文本框失去焦点或回车键弹起触发的事件
            async handleInputConfirm(row){
                //判断输入内容去除空格后是否为空
                if (row.inputValue.trim().length === 0){
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }

                //输入内容不为空，进行后续处理
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false

                //发起请求，保存操作
                this.saveAttrVals(row)

            },

            //点击按钮，展示添加tag文本框
            showInput(row){
                row.inputVisible = true
                //让文本框自动获得焦点
                //nextTick的作用：当页面上代码重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            //删除对应的参数可选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
    },

            //将对attr_vals的操作，保存到数据库
            async saveAttrVals(row){
                //发起请求，保存操作
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                })

                if (res.meta.status !== 200){
                    return this.$message.error('修改参数项失败！')
                }

                this.$message.success('修改参数项成功！')
            }
        },
        computed:{
            //参数按钮是否被禁用
            isBtnDisable(){
                if (this.selectedCateKeys.length !==3){
                    return true
                }
                return false
            },

            //当前选中的三级分类的id
            cateId(){
                if (this.selectedCateKeys.length === 3){
                    return this.selectedCateKeys[2]
                }
                return null
            },

            //动态计算标题文本
            titleText(){
                if (this.activeName === "many"){
                    return '动态参数'
                }
                return '静态属性'

            }
        }
    }
</script>

<style scoped>
.cat_opt{
    margin: 15px 0;
}

    .el-tag{
        margin: 10px;
    }

    .input-new-tag{
        width: 150px;
    }

</style>