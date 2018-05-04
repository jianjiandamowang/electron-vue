<template>
    <!--设备管理-->
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
            <!--头部-->
            <div class="head">
                <h4 class="left" :class="Active? 'active':''" @click="Active=true">
                    设备列表<span v-if="count">({{count}})</span>
                </h4>
                <h4 class="left" :class="Active? '':'active'" @click="Active=false;">
                    设备分布图
                </h4>
                <div class="right" style="margin-right: 20px">
                    <el-tooltip class="item" effect="dark" content="添加设备" placement="top">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="$router.push('adddevice')">添加设备</el-button>
                    </el-tooltip>
                </div>
                <!--批量操作-->
                <div class="right" style="margin-right: 20px">
                    <el-badge :value="batchCount">
                        <el-button type="warning" icon="el-icon-edit-outline" size="mini" @click="batchShow = true">批量操作</el-button>
                    </el-badge>
                </div>
                <div class="right" style="margin-right: 20px">
                    <el-tooltip class="item" effect="dark" content="刷新当前数据" placement="top">
                        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="OnInit"></el-button>
                    </el-tooltip>
                </div>
                <div class="clearbotn"></div>
            </div>

            <!--批量控制 hover 弹出层 -->
            <el-dialog :visible.sync="batchShow" title="批量控制"  width="800" trigger="hover">
                <el-table :data="batchData" size="mini" max-height="300">
                    <el-table-column  property="a00211" label="设备IMEI"></el-table-column>
                    <el-table-column  property="a00215" label="设备名称"></el-table-column>
                    <el-table-column  property="a00202" label="产品类型"></el-table-column>
                    <el-table-column  property="a00203" label="小区名称"></el-table-column>
                    <el-table-column  label="移除">
                        <template slot-scope="scope">
                             <el-button size="mini" type="danger" @click="removeBatch(scope.$index)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if="batchCtlShow">
                    <!--开关-->
                    <p>
                        <span style="padding-left: 15px;">开关</span>
                        <el-switch v-model="power" @change="BathOnOff" active-value="1"  inactive-value="0" style="padding-left: 15px;" :disabled="controlDisabled"></el-switch>
                    </p>
                    <!--紫灯-->
                    <p style="height: 30px">
                        <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">紫灯亮度</span>
                        <el-slider v-model="PurpleLight" @change="BatchPurpleLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                    </p>
                    <!--白灯-->
                    <p style="height: 30px">
                        <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">白灯亮度</span>
                        <el-slider v-model="WhiteLight" @change="BatchWhiteLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                    </p>
                    <!--彩灯-->
                    <p  style="height: 30px">
                        <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">彩灯亮度</span>
                        <el-slider v-model="ColorLight" @change="BatchColorLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                    </p>
                </div>
                <div stlye="text-align:center;">
                    <el-button style="margin-top:10px;" type="primary" size="mini" @click="batchCtlShow = !batchCtlShow">控制界面</el-button>
                    <el-button style="margin-top:10px;" type="danger" size="mini" @click="removeAll">全部移除</el-button>
                </div>
            </el-dialog>
            <!---->
            <!--条件筛选-->
            <el-row class="search_head" style="padding: 6px 0 0 15px;">
                <selectAddress :address="address" @SetAddress="setAddress"></selectAddress>
            </el-row>

            <el-row  class="search_head" style="border-bottom: 1px solid #eee;">
                <el-col :span="5" class="search_item">
                    <el-row style="height: 28px;">
                        <el-col :span="8" class="search_tip">项目</el-col>
                        <el-col :span="16">
                            <!--<el-input placeholder="项目名称" prefix-icon="el-icon-search" 
                                size="mini" v-model="search.a00212">
                            </el-input>-->
                            <el-select v-model="search.a00212" size="mini" @focus="GetProject" :clearable="true" filterable placeholder="请选择">
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
                            <!--<el-input placeholder="产品类别" prefix-icon="el-icon-search" 
                                size="mini" v-model="search.a00202">
                            </el-input>-->
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
                            <el-input placeholder="设备IMEI" prefix-icon="el-icon-search" clearable
                                size="mini" v-model="search.a00211">
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4" class="search_item">
                        <el-button type="primary" size="mini" @click="searchDev" style="margin-left: 10px;">查询</el-button>
                </el-col>
            </el-row>
            <!---->

            <!--设备列表-->
            <div class="table_container" v-if="Active">
                  <el-table :data="tableData" ref="DevTable" :row-key="row => row.a00201" v-loading='loading || socketloading' size="small" 
                    :row-class-name="tableRowClassName" style="width: 100%;min-height: 490px;" @selection-change="batchSelect">
                    <el-table-column type="selection" :selectable="check" :reserve-selection="true"></el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="table-expand">
                                <el-form-item label="设备IMEI:"><span>{{ props.row.a00201 }}</span></el-form-item>
                                <el-form-item label="设备名称:"><span>{{ props.row.a00215 }}</span></el-form-item>
                                <el-form-item label="产品类别:"><span>{{ props.row.a00202 }}</span></el-form-item>
                                <el-form-item label="所属项目:"><span>{{ props.row.a00212 }}</span></el-form-item>
                                <el-form-item label="地址信息:"><span>{{ props.row.a00214 }}</span></el-form-item>
                                <el-form-item label="小区名称:"><span>{{ props.row.a00203 }}</span></el-form-item>
                                <el-form-item label="在线状态:"><span :class="setColor(props.row.a00205)">{{ exChangeStatus(props.row.a00205) }}</span></el-form-item>
                                <el-form-item label="故障状态:">
                                    <span v-if="props.row.a00206 == '0'">正常</span>
                                    <span v-if="props.row.a00206 == '1'" style="color: #F78989">故障</span>
                                </el-form-item>
                                <el-form-item label="故障信息:"><span>{{ props.row.a00207 }}</span></el-form-item>
                                <el-form-item label="售后帐号:"><span>{{ props.row.a00208 }}</span></el-form-item>
                                <el-form-item label="物业帐号:"><span>{{ props.row.a00209 }}</span></el-form-item>
                                <el-form-item label="特定设备信息:"><el-button type="text" @click="seeSpecial(props.row,props.$index)">查看</el-button></el-form-item>
                                <el-form-item label="GPS 地址:">
                                        <a v-if="props.row.a00204.length > 0" class="location" @click="setLocation(props.row)">定位</a>
                                        <span v-else>无法定位</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <!--<el-table-column type="selection" width="55"></el-table-column>-->
                    <el-table-column label="设备IMEI" prop="a00211"></el-table-column>
                    <el-table-column label="设备名称" prop="a00215"></el-table-column>
                    <el-table-column label="产品类别" prop="a00202"></el-table-column>
                    <el-table-column label="小区名称" prop="a00203"></el-table-column>
                    <el-table-column label="地图定位">
                        <template slot-scope="scope">
                            <a v-if="scope.row.a00204.length > 0" class="location" @click="setLocation(scope.row)">定位</a>
                            <span v-else>无法定位</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="在线状态">
                        <template slot-scope="scope">
                            <span :class="setColor(scope.row.a00205)">{{exChangeStatus(scope.row.a00205)}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="管控(开关)">
                        <template slot-scope="scope">
                            <span v-if="scope.row.a00205 == '0'">无法控制</span>
                            <el-switch v-else v-model="scope.row.a00205"  active-value="1"  inactive-value="2"></el-switch>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="操作"   width="240">
                        <template slot-scope="scope">
                            <el-button v-if="Permision.DevVisible" type="primary" size="mini" @click="openDialog(scope.row,scope.$index)">编辑</el-button>
                            <el-button type="primary" size="mini" @click="openControl(scope.row,scope.$index)">控制</el-button>
                            <el-button v-if="Permision.delDev" @click="deleteDev(scope.row,scope.$index)" type="danger" size="mini">删除</el-button>
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
            <!--编辑窗口-->
            <el-dialog title=""  :visible.sync="dialogShow" top="8vh" @close="flashData">
                <el-tabs v-model="editTab"  tab-position="left" style="min-height: 200px;" @tab-click="tabChange">
                    <el-tab-pane label="编辑信息" name="msgtab" v-if="Permision.DevVisible">
                        <!--设备信息编辑窗口-->
                        <el-form size="mini" :model="editForm" label-width="100px" label-position="left">
                            <el-form-item label="设备IMEI">
                                <p class="dialogP">{{editForm.a00211}}</p>
                            </el-form-item>
                            <el-form-item label="设备名称">
                                <el-input v-model="editForm.a00215" class="edit_input"></el-input>
                            </el-form-item>
                            <el-form-item label="所属项目">
                                <el-select v-model="editForm.a00212" @focus="GetProject" @change="setProject" filterable placeholder="请选择">
                                    <el-option  v-for="(item,index) in ProjectList" :key="item.a00301"
                                     :label="item.a00302":value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产品类别">
                                <!--<el-input v-model="editForm.a00202" class="edit_input"></el-input>-->
                                <el-select v-model="editForm.a00202" @focus="GetProductlist" @change="setProduct" filterable placeholder="请选择">
                                    <el-option  v-for="(item,index) in ProductList" :key="item.a00401"
                                     :label="item.a00402":value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="地址信息">
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
                            <el-form-item label="小区名称">
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
                                    <el-radio-group v-model="editForm.a00206">
                                        <el-radio-button label="0">正常</el-radio-button>
                                        <el-radio-button label="1">故障</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            </el-row>
                            <el-form-item label="故障信息">
                                <!--<p class="dialogP">{{editForm.a00207?editForm.a00207:"暂无"}}</p>-->
                                <el-input v-model="editForm.a00207" class="edit_input"></el-input>
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
                               <el-button v-if="Permision.editDev" type="primary" @click="editDev">确 定 修 改</el-button>
                            </el-form-item>
                        </el-form>
                        <!---->
                    </el-tab-pane>
                    <!--设备管控-->
                    <el-tab-pane label="设备管控" name="controltab">
                        <div v-if="editForm.a00210" v-loading="controlDisabled">
                            <!--开关-->
                            <p v-if="editForm.a00210.valueLED_STATE!=null">
                                <span style="padding-left: 15px;">灯开关</span>
                                <el-switch v-model="editForm.a00210.valueLED_STATE" @change="OnOff" active-value="1"  inactive-value="0" style="padding-left: 15px;" :disabled="controlDisabled"></el-switch>
                            </p>
                            <!--彩虹灯选择-->
                            <P v-if="editForm.a00210.valueDISPLAY_TYPE!=null">
                                <span style="padding-left: 15px;">彩灯样式</span> 
                                <!--<el-radio-group v-model="editForm.a00210.valueDISPLAY_TYPE" @change="ChnageDisplayType"  size="mini">
                                    <el-radio-button :label="0">七彩渐变</el-radio-button>
                                    <el-radio-button :label="1">七彩轮转</el-radio-button>
                                    <el-radio-button :label="2">白灯</el-radio-button>
                                    <el-radio-button :label="3">暖白</el-radio-button>
                                </el-radio-group>-->
                                <el-select v-model="editForm.a00210.valueDISPLAY_TYPE" placeholder="请选择" size="mini" @change="ChnageDisplayType">
                                    <el-option v-for="item in ColorType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </P>
                            <!--紫灯-->
                            <p v-if="editForm.a00210.valuePURPLE_PWM!=null" style="height: 40px">
                                <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">紫灯亮度</span>
                                <el-slider v-model="editForm.a00210.valuePURPLE_PWM" @change="adjustPurpleLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                            </p>
                            <!--白灯-->
                            <p v-if="editForm.a00210.valueWHITE_PWM!=null" style="height: 40px">
                                <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">白灯亮度</span>
                                <el-slider v-model="editForm.a00210.valueWHITE_PWM" @change="adjustWhiteLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                            </p>
                            <!--彩灯-->
                            <p v-if="editForm.a00210.valueCOLOR_PWM!=null" style="height: 40px">
                                <span style="padding-left: 15px;display: block;line-height: 40px;height: 40px;float:left;">彩灯亮度</span>
                                <el-slider v-model="editForm.a00210.valueCOLOR_PWM" @change="adjustColorLight" style="width: 60%; float: left; padding-left: 15px;" :disabled="controlDisabled"></el-slider>
                            </p>
                        </div>
                        <p>
                            <el-button type="success" @click="DevReStart" icon="el-icon-refresh">重启设备</el-button>
                        </p>
                    </el-tab-pane>
                    <!--特定属性-->
                    <el-tab-pane label="特定属性" name="specialtab" v-if="Permision.DevVisible">
                        <DevSpecial :special="editForm.a00210"></DevSpecial>
                    </el-tab-pane>
                    <el-tab-pane label="电压变化" name="Battery" v-if="Permision.DevVisible">
                        <div v-if="BatteryShow">
                            <h4>电压变化趋势(近三十天)</h4>
                            <Tendency4  :imei="editForm.a00211"></Tendency4>
                        </div>
                    </el-tab-pane>
                    <!--数据透传-->
                    <el-tab-pane label="数据透传" name="DataTab" v-if="Permision.DevVisible">
                        <p>数据透传：</p>
                        <p>
                            <el-input v-model="passImei" size="small">
                                 <template slot="prepend">设备IMEI</template>
                            </el-input>
                        </p>
                        <p>
                            <el-input v-model="passData" size="small">
                                <template slot="prepend">命令</template>
                                <el-button slot="append" type="primary" @click="dataPass">发送数据</el-button>
                            </el-input>
                        </p>
                        <p>发送的命令：</p>
                        <p>{{command}}</p>
                        <p>接收到的数据：</p>
                        <p>{{passResult}}</p>
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="dialogShow = false">返 回</el-button>
                </div>
            </el-dialog>
            <!--设备分布图 Map-->
            <div v-if="!Active">
                <Map :mapData="tableData" :mapJudge="search" type="0" :locationDev="locationDev"></Map>
            </div>
            <!---->
        </el-col>
    </el-row>
</template>

<style>
    .el-table .warning-row {
    background-color: #FDE8E3;
  }
</style>

<script>
    import { mapState,mapMutations } from 'vuex';
    import { socketUrl } from '@/util/env';
    import Map from '@/components/map';
    import DevSpecial from '@/components/devspecial';
    import selectAddress from '@/components/selectAddress';
    import Tendency4 from '@/components/tendency4';
    import { SearchDevice,AccountList,getAllProduct,GetAllProject,EditDevice,DelDevice,DataPass,DevBatchControl,getStreet } from '@/interface/getData'

    export default {
        name:'DeviceList',
        data(){
            return{
                /*******************设备表格**********************/
                tableData:[],       //表单显示数据
                search:{ //搜索关键词
                    a00202:'',a00203:'',a00206:'',a00211:'',a00212:'',a00214:''
                }, 
                currentPage:1,       //当前页码
                pageSize:10,         //每页显示的数目
                count:null,          //数据总数量
                loading:false,       //数据加载 过渡动画
                socketloading:false,
                address:{province:'',city:'',district:''},         
                locationDev:null,
                /*****************编辑窗口******************/
                dialogShow:false,    //编辑窗口显示
                editIndex:null,      //当前编辑选中的索引
                editData:{  //当前编辑选中的数据
                    a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                    a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:''
                },         
                Active:true,         //MAP与列表切换
                editForm:{              //编辑窗口数据
                    a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                    a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:'',
                },
                light:50,       //设备灯 亮度
                ColorType:[{value:'0',label:'无'},{value:'1',label:'渐变'},{value:'2',label:'七彩'},{value:'3',label:'暖黄'},{value:'4',label:'白色'},{value:'5',label:'红色'},{value:'6',label:'橙色'}
                    ,{value:'7',label:'黄色'},{value:'8',label:'绿色'},{value:'9',label:'青色'},{value:'10',label:'蓝色'},{value:'11',label:'紫色'}
                ],
                controlDisabled:false,    //是否允许控制
                pTimer:null,
                addShow:false,
                editAddress:{province:'',city:'',district:''},  //重新编辑地址
                afterSaleList:null,        //售后帐号数据
                PropertyList:null,        //物业人员数据
                ProductList:null,          //产品列表数据
                ProjectList:null,         //项目列表数据   
                editTab:'msgtab',       
                BatteryShow:false,         //电池电压
                /**************批量控制***************/
                batchData:[],    //批量控制的 数据
                batchCount:0,    //批量控制的设备数量
                batchShow:false,
                batchCtlShow:false,  //批量控制界面
                PurpleLight:0,      //批量紫灯亮度
                WhiteLight:0,       //批量白灯亮度
                ColorLight:0,       //批量彩灯亮度
                power:0,            //批量开关
                /***************数据透传*******************/
                websocket:null,
                command:'',
                passResult:'无数据',
                passImei:'',
                passData:'',
            }
        },
        mounted(){
            this.OnInitWebsocket();   //连接socket
            this.OnInit();  //数据初始化  获取所有设备
        },
        methods:{
            ...mapMutations(['setWebSocket']),
            tableRowClassName({row, rowIndex}){  //故障高亮
                if(row.a00206 == '1'){ return 'warning-row'  }
                return ''
            },
            handleSizeChange(val) {},
            handleCurrentChange(val) { this.currentPage = val; this.OnInit(); },    //翻页
            /**************************获取数据*************************/
            setAddress(val){       //设置地址信息
                this.search.a00214 = val.province + val.city + val.district;
            },
            searchDev(){ this.currentPage = 1; this.locationDev = null;  this.OnInit();  },//查询设备
            async OnInit(){ //数据初始化 
                var that = this;   this.loading = true;
                this.search.currentPage = this.currentPage;
                const result = await SearchDevice(this.search);
                console.log(result);
                if(result.status == 0){
                    this.count = result.data.totalNum;
                    result.data.items.map((item,index)=>{   //前端处理后端数据
                        item.a00204 = that.toArray(item.a00204);  //处理坐标
                        item.a00210 = that.parseProperty(item.a00210);   //解析特殊属性
                        this.setLightValue(item.a00210);
                    })
                    this.tableData = result.data.items;
                    this.loading = false;
                }else{
                    this.$notify.error({title: '错误',message: '获取数据失败,请重试'});
                    this.loading = false;
                }
            },
            async GetAfterSaleAccount(){   //获取售后账户列表
                if(this.afterSaleList) return;
                const result = await AccountList({a00105:'2'});
                if(result.status == 0){
                    this.afterSaleList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取售后人员列表失败,请重试'});
                }
            },
            async GetPropertyAccount(){     //获取物业账户列表
                if(this.PropertyList) return;
                const result = await AccountList({a00105:'3'});
                if(result.status == 0){
                    this.PropertyList = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取物业人员列表失败,请重试'});
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
            setProduct(val){    //选择产品
                this.editForm.a00202 = this.ProductList[val].a00402;
                this.editForm.a00217 = this.ProductList[val].a00401;
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
            setProject(val){       //选择项目
                this.editForm.a00212 = this.ProjectList[val].a00302;
                this.editForm.a00218 = this.ProjectList[val].a00301;
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
            /*************************编辑信息***********************/
            openControl(row,index){     //控制窗口
                this.copyData(row,index);
                this.dialogShow = true;  
                this.editTab = 'controltab';
            },
            seeSpecial(row,index){
                this.copyData(row,index);
                this.dialogShow = true;
                this.editTab = 'specialtab';
            },
            openDialog(row,index){  //打开编辑窗口
                this.copyData(row,index);
                this.editTab = 'msgtab';
                this.dialogShow = true;
            },
            tabChange(val){  //监听 tab切换
                if(val.name == 'Battery'){
                    this.BatteryShow = true;
                }
            },
            flashData(){       //关闭窗口时 刷新数据
                this.BatteryShow = false;
                this.OnInit();
            },
            async editDev(){    //修改设备信息
                var data = this.editForm;
                if(data.a00204.length　> 0){ data.a00204 = data.a00204[0] + ',' + data.a00204[1]; }
                else{ data.a00204 = "" }  
                const result = await EditDevice({
                    a00201:data.a00201,a00202:data.a00202,a00203:data.a00203,a00204:data.a00204,a00205:data.a00205,a00206:data.a00206,a00207:data.a00207,
                    a00208:data.a00208,a00209:data.a00209,a00211:data.a00211,a00212:data.a00212,a00214:data.a00214,a00215:data.a00215,a00216:'',
                    a00217:data.a00217,a00218:data.a00218
                });
                if(result.status == 0){
                     this.$notify({title:'成功',message:result.msg,type:'success'});
                     data.a00204 = this.toArray(data.a00204);
                    //  this.tableData.splice(this.editIndex,1,data);
                }else{
                    this.$notify({title:'失败',message:result.msg,type:'error'});
                }
            },
            async deleteDev(row,index){  //删除设备
                this.$confirm('此操作将删除该设备, 是否继续?', '提示', {
                    confirmButtonText: '确定', cancelButtonText: '取消',type: 'warning'
                }).then(async () => {
                    const result = await DelDevice({a00201:row.a00201});
                    if(result.status == 0){  //删除成功
                        this.$notify({ title: '成功',message: '已成功删除该设备',type: 'success'});
                        this.tableData.splice(index,1); 
                    }else{   //删除失败
                        this.$notify.error({ title: '错误',message: result.msg});
                    }
                }).catch(() => {
                    this.$notify.info({ title: '消息',message: '已取消删除该设备'});        
                });
            },
            setLocation(row){  //设备定位
                this.locationDev = row;
                this.Active = false;
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
            /*******************批量操作*************************/
            batchSelect(val){
                this.batchData = val;
                this.batchCount = this.batchData.length;
            },
            check(row,index){   //离线设备无法管控()
                if(!row.a00205 || row.a00205 == '0'){
                    return false;    
                }else{
                    return true;
                }
                // return true;
            },
            removeBatch(index){      //从批量列表中移除
                this.batchData.splice(index,1); this.batchCount = this.batchData.length;
            },
            removeAll(){            //移除全部批量管理的设备
                this.batchData.splice(0,this.batchData.length); 
                this.batchCount = this.batchData.length;
            },
            async BatchPurpleLight(val){
                var batchArr = this.getImeiArray(this.batchData,'purpleLight');
                var command = "{PURPLE_PWM:"+val+''+"}";
                if(!batchArr || batchArr == ''){
                    this.$message({ message: '没有设备拥有该功能,无法执行该操作', type: 'warning' });
                    return;
                }
                const result = await DevBatchControl({imeis:batchArr,data:command});
                console.log(result);
            },
            async BatchColorLight(val){
                var batchArr = this.getImeiArray(this.batchData,'colorLight');
                var command = "{COLOR_PWM:"+val+''+"}";
                if(!batchArr || batchArr == ''){
                    this.$message({ message: '没有设备拥有该功能,无法执行该操作', type: 'warning' });
                    return;
                }
                const result = await DevBatchControl({imeis:batchArr,data:command});
                console.log(result)
            },
            async BatchWhiteLight(val){
                var batchArr = this.getImeiArray(this.batchData,'whiteLight');
                var command = "{WHITE_PWM:"+val+''+"}";
                if(!batchArr || batchArr == ''){
                    this.$message({ message: '没有设备拥有该功能,无法执行该操作', type: 'warning' });
                    return;
                }
                const result = await DevBatchControl({imeis:batchArr,data:command});
                console.log(result)
            },
            async BathOnOff(val){
                var command;
                if(val == '1'){ command = "{LED_STATE:1}";}
                else{ command = "{LED_STATE:0}";}
                var batchArr = this.getImeiArray(this.batchData,'onoff');
                console.log(batchArr);
                if(!batchArr || batchArr == ''){
                    this.$message({ message: '没有设备拥有该功能,无法执行该操作', type: 'warning' });
                    return;
                }
                const result = await DevBatchControl({imeis:batchArr,data:command});
                console.log(result)
            },
            //***********************util**********************
            exChangeStatus(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return '离线';break;
                    case '1':  return '在线'; break;
                    default: return '未知';
                }
            },
            parseProperty(str){    //解析设备特殊属性
                if(typeof(str) == 'object') return;
                if(typeof(str) == "string" && str.length>0){
                    return JSON.parse(str);
                }
            },
            async copyData(row,index){         //深度复制(改用重新申请数据)
                const result = await SearchDevice({a00202:'',a00203:'',a00206:'',a00211:row.a00211,a00212:'',a00214:'',currentPage:1});
                if(result.status == 0){
                    result.data.items.map((item,index)=>{   //前端处理后端数据
                        item.a00204 = this.toArray(item.a00204);  //处理坐标
                        item.a00210 = this.parseProperty(item.a00210);   //解析特殊属性
                        this.setLightValue(item.a00210);
                    })
                    this.editForm = result.data.items[0];
                }
                // this.editForm = Object.assign({},row);
                // for(var i in row){
                //     this.editForm[i] = row[i];
                // }
                this.editData = row;
                this.editIndex = index;
                this.openAndSend(row);   //获取设备当前状态
                this.addShow = false;
            },
            setColor(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return 'color1'; break;
                    case '1':  return 'color2'; break;
                    default: return 'color1';
                }
            },
            toArray(str){   //数据处理
                var arr = [];
                if(str && str.length > 0){ arr = str.split(','); }
                return arr;
		    },
            setLightValue(data){    //特殊属性 亮度转换为 number
                if(!data) return;
                if(data.valuePURPLE_PWM!=null)  data.valuePURPLE_PWM = data.valuePURPLE_PWM * 1;
                if(data.valueWHITE_PWM!=null)  data.valueWHITE_PWM = data.valueWHITE_PWM * 1;
                if(data.valueCOLOR_PWM!=null)  data.valueCOLOR_PWM = data.valueCOLOR_PWM * 1;
            },
            isJSON(str){      //判别str 是否为json格式
                if( typeof(str) == "string"){
                    try{
                        JSON.parse(str);
                        if(str.indexOf('{') > -1){ return true;}
                        else{return false; }
                    }catch(e){return false; }
                }
                return false;
            },
            getImeiArray(arr,judge){
                var result = [];
                if(judge == "purpleLight"){
                    arr.forEach((item) => {
                        if(item.a00210 && item.a00210!=null){
                            if(item.a00210.valuePURPLE_PWM!=null){
                                result.push(item.a00211)
                            }
                        }
                    })
                }
                if(judge == 'colorLight'){
                    arr.forEach((item) => {
                        if(item.a00210 && item.a00210!=null){
                            if(item.a00210.valueCOLOR_PWM!=null){
                                result.push(item.a00211)
                            }
                        }
                    })
                }
                if(judge == 'whiteLight'){
                    arr.forEach((item) => {
                        if(item.a00210 && item.a00210!=null){
                            if(item.a00210.valueWHITE_PWM!=null){
                                result.push(item.a00211)
                            }
                        }
                    })
                }
                if(judge == "onoff"){
                    arr.forEach((item) => {
                        if(item.a00210 && item.a00210!=null){
                            if(item.a00210.valueLED_STATE && item.a00210.valueLED_STATE!=null){
                                result.push(item.a00211)
                            }
                        }
                    })
                }
                return result.join(',');
            },
            /*******************websocket 控制设备***************************/
            OnOff(val){    //灯开关
                var command;
                if(val == "1"){
                     command = {cmd:40,imei:this.editForm.a00211,data:{"LED_STATE":1}};
                }else{
                     command = {cmd:40,imei:this.editForm.a00211,data:{"LED_STATE":0}};
                }
                this.controlDisabled = true;
                this.pTimer = setTimeout(()=>{  //五秒延迟
                    // this.editForm.a00210.valueLED_STATE = this.editData.a00210.valueLED_STATE;
                    this.controlDisabled = false;
                },5000);
                // console.log(JSON.stringify(command));
                this.websocket.send(JSON.stringify(command));
            },
            adjustPurpleLight(val){  //调节紫灯亮度
                 var command = {cmd:40,imei:this.editData.a00211,data:{"PURPLE_PWM":val+''}};
                 this.controlDisabled = true;
                 console.log(this.editForm.a00210);
                 console.log(this.editData.a00210);
                 console.log(this.tableData[this.editIndex].a00210);
                 
                 this.pTimer = setTimeout(()=>{  //五秒延迟
                     console.log('没有回应');
                    // this.editForm.a00210.valuePURPLE_PWM = this.editData.a00210.valuePURPLE_PWM;
                    this.controlDisabled = false;
                 },5000)
                 this.websocket.send(JSON.stringify(command));
            },
            adjustWhiteLight(val){       //调节白灯亮度
                console.log(val)
                var command = {cmd:40,imei:this.editData.a00211,data:{"WHITE_PWM":val+''}};
                this.controlDisabled = true;
                this.pTimer = setTimeout(()=>{  //五秒延迟
                    // this.editForm.a00210.valueWHITE_PWM = this.editData.a00210.valueWHITE_PWM;
                    this.controlDisabled = false;
                 },5000)
                 this.websocket.send(JSON.stringify(command));
            },
            adjustColorLight(val){        //调节彩灯亮度
                var command = {cmd:40,imei:this.editData.a00211,data:{"COLOR_PWM":val+''}};
                this.controlDisabled = true;
                this.pTimer = setTimeout(()=>{  //五秒延迟
                    // this.editForm.a00210.valueCOLOR_PWM = this.editData.a00210.valueCOLOR_PWM;
                    this.controlDisabled = false;
                 },5000)
                this.websocket.send(JSON.stringify(command));
            },
            ChnageDisplayType(val){     //调节彩灯类型
                var command = {cmd:40,imei:this.editData.a00211,data:{"DISPLAY_TYPE":val}};
                this.controlDisabled = true;
                this.pTimer = setTimeout(()=>{  //五秒延迟
                    // this.editForm.a00210.valueDISPLAY_TYPE = this.editData.a00210.valueDISPLAY_TYPE;
                    this.controlDisabled = false;
                 },5000)
                this.websocket.send(JSON.stringify(command));
            },
            DevReStart(){   //设备重启
                var command = { cmd:65,imei:this.editForm.a00211};
                this.websocket.send(JSON.stringify(command));
            },
            flashState(){   //发出控制收到回应后 同步状态
                this.editData.a00210 = this.editForm.a00210;
            },
            restatus(data){     //特殊属性 根据socket 实时刷新
                if(typeof(data) != 'object'){ if(this.isJSON(data)){data = JSON.parse(data);} }
                for(var i in data){
                    if(this.editForm.a00210[i] != null){
                        this.editForm.a00210[i] = data[i];
                    }
                }
            },
            devOnline(data){        //设备在线
                if(typeof(data) != 'object'){ if(this.isJSON(data)){data = JSON.parse(data);} }
                for(var i=0,l=this.tableData.length;i<l;i++){
                    if(this.tableData[i].a00211 == data.gprs_imei){
                        this.tableData[i].a00205 = '1';
                        this.tableData[i].a00206 = '0';
                        // this.$notify({title:'上线通知',message:'设备Imei:'+data.gprs_imei+'上线',type:'success'});
                    }
                }
            },
            devOutline(data){    //设备离线
                if(typeof(data) != 'object'){ if(this.isJSON(data)){data = JSON.parse(data);} }
                for(var i=0,l=this.tableData.length;i<l;i++){
                    if(this.tableData[i].a00211 == data.gprs_imei){
                        this.tableData[i].a00205 = '0';
                        this.tableData[i].a00206 = '1';
                        // this.$notify({title:'离线通知',message:'设备Imei:'+data.gprs_imei+'离线',type:'warning'});
                    }
                }
            },
            warningJump(){   //告警设备跳转
                this.$router.push('errdevice')
            },
            deviceWarning(data){  //设备告警
                if(this.Permision.DevWarning){
                    this.$notify({title:'设备告警',dangerouslyUseHTMLString: true,type:'error',onClick:this.warningJump, position: 'bottom-right',
                        message:'<small>设备Imei:'+data.a00211+'告警(点击跳转)</small>'+'<br> <small>设备类型:' +data.a00202+ '地址:' +data.a00214+data.a00203 +'</small>',    
                    });
                }    
            },
            openAndSend(dev){  //打开窗口 websocket获取设备信息
                var command = { cmd:49,imei:dev.a00211};
                this.websocket.send(JSON.stringify(command));
            },
            dataPass(){     //数据透传
            //    const result = await DataPass({imei:this.passImei,data:this.passData});
            //    var command = "{'cmd':41,'imei':'"+this.passImei+"','data':'"+this.passData+"'}";
               var command = { cmd:41,imei:this.passImei,data:this.passData};
               this.passResult = '等待回应';
               this.command = JSON.stringify(command);
               this.websocket.send(JSON.stringify(command));
            //    if(result.status == 0){
            //        this.passResult = result.msg;
            //    }
            },
            OnInitWebsocket(){
                if(this.websocket) return;  //data的websocket
                if(this.WebSocket){     //store的websocket
                    this.websocket = this.WebSocket; 
                }else{
                    this.socketloading = true;
                    this.$message({type:'warning',message:"websocket正在重连"});
                    setTimeout(()=>{
                        this.OnInitWebsocket();
                    },3000);
                }
                
                if(this.websocket){
                    this.socketloading = false;
                    // var fn = this.websocket.myMethod;  
                    // 消息接收
                    this.websocket.onmessage = message => {
                        // fn(message);
                        console.log('reciver')
                        if(this.isJSON(message.data)){
                            console.log(message.data);
                            var data = JSON.parse(message.data);
                            if(data.data && data.data.gprs_imei == this.editData.a00211){
                                this.passResult = message.data;  //透传结构显示
                            }
                            switch(data.cmd){
                                case 51:    //当前设备收到命令
                                    if(data.data && data.data.gprs_imei == this.editData.a00211){
                                        window.clearTimeout(this.pTimer);
                                        this.restatus(data.data);
                                        this.flashState();
                                        this.controlDisabled = false;
                                        return;
                                    }   
                                    break;
                                case 33:   //设备上线
                                    if(data.data){
                                        this.devOnline(data.data);
                                    }
                                    break;
                                case 34:   //设备离线
                                    if(data.data){
                                        this.devOutline(data.data);
                                    }
                                    break;
                                case 500: //设备告警
                                    if(data.device){
                                        this.deviceWarning(data.device);   
                                    }
                                    break;
                            }   
                            
                            
                        }
                    };
                }
            },
            
        },
        components:{
            Map,
            DevSpecial,
            selectAddress,
            Tendency4
        },
        computed:{
            ...mapState(['userInfo','Permision','WebSocket']),
        },
        watch:{
            // search:{
            //     handler(val){
            //         var that = this;
            //         var oldval = {
            //             a00202:val.a00202,a00203:val.a00203,a00206:val.a00206,
            //             a00211:val.a00211,a00212:val.a00212,a00214:val.a00214,
            //             currentPage:val.currentPage
            //         };
            //         (function(old){
            //             setTimeout(()=>{
            //                 if(JSON.stringify(val) == JSON.stringify(old)){
            //                     that.searchDev();
            //                 }
            //             },500)
            //         }(oldval))
            //         this.locationDev = null;
            //     },
            //     deep:true
            // },
        }
    }
</script>




<style lang="less" scoped> 
    .table_container{border: 1px solid #f8f8f8;background: #fff;}
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .search_head{ height: 46px; background:#fff; }
    .search_item {  margin: 8px 0;}
    .search_tip{ height: 28px;line-height: 28px;color: #808080;font-size: 14px; text-align: center;}
    .left{ float: left;  padding:0 15px; background: #999; color: #fff; margin: 0; height: 60px; line-height: 60px;cursor: pointer;}
    .left.active{ background: #2ABB9C;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}

    .dialogP{ margin: 0;}
    .table-expand .el-form-item { margin-right: 0;margin-bottom: 0; width: 49%;}
    .edit_input{ width: 90%;}
    .location{color:#409EFF;cursor: pointer;text-decoration: underline; }
   .color1{ color: #F78989;}
   .color2{ color: #13ce66;}
   #editaddress select{ height: 28px; outline: none; border-radius: 5px; border-color: #dcdfe6; padding: 0 10px;}
</style>
