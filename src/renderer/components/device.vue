<template>
    <div>
        <!--设备组件-->
        <el-row>
            <!--筛选条件-->
            <el-col :span="8">
                <el-input placeholder="所属小区" prefix-icon="el-icon-search" 
                 style="width:80%;" size="mini" v-model="search.a00203"></el-input>
            </el-col>
            <el-col :span="8">
                <el-input placeholder="产品类别" prefix-icon="el-icon-search" 
                 style="width:80%;" size="mini" v-model="search.a00202"></el-input>
            </el-col>
            <el-col :span="8">
                <el-input placeholder="设备标识" prefix-icon="el-icon-search" 
                 style="width:80%;" size="mini" v-model="search.a00211"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <!--设备列表-->
            <el-col :span="24">
                <el-table :data="tableData" size="mini" v-loading="loading" hignlight-current-row  style="width:100%;"> 
                    <el-table-column props="a00211" label="设备IMEI"></el-table-column>
                    <el-table-column props="a00215" label="设备名称"></el-table-column>
                    <el-table-column props="a00202" label="产品类别"></el-table-column>
                    <el-table-column props="a00203" label="所属小区"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" >添至项目</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-size="pageSize"
                         layout="total, prev, pager, next" :total="count">
                    </el-pagination>
                </div>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { SearchDevice } from '@/interface/getData' 

    export default {
        name:'Device',
        data(){
            return{
                tableData:[],    //设备列表数据
                loading:false,
                currentPage:1,   //当前页码
                pageSize:10,     //每页的显示数目
                count:0,         //数据总数

                search:{  //查询条件
                    a00202:'',a00203:'',a00206:'',a00211:'',a00212:'',a00214:'',currentPage:''
                }
            }
        },
        methods:{
            handleCurrentChange(val){   //翻页
                this.currentPage = val;
            },
            /*************获取数据*******************/
            async searchDev(){      //查询匹配设备
                this.loading = true;
                this.search.currentPage = this.currentPage;
                const result = await SearchDevice(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title:'错误',message:'获取设备数据失败.'});
                }
                this.loading = fasle;
            }
        }
    }

</script>
