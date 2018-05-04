<template>
    <div>
        <div class="data_section">
            <el-card class="box-card" style="margin-bottom: 40px;">
            <div slot="header" class="clearfix">
                <span style="color: deepskyblue;font-weight: bold;">数据概览</span>
                <el-dropdown class="LayOut" size="mini" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class="el-icon-menu"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="lay1">2x2</el-dropdown-item>
                    <el-dropdown-item command="lay2">1x3</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
                <!--<el-button class="LayOut" type="text" size="mini" @click="layout=true;col=12;">2x2</el-button>
                <el-button class="LayOut" type="text" size="mini" @click="layout=false;col=23;">1x3</el-button>-->
            </div>
            <div>
                <el-row :gutter="20">
                <el-col  :span="6">
                    <div class="grid-content bg-purple" style="border-color: #2099EC;">
                        <el-row>
                            <el-col :span="8">
                            <div class="el-icon-edit" style="font-size: 40px;padding: 10px;color: #2099EC; border-right: 1px solid #2099EC"></div>
                            </el-col>
                            <el-col :span="16">
                                <h2 style="margin: 0;padding-left:20px;"><span>{{overView.deviceCount}}</span></h2><small style="padding-left:20px;color: #B8B8BA;">设备总数</small>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col  :span="6">
                    <div class="grid-content bg-purple" style="border-color: #11C785;">
                        <el-row>
                            <el-col :span="8">
                            <div class="el-icon-location" style="font-size: 40px;padding: 10px;color: #11C785; border-right: 1px solid #11C785"></div>
                            </el-col>
                            <el-col :span="16">
                                <h2 style="margin: 0;padding-left:20px;"><span>{{overView.onlineDeviceCount}}</span></h2><small style="padding-left:20px;color: #B8B8BA;">在线设备数</small>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col  :span="6">
                    <div class="grid-content bg-purple" style="border-color: #B8B8BA;">
                        <el-row>
                            <el-col :span="8">
                            <div class="el-icon-circle-plus" style="font-size: 40px;padding: 10px;color: #B8B8BA; border-right: 1px solid #B8B8BA"></div>
                            </el-col>
                            <el-col :span="16">
                                <h2 style="margin: 0;padding-left:20px;"><span>{{overView.productCount}}</span></h2><small style="padding-left:20px;color: #B8B8BA;">产品总数</small>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col  :span="6">
                    <div class="grid-content bg-purple" style="border-color: #E54D42;">
                        <el-row>
                            <el-col :span="8">
                            <div class="el-icon-edit-outline" style="font-size: 40px;padding: 10px;color: #E54D42; border-right: 1px solid #E54D42"></div>
                            </el-col>
                            <el-col :span="16">
                                <h2 style="margin: 0;padding-left:20px;"> <span>{{overView.projectCount}}</span></h2><small style="padding-left:20px;color: #B8B8BA;">项目总数</small>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                </el-row>
            </div>
            </el-card>

            <!--趋势图-->
            <el-row :gutter="20">
                <el-col :span="col">
                    <div class="tendency_box">
                        <h4 class="tendency_title">
                            产品数据
                            
                            <el-date-picker v-model="value1" size="small"  value-format='yyyyMM' @change="getDevMonth"
                                type="month" class="tendency_head"
                                placeholder="选择月份">
                            </el-date-picker>
                            <el-select size="small" class="tendency_head" v-model="productID" :clearable="true" @focus="GetProductlist" @change="setProduct" filterable placeholder="选择产品">
                                <el-option  v-for="item in ProductList" :key="item.a00401"
                                    :label="item.a00402":value="item.a00401">
                                </el-option>
                            </el-select>
                            <a class="sevenday" @click='getDevSevenDay'>查看近七天</a>
                        </h4>
                        <Tendency1 :Day="tendencyData1.x" :Data="tendencyData1.y" :layout="layout"></Tendency1>
                    </div>
                </el-col>
                <el-col :span="col" v-if="Permision.homeDataVisible[2]">
                    <div class="tendency_box">
                        <h4 class="tendency_title">
                            故障走势
                            <el-date-picker v-model="value2" size="small" value-format='yyyyMM'  @change="getErrMonth"
                                type="month" class="tendency_head"
                                placeholder="选择月份">
                            </el-date-picker>
                            <a class="sevenday" @click='getErrSevenDay'>查看近七天</a>
                        </h4>
                        <Tendency2 :Day="tendencyData2.x" :Data="tendencyData2.y" :layout="layout"></Tendency2>
                    </div>
                </el-col>
                <el-col :span="col">
                    <div class="tendency_box">
                        <h4 class="tendency_title">
                            售后数据
                            <el-date-picker v-model="value3" size="small" value-format="yyyyMM" @change="getAftersaleMonth"
                                type="month" class="tendency_head"
                                placeholder="选择月份">
                            </el-date-picker>
                            <a class="sevenday" @click="getAfterSevenDay">查看近七天</a>
                        </h4>
                        <Tendency3 :Day="tendencyData3.x" :Data="tendencyData3.y" :layout="layout"></Tendency3>
                    </div>
                </el-col>
            </el-row>

            <!--故障地图-->
            <el-row style="margin:40px 0;">
                <el-col :span="24">
                     <ErrMap></ErrMap>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import Tendency1 from '@/components/tendency1';
    import Tendency2 from '@/components/tendency2';
    import Tendency3 from '@/components/tendency3';
    import ErrMap from '@/components/errMap';
    import { mapState } from 'vuex' 

    import { ErrTendencyData,AfterTendencyData,DevTendencyData,GetOverView,getAllProduct } from '@/interface/getData'

    export default {
        name:'Home',
        data() {
            return{
               col:12,
               value1:'',
               value2:'',
               value3:'',
               ProductList:[],
               productID:'',
               tendencyData1:{x:'',y:''},       //产品趋势数据
               tendencyData2:{x:'',y:''},       //故障趋势数据
               tendencyData3:{x:'',y:''},       //工单趋势数据
               layout:true,
               myDate:null,
               overView:{
                   deviceCount:'',onlineDeviceCount:'',productCount:'',projectCount:''
               },
               socket:null,
               timer:null
            }
        },
        components: {
            Tendency1,
            Tendency2,
            Tendency3,
            ErrMap
        },
        computed:{
            ...mapState(['Permision']),
        },
        mounted(){
            this.getErrSevenDay();  
            this.getAfterSevenDay();
            this.getOverView();
            this.getDevSevenDay();
        },
        methods:{
            handleCommand(command){
                switch(command){
                    case 'lay1': this.layout = true;this.col=12;break;
                    case 'lay2': this.layout = false;this.col=23;break;
                }
            },
            async getOverView(){
                const result = await GetOverView();
                if(result.status == 0){
                    this.overView = result.data;
                }
            },
            async GetProductlist(){     //获取产品信息
                const result = await getAllProduct();
                if(result.status == 0){
                    this.ProductList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取产品列表失败,请重试'});
                }
            },
            setProduct(){
                if(this.value1){
                    this.getDevMonth();
                }else{
                    this.getDevSevenDay();
                }
            },
            async getDevSevenDay(){     //获取近七天的产品设备趋势数据
                var today = this.currentDate(); 
                const result = await DevTendencyData({dateString:today,days:'7',a00401:this.productID});
                if(result.status == 0){
                    this.tendencyData1.x = result.data.dates;
                    this.tendencyData1.y = result.data.resultsList;
                    this.value1 = '';
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败！'});
                }
            },
            async getErrSevenDay(){     //获取近七天故障趋势数据
                var today = this.currentDate(); 
                const result = await ErrTendencyData({dateString:today,days:'7'});
                if(result.status == 0){
                    this.tendencyData2.x = result.data.dates;
                    this.tendencyData2.y = result.data.results;
                    this.value2 = '';
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败！'});
                }
            },
            async getAfterSevenDay(){   //获取近七天售后趋势数据
                var today = this.currentDate();
                const result = await AfterTendencyData({dateString:today,days:'7'});
                if(result.status == 0){
                    this.tendencyData3.x = result.data.dates;
                    this.tendencyData3.y = result.data.resultsList;
                    this.value3 = '';
                }else{
                    this.$notify.error({title: '错误',message: result.msg});
                }
            },
            async getDevMonth(){
                var day = this.value1 + '31';
                const result = await DevTendencyData({dateString:day,days:'31',a00401:this.productID});
                if(result.status == 0){
                    this.tendencyData1.x = result.data.dates;
                    this.tendencyData1.y = result.data.resultsList;
                }else{
                    this.$notify.error({title: '错误',message: result.msg});
                }
            },
            async getErrMonth(){
                var day = this.value2 + '31';
                const result = await ErrTendencyData({dateString:day,days:'31'});
                if(result.status == 0){
                    this.tendencyData2.x = result.data.dates;
                    this.tendencyData2.y = result.data.results;
                }else{
                    this.$notify.error({title: '错误',message: result.msg});
                }
            },
            async getAftersaleMonth(){
                var day = this.value3 + '31';
                const result = await AfterTendencyData({dateString:day,days:'31'});
                if(result.status == 0){
                    this.tendencyData3.x = result.data.dates;
                    this.tendencyData3.y = result.data.resultsList;
                }else{
                    this.$notify.error({title: '错误',message: result.msg});
                }
            },
            currentDate(){          //当前日期
                if(!this.myData) this.myDate = new Date();
                var year = this.myDate.getFullYear();
                var month = this.myDate.getMonth() + 1;
                var day = this.myDate.getDate();
                if(month >= 1 && month <= 9) month = '0'+month;
                if(day >= 0 && day <= 9) day = '0'+day;
                return year + month + day;
            },

            
        },
    }
</script>

<style lang="less" scoped>
     @import '../assets/mixin.less';

     .data_section{
		padding: 20px;
		margin-bottom: 40px;
		.section_title{
			text-align: center;
			font-size: 30px;
			margin-bottom: 10px;
		}
        .data_list{
			text-align: center;
			font-size: 14px;
			color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .data_num{
                color: #333;
                font-size: 26px;

            }
            .head{
                border-radius: 6px;
                font-size: 24px;
                padding: 0 10px;
                color: #fff;
            }
        }
        .today_head{
            background: #FF9800;
        }
        .all_head{
            background: #20A0FF;
        }

        .grid-content{
            border: 2px solid #eee; border-radius: 5px;
            height: 64px; padding: 5px;
            margin:5px 0; 
        }
        .tendency_head{ float:right;width:150px; margin: 0 1px;}
        .tendency_title{
            margin:5px 0 0 0; height: 42px;line-height: 42px;padding: 0 15px;
            color: #808080; border-bottom: 1px solid #eee;
        }
        .tendency_box{
            background: #fff
        }
     }

     .LayOut{ float: right;margin: 0 5px;  }
     .sevenday{ float:right; font-size: 12px; color: #66B1FF; margin-right: 15px;text-decoration: underline;cursor: pointer;}
</style>