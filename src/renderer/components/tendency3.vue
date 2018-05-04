<template>
    <div>
        <div id="line3" class="" style="width: 100%;height: 450px;padding: 5px 10px;"></div>
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
        name:'Tendency3',
        props:['Day','Data','layout'],
        data(){
            return{
                myChart:null,
            }
        },
        mounted(){
            this.myChart = echarts.init(document.getElementById('line3')); //初始化echarts 实例   产品数据
            this.initData();
            var fn = window.onresize;
            window.onresize = () => {
               if(fn){  fn(); }
                this.myChart.resize();
            }
        },
        methods:{
            initData(){
                const colors = ['#5793f3', '#675bba' ,'#d14a61'];
                const option = {
                    color:colors,
                    title:{ text: '售后数据', subtext:''},
                    tooltip:{trigger:'axis'},
                    legend:{data:['工单总数','已解决工单数','未解决工单数']},
                    toolbox:{ show:true,
                        feature:{
                            magicType:{ type:['bar','line']}, 
                        }
                    },
                    xAxis:{ type:'category', boundaryGap:false, data:this.Day },
                    yAxis:[
                        { type:'value', name:'工单数', min:0,
                            position:'left',
                            axisLine:{lineStyle:{ color:'#999' }},
                            axisLabel:{ formatter:'{value}' }    },
                    ],
                    series:[
                        {name:'工单总数', type:'line',data:this.Data[0],
                            markPoint:{ data:[ {type:'max',name:'最大值'}, {type:'min',name:'最小值'}] },
                        },
                        {name:'已解决工单数', type:'line',data:this.Data[2],
                            markPoint:{ data:[ {type:'max',name:'最大值'}, {type:'min',name:'最小值'}] },
                        },
                        {name:'未解决工单数', type:'line',data:this.Data[1],
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

