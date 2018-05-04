<template>
    <!--设备固件升级-->
    <el-row type="flex" justify="center">
        <el-col :span="23" class="content">
            <!--头部-->
            <div class="head">
                <h4 class="left bg">固件更新<small>(当前可更新设备)</small></h4>
                <span class="left tip">
                    <b style="color: red">Tip：</b>当前产品的最新版本  {{latestVersion}}
                </span>
                <div class="right">
                    <el-button size="mini" @click="$router.push('report')">任务报表</el-button>
                    <el-badge :value="devCount">
                        <el-button size="mini" type="warning" @click="batchShow = true">批量更新</el-button>
                    </el-badge>
                </div>
                <div class="clearboth"></div>
            </div>

            <!--条件筛选-->
            <el-row class="search_head" style="padding: 6px 0 0 15px;">       
                <selectAddress :address="address" @SetAddress="setAddress"></selectAddress>
            </el-row>
            <el-row class="search_head">
                <el-col :span="5" class="search_item">
                    <el-row style="height: 28px;">
                        <el-col :span="8" class="search_tip">项目</el-col>
                        <el-col :span="16">
                            <el-select v-model="search.a00212" size="mini" @focus="GetProject" :clearable="true" filterable placeholder="请选择">
                                <el-option  v-for="item in ProjectList" :key="item.a00301"
                                    :label="item.a00302":value="item.a00302">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5" class="search_item">
                    <el-row>
                        <el-col :span="8" class="search_tip">小区</el-col>
                        <el-col :span="16">
                            <el-autocomplete placeholder="小区名称" prefix-icon="el-icon-search" 
                                size="mini" v-model="search.a00203" :fetch-suggestions="querySearchStreet">
                            </el-autocomplete>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5" class="search_item">
                    <el-row>
                        <el-col :span="8" class="search_tip">产品</el-col>
                        <el-col :span="16">
                            <!--<el-input placeholder="产品类别" prefix-icon="el-icon-search" 
                                size="mini" v-model="search.a00202">
                            </el-input>-->
                            <el-select size="mini" v-model="search.a00217"  @focus="GetProductlist" filterable placeholder="请选择产品类型" >
                                <el-option  v-for="(item,index) in ProductList" :key="item.a00401"
                                    :label="item.a00402":value="item.a00401">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5" class="search_item">
                    <el-row>
                        <el-col :span="8" class="search_tip">设备IMEI</el-col>
                        <el-col :span="16">
                            <el-input placeholder="设备IMEI" prefix-icon="el-icon-search" 
                                size="mini" v-model="search.a00211">
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4" class="search_item">
                    <el-button size="mini" type="primary" style="margin-left: 10px;" @click="changeSearch">查询</el-button>
                </el-col>
            </el-row>
            <!---->
            <div class="table_container">
                <!--表格-->
                <el-table ref="versionUpdate" v-loading="loading" :data="tableData" :row-key="row => row.a00201"
                size="small"  style="width: 100%;min-height: 490px;"  @selection-change="batchSelect">
                    <el-table-column type="selection" width="55" :selectable="check"  :reserve-selection="true"></el-table-column>
                    <el-table-column label="设备IMEI" prop="a00211"></el-table-column>
                    <el-table-column label="设备名称" prop="a00215"></el-table-column>
                    <el-table-column label="产品类别" prop="a00202"></el-table-column>
                    <el-table-column label="省市区" prop="a00214"></el-table-column>
                    <el-table-column label="所属小区" prop="a00203"></el-table-column>
                    <el-table-column label="固件版本" prop="a00216"></el-table-column>
                    <el-table-column label="在线状态">
                        <template slot-scope="scope">
                            <span :class="setColor(scope.row.a00205)">{{exChangeStatus(scope.row.a00205)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="success" size="mini" @click="update(scope.row,scope.$index)">更新固件</el-button>
                            <el-button type="success" size="mini" @click="setTimeUpdate(scope.row)">定时</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--页码-->
                <div class="Pagination" style="margin-top: 10px;">
                    <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="count">
                    </el-pagination>
                </div>
            </div>

            <!--批量窗口-->
            <el-dialog title="批量更新" :visible.sync="batchShow" width="1200px">
                <el-table :data="batchData" size="mini"   :max-height="300"  style="width: 100%;">
                    <el-table-column label="设备IMEI" prop="a00211" width="150"></el-table-column>
                    <el-table-column label="设备名称" prop="a00215" width="150"></el-table-column>
                    <el-table-column label="产品类别" prop="a00202" width="150"></el-table-column>
                    <el-table-column label="省市区" prop="a00214" width="200"></el-table-column>
                    <el-table-column label="所属小区" prop="a00203" width="150"></el-table-column>
                    <el-table-column label="固件版本" prop="a00216" width="150"></el-table-column>
                    <el-table-column label="在线状态" width="100">
                        <template slot-scope="scope">
                            <span :class="setColor(scope.row.a00205)">{{exChangeStatus(scope.row.a00205)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                           <el-button size="mini" @click="remove(scope.$index)" type="danger">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="batchShow = false">取 消</el-button>
                    <el-button size="small" type="success" @click="setTimeUpdate()">定时更新</el-button>
                    <el-button size="small" type="success" @click="batchUpdate">批量更新</el-button>
                </span>
            </el-dialog>


            <!--结果报表-->
            <el-dialog title="更新结果" :visible.sync="resultShow" width="1000px" @close="clearTime">
                <h4>更新任务批次号: {{currentPageBatch}}</h4>
                <el-table :data="resultTableData" v-loading="resultLoading" size="mini" :max-height="300" style="width: 100%;">
                    <el-table-column label="设备IMEI" prop="a00702"></el-table-column>
                    <el-table-column label="更新版本文件" prop="a00703"></el-table-column>
                    <el-table-column label="更新时间" prop="a00705"></el-table-column>
                    <el-table-column label="更新结束时间" prop="a00707"></el-table-column>
                    <el-table-column label="更新结果" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.a00706 == '1'" style="color: #67C23A">更新已完成</span>
                            <span v-if="scope.row.a00706 == '0'" style="color: #E6A23C">更新未完成</span>
                            <span v-if="scope.row.a00706 == '2'" style="color: #F56C6C">更新失败</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-progress style="margin: 15px;" status="success" :text-inside="true" :stroke-width="18" :percentage="progress"></el-progress>
                <el-row>
                    <el-col :span="6">
                        <h4><span>更新成功: {{successCount}}/{{total}}</span></h4>
                    </el-col>
                    <el-col :span="6">
                        <h4><span>更新未完成: {{uncompletedCount}}/{{total}}</span></h4>
                    </el-col>
                    <el-col :span="6">
                        <h4><span>更新失败: {{failCount}}/{{total}}</span></h4>
                    </el-col>
                </el-row>
            </el-dialog>


            <!--定时更新-->
            <el-dialog title="定时更新" :visible.sync="setTimeShow">
                <el-form :model="setTimeForm" ref="setTimeForm"  :rules="timerule" size="small" label-width="80px">  
                    <el-form-item label="选择日期" prop="date">
                        <el-date-picker v-model="setTimeForm.date" type="date" placeholder="选择日期" value-format="yyyyMMdd">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item label="选择时间" prop="time">
                        <el-time-select v-model="setTimeForm.time" size="mini"
                        :picker-options="{ start: '01:00', step: '01:00', end: '24:00', }"  placeholder="选择时间">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitTimeUpdate">提交</el-button>
                    </el-form-item>
                </el-form>          
            </el-dialog>


            <!--更新任务队列-->
            <el-dialog :visible.sync="taskQueueShow">
                <el-tabs type="card">
                    <el-tab-pane label="普通任务" name="first">普通任务</el-tab-pane>
                    <el-tab-pane label="定时任务" name="second">定时任务</el-tab-pane>
                </el-tabs>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import SelectAddress from '@/components/selectAddress';
    import { SearchUpdateDev,VersionUpdate,getAllProduct,GetAllProject,getStreet,GetLatestVersion,SetTimeUpdate,GetReportByBatch } from '@/interface/getData';
    export default {
        name:'VersionUpdate',
        data(){
            return{
                tableData:[],
                loading:false, //过渡效果
                currentPage:1,  //当前页码
                count:0,       //总数
                pageSize:10,   //每页显示的数目
                devCount:0,
                ProductList:null,          //产品列表数据
                ProjectList:null,         //项目列表数据 
                search:{ //搜索关键词
                    a00217:'',a00203:'',a00206:'',a00211:'',a00212:'',a00214:''
                }, 
                address:{ province:'',city:'',district:''},
                latestVersion:null,
                /********批量更新***********/
                selectArray:[],  //多选数组标记
                selectData:{},  
                selectLength:0,
                batchData:[],      //批量设备
                batchShow:false,
                setTimeForm:{time:'',date:''},         //定时
                timerule:{      //定时更新表单验证规则
                    date:[{ required:true,message:'请选择日期', trigger: 'blur'}],
                    time:[{ required:true,message:'请选择时间', trigger: 'blur'}],
                },
                setTimeShow:false,
                setTimeData:[],     //定时更新的设备
                /***********更新结果(报表)***********/
                resultTableData:[],
                resultShow:false,
                resultLoading:true,
                progress:0,    //更新进度条
                taskQueueShow:false,   //任务队列
                currentPageBatch:null,   //当前批次号
                total:0,
                successCount:0,       //更新成功数
                failCount:0,           //更新失败数
                uncompletedCount:0,    //更新未完成数
                timer:null
            }
        },
        mounted(){
            this.OnInit();   //数据初始化
        },
        methods:{
            async OnInit(){  //数据初始化
                await this.GetProductlist();
                this.search.a00217 = this.ProductList[0].a00401;
                this.searchDev();
            },
            async GetProductlist(){     //获取产品信息
                if(this.ProductList) return;
                const result = await getAllProduct();
                if(result.status == 0){
                    this.ProductList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取产品列表失败,请重试'});
                }
            },
            async GetProject(){         //获取项目信息
                if(this.ProjectList) return;
                const result = await GetAllProject();
                if(result.status == 0){
                    this.ProjectList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取项目列表失败,请重试'});
                }
            },
            async querySearchStreet(queryString,cb){    //获取小区名称 模糊筛选
                const street = await getStreet({a00214:this.search.a00214,a00203:queryString});
                if(street.status == 0){
                    var arr =[]
                    street.data.map( item =>{
                        arr.push({value:item})
                    })
                    setTimeout(()=>{
                        cb(arr);
                    },500)
                }else{
                    this.$notify.error({message: '获取小区数据失败,请重试'});
                }
            },
            async getVersion(){     //获取当前产品的最新固件版本
                const result = await GetLatestVersion({a00602:this.search.a00217});
                if(result.status == 0){
                    this.latestVersion = result.data;
                }
            },
            setAddress(val){       //设置地址信息
                this.search.a00214 = val.province + val.city + val.district;
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.searchDev();
            },
            changeSearch(){
                this.selectArray = [];
                this.currentPage = 1;
                this.searchDev();
            },
            async searchDev(){        //查询设备
                this.loading = true;
                this.getVersion();
                this.search.currentPage = this.currentPage;
                const result = await SearchUpdateDev(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败'});
                }
                this.loading = false;
            },
            /************************固件更新***************************/
            update(row,index){   //单设备更新
                if(row.a00205 == 0){
                    this.$message({type:'warning',message:"离线设备无法执行更新操作."});
                    return;
                }
                this.$confirm('将设备的固件版本更新到已发布的最新版,是否更新?',{
                    confirmButtonText: '继续',cancelButtonText: '取消', type: 'warning'
                }).then(async ()=>{
                    const result = await VersionUpdate({imei:row.a00211});
                    if(result.status == 0){
                        this.$notify.success({message: '执行更新任务'});
                        this.currentPageBatch = result.data;  //设置报表批次号
                        this.resultShow = true;
                        this.resultLoading = true;
                        this.getReportByBatch();  //根据批次查询报表
                    }else{
                        this.$notify.error({message: result.data});
                    }
                }).catch(()=>{ })
            },
            setTimeUpdate(row){ //定时更新
                this.setTimeData = [];
                if(row){
                    this.setTimeData.push(row);
                }else{
                    this.setTimeData = this.batchData;
                }
                this.setTimeForm = {time:'',date:''}; 
                this.setTimeShow = true;
            },
            submitTimeUpdate(){ //提交定时更新
                this.$refs.setTimeForm.validate(async (valid) =>{
                    if(valid){
                        var time = this.setTimeForm.date + this.formateTime(this.setTimeForm.time);
                        var imeis = this.getImeiArray(this.setTimeData);
                        const result = await SetTimeUpdate({imeis:imeis,dateTime:time});
                        if(result.status == 0){
                            this.$notify.success({message: '定时任务发布成功'});
                            this.batchShow = false;
                            this.setTimeShow = false;
                        }else{
                            this.$notify.error({message: result.msg});
                        }
                    }
                })
                
            },
            async batchUpdate(){  //批量设备更新
                var Imei = this.getImeiArray(this.batchData)
                const result = await VersionUpdate({imei:Imei});
                if(result.status == 0){
                    this.batchShow = false,
                    this.$notify.success({message: '执行更新任务'});
                    this.currentPageBatch = result.data;  //设置报表批次号
                    this.resultShow = true;
                    this.resultLoading = true;
                    this.getReportByBatch();  //根据批次查询报表
                }else{
                    this.$notify.error({message: result.msg});
                }
            },
            async getReportByBatch(){   //根据任务批次查看报表
                const result = await GetReportByBatch({a00704:this.currentPageBatch});
                if(result.status == 0){
                    result.data.map( item =>{
                        item.a00705 = this.formateDate(item.a00705);
                        item.a00707 = this.formateDate(item.a00707);
                    })
                    this.resultTableData = result.data;
                    this.resultSort();
                    this.resultLoading = false;
                }else{
                    this.$notify.error({message: '操作异常,请重试'});
                }
            },
            /**********************批量选择************************/
            batchSelect(val){
                this.batchData = val;
                this.devCount = this.batchData.length;
            },
            check(row,index){
                if(!row.a00205 || row.a00205 == '0'){
                    return false;    
                }else{
                    return true;
                }
            },
            remove(index){
                this.batchData.splice(index,1);
                this.devCount = this.batchData.length;
            },
            /************************util******************************/
            formateTime(time){  //时间格式转换
                var result = '';
                if(time){
                    result = time.slice(0,2) + "0000";
                }
                return result;
            },
            setColor(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return 'color1'; break;
                    case '1':  return 'color2'; break;
                    default: return 'color1';
                }
            },
            exChangeStatus(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return '离线';break;
                    case '1':  return '在线'; break;
                    default: return '未知';
                }
            },
            getImeiArray(arr){  //批量设备数据 转imei 字符串
                var result = [];
                arr.forEach( item =>{
                    result.push(item.a00211);
                })
                return result.join(',');
            },
            formateDate(dateTime){      //格式化日期
                if(!dateTime || dateTime.length != 14) return dateTime;
                var Y = dateTime.slice(0,4);
                var M = dateTime.slice(4,6);
                var D = dateTime.slice(6,8);

                var h = dateTime.slice(8,10);
                var m = dateTime.slice(10,12);
                var s = dateTime.slice(12);
                return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
            },
            resultSort(){   //更新结果统计
                this.total = this.resultTableData.length;
                this.successCount = 0;
                this.failCount = 0; this.uncompletedCount = 0;
                this.resultTableData.forEach( item =>{
                    switch(item.a00706){
                        case '0': this.uncompletedCount++;break;
                        case '1': this.successCount++;break;
                        case '2': this.failCount++;break;
                    }
                })
                this.progress = 100*(1 - (this.uncompletedCount/this.total));
                if(this.progress != 100){
                    this.reGetStatus();
                }else{
                    this.clearTime();
                }
            },
            reGetStatus(){      //轮询获取更新状态
                this.timer = setTimeout(()=>{
                    this.getReportByBatch();
                },10000);
            },
            clearTime(){        //清空轮询定时器
                if(this.timer){
                    clearTimeout(this.timer);
                    this.timer = null;
                }
            }
        },
        watch:{
        },
        components:{
            SelectAddress
        }
    }
</script>

<style lang="less" scoped>
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .search_head{ height: 46px; background:#fff;border-bottom: 1px solid #eee; }
    .search_item {  padding: 8px 0;}
    .search_tip{ height: 28px;line-height: 28px;color: #808080;font-size: 14px; text-align: center;}
    .left{ float: left; padding:0 15px;   margin: 0; height: 60px; line-height: 60px; cursor: pointer;}
    .bg{background: #3D5D86; color: #fff;}
    .tip{ font-size: 13px;color: #808080;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .clearboth{ clear: both;}
    .color1{ color: #F78989;}
    .color2{ color: #13ce66;}
</style>