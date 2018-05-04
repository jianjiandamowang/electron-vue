<template>
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
        <!--项目列表-->
            <!--头部-->
            <div class="head">
                <h4 class="left">
                    项目列表<span v-if="count > 0">({{count}})</span>
                </h4>
                <div class="right" style="margin-right: 20px">
                    <el-tooltip class="item" effect="dark" content="新建一个新项目" placement="top">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="$router.push('/addproject')">新建项目</el-button>
                    </el-tooltip>
                </div>
                <div class="right" style="margin-right: 20px">
                    <el-input placeholder="输入项目全称" prefix-icon="el-icon-search"  size="mini" v-model="search.a00302">
                    </el-input>
                </div>
                <div class="clearbotn"></div>
            </div>
             <el-row class="search_head" style="padding: 6px 0 0 15px;">
                    <selectAddress :address="address" @SetAddress="setAddress"></selectAddress>
             </el-row>
            <!--项目数据表格-->
             <div class="table_container">
                <el-table :data="tableData" size="small" v-loading="loading" highlight-current-row 
                    element-loading-text="拼命加载中"  :row-key="row => row.index" style="min-height: 480px;width: 100%">
                    <el-table-column label="#" width="50">
                        <template slot-scope="scope">{{scope.$index+1}}</template>
                    </el-table-column>
                    
                    <el-table-column property="a00302" label="项目名称"></el-table-column>
                    <el-table-column property="a00303" label="项目地址"></el-table-column> 
                    <el-table-column property="a00304" label="负责人"></el-table-column> 
                    <el-table-column property="a00305" label="联系方式"></el-table-column> 
                    <el-table-column property="a00306" label="截止日期"></el-table-column> 
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="openProjectEdit(scope.row,scope.$index)">{{Permision.ProjectEdit?'编辑':'查看'}}</el-button>
                            <el-button v-if="Permision.ProjectEdit" @click="deleteProject(scope.row,scope.$index)" type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--项目分页-->
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"  :page-size="pageSize"
                        layout="total, prev, pager, next"  :total="count">
                    </el-pagination>
                </div>
            </div>
            <!--编辑窗口 项目管理-->
            <el-dialog title="项目管理" :visible.sync="projectShow" width="85%" top="8vh" center> 
                <el-tabs  tab-position="left" style="min-height: 200px;">
                    <el-tab-pane label="项目信息" >
                        <el-row>
                            <!--left-->
                            <el-col :span="8">
                                <!--基本信息-->
                                <el-row>
                                        <h4 style="padding-left:20px;">基本信息</h4>
                                        <el-form size="small" :model="editData" label-width="100px">
                                            <el-form-item label="项目名称">
                                                <el-input v-model="editData.a00302" auto-complete="off" style="width:72%;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="项目地址">
                                                <el-input v-model="editData.a00303" auto-complete="off" style="width:72%;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="项目负责人">
                                                <el-input v-model="editData.a00304" auto-complete="off" style="width:72%;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="负责人电话">
                                                <el-input v-model="editData.a00305" auto-complete="off" style="width:72%;"></el-input>
                                            </el-form-item>
                                            <el-form-item label="截止日期">
                                                <el-date-picker v-model="editData.a00306" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                                            </el-form-item>
                                            <el-form-item>
                                                <el-button v-if="Permision.ProjectEdit" @click="editProject" type="primary">保存修改</el-button>
                                            </el-form-item>
                                        </el-form>
                                </el-row>

                            </el-col>
                            <!--right-->
                            <el-col :span="16">
                                <!--设备列表-->
                                <el-row>
                                    <el-col :span="23">
                                        <h4 style="margin-bottom:0;">设备列表</h4>
                                        <el-table size="mini" :data="devTableData" highlight-current-row style="width: 100%;" height="350">
                                            <el-table-column label="设备IMEI" prop="a00211"></el-table-column>
                                            <el-table-column label="设备名称" prop="a00215"></el-table-column>
                                            <el-table-column label="产品类型" prop="a00202"></el-table-column>
                                            <el-table-column label="小区名称" prop="a00203"></el-table-column>
                                            <el-table-column label="在线状态">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.a00205 == '0'">离线</span>
                                                    <span v-if="scope.row.a00205 == '1'">在线</span>
                                                    <span v-if="!scope.row.a00205">未知</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="操作" v-if="Permision.ProjectEdit">
                                                <template slot-scope="scope">
                                                    <el-button type="primary" size="mini" @click="removeProject(scope.row.a00201,scope.$index)">移除</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <!--设备分页-->
                                        <div class="Pagination" style="text-align: left;margin-top: 10px;">
                                            <el-pagination
                                                @current-change="DevCurrentChange"
                                                :current-page="devCurrentPage"  :page-size="devPageSize"
                                                layout="total, prev, pager, next"  :total="devCount">
                                            </el-pagination>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                   </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="projectShow = false">返 回</el-button>
                </div>
            </el-dialog>
            <!---->
        </el-col>
    </el-row>
</template>

<script>
    import SelectAddress from '@/components/selectAddress';
    import { mapState } from 'vuex';
    import { GetProject,EditProject,DeleteProject,SearchDevice,RemoveDevProject } from '@/interface/getData'

    export default {
        name:'projectList',
        data(){
            return {
                /*****************项目********************/
                tableData:[],           //存放项目列表数据
                loading:false,
                search:{    //项目的搜索条件
                    a00302:'',a00303:''
                },
                address:{province:'',city:'',district:''},
                currentPage:1,
                pageSize:10,
                count:0,
                /*****************设备********************/
                devTableData:[],        //存放设备列表数据
                devSearch:{ //项目设备的搜索条件
                    a00202:'',a00203:'',a00206:'',a00211:'',a00212:'',a00214:''
                },
                devCurrentPage:1,
                devPageSize:10,
                devCount:0,
                /*****************编辑********************/
                projectShow:false,      //项目编辑窗口
                editData:{      //项目编辑窗口的数据  即当前编辑数据
                    a00301:'',a00302:'',a00303:'',a00304:'',a00305:'',a00306:'',a00307:'',a00308:'',a00309:''
                },
                editIndex:null,         //当前编辑数据的索引           
                
            }
        },
        mounted(){
            this.getProject();     //获取项目列表  数据初始化
        },
        computed:{
            ...mapState(['Permision']),
        },
        methods:{
            handleCurrentChange(val){   // 项目列表翻页
                this.currentPage = val;
                this.getProject();
            },  
            DevCurrentChange(val){     // 设备列表翻页
                this.devCurrentPage = val;
                this.getDevByProject();
            },
            setAddress(val){       //设置地址信息
                this.search.a00303 = val.province + val.city + val.district;
            },
            /**************************获取数据***************************/
            searchProject(){ this.currentPage = 1; this.getProject(); },  
            async getProject(){    //查询并获取项目数据
                this.loading = true;
                this.search.currentPage = this.currentPage;
                const result = await GetProject(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title: '错误',message: '获取项目列表数据失败,请重试'});
                }
                this.loading = false;
            },  
            openProjectEdit(row,index){  //打开项目编辑窗口
                this.copyData(row,index);
                this.projectShow = true;
                this.getDevByProject();
            },
            async editProject(){          //修改项目信息
                const result = await EditProject(this.editData);
                if(result.status == 0){
                    this.$notify({title: '成功',message: result.msg,type:"success"});
                    this.getProject();
                }else{
                    this.$notify({title: '失败',message: result.msg,type:"error"});
                }
            },
            async removeProject(devId,index){      //移除设备项目所属
                const result = await RemoveDevProject({a00201:devId});
                if(result.status == 0){
                    this.$notify({title: '成功',message: result.msg,type:"success"});
                    this.devTableData.splice(index,1);
                }else{
                    this.$notify({title: '失败',message: result.msg,type:"error"});
                }
            },
            async getDevByProject(){  //根据项目查找设备 （获取项目下的所有设备）
                this.devSearch.a00212 = this.editData.a00302;
                this.devSearch.currentPage = this.devCurrentPage;
                const result = await SearchDevice(this.devSearch);
                if(result.status == 0){
                    this.devTableData = result.data.items;
                    this.devCount = result.data.totalNum;
                }else{
                     this.$notify.error({title: '错误',message: '获取设备列表数据失败,请重试'});
                }
            },
            async deleteProject(row,index){      //删除项目
                this.copyData(row,index);
                await this.getDevByProject();
                if(this.devCount > 0){
                    this.$notify({title: '失败',message: '该项目下拥有设备,无法执行删除操作',type:'error'});
                    return;
                }
                const result = await DeleteProject({a00301:row.a00301});
                if(result.status == 0){
                    this.$notify({title: '成功',message: result.msg,type:"success"});
                    this.tableData.splice(this.editIndex,1);
                }else{
                    this.$notify({title: '失败',message: result.msg,type:"error"});
                }
            },
            /********************util***********************/
            copyData(row,index){    //深度复制
                this.editData = {
                    a00301:row.a00301,a00302:row.a00302,a00303:row.a00303,
                    a00304:row.a00304,a00305:row.a00305,a00306:row.a00306,
                    a00307:row.a00307,a00308:row.a00308,a00309:row.a00309,
                };
                this.editIndex = index;
            }

        },
        watch:{
            search:{
                handler(val){
                    var that = this;
                    var oldval = {
                        a00302:val.a00302,a00303:val.a00303,currentPage:val.currentPage
                    };
                    (function(old){
                        setTimeout(()=>{
                            if(JSON.stringify(val) == JSON.stringify(old)){
                                that.searchProject();
                            }
                        },500)
                    }(oldval))
                },
                deep:true
            }
        },
        components:{
            SelectAddress
        }
    }

</script>

<style lang="less" scoped>
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .search_head{ height: 46px; background:#fff; border-bottom: 1px solid #eee; padding-top: 6px;}
    .left{ float: left;  padding:0 15px; background: #2ABB9C; color: #fff; margin: 0; height: 60px; line-height: 60px;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}
    .table_container{border: 1px solid #f8f8f8;background: #fff; }
 

</style>

