<template>
    <!--首页故障分布图-->
    <div class="map_container">
        <el-row style="background: #fff;height: 40px; line-height: 40px;">
            <el-col :span="6">
                <h4 style="color: #333;padding-left: 15px; margin: 0;">故障分布图</h4>
            </el-col>
            <el-col :span="10">
                <SelectAddress :address="address" @SetAddress="setAddress"></SelectAddress>
            </el-col>
        </el-row>
        <div id="errMap"></div>

        <!--msgbox-->
        <transition name="el-zoom-in-top">
            <div id="msgbox" v-show="devMsgShow">
                <el-tabs type="border-card">
                    <el-tab-pane label="基本信息">
                        <p>设备IMEI： <small v-if="SelectDev">{{SelectDev.a00211}}</small></p>
                        <p>设备名称 <small v-if="SelectDev">{{SelectDev.a00215}}</small></p>
                        <p>产品名称： <small v-if="SelectDev">{{SelectDev.a00202}}</small></p>
                        <p>所属项目： <small v-if="SelectDev">{{SelectDev.a00212}}</small></p>
                        <p>省市区： <small v-if="SelectDev">{{SelectDev.a00214}}</small></p>
                        <p>所在小区： <small v-if="SelectDev">{{SelectDev.a00203}}</small></p>
                        <p>在线状态：<small v-if="SelectDev">{{SelectDev.a00205}}</small></p>
                        <p>故障状态：<small v-if="SelectDev">{{SelectDev.a00206}}</small></p>
                        <p>售后帐号：<small v-if="SelectDev">{{SelectDev.a00208}}</small></p>
                        <p>物业帐号：<small v-if="SelectDev">{{SelectDev.a00209}}</small></p>
                        <p>经度：<small v-if="SelectDev">{{SelectDev.a00204[0]}}</small></p>
                        <p>纬度：<small v-if="SelectDev">{{SelectDev.a00204[1]}}</small></p>
                    </el-tab-pane>
                    <el-tab-pane label="特殊属性">
                        <div v-if="translate(SelectDev.a00210)">
                            <p v-if="SelectDev.a00210.valueLED_STATE">开关状态: {{SelectDev.a00210.valueLED_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueLOW_VOL">低电压状态: {{SelectDev.a00210.valueLOW_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueGAR_STATE">桶满状态： {{SelectDev.a00210.valueGAR_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueRAIN_STATE">雨水传感器状态： {{SelectDev.a00210.valueRAIN_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueGATE_STATE">门开关传感器状态： {{SelectDev.a00210.valueGATE_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueDISPLAY_TYPE">彩虹灯显示样式： {{SelectDev.a00210.valueDISPLAY_TYPE}}</p>
                            <p v-if="SelectDev.a00210.valueLED_FLASH">闪烁频率： {{SelectDev.a00210.valueLED_FLASH}}</p>
                            <p v-if="SelectDev.a00210.valuePURPLE_PWM">紫灯当前亮度： {{SelectDev.a00210.valuePURPLE_PWM}}</p>
                            <p v-if="SelectDev.a00210.valueWHITE_PWM">白灯当前亮度： {{SelectDev.a00210.valueWHITE_PWM}}</p>
                            <p v-if="SelectDev.a00210.valueCOLOR_PWN">彩色灯当前亮度： {{SelectDev.a00210.valueCOLOR_PWN}}</p>
                            <p v-if="SelectDev.a00210.valueLAMP_VOL">草坪灯编号： {{SelectDev.a00210.valueLAMP_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueBAT_VOL">电池电压： {{SelectDev.a00210.valueBAT_VOL}}</p>
                            <p v-if="SelectDev.a00210.valuePV_VOL">太阳能板电压： {{SelectDev.a00210.valuePV_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueCHARGE_CURRENT">充电电流： {{SelectDev.a00210.valueCHARGE_CURRENT}}</p>
                            <p v-if="SelectDev.a00210.valueDISCHARE_CHARGE">放电电流： {{SelectDev.a00210.valueDISCHARE_CHARGE}}</p>
                            <p v-if="SelectDev.a00210.valueSUM_CURRENT">当天已充电量： {{SelectDev.a00210.valueSUM_CURRENT}}</p>
                            <p v-if="SelectDev.a00210.valueTEMPERTURE">当前环境温度： {{SelectDev.a00210.valueTEMPERTURE}}</p>   
                        </div>
                        <p v-else>无</p>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </transition>
    </div>
</template>

<script>
    import { getMapDev } from '@/interface/getData'
    import SelectAddress from '@/components/selectAddress'
    
    export default {
        name:"ErrMap",
        data(){
            return{
                map:null,
                devData:null,
                condition:{nw:'',es:'',status:'1'},
                address:{ province:'',city:'',district:''},
                markerClusterer:null,
                prevMarker:null,
                SelectDev:{
                     a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                     a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:'',
                },
                devMsgShow:false,
            }
        },
        mounted(){
           this.mapOnint();
           this.getDev();
        },
        methods:{
            setAddress(val){
                this.createMap();
            },
            async getDev(){       //获取设备故障信息
                if(!this.devData){
                    const result = await getMapDev(this.condition);
                    if(result.status == 0){
                        this.devData = result.data.data;
                    }  
                }
                this.setMarker();
            },
            mapOnint(){
                if(!this.map) this.map = new BMap.Map("errMap");
                var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                this.map.addControl(top_left_control);        
		        this.map.addControl(top_left_navigation);  
                this.map.enableScrollWheelZoom();
                this.createMap();
            },
            createMap(){  //初始化地图
                /**
                 *  根据地址显示地图
                 *  默认显示厦门
                 * */
                if(this.address.province || this.address.city || this.address.district){
                    var address = this.address.province + this.address.city + this.address.district;
                    this.map.centerAndZoom(address,14);
                }else{
                    this.map.centerAndZoom(new BMap.Point(118.10388605,24.48923061),14);
                }
            },
            setMarker(){  //添加地图标记点
                if(this.markerClusterer){
                    this.markerClusterer.clearMarkers();
                }
                this.map.clearOverlays();
                var that = this;
                var markers = [];
                for(var i=0,l=this.devData.length;i<l;i++){
                    this.devData[i].a00204 = this.toArray(this.devData[i].a00204);
                    var position = this.devData[i].a00204;
                    if(!position || position.length <=0) continue;
                    var point = new BMap.Point(position[0],position[1]);
                    //******
                    // var myIcon = new BMap.Icon("http://127.0.0.1:80/icon.png", new BMap.Size(28,28));
                    //***
                    // var marker = new BMap.Marker(point,{icon:myIcon});
                    var marker = new BMap.Marker(point);
                    // this.map.addOverlay(marker);
                    
                    (function(index,m){
                        m.addEventListener('click',function(){
                            var data = that.devData;
                            that.SelectDev = {
                                a00201:data[index].a00201,a00202:data[index].a00202,a00203:data[index].a00203,a00204:data[index].a00204,
                                a00205:data[index].a00205,a00206:data[index].a00206,a00207:data[index].a00207,a00208:data[index].a00208,
                                a00209:data[index].a00209,a00210:data[index].a00210,a00211:data[index].a00211,a00212:data[index].a00212,
                                a00213:data[index].a00213,a00214:data[index].a00214,a00215:data[index].a00215,a00216:data[index].a00216,
                                a00217:data[index].a00217,a00218:data[index].a00218,
                            }
                            // m.setAnimation(BMAP_ANIMATION_DROP);
                            if(that.preMarker){
                                that.preMarker.setAnimation();
                            }
                            that.preMarker = m;
                            m.setAnimation(BMAP_ANIMATION_BOUNCE);
                            that.devMsgShow = true;
                        })
                    }(i,marker))
                    markers.push(marker);
                }
               this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});
            },

            /**********************util******************************/
            toArray(str){   //数据处理
                if(typeof(str) == 'object'){ return str; }
                var arr = [];
                if(str && str.length > 0){ arr = str.split(','); }
                return arr;
		    },
            translate(arg){    //解析特殊属性
                if(!arg){  return false;}
                try {
                    this.SelectDev.a00210 = JSON.parse(this.SelectDev.a00210);
                    return true;
                } catch (error) {
                    return false;
                }
            }

        },
        components:{
            SelectAddress
        }
    }

</script>

<style scoped>
    .map_container{ border-radius: 5px; border: 1px solid #eee;}
    #errMap{ height: 500px; width: 100%;}
    #msgbox{  width: 250px; position: absolute; right: 10px;top: 50px; background: #fff;}
    #msgbox p{ font-size: 14px; font-weight: bold; color: #808080;}
    #msgbox small{  font-weight: normal;}
</style>
