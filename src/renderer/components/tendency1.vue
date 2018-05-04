<template>
    <div class="line1">
        <div id="line1" class="" style="width: 100%;height: 450px;padding: 5px 10px;"></div>
    </div>


</template>

<script>
    // import echarts from 'echarts/dist/echarts.common.min.js';
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/bar';  //引入柱状图
    import 'echarts/lib/chart/line'; //引入折线图
    // 引入提示框组件、标题组件、工具箱组件。
    import 'echarts/lib/component/title';   
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';


    export default {
        name:'Tendency1',
        data(){
            return{
            }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('line1')); //初始化echarts 实例   产品数据
            this.initData();
            var fn = window.onresize;
            window.onresize = () => {
               if(fn){  fn(); }
                this.myChart.resize();
            }
        },
        props: ['Day','Data','layout'],  //接收组件传递的数据
        methods:{
            initData(){
                const colors = ['#5793f3','#d14a61', '#675bba'];
                const option = {
                    color:colors,
                    title:{ text: '产品数据', subtext:''},
                    tooltip:{trigger:'axis'},
                    legend:{data:['设备总数','设备故障数','设备新增数']},
                    toolbox:{show:true, feature:{  magicType:{ type:['bar','line']},}},
                    xAxis:{type:'category', boundaryGap:false,data:this.Day },
                    yAxis:[{type:'value', name:'设备数', min:0,position:'left',
                            axisLine:{lineStyle:{ color:'#999' }},
                            axisLabel:{formatter:'{value}'} },
                    ],
                    series:[
                        {name:'设备总数',type:'line',data:this.Data[0],
                        markPoint:{data:[{type:'max',name:'最大值'},{type:'min',name:'最小值'}]},
                        },
                        { name:'设备故障数',type:'line', data:this.Data[1],
                        markPoint:{data:[{type:'max',name:'最大值'},{type:'min',name:'最小值'}]},
                        },
                        {name:'设备新增数',type:'line',data:this.Data[2],
                        markPoint:{data:[{type:'max',name:'最大值'},{type:'min',name:'最小值'}]},
                        },
                    ]
                };
                // end  option
                this.myChart.setOption(option);
            },
        },
        watch:{
            Data:function(){  
                this.initData();
            },
            layout:function(){
                this.myChart.resize();
            }
        }
    }
</script>

