<template>  
    <div>
         <!--添加设备弹出层-->
            <el-dialog title="添加故障设备" :visible.sync="ErrDevShow" :before-close="closeDialog">
                <el-tabs  tab-position="left" style="min-height: 200px;">
                    <el-tab-pane label="故障设备" >
                        <el-row>
                            <el-col :span="8">
                                <el-input placeholder="所属小区" prefix-icon="el-icon-search" 
                                    style="width:80%;" size="mini" v-model="search.a00203">
                                </el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input placeholder="产品类别" prefix-icon="el-icon-search" 
                                    style="width:80%;" size="mini" v-model="search.a00202">
                                </el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input placeholder="设备标识" prefix-icon="el-icon-search" 
                                    style="width:80%;" size="mini" v-model="search.a00211">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top: 15px;">
                            <el-col :span="23">
                                <el-table 
                                :data="tableData" max-height="350"
                                size="mini" v-loading='loading'
                                hignlignt-current-row
                                style="width: 100%;">
                                    <el-table-column property="a00211" label="设备IMEI"></el-table-column>
                                    <el-table-column property="a00215" label="设备名称"></el-table-column>
                                    <el-table-column property="a00202" label="产品类别"></el-table-column>
                                    <el-table-column property="a00203" label="所属小区"></el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="primary" size="mini" @click="devToWorkOrder(scope.row)">添加</el-button>
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
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="closeDialog">返 回</el-button>
                </div>
            </el-dialog>
            <!---->
    </div>
</template>

<script>
    import { SearchDevice } from '@/interface/getData'

    export default {
        name:"AddErrDev",
        props:['ErrDevShow'],
        data(){
            return{
                tableData:[],   //列表故障设备数据
                currentPage:1,  //页码
                count:0,        //总数
                pageSize:10,    //每页显示数目
                search:{a00202:'',a00203:'',a00206:'1',a00211:'',a00212:'',a00214:''}, //搜索关键字
                loading:false,
            }
        },
        methods:{
            closeDialog(){
                this.$emit('closeDialog',false); 
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.searchDev();
            },
            changeSearch(){  // 查询条件修改
                console.log('chaxun')
                this.currentPage = 1;
                this.searchDev(); 
            },
            async searchDev(){     //查询匹配 故障设备
                this.loading = true;
                this.search.currentPage = this.currentPage;
                const result = await SearchDevice(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title:'错误',message:'获取故障设备数据失败.'});
                }
                this.loading = false;
            },
            devToWorkOrder(row){
                this.$emit('devToOrder',row); 
            }

        },
        watch:{
            search:{
                handler(val){
                    var that = this;
                    var oldval = {
                        a00202:val.a00202,a00203:val.a00203,a00206:val.a00206,
                        a00211:val.a00211,a00212:val.a00212,a00214:val.a00214,
                        currentPage:val.currentPage
                    };
                    (function(old){
                        setTimeout(()=>{
                            if(JSON.stringify(val) == JSON.stringify(old)){
                                that.changeSearch();
                            }
                        },500)
                    }(oldval))
                }, 
                deep:true
            },
            ErrDevShow:function(){
                if(this.ErrDevShow){
                    this.searchDev();  //数据初始化
                }
            }
        },
    }

</script>


<style lang="less" scoped>

</style>