<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片区域-->
        <el-card>
<!--            提示信息-->
            <el-alert show-icon center title="添加商品信息" type="info" :closable="false"></el-alert>
<!--            步骤区域-->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!--            tab区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">基本信息
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader
                                expand-trigger="hover"
                                :options="cateList"
                                :props="cateProps"
                                v-model="addForm.goods_cat"
                                @change="handleGoodsCatChange">
                        </el-cascader>
                    </el-form-item>

                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
<!--                    渲染表单的item项-->
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
<!--                        复选框组-->
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                        </el-checkbox-group>

                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in this.onlyTableData" :key="item.attr_id" >
                        <el-input v-model="item.attr_vals"></el-input>

                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
<!--                    action表示图片要上传到的后台api地址-->
                    <el-upload
                        class="upload-demo"
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headerObj"
                        :on-success="handleSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
<!--                    富文本编辑器组件-->
                    <quill-editor v-model="addForm.goods_introduce">
                    </quill-editor>
                    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>

                </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-card>

<!--        预览图片对话框-->
        <el-dialog
                title="图片预览"
                :visible.sync="previewVisible"
                width="50%">
            <img :src="previewPath" alt="" class="previewImg">
            <span slot="footer" class="dialog-footer">
  </span>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "Add",
        data(){
            return{
                //激活索引
                activeIndex:'0',
                //添加商品
                addForm:{
                    goods_name:'',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    //商品所属分类数组
                    goods_cat:[],
                    //图片的数组
                    pics:[],
                    //商品的详情描述
                    goods_introduce:'',
                    //将要上传的参数
                    attrs:[],
                },
                addFormRules:{
                    goods_name: [{
                        required:true,
                        message:'请输入商品名称',
                        trigger:'blur'},],
                    goods_price: [{
                        required:true,
                        message:'请输入商品价格',
                        trigger:'blur'},],
                    goods_weight: [{
                        required:true,
                        message:'请输入商品重量',
                        trigger:'blur'},],
                    goods_number: [{
                        required:true,
                        message:'请输入商品数量',
                        trigger:'blur'},],
                    goods_cat: [{
                        required:true,
                        message:'请选择商品分类',
                        trigger:'blur'},],
                },

                //商品分类列表
                cateList:[],
                cateProps:{
                    label:'cat_name',
                    value:'cat_id',
                    children:'children'
                },

                //动态参数列表数据
                manyTableData:[],
                //静态属性数据
                onlyTableData:[],
                //上传图片的地址 !更改api时需要注意
                uploadURL:'https://www.liulongbin.top:8888/api/private/v1/upload',
                //设置upload请求头
                headerObj:{
                    Authorization: window.sessionStorage.getItem('token')
                },

                //预览图片
                previewPath:'',
                previewVisible:false,




            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            //获取商品列表
            async getCateList(){
                const {data:res} = await this.$http.get('categories')

                if (res.meta.status !== 200){
                    return this.$message.error('获取商品分类数据失败')
                }

                //把数据列表 赋值给cateList
                this.cateList = res.data
                console.log(this.cateList);
            },

            //级联选择器变化事件
            handleGoodsCatChange(){
                console.log(this.addForm.goods_cat);
                if (this.addForm.goods_cat.length !== 3){
                    this.addForm.goods_cat = []
                }
            },

            //tabs离开前触发的事件
            beforeTabLeave(activeName,oldActiveName){
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                    this.$message.error('请先选择商品分类')
                    return false
                }

            },

            //点击tabs触发的事件
            async tabClicked(){
                //访问商品参数面板
                if (this.activeIndex === '1'){
                     const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
                        sel:'many'
                        }})
                    if (res.meta.status !== 200){
                        return this.$message.error('获取动态参数列表失败！')
                    }
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals === 0 ?
                    [] : item.attr_vals.split(' ')})
                    this.manyTableData = res.data
                }else if(
                    //访问商品属性面板
                    this.activeIndex === '2'
                ){
                    const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
                            sel:'only'
                        }})
                    if (res.meta.status !== 200){
                        return this.$message.error('获取静态属性失败！')
                    }

                    this.onlyTableData = res.data
                    console.log(this.onlyTableData);
                }


            },

            //处理图片预览效果
            handlePreview(file){
                console.log(file);
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            //处理图片移除操作
            handleRemove(file){
                //1.获取将要删除图片的临时路径
                const filePath = file.response.data.tmp_path
                //2.从pics中找到索引值
                const i = this.addForm.pics.findIndex(x => x.pic === filePath)
                //调用数组的splice方法，把图片信息对象从pics数组中删除
                this.addForm.pics.splice(i,1)
                console.log(this.addForm);
            },
            //监听图片上传成功的事件
            handleSuccess(response){
                // console.log(res);
                //1.拼接图片属性对象
                const picInfo = {pic:response.data.tmp_path}
                //2.将图片信息对象，push到pics数组中
                this.addForm.pics.push(picInfo)
                console.log(this.addForm);
            },

            //添加商品
            add(){
                this.$refs.addFormRef.validate(async valid =>{
                    if (!valid){
                        return this.$message.error('请填写必要的表单数据')
                    }
                    //执行添加商品的业务逻辑
                    const form = JSON.parse(JSON.stringify(this.addForm))
                    form.goods_cat =
                        form.goods_cat.join(',')

                    //处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals.join(' '),
                        }
                        this.addForm.attrs.push(newInfo)
                    })

                    //处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = {
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals,
                        }
                        this.addForm.attrs.push(newInfo)
                    })

                    form.attrs = this.addForm.attrs
                    console.log(form);

                    //请求添加商品
                    //商品名称必须唯一
                    const { data:res } = await this.$http.post('goods',form)
                    if (res.meta.status !== 201){
                        return this.$message.error('添加商品失败！')
                    }

                    this.$message.success('添加商品成功！')
                    this.$router.push('/goods')



                })
            },

        },
        computed:{
            cateId(){
                if (this.addForm.goods_cat.length === 3){
                    return this.addForm.goods_cat[2]
                }
                return null
            },
        }
    }
</script>

<style scoped>
    .el-checkbox{
        margin: 0 5px 0 0 !important;
    }

    .previewImg{
        width: 100%;
    }

    .btnAdd{
        margin-top: 15px;
    }

</style>