<template>
    <!--售后工单-->
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
            <!--工单列表-->
            <div class="head">
                <h4 class="left">
                    工单列表<span v-if="count > 0">({{count}})</span>
                </h4>
                <div class="right">
                    <el-tooltip class="item" effect="dark" content="添加工单" placement="top">
                        <el-button style="background: #16B398;color: #fff;" icon="el-icon-plus" size="mini" @click="$router.push('orderadd')">添加工单</el-button>
                    </el-tooltip>
                </div>
                <div class="right">
                    <el-input
                        placeholder="搜索(输入工单ID)"
                        prefix-icon="el-icon-search"
                        size="mini"
                        v-model="search">
                    </el-input>
                </div>
                <div class="clearbotn"></div>
            </div>
            <!---->
            <div class="table_container">
                <div class="tab">
                    <span style="color: #808080; padding:0 10px;">筛选: </span>
                    <el-button size="small" type="danger" @click="setArgs(null,'0')" plain>待派发</el-button>
                    <el-button size="small" type="warning" @click="setArgs(null,'1')" plain>待处理</el-button>
                    <el-button size="small" type="success" @click="setArgs(null,'2')" plain>已处理</el-button>
                </div>
                <el-table :data="tableData" highlight-current-row v-loading="loading" size="small"
                    element-loading-text="拼命加载中" :row-key="row => row.a00501" style="width: 100%;min-height:490px;">
                    <el-table-column property="a00501" label="工单号"></el-table-column>
                    <el-table-column  label="工单状态">
                        <template slot-scope="scope">
                            <span style="color:#F56C6C;" v-if="scope.row.a00510 == '0'">未指派</span>
                            <span style="color:#E6A23C"  v-if="scope.row.a00510 == '1'">待处理</span>
                            <span style="color:#16B398;" v-if="scope.row.a00510 == '2'">已处理</span>
                        </template>
                    </el-table-column>
                    <el-table-column property="a00505" label="联系人手机号"></el-table-column>
                    <el-table-column property="a00513" label="指派人员工号"></el-table-column>
                    <el-table-column property="a00509" label="指派人员手机号"></el-table-column>
                    <el-table-column property="a00506" label="地址"></el-table-column>
                    <el-table-column property="a00507" label="生成时间">
                        <template slot-scope="scope">
                            <span>{{DateFormat(scope.row.a00507)}}</span>
                        </template>
                    </el-table-column>
                   <el-table-column label="故障设备">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="openErrDev(scope.row.a00501,scope.$index)">查看</el-button>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="openEdit(scope.row,scope.$index)">管理</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="count">
                    </el-pagination>
                </div>
            </div>
            <!--工单管理-->
            <el-dialog title="工单管理" :visible.sync="dialogShow" width="85%" style="min-width: 1200px;" top="8vh">
                <el-tabs  tab-position="left" style="min-height: 200px;" @tab-click="handleTab">
                    <el-tab-pane label="工单信息" >
                        <!--工单编辑管理-->
                        <el-row>
                            <el-form :model="orderForm" v-if="orderForm" size="small" label-width="100px">
                                <el-col :span="10">
                                <el-form-item label="工单号">
                                    <p class="msg_p"><span class="el-icon-tickets"></span>{{orderForm.a00501}}</p>
                                    <!--<el-input v-model="orderForm.a1" auto-complete="off" style="width:70%;"></el-input>-->
                                </el-form-item>
                                <el-form-item label="工单状态">
                                    <el-radio-group v-model="orderForm.a00510">
                                    <el-radio-button label="0" :disabled="orderForm.a00510 == '0'?false: true">待派发</el-radio-button>
                                    <el-radio-button label="1" :disabled="orderForm.a00510 == '1'?false: true">待处理</el-radio-button>
                                    <el-radio-button label="2" :disabled="orderForm.a00510 == '2'?false: true">已处理</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="联系人">
                                    <el-input v-model="orderForm.a00504" auto-complete="off" style="width:70%;"></el-input>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <el-input v-model="orderForm.a00505" auto-complete="off" style="width:70%;"></el-input>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input v-model="orderForm.a00506" auto-complete="off" style="width:70%;"></el-input>
                                </el-form-item>
                                <el-form-item label="指派人员">
                                    <!--<el-input v-model="orderForm.a00509" auto-complete="off" style="width:70%;"></el-input>-->
                                    <el-select :disabled="!Permision.orderAssign" v-model="orderForm.a00509"  @focus="setOptions" filterable placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :key="item.a00101"
                                            :label="item.a00102"
                                            :value="item.a00103">
                                            <span style="float: left">{{ item.a00106 }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <p class="msg_p"><span class="el-icon-date"></span> {{orderForm.a00507}}</p>
                                    <!--<el-date-picker v-model="orderForm.a4" type="date"></el-date-picker>-->
                                </el-form-item>
                                <el-form-item label="服务内容">
                                    <el-input type="textarea" v-model="orderForm.a00503" auto-complete="off" style="width:70%;"></el-input>
                                </el-form-item>
                                </el-col>
                                <!---->
                                <el-col :span="14">
                                    <h4>故障设备信息</h4>
                                    <el-table size="mini" :data="errDev" max-height="350">
                                        <el-table-column prop="a00211" label="设备IMEI"></el-table-column>
                                        <el-table-column prop="a00215" label="设备名称"></el-table-column>
                                        <el-table-column prop="a00202" label="产品类别"></el-table-column>
                                        <el-table-column prop="a00203" label="小区名称"></el-table-column>
                                        <el-table-column label="故障信息">
                                            <template slot-scope="scope">
                                                <el-button @click="ShowErrMsg(scope.row.a00207)" type="text">故障信息</el-button>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" v-if="Permision.orderRight">
                                            <template slot-scope="scope"> 
                                                <el-button size="mini" type="danger" @click="devRemoveWorkOrder(scope.row,scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <p style="text-align: center; margin-top: 25px;">
                                        <el-button type="primary" v-if="Permision.orderRight" size="small" @click="adderrorShow = true">添加设备</el-button>
                                    </p>    
                                
                                </el-col>
                            </el-form>
                        </el-row>
                        <el-row>
                            <p style="text-align: center; margin-top: 25px;">
                                <el-button type="primary" size="small" v-if="Permision.orderRight" @click="editOrder()">保存修改</el-button>
                                <el-button type="primary" size="success" :disabled="checkAssign()" v-if="Permision.orderAccept" @click="acceptOrder()">售后接单</el-button>
                            </p> 
                        </el-row>
                        <!---->
                    </el-tab-pane>
                    <el-tab-pane label="工单指派" v-if="Permision.orderAssign">
                        <!--工单指派管理-->
                        <el-row>
                            <el-col :span="6" :offset="1">
                                <el-input placeholder="指派人员姓名" prefix-icon="el-icon-search" 
                                    style="width:80%;" size="mini" v-model="AssignSearch.a00102">
                                </el-input>
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <el-input placeholder="指派人员手机号" prefix-icon="el-icon-search" 
                                    style="width:80%;" size="mini" v-model="AssignSearch.a00103">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="18" :offset="1">
                                <el-table 
                                :data="AssignTableData" size="mini"
                                hignlignt-current-row style="width: 100%;">
                                    <el-table-column property="a00106" label="工号"></el-table-column>
                                    <el-table-column property="a00102" label="姓名"></el-table-column>
                                    <el-table-column property="a00103" label="联系方式"></el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="primary" size="mini" @click="assignOrder(scope.row)">指派</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                                    <el-pagination
                                    @current-change="AssignCurrentChange"
                                    :current-page="AssignCurrentPage"
                                    :page-size="pageSize"
                                    layout="total, prev, pager, next"
                                    :total="AssignCount">
                                    </el-pagination>
                                </div>
                            </el-col>
                        </el-row>    
                        <!---->
                    </el-tab-pane>
                    <el-tab-pane label="完成工单" v-if="Permision.orderFinish">
                            <el-button type="primary" size="small" @click="FinishOrder()">确认工单服务结束</el-button>
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogShow = false">返 回</el-button>
                </div>
            </el-dialog>
            <!--已完成工单的信息窗口-->
            
            <el-dialog title="已完成工单" :visible.sync="FinishOrderShow" width="85%" style="min-width: 1200px;" top="8vh">
                <el-tabs  tab-position="left" style="min-height: 200px;" @tab-click="handleTab">
                    <el-tab-pane label="工单信息" >
                        <!--工单编辑管理-->
                        <el-row>
                            <el-form :model="orderForm" v-if="orderForm" size="small" label-width="100px">
                                <el-col :span="10">
                                <el-form-item label="工单号">
                                    <p class="msg_p"><span class="el-icon-tickets"></span>{{orderForm.a00501}}</p>
                                </el-form-item>
                                <el-form-item label="工单状态">
                                    <el-radio-group v-model="orderForm.a00510">
                                    <el-radio-button label="0" :disabled="orderForm.a00510 == '0'?false: true">待派发</el-radio-button>
                                    <el-radio-button label="1" :disabled="orderForm.a00510 == '1'?false: true">待处理</el-radio-button>
                                    <el-radio-button label="2" :disabled="orderForm.a00510 == '2'?false: true">已处理</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="联系人">
                                     <p class="msg_p">{{orderForm.a00504}}</p>
                                </el-form-item>
                                <el-form-item label="联系电话">
                                    <p class="msg_p">{{orderForm.a00505}}</p>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <p class="msg_p">{{orderForm.a00506}}</p>
                                </el-form-item>
                                <el-form-item label="指派人员">
                                    <p class="msg_p"> <span>(工号)</span>{{orderForm.a00513}}</p>
                                </el-form-item>
                                <el-form-item label="指派人员">
                                    <p class="msg_p"><span>(手机号)</span>{{orderForm.a00509}}</p>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <p class="msg_p"><span class="el-icon-date"></span> {{orderForm.a00507}}</p>
                                </el-form-item>
                                <el-form-item label="服务内容">
                                    <p class="msg_p">{{orderForm.a00503}}</p>
                                </el-form-item>
                                </el-col>
                                <!---->
                                <el-col :span="14">
                                    <h4>故障设备信息</h4>
                                    <el-table size="mini" :data="errDev">
                                        <el-table-column prop="a00211" label="设备IMEI"></el-table-column>
                                        <el-table-column prop="a00215" label="设备名称"></el-table-column>
                                        <el-table-column prop="a00202" label="产品类别"></el-table-column>
                                        <el-table-column prop="a00203" label="小区名称"></el-table-column>
                                        <el-table-column label="故障信息">
                                            <template slot-scope="scope">
                                                <el-button @click="ShowErrMsg(scope.row.a00207)" type="text">故障信息</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-form>
                        </el-row>
                        <!---->
                    </el-tab-pane>
                </el-tabs>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="FinishOrderShow = false">返 回</el-button>
                    </div>
            </el-dialog>
            <!--故障信息窗口-->
            <el-dialog title="故障信息" :visible.sync="errMsgShow">
                <p>{{errMsg}}</p>
            </el-dialog>
            <!---->
            <el-dialog title="故障设备信息" :visible.sync="deviceShow">
                <!--故障设备列表-->
                <el-table size="small" v-if="errDev" :data="errDev">
                    <el-table-column prop="a00211" label="设备IMEI"></el-table-column>
                    <el-table-column prop="a00215" label="设备名称"></el-table-column>
                    <el-table-column prop="a00202" label="产品类别"></el-table-column>
                    <el-table-column prop="a00203" label="小区名称"></el-table-column>
                    <el-table-column label="故障信息">
                        <template slot-scope="scope">
                             <el-button @click="ShowErrMsg(scope.row.a00207)" type="text">故障信息</el-button>
                        </template>
                    </el-table-column>
                </el-table>
    
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="deviceShow = false">确 定</el-button>
                </div>
            </el-dialog>
            <!--添加故障设备-->
            <AddErrDev @closeDialog="close" @devToOrder="devToWorkOrder" :ErrDevShow="adderrorShow" ></AddErrDev>
            <!---->
        </el-col>
        </el-row>
</template>

<script>
    import AddErrDev from '@/components/adderrDev'  //添加故障设备组件
    import { mapState } from 'vuex'
    import { GetWorkOrder,AccountList,SearchAccount,AssignOrder,EditOrder,GetOrderDev,FinishOrder } from '@/interface/getData' 

    export default {
        name:'WorkOrder',
        data(){
            return{
                tableData:[],     //工单表格数据
                search:'',   //查询工单的关键字,  
                args:{a00501:null,a00510:'0'},  //工单搜索参数
                currentPage:1,   //当前页
                count:0,        //总数
                pageSize:10,     //每页显示数目
                loading:false,   //加载过渡效果
                options:[],        //指派人员 下拉数据

                errDev:[],     //故障设备
                orderForm:{
                    a00501:'',a00502:'',a00503:'',a00504:'',a00505:'',a00506:'',a00507:'',a00508:'',a00509:'',a00510:'',a00511:'',a00513:''
                },     //工单信息
                dialogShow:false,   //工单管理窗口
                FinishOrderShow:false,  //已完成工单信息窗口
                deviceShow:false,   //故障设备窗口 
                adderrorShow:false,  //添加故障设备到工单窗口
                errMsgShow:false,       //故障信息窗口
                errMsg:'暂无故障信息',
                AssignData:[],        
                AssignTableData:[],   //指派人员列表数据
                prevAssignSearch:[],
                AssignSearch:{a00102:'',a00103:'',a00105:'2'}, //查询指派人员的关键字
                AssignCurrentPage:1,                
                AssignCount:0,
                
                currentIndex:null,    //当前查看 或者 当前编辑的索引

            }
        },
        computed:{
            ...mapState(['Permision','userInfo']),
        },
        mounted(){
            this.getOrder();  //初始化数据  获取工单信息
        },
        methods:{
            /*************** 工单及管理  *********/
            handleCurrentChange(val) {      //工单（表格）翻页
                this.currentPage = val;   
                this.getOrder();
            },
            setArgs(arg1,arg2){  //设置工单搜索参数   arg1:工单ID    arg2: 工单状态
                this.args.a00501 = arg1;
                this.args.a00510 = arg2;
                this.currentPage = 1;   //重置页码
                this.getOrder();
            },
            async getOrder(){  //获取工单  
                this.loading = true;  //开启过渡效果
                this.args.currentPage = this.currentPage;
                const result = await GetWorkOrder(this.args);
                if(result.status == 0){
                    this.tableData = result.data.items;
                    this.count = result.data.totalNum;
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败,请重试'});
                }
                this.loading = false;
            },
            openEdit(row,index){        //打开工单管理窗口
                this.getErrDev(row.a00501,index);
                this.currentIndex = index;
                if(typeof(row.a00502) == "string"){
                    if(this.isJSON(row.a00502)){
                        row.a00502 = JSON.parse(row.a00502);
                    }else{
                        row.a00502 = [];
                    }
                }
                this.orderForm.a00501 = row.a00501;this.orderForm.a00502 = row.a00502;
                this.orderForm.a00503 = row.a00503;this.orderForm.a00504 = row.a00504;
                this.orderForm.a00505 = row.a00505;this.orderForm.a00506 = row.a00506;
                this.orderForm.a00507 = row.a00507;this.orderForm.a00508 = row.a00508;
                this.orderForm.a00509 = row.a00509;this.orderForm.a00510 = row.a00510;
                this.orderForm.a00511 = row.a00511;this.orderForm.a00513 = row.a00513;
                switch(this.orderForm.a00510){
                    case '0': this.dialogShow = true;break;
                    case '1': this.dialogShow = true;break;
                    case '2': this.FinishOrderShow = true;break;
                }
                
            },
            close(data){
                this.adderrorShow = false;
            },
            openErrDev(id,index){  //打开故障设备信息窗口
                this.getErrDev(id,index);
                this.currentIndex = index;
                this.deviceShow = true;
            },
            ShowErrMsg(text){       //打开故障信息窗口
                if(text && text!=''){
                    this.errMsg = text;
                }
                this.errMsgShow = true
            },
            async getErrDev(id,index){
                // if(this.currentIndex === index){return;}
                const result = await GetOrderDev({a00501:id});
                if(result.status == 0){
                    this.errDev = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取故障设备数据失败！'});
                }
            },
            devToWorkOrder(row){  // 新增故障设备
                if(this.exited(row)){
                   this.errDev.push(row);
               }else{
                   this.$message({ message: '该设备已经添加过了', type: 'warning' });
               }
            },
            devRemoveWorkOrder(row,index){  //故障设备从工单中移除
                this.errDev.splice(index,1);
            },
            exited(target){  //判断数据是否存在   即设备是否已存在于工单
                var Alldev = this.errDev;
                for(var i in Alldev){
                    if(JSON.stringify(Alldev[i]) == JSON.stringify(target)){
                        return false
                    }
                }
                return true
            },
            async editOrder(){    //修改工单
                var data = this.orderForm;
                var obj = {
                    a00501:data.a00501,a00502:data.a00502,a00503:data.a00503,
                    a00504:data.a00504,a00505:data.a00505,a00506:data.a00506,a00509:data.a00509
                }
                obj.a00502 = this.toStr(this.errDev);       
                console.log(obj);
                const result = await EditOrder(obj);
                if(result.status == 0){
                    this.$notify({title:'修改完成',message:'工单信息修改成功',type:'success'});
                    this.getOrder();   //重新加载数据
                }else{
                    this.$notify.error({title: '错误',message: '修改工单发生异常,请重试'});
                }
            },
            async setOptions(){
                var that = this;
                const result = await AccountList({a00105:'2'});
                if(result.status == 0){
                    this.options = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取售后人员列表失败,请重试'});
                }
            },
            async searchById(val){
                this.loading = true;
                const result = await GetWorkOrder({a00501:val,a00510:'',currentPage:1});
                if(result.status == 0){
                    this.tableData = result.data.items;
                    this.count = result.data.totalNum;
                }else{
                    this.$notify.error({title: '错误',message: '查询工单失败,请重试'});
                }
                this.loading = false;
            },


            /****************   人员指派  ********************/
            handleTab(val){
                if(val.index == "1"){
                    this.searchAssign();
                }
            },
            async searchAssign(){ //查询并匹配指派人员
                // console.log("查询")
                this.AssignCurrentPage = 1;
                const result = await SearchAccount(this.AssignSearch);
                this.AssignData = result.data;
                this.sortPage(this.AssignData);
            },
            AssignCurrentChange(val){       //指派人员（表格）翻页
                this.AssignCurrentPage = val;
                this.sortPage(this.AssignData);
            },
            async assignOrder(row){  //派发工单
                const result = await AssignOrder({a00501:this.orderForm.a00501,a00509:row.a00103});
                if(result.status == 0){
                    this.$notify({title: '派发成功', message: '工单已成功派发给该人员',type: 'success'});
                    this.orderForm.a00509 = row.a00103;  
                    this.getOrder();   //重新加载数据
                }else{
                    this.$notify.error({ title: '派发失败',message: result.msg});
                }
            },
            async acceptOrder(){
                const result = await AssignOrder({a00501:this.orderForm.a00501,a00509:this.userInfo.a00103});
                if(result.status == 0){
                    this.$notify({title: '成功', message: result.msg,type: 'success'});
                    this.dialogShow = false; //关闭窗口
                    this.getOrder();   //重新加载数据
                }else{
                    this.$notify.error({ title: '失败',message: result.msg});
                }
            },
            checkAssign(){
                if(this.orderForm.a00509 && this.orderForm.a00509!=null){
                    return true;
                }else{
                    return false;
                }
            },
            FinishOrder(){
                this.$confirm('确认该工单服务是否完成?', '提示', {
                    confirmButtonText: '完成', cancelButtonText: '取消',type: 'warning'
                }).then(async () => {
                    const result = await FinishOrder({a00501:this.orderForm.a00501});
                    if(result.status == 0){  //删除成功
                        this.$notify({ title: '成功',message: '执行成功',type: 'success'});
                        this.dialogShow = false; //关闭窗口
                        this.getOrder();   //重新加载数据
                    }else{   //删除失败
                        this.$notify.error({ title: '错误',message: '执行失败'});
                    }
                }).catch(() => {        
                });
                
                
            },
            /* 工具方法  */
            DateFormat(date){  
                return date.slice(0,10);
            },
            sortPage(data){     //指派人员数据分页
                this.AssignTableData = [];
                this.AssignCount = data.length;
                for(var i=(this.AssignCurrentPage-1)*this.pageSize;i<(this.AssignCurrentPage*this.pageSize);i++){
                    if( i == this.AssignCount) break;
                        this.AssignTableData.push(data[i])
                }
            },
            isJSON(str){      //判别str 是否为json格式
                if( typeof(str) == "string"){
                    try{
                        JSON.parse(str);
                        if(str.indexOf('{') > -1){
                            return true;
                        }else{
                            return false;
                        }
                    }catch(e){
                        return false;
                    }
                }
                return false;
            },
            toStr(data){    //设备信息转换成 a00502可识别格式
                var arr = [];
                data.forEach((item) => {
                    arr.push(item.a00211);
                })
                return arr.join(',');
            }
        },
        watch:{
            AssignSearch:{
                handler(val){
                    var that = this;
                    var oldval = {};
                    oldval.a00102 = val.a00102; oldval.a00103 = val.a00103; oldval.a00105 = val.a00105;  //深度复制
                    (function(old){         //搜索优化
                        setTimeout(()=>{
                           if(old.a00102 == val.a00102 && old.a00103 == val.a00103){
                               that.searchAssign();
                           }
                        },500)
                    }(oldval))
                    
                },
                deep:true
            },
            search:function(val){
                var that = this;var oldval = val;
                (function(old){
                    setTimeout(() => {
                        if(old == val){
                            that.searchById(val);
                        }
                    },550)
                }(oldval))
            }
        },
        components:{
            AddErrDev
        }
    }

</script>

<style lang="less" scoped>
    .head{ color: #333; height: 60px;  border-bottom:1px solid #eee; background: #f8f8f8; }
    .left{ float: left;  padding:0 15px; background: #2ABB9C; color: #fff; margin: 0; height: 60px; line-height: 60px;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .tab { height: 42px; border-bottom: 1px solid #eee; line-height: 42px;}
    .msg_p{ margin: 0}
</style>