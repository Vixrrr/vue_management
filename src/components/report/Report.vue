<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--2 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    //1 导入echarts
    import echarts from 'echarts'

    export default {
        name: "Report",
        data(){
            return{
                //需要合并的数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }

            }
        },
        created() {
        },
        async mounted() {
            //3 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            //4 指定图表的配置项和数据
            const {data:res} = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200){
                return this.$message.error('获取折线图数据失败!')
            }

            const result = Object.assign(this.options,res.data)


            //5 使用刚指定的配置项和数据显示图表。
            myChart.setOption(result);

        },
        methods:{}
    }
</script>

<style scoped>

</style>