<template>
    <!--设备管理-->
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
            <!---->
            <div class="head">
                <h4 class="left" :class="Active? 'active':''" @click="Active=true">
                    故障设备<span v-if="count > 0">({{count}})</span>
                </h4>
                <h4 class="left" :class="Active? '':'active'" @click="Active=false;">
                    故障分布图
                </h4>
                <div class="right" style="margin-right: 20px">
                        <el-badge :value="devCount" class="item">
                            <!---->    
                            <el-button style="background: #16B398;color: #fff;" icon="el-icon-plus" size="mini" @click="errOrderShow = true">添加工单</el-button>
                        </el-badge>
                </div>
                <div class="clearbotn"></div>
            </div>
            <!--hover弹出工单-->
            <el-dialog  :visible.sync="errOrderShow" title="添加工单 — 故障设备列表"  width="700" >
                 <el-table :data="ErrDev" size="mini" max-height="300">
                    <el-table-column  property="a00211" label="设备IMEI" width="150"></el-table-column>
                    <el-table-column  property="a00215" label="设备名称" width="150"></el-table-column>
                    <el-table-column  property="a00202" label="产品类别" width="150"></el-table-column>
                    <el-table-column  property="a00203" label="小区名称" width="150"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="removeOrder(scope.row,scope.$index)">移除</el-button>      
                        </template>
                    </el-table-column>
                </el-table>
                <div stlye="text-align:center;">
                         <el-button style="margin-top:10px;background: #16B398;color: #fff;" size="mini" @click="JumpToOrder()">发布工单</el-button>
                </div>
            </el-dialog>
            <!---->
            <!--条件筛选-->
            <el-row class="search_head" style="padding: 6px 0 0 15px;">       
                <selectAddress :address="address" @SetAddress="setAddress"></selectAddress>
            </el-row>
            <el-row class="search_head">
                <el-col :span="5" class="search_item">
                    <el-row style="height: 28px;">
                        <el-col :span="8" class="search_tip">项目</el-col>
                        <el-col :span="16">
                            <el-select v-model="search.a00212" size="mini" @focus="GetProject" clearable filterable placeholder="请选择">
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
                            <el-select v-model="search.a00202" size="mini" @focus="GetProductlist"  clearable filterable placeholder="请选择">
                                <el-option  v-for="item in ProductList" :key="item.a00401"
                                     :label="item.a00402":value="item.a00402">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="5" class="search_item">
                    <el-row>
                        <el-col :span="8" class="search_tip">设备IMEI</el-col>
                        <el-col :span="16">
                            <el-input placeholder="设备IMEI" prefix-icon="el-icon-search"  clearable
                                size="mini" v-model="search.a00211">
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4" class="search_item">
                        <el-button type="primary" size="mini" @click="changeSearch" style="margin-left: 10px;">查询</el-button>
                </el-col>
            </el-row>
            <!---->

            <!---->
            <div class="table_container" v-if="Active">
                  <el-table ref="multipleTable"  :row-key="row => row.a00201" v-loading="loading"  :data="tableData"
                    size="small"  style="width: 100%;min-height: 490px;" @selection-change="batchSelect">
                    <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="table-expand">
                            <el-form-item label="设备IMEI:"><span>{{ props.row.a00211 }}</span></el-form-item>
                            <el-form-item label="设备名称:"><span>{{ props.row.a00215 }}</span></el-form-item>
                            <el-form-item label="产品类别:"><span>{{ props.row.a00202 }}</span></el-form-item>
                            <el-form-item label="小区名称:"><span>{{ props.row.a00203 }}</span></el-form-item>
                            <el-form-item label="在线状态:"><span :class="setColor(props.row.a00205)">{{ exChangeStatus(props.row.a00205) }}</span></el-form-item>
                            <el-form-item label="故障状态:">
                                <span v-if="props.row.a00206 == '0'">正常</span>
                                <span v-if="props.row.a00206 == '1'" style="color: #F78989">故障</span>
                            </el-form-item>
                            <el-form-item label="故障信息:"><span>{{ props.row.a00207 }}</span></el-form-item>
                            <el-form-item label="售后帐号:"><span>{{ props.row.a00208 }}</span></el-form-item>
                            <el-form-item label="物业帐号:"><span>{{ props.row.a00209 }}</span></el-form-item>
                            <el-form-item label="GPS 地址:">
                                <a v-if="props.row.a00204.length > 0" class="location" @click="setLocation(props.row)">定位</a>
                                <span v-else>无法定位</span>
                            </el-form-item>
                        </el-form>
                    </template>
                    </el-table-column>
                    <el-table-column label="设备IMEI" prop="a00211"></el-table-column>
                    <el-table-column label="设备名称" prop="a00215"></el-table-column>
                    <el-table-column label="产品类别" prop="a00202"></el-table-column>
                    <el-table-column label="所属小区" prop="a00203"></el-table-column>
                    <!--<el-table-column label="在线状态">
                        <template slot-scope="scope">
                            <span :class="setColor(scope.row.a00205)">{{exChangeStatus(scope.row.a00205)}}</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="地图定位">
                        <template slot-scope="scope">
                            <a v-if="scope.row.a00204.length > 0" class="location" @click="setLocation(scope.row)">定位</a>
                            <span v-else>无法定位</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="故障状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.a00206 == '1'" style="color: #F78989">故障</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="故障信息">
                        <template slot-scope="scope">
                            <el-button @click="ShowErrMsg(scope.row.a00207)" size="mini" type="text">查看故障信息</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="openDialog(scope.row,scope.$index)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
            <!--故障信息窗口-->
            <el-dialog title="故障信息" :visible.sync="errMsgShow">
                <p>{{errMsg}}</p>
            </el-dialog>

            <!--编辑窗口-->
            <el-dialog title="" :visible.sync="dialogShow" top="8vh">
                <el-tabs  tab-position="left" style="min-height: 200px;">
                    <el-tab-pane label="设备信息" >
                        <!---->
                        <el-form size="small" :model="editForm" label-width="100px" label-position="center">
                            <el-row>
                            <el-col :span="12">
                                <el-form-item label="设备IMEI">
                                    <p class="dialogP">{{editForm.a00211}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设备名称">
                                    <p class="dialogP">{{editForm.a00215}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属项目">
                                    <p class="dialogP">{{editForm.a00212?editForm.a00212:"—————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="产品类别">
                                    <p class="dialogP">{{editForm.a00202?editForm.a00202:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="详细地址">
                                    <p class="dialogP">{{editForm.a00214?editForm.a00214:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属小区">
                                    <p class="dialogP">{{editForm.a00203?editForm.a00203:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="上线时间">
                                    <p class="dialogP">{{editForm.a00213?editForm.a00213:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="在线状态">
                                    <p class="dialogP" v-if="editForm.a00205=='0'">离线</p>
                                    <p class="dialogP" v-if="editForm.a00205=='1'">在线</p>
                                    <p class="dialogP" v-if="!editForm.a00205">————</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="故障状态">
                                    <p class="dialogP" v-if="editForm.a00206=='0'">正常</p>
                                    <p class="dialogP" v-if="editForm.a00206=='1'">故障</p>
                                    <p class="dialogP" v-if="!editForm.a00206">————</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="故障信息">
                                    <el-button @click="ShowErrMsg(editForm.a00207)" type="text">查看故障信息</el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="售后帐号">
                                    <p class="dialogP">{{editForm.a00208?editForm.a00208:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="物业帐号">
                                    <p class="dialogP">{{editForm.a00209?editForm.a00209:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="GPS经度">
                                    <p class="dialogP">{{editForm.a00204[0]?editForm.a00204[0]:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="GPS纬度">
                                    <p class="dialogP">{{editForm.a00204[1]?editForm.a00204[1]:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="固件版本">
                                    <p class="dialogP">{{editForm.a00216?editForm.a00216:"————"}}</p>
                                </el-form-item>
                            </el-col>
                            </el-row>
                        </el-form>
                        <!---->
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogShow = false">返 回</el-button>
                </div>
            </el-dialog>
            <!--故障分布图 Map-->
            <div v-if="!Active">
                <Map :mapData="tableData" :mapJudge="search" type="1" :locationDev="locationDev"></Map>
            </div>
            <!---->
        </el-col>
    </el-row>
</template>

<script>
    import Map from '@/components/map'
    import SelectAddress from '@/components/selectAddress'
    import { mapMutations } from 'vuex'
    import { SearchDevice,getAllProduct,GetAllProject,getStreet } from '@/interface/getData'

    export default {
        name:'ErrDevice',
        data(){
            return{
                tableData:[],
                search:{ //搜索关键词
                    a00202:'',a00203:'',a00206:'1',a00211:'',a00212:'',a00214:'',
                }, 
                errOrderShow:false,
                devCount:0,   //工单中的故障设备数 
                ErrDev:[],    //工单中的故障设备 
                dialogShow:false,
                editIndex:null, 
                editForm:{
                    a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                    a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:''
                },
                loading:false,   //加载过渡效果
                currentPage:1,   //当前页
                count:0,        //总数
                pageSize:10,    //每页显示的数目
                power:true,    //设备灯 开关
                light:50,       //设备灯 亮度
                errMsgShow:false,
                errMsg:'暂无故障信息',
                address:{ province:'',city:'',district:''},
                ProductList:null,          //产品列表数据
                ProjectList:null,         //项目列表数据 
                //******地图*******
                Active:true,
                locationDev:null
            }
        },
        mounted(){
             this.searchDev();   //数据初始化
        },
        methods:{
            ...mapMutations(['saveErrDev']),
            handleCurrentChange(val){
                this.currentPage = val;
                this.searchDev();
            },
            /*********************批量****************************/
            batchSelect(val){
                this.ErrDev = val;
                this.devCount = this.ErrDev.length;
            },
            /**************************获取数据******************************/
            setAddress(val){       //设置地址信息
                this.search.a00214 = val.province + val.city + val.district;
            },
            changeSearch(){
                this.currentPage = 1;
                this.locationDev = null;
                this.searchDev();
            },
            async searchDev(){        //查询设备 （故障）
                this.loading = true;
                this.search.currentPage = this.currentPage;
                const result = await SearchDevice(this.search);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    result.data.items.map((item,index)=>{   //前端处理后端坐标数据
                        item.a00204 = this.toArray(item.a00204);   
                    })
                    this.tableData = result.data.items;
                    this.loading = false;
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败'});
                    this.loading = false;
                }
                
            },
            openDialog(row,index){  //打开编辑窗口
                this.editForm = {
                    a00201:row.a00201,a00202:row.a00202,a00203:row.a00203,a00204:row.a00204,
                    a00205:row.a00205,a00206:row.a00206,a00207:row.a00207,a00208:row.a00208,
                    a00209:row.a00209,a00210:row.a00210,a00211:row.a00211,a00212:row.a00212,
                    a00213:row.a00213,a00214:row.a00214,a00215:row.a00215,a00216:row.a00216,
                    a00217:row.a00217,a00218:row.a00218
                };
                this.editIndex = index;
                this.dialogShow = true;
            },
            ShowErrMsg(text){       //打开故障信息窗口
                if(text && text!=''){
                    this.errMsg = text;
                }
                this.errMsgShow = true
            },
            setLocation(row){  //故障设备定位
                this.locationDev = row;
                this.Active = false;
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
            async GetProductlist(){     //获取产品信息
                if(this.ProductList) return;
                const result = await getAllProduct();
                if(result.status == 0){
                    this.ProductList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取产品列表失败,请重试'});
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
            /****************************工单操作***********************************/
            removeOrder(row,index){
                this.ErrDev.splice(index,1);
                this.devCount = this.ErrDev.length;
            },
            JumpToOrder(){      //路由跳转至工单发布页面
                this.saveErrDev(this.ErrDev);
                this.$router.push('orderadd'); 
            },
            /**********************util******************************/
            toArray(str){   //数据处理
                var arr = [];
                if(str && str.length > 0){ arr = str.split(','); }
                return arr;
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
        },
        watch:{
            // search:{
            //     handler(val){
            //         var that = this;            //搜索优化
            //         var oldval = {
            //             a00202:val.a00202,a00203:val.a00203,a00206:val.a00206,a00211:val.a00211,
            //             a00212:val.a00212,a00214:val.a00214,currentPage:val.currentPage,
            //         };
            //         (function(old){
            //             setTimeout(()=>{
            //                 if(JSON.stringify(val) == JSON.stringify(old)){
            //                     that.changeSearch();
            //                 }
            //             },500)
            //         }(oldval))
            //         this.locationDev = null;
            //     },  
            //     deep:true
            // }
        },
        components:{
            Map,
            SelectAddress
        }
    }


</script>

<style lang="less" scoped> 
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .search_head{ height: 46px; background:#fff;border-bottom: 1px solid #eee; }
    .search_item {  padding: 8px 0;}
    .search_tip{ height: 28px;line-height: 28px;color: #808080;font-size: 14px; text-align: center;}
    .left{ float: left;  padding:0 15px; background: #999; color: #fff; margin: 0; height: 60px; line-height: 60px; cursor: pointer;}
    .left.active{ background: #2ABB9C;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}
    .color1{ color: #F78989;}
    .color2{ color: #13ce66;}
    .table_container{ border: 1px solid #f8f8f8; background: #fff;}
    .table-expand .el-form-item { margin-right: 0;margin-bottom: 0; width: 49%;}
    .edit_input{ width: 90%;}
    .dialogP{ margin: 0;color:#808080;border-bottom: 1px solid #eee; padding-left: 15px;}
    .location{color:#2FB1BE;cursor: pointer;text-decoration: underline; }
</style>
