<template>
    <!--未编辑设备-->
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
            <!--头部-->
            <div class="head">
                <h4 class="left">
                    未编辑设备<span v-if="count">({{count}})</span>
                </h4>
                <div class="right">
                    <el-input placeholder="输入设备IMEI进行查询" prefix-icon="el-icon-search"  size="mini" v-model="search.a00211">
                    </el-input>
                </div>
                <div class="clearbotn"></div>
            </div>
            <!--未编辑设备表格-->
            <div class="table_container">
                <el-table :data="tableData" v-loading="loading" size="small" style="width:100%;min-height:490px;">
                    <el-table-column label="设备IMEI" prop="a00211"></el-table-column>
                    <el-table-column label="设备名称" prop="a00215"></el-table-column>
                    <el-table-column label="产品类别" prop="a00202"></el-table-column>
                    <el-table-column label="小区名称" prop="a00203"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="toEdit(scope.row,scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination @current-change="handleCurrentChange"
                    :current-page="currentPage"  :page-size="pageSize"
                    layout="total, prev, pager, next" :total="count">
                    </el-pagination>
                </div>
            </div>

            <!--编辑窗口-->
            <el-dialog title="编辑设备" :visible.sync="editdialogShow" top="8vh" size="mini">
                <el-tabs tab-position="left">
                    <el-tab-pane label="编辑信息">
                        <!--设备信息编辑窗口-->
                        <el-form size="mini" :model="editForm" ref="editForm" :rules="editRules" label-width="100px" label-position="left">
                            <el-form-item label="设备IMEI">
                                <p class="dialogP">{{editForm.a00211}}</p>
                            </el-form-item>
                            <el-form-item label="设备名称">
                                <el-input v-model="editForm.a00215" class="edit_input"></el-input>
                            </el-form-item>
                            <el-form-item label="所属项目" prop="a00212">
                                <el-select v-model="editForm.a00212" @focus="GetProject" @change="setProject" filterable placeholder="请选择">
                                    <el-option  v-for="(item,index) in ProjectList" :key="item.a00301"
                                     :label="item.a00302":value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产品类别" prop="a00202">
                                <!--<el-input v-model="editForm.a00202" class="edit_input"></el-input>-->
                                <el-select v-model="editForm.a00202" @focus="GetProductlist" @change="setProduct" filterable placeholder="请选择">
                                    <el-option  v-for="(item,index) in ProductList" :key="item.a00401"
                                     :label="item.a00402":value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="地址信息" prop="a00214">
                                <!--<el-input v-model="editForm.a00214" class="edit_input"></el-input>-->
                                <span v-if="!addShow">{{editForm.a00214}}</span>
                                <el-button v-if="!addShow" type="text" size="mini" @click="resetAddress">位置不准?重新设置</el-button>
                                <el-row>
                                    <el-col :span="20">
                                        <div v-show="addShow" id="editaddress" data-toggle="distpicker" data-value-type="name">
                                            <select data-province="---- 选择省 ----" v-model="editAddress.province" @change="SetProvince"></select>
                                            <select data-city="---- 选择市 ----" v-model="editAddress.city" @change="SetCity"></select>
                                            <select data-district="---- 选择区 ----" v-model="editAddress.district" @change="SetDistrict"></select>
                                        </div>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button v-if="addShow" type="text" size="mini" @click="addShow = false">取消</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>

                            <el-form-item label="小区名称" prop="a00203">
                                <el-input v-model="editForm.a00203" class="edit_input"></el-input>
                            </el-form-item>
                            <el-row>
                            <el-col :span="12">
                                <el-form-item label="GPS经度">
                                    <el-input v-model="editForm.a00204[0]" style="width: 80%;"></el-input>  
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="GPS纬度">
                                    <el-input v-model="editForm.a00204[1]" style="width:80%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="在线状态">
                                    <p class="dialogP">{{ exChangeStatus(editForm.a00205)}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="故障状态">
                                    <p class="dialogP">{{editForm.a00206?editForm.a00206:"暂无"}}</p> 
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-form-item label="故障信息">
                                <p class="dialogP">{{editForm.a00207?editForm.a00207:"暂无"}}</p>
                            </el-form-item>
                            <el-row>
                            <el-col :span="12">
                            <el-form-item label="售后帐号">
                                <el-select v-model="editForm.a00208" @focus="GetAfterSaleAccount" filterable placeholder="请选择">
                                    <el-option  v-for="item in afterSaleList" :key="item.a00101"
                                     :label="item.a00102":value="item.a00106">
                                        <span style="float: left">{{ item.a00106 }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            </el-col>
                            <el-col :span="12">
                            <el-form-item label="物业帐号">
                                <el-select v-model="editForm.a00209" @focus="GetPropertyAccount" filterable placeholder="请选择">
                                    <el-option  v-for="item in PropertyList" :key="item.a00101"
                                     :label="item.a00102":value="item.a00106">
                                        <span style="float: left">{{ item.a00106 }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            </el-col>
                            </el-row>
                            <el-form-item label="上线时间">
                                <p class="dialogP">{{editForm.a00213?editForm.a00213:"暂无"}}</p>
                            </el-form-item>
                            <el-form-item label="固件版本">
                                <p class="dialogP">{{editForm.a00216?editForm.a00216:"暂无"}}</p>
                            </el-form-item>
                            <el-form-item>
                               <el-button type="primary" @click="finishEdit('editForm')">完 成 编 辑</el-button>
                            </el-form-item>
                        </el-form>
                        <!---->
                    </el-tab-pane>

                </el-tabs>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import { GetUnEdit,getAllProduct,GetAllProject,EditDevice,AccountList } from '@/interface/getData'

    export default {
        name:'UnEdit',
        data(){
            var checkProduct = (rule,value,callback) => {
                if(value){
                    if(value == '未编辑'){
                        return callback(new Error('请选择产品种类'));
                    }else{
                        callback();
                    }
                }
            }
            return{
                /*************未编辑设备******************/
                tableData:[],       //未编辑设备数据
                loading:false,
                currentPage:1,      //当前页码
                pageSize:10,        //每页显示数目
                count:0,            //设备总数
                search:{            //查询未编辑设备的查询条件
                    a00211:'',currentPage:1
                },
                editRules:{ 
                    a00212: [{ required: true, message: '所属项目不能为空', trigger: 'blur' },],
                    a00214: [{ required: true, message: '请把地址信息补充完整', trigger: 'blur' },],
                    a00202: [
                        { required: true, message: '请选择产品类别', trigger: 'blur' },
                        { validator:checkProduct ,trigger: 'blur' },
                        ],
                    a00203: [{ required: true, message: '请填写小区信息', trigger: 'blur' },],
                },
                /************编辑窗口***************/
                editdialogShow:false,
                editIndex:null,     //当前编辑数据的索引
                editForm:{          //编辑窗口的数据
                    a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                    a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:''
                },
                addShow:false,
                editAddress:{province:'',city:'',district:''},  //重新编辑地址
                afterSaleList:[],        //售后帐号数据
                PropertyList:[],        //物业人员数据
                ProductList:[],          //产品列表数据
                ProjectList:[],         //项目列表数据
            }
        },
        mounted(){
            this.getUnEdit();
        },
        methods:{
            handleCurrentChange(val){   //翻页操作  
                this.currentPage = val;
                this.getUnEdit();
            },
            /******************获取数据************************/
            changeSearch(){         //动态查询
                this.currentPage = 1; this.getUnEdit();
            },
            async getUnEdit(){      //获取未编辑设备列表
                this.loading=true;this.search.currentPage = this.currentPage;
                const result = await GetUnEdit(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    result.data.items.map((item) => {
                        item.a00204 = this.toArray(item.a00204);
                    })
                    this.tableData = result.data.items;
                }else{
                    this.$notify.error({title: '错误',message: '获取未编辑设备数据失败,请重试'});
                }
                this.loading = false;
            },
            /********************编辑设备信息****************************/
            toEdit(row,index){
                this.copyData(row,index);
                this.editdialogShow = true;
            },
            async GetAfterSaleAccount(){   //获取售后账户列表
                const result = await AccountList({a00105:'2'});
                if(result.status == 0){
                    this.afterSaleList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取售后人员列表失败,请重试'});
                }
            },
            async GetPropertyAccount(){     //获取物业账户列表
                const result = await AccountList({a00105:'3'});
                if(result.status == 0){
                    this.PropertyList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取物业人员列表失败,请重试'});
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
            setProduct(val){    //选择产品
                this.editForm.a00202 = this.ProductList[val].a00402;
                this.editForm.a00217 = this.ProductList[val].a00401;
            },
            async GetProject(){         //获取项目信息
                const result = await GetAllProject();
                if(result.status == 0){
                    this.ProjectList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取项目列表失败,请重试'});
                }
            },
            setProject(val){       //选择项目
                this.editForm.a00212 = this.ProjectList[val].a00302;
                this.editForm.a00218 = this.ProjectList[val].a00301;
            },
            resetAddress(){
                this.addShow = true;
                this.editAddress = { province:'',city:'',district:''};
                $('#editaddress').distpicker('destroy');
                $('#editaddress').distpicker();
                
            },
            SetProvince(){
                 this.editAddress.city = ""; this.editAddress.district="";
                 this.editForm.a00214 = this.editAddress.province + this.editAddress.city + this.editAddress.district; 
            },
            SetCity(){
                this.editAddress.district = "";
                this.editForm.a00214 = this.editAddress.province + this.editAddress.city + this.editAddress.district; 
            },
            SetDistrict(){
                this.editForm.a00214 = this.editAddress.province + this.editAddress.city + this.editAddress.district; 
            },
            finishEdit(formName){      //编辑设备信息
                this.$refs[formName].validate((valid) => {
                     if(valid){
                         this.editDev();
                     }
                })
            },
            async editDev(){    //修改设备
                var data = this.editForm;
                data.a00204 = this.ArraytoStr(data.a00204);
                const result = await EditDevice(data);
                if(result.status == 0){
                    this.$notify({title:'成功',message:result.msg,type:'success'});
                    this.getUnEdit();
                }else{
                    this.$notify({title:'失败',message:result.msg,type:'error'});
                }
            },
            /***********************util*****************************/
            copyData(row,index){
                this.editForm = {
                    a00201:row.a00201,a00202:row.a00202,a00203:row.a00203,a00204:row.a00204,
                    a00205:row.a00205,a00206:row.a00206,a00207:row.a00207,a00208:row.a00208,
                    a00209:row.a00209,a00210:row.a00210,a00211:row.a00211,a00212:row.a00212,
                    a00213:row.a00213,a00214:row.a00214,a00215:row.a00215,a00216:row.a00216,
                    a00217:row.a00217,a00218:row.a00218
                };
                this.editIndex = index;
            },
            toArray(str){       //坐标数据处理
                var arr = [];
                if(str && str.length >0 && (str.indexOf(','))>-1 ){
                    arr = str.split(',');
                }
                return arr;
            },
            ArraytoStr(p){   //坐标数据处理
                if(p.length > 0){
                    return p[0] + ',' +p[1];
                }else{
                    return "";
                }
            },
            exChangeStatus(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return '离线';break;
                    case '1':  return '在线'; break;
                    default: return '未知';
                }
            },
        },
        watch:{
            search:{
                handler(val){
                    var that = this;
                    var oldVal = { a00211:val.a00211,currentPage:val.currentPage};
                    (function(old){
                        setTimeout(()=>{
                            if(JSON.stringify(val) == JSON.stringify(old)){
                                that.changeSearch();
                            }
                        },500)
                    }(oldVal))
                },
                deep:true
            }
        }
    }


</script>

<style scoped>
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .left{ float: left;  padding:0 15px; background: #2ABB9C; color: #fff; margin: 0; height: 60px; line-height: 60px;cursor: pointer;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}
    .dialogP{margin: 0;}
    #editaddress select{ height: 28px; outline: none; border-radius: 5px; border-color: #dcdfe6; padding: 0 10px;}
</style>