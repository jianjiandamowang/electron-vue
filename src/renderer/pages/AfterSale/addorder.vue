<template>  
    <div class="body">
        <!--添加工单-->
        <div class="content_container">
            <el-row style="padding-top: 20px; background: #fff">
                <h4 style="text-align:center;">工单信息</h4>
                <el-col :span="14" :offset="4">
                    <el-form ref="form" size="small" label-position="left" :model="orderForm" :rules="rules" label-width="110px">
                        <el-form-item label="联系人" prop="">
                            <el-input  v-model="orderForm.a00504"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="">
                            <el-input  v-model="orderForm.a00505"></el-input>
                        </el-form-item>
                        <el-form-item label="所属物业" prop="">
                            <!--<el-input  v-model="orderForm.a00512"></el-input>-->
                            <el-select v-model="orderForm.a00512"  @focus="setPropertyOptions" filterable placeholder="请选择所属物业">
                                <el-option v-for="item in PropertyOptions" :key="item.a00101" 
                                :label="'工号: '+item.a00106+' '+item.a00102" :value="item.a00101">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="服务内容" prop="">
                            <el-input type="textarea" v-model="orderForm.a00503"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="">
                            <el-input v-model="orderForm.a00506"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row style="padding-top: 20px; background: #fff">
                <h5 style="text-align:center;">故障设备</h5>
                <el-col :span="14" :offset="4">
                    <el-table size="small" :data="orderTableData"style="width: 100%">
                        <el-table-column prop="a00211" label="设备IMEI" ></el-table-column>
                        <el-table-column prop="a00202" label="产品类别" ></el-table-column>
                        <el-table-column prop="a00203" label="所属小区" ></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="danger" size="mini" @click="devRemoveWorkOrder(scope.row,scope.$index)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p style="text-align:center;">
                        <el-button type="primary" size="small" @click="openDialog()">添加</el-button>
                    </p>
                </el-col>
            </el-row>
            <el-row style="padding: 20px 0; background: #fff">
                <el-col :span="14" :offset="4">
                    <el-button type="success" @click="orderSubmit()">提交</el-button>
                </el-col>
            </el-row>
            <!---->
            <AddErrDev @closeDialog="close" @devToOrder="devToWorkOrder" :ErrDevShow="dialogShow"></AddErrDev>
        </div>
    </div>
</template>

<script>     
    import AddErrDev from '@/components/adderrDev'   //添加故障设备组件
    import { mapState,mapMutations } from 'vuex'    
    import { AddWorkOrder,AccountList } from '@/interface/getData' 

    export default {
        name:"OrderAdd",
        data(){
            return{
                orderForm:{ 
                    a00502:'',a00503:'',a00504:'',a00505:'',a00506:'',a00512:""
                },
                orderTableData:[], //工单中的故障设备列表
                rules:{},
                dialogShow:false,
                PropertyOptions:[],
            }
        },
        mounted(){
            if( this.ErrDev && this.ErrDev.length > 0){
                // console.log('存在');
                this.orderTableData = this.ErrDev;
            }

            this.setPropertyOptions();
            if(this.userInfo.a00105 == '3'){
                this.orderForm.a00512 = this.userInfo.a00101
            }
        },
        methods:{
            close(data){
                this.dialogShow = data;
            },
            async orderSubmit(){  //提交并发布工单
                if(!this.checkOrderForm()){ return;}
                this.orderForm.a00502 = this.toStr(this.orderTableData);
                const result = await AddWorkOrder(this.orderForm);
                if(result.status == 0){
                    this.$notify({title:'成功',message:'成功发布了一条工单',type:'success'});
                    this.orderForm.a00502 = "";this.orderForm.a00503 = "";
                    this.orderForm.a00504 = "";this.orderForm.a00505 = "";
                    this.orderForm.a00506 = "";this.orderForm.a00512 = "";
                    this.orderTableData = [];
                }else{
                    this.$notify.error({title: '错误',message: '操作失败,请重试'});
                }
            },
            async setPropertyOptions(){
                const result = await AccountList({a00105:'3'});
                if(result.status == 0){
                    this.PropertyOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取物业列表失败'});
                }
            },
            checkOrderForm(){  //检查工单  字段
                if(!this.orderForm.a00504 || this.orderForm.a00504 == ''){
                    this.$message({type:'warning',message:"请填写联系人信息"});
                    return false;
                }
                if(!this.orderForm.a00505 || this.orderForm.a00505 == ''){
                    this.$message({type:'warning',message:"请填写联系人的联系方式"});
                    return false;
                }
                if(!this.orderForm.a00512 || this.orderForm.a00512 == ''){
                    this.$message({type:'warning',message:"请选择所属物业"});
                    return false;
                }
                if(!this.orderForm.a00506 || this.orderForm.a00506 == ''){
                    this.$message({type:'warning',message:"请填写需要服务的地址街道信息"});
                    return false;
                }
                if(this.orderTableData.length < 1){
                    this.$message({type:'warning',message:"请为工单添加设备"});
                    return false;
                }
                return true;
            },

            openDialog(){   // 打开添加故障设备到工单的窗口
                this.dialogShow = true;
                // this.searchDev();   //初始化查询
            },
            devToWorkOrder(row){  //故障设备添加到工单
                if(this.exited(row)){
                   this.orderTableData.push(row);
               }else{
                   this.$message({ message: '该设备已经添加过了', type: 'warning' });
               }
            },
            devRemoveWorkOrder(row,index){  //故障设备从工单中移除
                this.orderTableData.splice(index,1);
            },
            exited(target){  //判断数据是否存在   即设备是否添加过
                var Alldev = this.orderTableData;
                for(var i in Alldev){
                    if(Alldev[i].a00201 == target.a00201){
                        return false
                    }
                }
                return true
            },
            toStr(data){
                var arr = [];
                data.forEach((item) => {
                    arr.push(item.a00211);
                })
                return arr.join(',');
            }
        },
        components:{
            AddErrDev
        },
        computed:{
            ...mapState(['ErrDev','userInfo']),
        }
    }


</script>

<style lang="less" scoped>
    .content_container{ padding: 40px;}
    
</style>