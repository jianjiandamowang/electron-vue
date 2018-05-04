<template>
    <!--电池电压变化图-->
    <div>
        <el-button size="mini" type="text" @click="getBattery">重新获取</el-button>
        <el-button size="mini" type="text" @click="download">下载报表</el-button>
        <div id="line4" class="" style="width: 100%;height: 300px;padding: 5px 0px;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts/lib/echarts';
    //    import echarts from 'echarts/dist/echarts.simple.min.js';

    // import 'echarts/lib/chart/bar';  //引入柱状图
    import 'echarts/lib/chart/line'; //引入折线图
    // 引入提示框组件、标题组件、工具箱组件。
    import 'echarts/lib/component/title';   
    import 'echarts/lib/component/legend';
    // import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';

    import {GetBattery} from '@/interface/getData';
    import { baseUrl } from '@/util/env'

    export default {
        name:'Tendency4',
        props:['imei'],
        data(){
            return{
                mayChart:null,
                Day:[],
                Data:[]
            }
        },
        mounted(){
            this.getBattery();
        },
        methods:{
            async getBattery(){
                const result = await GetBattery({imei:this.imei});
                if(result.status == 0){
                    this.Day = result.data.date;
                    this.Data = result.data.result;      
                    this.echartOnint();
                }else{
                    this.$notify.error({message: '获取数据失败,请重试'});
                }
            },
            echartOnint(){
                if(!this.myChart){
                    this.myChart = echarts.init(document.getElementById('line4')); //初始化echarts 实例
                }
                this.initData();
            },
            download(){  //下载报表
                location.href = baseUrl+'g00850?imei='+this.imei;
            },
            initData(){
                const colors = ['#5793f3'];
                const option = {
                    color:colors,
                    title: { text:'电池电压',subtext:''},
                    tooltip: { trigger:'axis'},
                    legend:{ data:['电池电压']},
                    xAxis:{ type:'category', boundaryGap:false, data:this.Day },
                    yAxis:[
                        { type:'value', name:'电压值', min:0,
                            position:'left',
                            axisLine:{lineStyle:{ color:'#999' }},
                            axisLabel:{ formatter:'{value}' }    },
                    ],
                    series:[
                        {name:'电池电压', type:'line',data:this.Data,
                            markPoint:{ data:[ {type:'max',name:'最大值'}, {type:'min',name:'最小值'}] },
                        },
                     ]
                };
                this.myChart.setOption(option);
            }
        },
    }
</script>

<style scoped>

</style>