<template>
    <div>
        <el-table size="small" v-loading="loading" :data="tableData" style="width:100%;">
            <el-table-column  property="a00704" label="任务批次"></el-table-column>
            <el-table-column  property="a00705" label="更新时间"></el-table-column>
            <el-table-column  label="查看">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="setBatch(scope.row.a00704)">查看报表</el-button>
                </template>
            </el-table-column>
            <!--<el-table-column  label="下载">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="">下载报表</el-button>
                </template>
            </el-table-column>-->
            
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


        <!--报表-->
        <el-dialog title="更新报表" :visible.sync="reportShow" width="1000px" @close="clearTime">
            <h4>批次号: {{currentPageBatch}}</h4>
            <el-table :data="reportData" size="mini" :max-height="300" style="width:100%;">
                <el-table-column label="设备IMEI" prop="a00702"></el-table-column>
                <el-table-column label="更新版本文件" prop="a00703"></el-table-column>
                <el-table-column label="更新时间" prop="a00705"></el-table-column>
                <el-table-column label="更新结束时间" prop="a00707"></el-table-column>
                <el-table-column label="更新状态">
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
    </div>
</template>

<script>
    import { GetReport,GetReportByBatch } from '@/interface/getData'

    export default {
        name:'ReportTable',
        data(){
            return{
                AllData:[],      
                tableData:[],
                pageSize:10,
                count:0,
                currentPage:1,
                loading:false,
                currentPageBatch:null,      //当前选择的批次号

                /***********报表**************/
                reportData:[],      //报表窗口数据
                reportShow:false,   //报表窗口显示标志
                total:0,
                successCount:0,       //更新成功数
                failCount:0,           //更新失败数
                uncompletedCount:0,    //更新未完成数
                progress:1,
                timer:null
            }
        },
        mounted(){
            this.getReport();
        },
        methods:{
            handleCurrentChange(val){ //翻页
                this.currentPage = val;
                this.sortPage(this.AllData);
            },
            async getReport(){      //获取任务批次列表
                this.loading = true;
                const result = await GetReport({a00709:'0'});
                if(result.status == 0){
                    result.data.map(item=>{
                        item.a00705 = this.formateDate(item.a00705);
                    })
                    this.AllData = result.data;
                    this.sortPage(this.AllData);
                    this.loading = false;
                }else{
                    this.$notify.error({message: '数据初始化失败,请刷新页面'});
                }
            },
            setBatch(row){
                this.currentPageBatch = row;
                this.getReportByBatch();
            },
            async getReportByBatch(){   //根据任务批次查看报表
                const result = await GetReportByBatch({a00704:this.currentPageBatch});
                console.log(result);
                if(result.status == 0){
                    result.data.map( item =>{
                        item.a00705 = this.formateDate(item.a00705);
                        item.a00707 = this.formateDate(item.a00707);
                    })
                    this.reportData = result.data;
                    this.resultSort();
                    this.reportShow = true;
                }else{
                    this.$notify.error({message: '操作异常,请重试'});
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
            sortPage(data){  //数据分页
                this.tableData = [];
                this.count = data.length;
                for(var i=(this.currentPage-1)*this.pageSize;i<(this.currentPage*this.pageSize);i++ ){  //分页
                      if(i == this.count) break;
                       this.tableData.push(data[i]); 
                }
                this.loading = false;
            },
            resultSort(){   //更新结果统计
                this.total = this.reportData.length;
                this.successCount = 0;
                this.failCount = 0; this.uncompletedCount = 0;
                this.reportData.forEach( item =>{
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
        }
    }    
</script>

<style scoped>

</style>