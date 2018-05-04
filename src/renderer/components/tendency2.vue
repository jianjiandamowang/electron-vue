<template>
    <div id="line2box">
        <div id="line2" class="" style="width: 100%;height: 450px;padding: 5px 10px;"></div>
    </div>


</template>

<script>
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/bar';  //引入柱状图
    import 'echarts/lib/chart/line'; //引入折线图
    // 引入提示框组件、标题组件、工具箱组件。
    import 'echarts/lib/component/title';   
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';
    // import echarts from 'echarts/dist/echarts.common.min.js';

    export default {
        name:'Tendency2',
        props:['Day','Data','layout'],
        data(){
            return{
                myChart:null,
            }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('line2')); //初始化echarts 实例   产品数据
            this.initData();
            var fn = window.onresize;
            window.onresize = () => {
               if(fn){  fn(); }
                this.myChart.resize();
            }
        },
        methods:{
            initData(){
               const option = {
                    color:['#d14a61'],
                    title:{ text: '故障走势', subtext:''},
                    tooltip:{trigger:'axis'},
                    legend:{data:['设备故障数']},
                    toolbox:{ show:true,
                        feature:{
                             magicType:{ type:['bar','line']}, 
                        }
                    },
                    xAxis:{ type:'category', boundaryGap:false, data:this.Day },
                    yAxis:[
                        { type:'value', name:'设备数', min:0,
                            position:'left',
                            axisLine:{lineStyle:{ color:'#999' }},
                            axisLabel:{ formatter:'{value}' }    },
                    ],
                    series:[
                        {name:'设备故障数', type:'line',data:this.Data,
                            markPoint:{ data:[ {type:'max',name:'最大值'}, {type:'min',name:'最小值'}] },
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

