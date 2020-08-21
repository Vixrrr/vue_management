<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--        卡片视图-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--        搜索视图-->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

<!--            订单列表数据-->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index">

                </el-table-column>
                <el-table-column label="订单编号" prop="order_number">

                </el-table-column>
                <el-table-column label="订单价格" prop="order_price">

                </el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1' ">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                    <template slot-scope="scope">
                        {{scope.row.is_send}}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">

                </el-table-column>
                <el-table-column label="操作">
                   <template slot-scope="scope">
                       <el-button size="mini" type="primary" icon="el-icon-edit" @click="showAddressDialog"></el-button>
                       <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress"></el-button>
                   </template>
                </el-table-column>

            </el-table>

            <!--            分页区域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

<!--            修改地址的对话框-->
            <el-dialog
                    title="修改地址"
                    :visible.sync="addressVisible"
                    width="50%">
<!--                内容区域-->
                <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                    <el-form-item label="省市区/县" prop="address1">
                       <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
<!--                底部区域-->
                <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
            </el-dialog>

<!--            修改物流进度的对话框-->
            <el-dialog
                    title="物流进度"
                    :visible.sync="progressVisible"
                    width="50%">
<!--                时间线-->
                <el-timeline>
                    <el-timeline-item
                            v-for="(activity, index) in progressInfo"
                            :key="index"
                            :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
                <span slot="footer" class="dialog-footer">
    <el-button @click="progressVisible = false">取 消</el-button>
    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
  </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import cityData from "./citydata";
    export default {
        name: "order",
        created() {
            this.getOrderList()
        },
        data(){
            return{
                //查询对象
                queryInfo:{
                    query:'',
                    pagenum: 1,
                    pagesize: 5,
                },
                total:0,
                orderList:[],

                //控制修改地址对话框的显示与隐藏
                addressVisible:false,
                addressForm:{
                    address1:[],
                    address2:'',
                },
                //地址的验证规则对象
                addressFormRules:{
                    address1:[{
                        required:true,
                        message:'请输入省市区/县',
                        trigger:'blur'}],
                    address2:[{
                        required:true,
                        message:'请输入详细地址',
                        trigger:'blur'}]
                },
                cityData:cityData,

                //控制物流进度对话框的显示与隐藏
                progressVisible:false,
                progressInfo:[],




            }
        },
        methods:{
            //获取订单数据
            async getOrderList(){
                const {data: res} = await this.$http.get("orders",{params:this.queryInfo})
                if (res.meta.status !== 200) return  this.$message.error("订单信息获取失败！");
                this.orderList = res.data.goods
                this.total = res.data.total
                console.log(res);
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

            //展示修改地址的对话框
            showAddressDialog(){
                this.addressVisible = true
            },

            async showProgress(){
                const {data: res} = await this.$http.get("/kuaidi/804909574412544580")
                if (res.meta.status !== 200) return  this.$message.error("物流信息获取失败！");
                this.progressInfo = res.data
                console.log(this.progressInfo);
                this.progressVisible = true
            },
        }

    }
</script>

<style scoped>
.el-cascader{
    width: 100%;
}
</style>