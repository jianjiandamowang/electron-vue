<template>
    <div>
        <div class="content_container"> 
            <el-row>
                <!--固件版本列表-->
                <el-col :span="18" style="height: 634px;">
                    <div class="head">
                        <h4 class="title">历史版本</h4>
                    </div>
                    <div class="tool">
                        <el-button size="small" type="primary" class="tool_btn" @click="$router.push('/versionupload')"><span class="el-icon-upload"></span>上传固件</el-button>
                        <span v-if="latestVersion" class="tip"><b>Tip：</b>当前最新版本为 {{latestVersion}} (当前使用的版本为当前已发布的最高版本)</span>
                    </div>
                    <!--表格-->
                    <div class="table_container">
                        <el-table  :data="tableData" size="small"  ref="versionTable" empty-text="该产品暂无固件版本文件"   highlight-current-row v-loading="loading" 
                            style="width:100%;min-height: 490px;"  @row-click="handlerClick"> 
                            <el-table-column label="#" width="50">
                                <template slot-scope="scope"><i class="el-icon-arrow-right"></i></template>
                            </el-table-column>
                            <el-table-column property="a00603" label="文件名"></el-table-column>
                            <el-table-column property="a00604" label="版本号"></el-table-column>
                            <el-table-column property="a00605" label="上传时间"></el-table-column>
                            <el-table-column property="a00607" label="文件大小"></el-table-column>
                            <el-table-column label="发布状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.a00606 == '1'" style="color: #13ce66;">已发布</span>
                                    <span v-else>未发布</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="240">
                                <template slot-scope="scope">
                                    <el-button type="warning" size="mini" @click="testVersion(scope.row)">测试</el-button>
                                    <el-button type="primary" size="mini" @click="releseVersion(scope.row)">发布</el-button>
                                    <el-button v-if="scope.row.a00606 != '1'" type="danger" size="mini" @click="deleteVersion(scope.row.a00601)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
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
                </el-col>
                <!--固件版本详情-->
                <el-col :span="6" style="height: 634px;background: #fff;">
                    <div class="head" style="background: #3A587A;text-align: center;">
                        <span style="color: #fff;font-size: 14px;">产品</span>
                        <el-select size="mini" v-model="ProductId" @focus="GetProductlist" @change="getVersionByProduct" filterable placeholder="请选择产品类型">
                            <el-option  v-for="(item,index) in ProductList" :key="item.a00401"
                                :label="item.a00402":value="item.a00401">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="tool"></div>
                    <div class="DetailMsg">   
                        <h4>详细信息:</h4>
                        <p>文件名: <small>{{DetailMsg.a00603}}</small></p>
                        <p>文件大小: <small>{{DetailMsg.a00607}}</small></p>
                        <p>上传时间: <small>{{DetailMsg.a00605}}</small></p>
                        <p>版本号: <small>{{DetailMsg.a00604}}</small></p>
                        <p>发布状态: <small v-if="DetailMsg.a00606 == '1'">已发布</small>
                        <small v-if="DetailMsg.a00606 == '0'">未发布</small>
                        <small v-else></small>
                        </p>
                    </div>
                </el-col>
            </el-row>

            <!--测试-->
            <el-dialog title="固件测试" :visible.sync="testVersionShow">
                <el-form :data="testVersionForm" label-width="110px">
                    <el-form-item label="固件文件名称">
                        <span>{{testVersionForm.fileName}}</span>
                    </el-form-item>
                    <el-form-item label="测试设备IMEI">
                        <el-input v-model="testVersionForm.imei" style="width: 60%;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="warning" size="small" @click="submitTest">提交并测试</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

        </div>
    </div>
</template>



<script>
    import { getAllProduct,GetVersionList,ReleaseVersion,GetLatestVersion,DeleteVersion,VersionTest } from '@/interface/getData'

    export default {
        name:'VersionManage',
        data(){
            return{
                tableData:[],
                latestVersion:null,           //当前最新版本
                currentPage:1,                //当前页码
                pageSize:10,                  //每页显示数目
                count:20,                      //数据总数目
                loading:false,
                ProductList:[],
                ProductId:null,          //搜素关键字
                currentPage:1,
                pageSize:10,
                count:0,
                DetailMsg:{    //右侧详细信息
                    a00601:'', a00602:'', a00603:'', a00604:'',a00605:'',a00606:'',a00607:''
                },
                testVersionShow:false,       //固件测试窗口
                testVersionForm:{              //固件测试
                    fileName:'',imei:''
                }
            }
        },
        mounted(){
            this.OnInit();
        },
        updated(){
            // this.toggleSelection();
        },
        methods:{
            handlerClick(row){
                this.DetailMsg = {
                    a00601:row.a00601,a00602:row.a00602,a00603:row.a00603,
                    a00604:row.a00604,a00605:row.a00605,a00606:row.a00606,a00607:row.a00607
                }
            },
            /********************获取数据**************************/
            async OnInit(){ //初始查询所有固件信息
                this.loading = true;
                await this.GetProductlist();
                this.ProductId = this.ProductList[0].a00401;
                this.getLatestVersion();
                const result = await GetVersionList({a00602:this.ProductId,currentPage:1});
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.pageSize = result.data.pageSize;
                    result.data.items.map(item => {
                        item.a00605 = this.formateDate(item.a00605);
                        item.a00607 = this.formateSize(item.a00607);
                    })
                    this.tableData = result.data.items;
                }
                this.loading = false;
            },
            async getVersion(){
                this.loading = true;
                const result = await GetVersionList({a00602:this.ProductId,currentPage:this.currentPage});
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.pageSize = result.data.pageSize;
                    result.data.items.map(item => {
                        item.a00605 = this.formateDate(item.a00605);
                        item.a00607 = this.formateSize(item.a00607);
                    })
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败,请重试'});
                }
                this.loading = false;
            },
            async getLatestVersion(){
                this.latestVersion = null;
                const result = await GetLatestVersion({a00602:this.ProductId});
                if(result.status == 0){
                    this.latestVersion = result.data;
                }
            },
            releseVersion(row){     //发布固件版本
                this.$confirm('固件发布之前请自行测试,一经发布无法删除',{
                    confirmButtonText: '发布',cancelButtonText: '取消', type: 'warning'
                }).then(async ()=>{
                    if(row.a00606 == 1){ 
                        this.$message.warning({message:'该固件处于已发布状态'});
                        return;
                    }
                    const result = await ReleaseVersion({a00601:row.a00601});
                    if(result.status == 0){
                        this.$notify.success({message: result.msg});
                        this.getVersion();
                    }else{
                        this.$notify.error({message: result.msg});
                    }
                }).catch(()=>{
                    this.$notify.info({message: '已取消发布'});
                })

                
            },
            getVersionByProduct(){  //根据产品ID 获取对应固件版本
                this.currentPage = 1; 
                this.getLatestVersion();
                this.getVersion();
            },
            deleteVersion(id){        //删除固件
                this.$confirm('是否删除该固件?', {
                    confirmButtonText: '确定', cancelButtonText: '取消',type: 'warning'
                }).then(async () => {
                    const result = await DeleteVersion({a00601:id});
                    if(result.status == 0){
                        this.$notify.success({message: result.msg});
                        this.getVersion();
                    }else{
                        this.$notify.error({message: result.msg});
                    }
                }).catch(() => { });
            },
            testVersion(row){  //测试固件
                this.testVersionForm.fileName = row.a00603;
                this.testVersionShow = true;
            },
            async submitTest(){       //提交测试
                if(!this.testVersionForm.imei){
                    return this.$message.warning({message:'测试设备的IMEI不能为空'})
                }
                const result = await VersionTest(this.testVersionForm);
                if(result.status == 0){
                    this.$notify.success({message: '操作成功, 请自行检查固件运行状态'});
                    this.testVersionShow = false;
                }else{
                    this.$notify.error({message: '操作失败!'+result.msg});
                }
            },
            handleCurrentChange(val){  //翻页操作
                this.currentPage = val;
                this.getLatestVersion();
                this.getVersion();
            },
            async GetProductlist(){     //获取产品信息
                if(this.ProductList.length>0) return;
                const result = await getAllProduct();
                if(result.status == 0){
                    this.ProductList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取产品列表失败,请重试'});
                }
            },
            /******************util*************************/
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
            formateSize(size){  //格式化文件大小
                if(!size) return;
                size = size * 1;
                if(size < 1024){
                    return size + 'B';
                }
                if(size >= 1024 && size < 1024*1024){
                    size = Math.round((size/1024)*100)/100;
                    return size+'KB'
                }
                if(size >= 1024*1024){
                    size = Math.round((size/1024/1024)*100)/100;
                    return size+'M';
                }
            }
        },
    }
</script>

<style lang="less" scoped>

    .content_container{ padding: 40px;}
    .head{ height: 50px; background:#3D5D86; line-height: 50px;}
    .title{ margin: 0; padding: 0 15px; color: #fff; line-height: 50px; }
    .tool{ height: 50px;background: #f8f8f8;}
    .tool_btn{ margin: 8px 15px;}
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .DetailMsg{background: #fff;border:1px solid #f8f8f8;padding:0 15px;}
    .DetailMsg P{ color: #333;font-size: 15px;}
    .DetailMsg P small{ color: #808080;}
    .tip{ font-size: 13px;color: #808080;}
</style>

