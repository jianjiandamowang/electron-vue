<template>  
    <!--更新任务报表-->
    <el-row type="flex" justify="center">
        <el-col :span="23" class="content">
            <!--头部-->
            
            <div class="head">
                <h4 class="left">更新报表 <small>({{reportChange?'普通更新':'定时更新' }})</small></h4>
            </div>
            <el-row class="report_head" style="padding: 6px 0 0 15px;">
               <el-button @click="reportChange = true" size="small" type="success">普通更新任务</el-button>
               <el-button @click="reportChange = false" size="small" type="warning">定时更新任务</el-button>
            </el-row>
            <!--普通任务-->
            <div v-if="reportChange" class="table_container">
                <ReportTable></ReportTable>
            </div>
            <!--定时任务-->
            <div v-if="!reportChange" class="table_container">
                <TimeReportTable></TimeReportTable>
            </div>
        </el-col>
    </el-row>
</template>


<script>
    import ReportTable from '@/components/reportTable'
    import TimeReportTable from '@/components/timereportTable'

    export default {
        name:'UpdateReport',
        data(){
            return{
               reportChange:true,
            }
        },
        methods:{

        },
        components:{
            ReportTable,
            TimeReportTable
        }
    }

</script>

<style scoped>
    .head{ color: #333; height: 60px;  border-bottom:1px solid #eee; background: #f8f8f8; }
    .left{ float: left;  padding:0 15px; background: #3D5D86; color: #fff; margin: 0; height: 60px; line-height: 60px;}
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .report_head{ height: 46px; background:#fff; }
</style>