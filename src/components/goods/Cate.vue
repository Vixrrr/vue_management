<template>
    <div>
        商品分类组件
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

<!--        卡片视图区域-->
        <el-card>
<!--            添加分类-->
            <el-row>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-row>

<!--            表格-->
            <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#"  border :show-row-hover="false">
<!--                有效性-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
<!--                排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag type="primary" size="mini">一级</el-tag>
                    <el-tag type="success" size="mini">二级</el-tag>
                    <el-tag type="warning" size="mini">三级</el-tag>
                </template>
<!--                操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>


                </template>
            </tree-table>

            <!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3, 5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>

<!--        添加分类的对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%"
                @close="addCateDialogClosed">
<!--            添加分类的表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
<!--                    props用来指定配置对象-->
<!--                    v-model必须绑定数组-->
                    <el-cascader
                            expand-trigger="hover"
                            :options="parentCateList"
                            :props="cascaderProps"
                            v-model="selectedKeys"
                            @change="parentCateChanged"
                            change-on-select>
                    </el-cascader>

                </el-form-item>
            </el-form>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "Cate",
        data(){
            return{

                //查询条件
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                //商品分类数据
                catelist:[],
                //商品总数
                total:0,
                //商品列数
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name',
                    },
                    {
                        label:'是否有效',
                        //表示将当前列定义成模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'isok'
                    },
                    {
                        label:'排序',
                        //表示将当前列定义成模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'order'
                    },
                    {
                        label:'操作',
                        //表示将当前列定义成模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'opt'
                    },
                ],

                //控制添加分类对话框的显示与隐藏
                addCateDialogVisible:false,

                //添加分类的表单数据对象
                addCateForm:{
                    //将要添加分类的名称
                    cat_name:'',
                    //父级分类的id
                    cat_pid:0,
                    //分类的等级，默认添加一级分类
                    cat_level:0,
                },

                //添加分类表单的验证规则对象
                addCateFormRules:{
                    cat_name:[{
                        required:true,
                        message:'请输入分类名称',
                        trigger:'blur'}]
                },

                //父级列表
                parentCateList:[],

                //指定联机选择器的配置对象
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },

                //选中的父级id分类的数组
                selectedKeys:[],


            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取商品分类数据
            async getCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo})

                if (res.meta.status !== 200){
                    return this.$message.error('获取商品分类失败')
                }

                console.log(res.data);
                //把数据列表 赋值给cateList
                this.catelist = res.data.result
                //把总数赋值 给total
                this.total = res.data.total
            },

            //监听pagesize的改变
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
                },

            //监听pagenum改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },

            //点击按钮展示添加分类的对话框
            showAddCateDialog(){
                this.getParentCateList()
                this.addCateDialogVisible = true
            },



            //获取父级分类的数据列表
            async getParentCateList(){
                const {data:res} = await this.$http.get('categories',{params:{type:2}})

                if (res.meta.status !== 200){
                    return this.$message.error('获取父级分类数据失败！')
                }

                console.log(res.data);
                this.parentCateList = res.data
            },

            //级联选择项变化时触发的函数
            parentCateChanged(){
                console.log(this.selectedKeys);
                //如果selectedKeys数组中的length大于0，证明选中父级分类，反之说明没有选中任何父级分类
                if (this.selectedKeys.length >0){
                    //父级分类的id
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                } else{
                    //父级分类的id
                    this.addCateForm.cat_pid = 0
                    //为当前分类的等级赋值
                    this.addCateForm.cat_level = 0
                }
            },

            //添加新分类
            addCate(){
                console.log(this.addCateForm);
                this.$refs.addCateFormRef.validate(async valid =>{
                    if(!valid) return
                    const {data:res} = await this.$http.post('categories',this.addCateForm)

                    if (res.meta.status !== 201){
                        return this.$message.error('添加分类失败！')
                    }

                    this.$message.success('添加分类成功！')
                    this.getCateList()
                    this.addCateDialogVisible = false


                })
            },

            //监听对话框的关闭事件，重置表单数据
            addCateDialogClosed(){
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        }
    }
</script>

<style scoped>
    .treeTable{
        margin-top: 15px;
    }

    .el-cascader{
        width: 100%;
    }

</style>