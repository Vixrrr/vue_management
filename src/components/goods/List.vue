<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--        搜索视图-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click=""></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
<!--            table表格-->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name">
                </el-table-column>
                <el-table-column label="商品价格" prop="goods_price">
                </el-table-column>
                <el-table-column label="商品重量" prop="goods_weight">
                </el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--                    修改按钮-->
                        <el-button type="primary" icon="el-icon-edit"  size="mini" ></el-button>
                        <!--                    删除按钮-->
                        <el-button type="danger" icon="el-icon-delete"size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页功能-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                    :total=total background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data(){
            return{
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5,
                },
                //商品列表
                goodsList:[],
                //数据总数
                total:0,



            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{
            async getGoodsList(){
                const {data:res} = await this.$http.get('goods',{params:this.queryInfo})

                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.$message.success('获取商品列表成功！')
                this.goodsList = res.data.goods
                this.total = res.data.total

            },

            //分页功能
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getGoodsList()

            },

            //删除商品功能
            async removeById(id){
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

                const {data:res} = await this.$http.delete('goods/'+id)

                if (res.meta.status !== 200){
                    return this.$message.error('删除失败！')
                }

                this.$message.success('删除成功！')
                this.getGoodsList()
            },

            //跳转到添加商品页面
            goAddpage(){
                this.$router.push('/goods/add')
            }

        },
    }
</script>

<style scoped>

</style>