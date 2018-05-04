<template>
    <div class="map_container">
        <!--map地图组件-->
        <div id="map"></div>
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
                        <p>在线状态：<small v-if="SelectDev">{{ exChangeStatus(SelectDev.a00205) }}</small></p>
                        <p>故障状态：<small v-if="SelectDev">{{ errStatus(SelectDev.a00206) }}</small></p>
                        <p>售后帐号：<small v-if="SelectDev">{{SelectDev.a00208}}</small></p>
                        <p>物业帐号：<small v-if="SelectDev">{{SelectDev.a00209}}</small></p>
                        <p>经度：<small v-if="SelectDev">{{SelectDev.a00204[0]}}</small></p>
                        <p>纬度：<small v-if="SelectDev">{{SelectDev.a00204[1]}}</small></p>
                    </el-tab-pane>
                    <el-tab-pane label="特殊属性">
                        <div v-if="!translate(SelectDev.a00210)">
                            <p v-if="SelectDev.a00210.valueLED_STAT!=null">开关状态: {{SelectDev.a00210.valueLED_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueLOW_VOL!=null">低电压状态: {{SelectDev.a00210.valueLOW_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueGAR_STATE!=null">桶满状态： {{SelectDev.a00210.valueGAR_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueRAIN_STATE!=null">雨水传感器状态： {{SelectDev.a00210.valueRAIN_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueGATE_STATE!=null">门开关传感器状态： {{SelectDev.a00210.valueGATE_STATE}}</p>
                            <p v-if="SelectDev.a00210.valueDISPLAY_TYPE!=null">彩虹灯显示样式： {{SelectDev.a00210.valueDISPLAY_TYPE}}</p>
                            <p v-if="SelectDev.a00210.valueLED_FLASH!=null">闪烁频率： {{SelectDev.a00210.valueLED_FLASH}}</p>
                            <p v-if="SelectDev.a00210.valuePURPLE_PWM!=null">紫灯当前亮度： {{SelectDev.a00210.valuePURPLE_PWM}}</p>
                            <p v-if="SelectDev.a00210.valueWHITE_PWM!=null">白灯当前亮度： {{SelectDev.a00210.valueWHITE_PWM}}</p>
                            <p v-if="SelectDev.a00210.valueCOLOR_PWN!=null">彩色灯当前亮度： {{SelectDev.a00210.valueCOLOR_PWN}}</p>
                            <p v-if="SelectDev.a00210.valueLAMP_VOL!=null">草坪灯编号： {{SelectDev.a00210.valueLAMP_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueBAT_VOL!=null">电池电压： {{SelectDev.a00210.valueBAT_VOL}}</p>
                            <p v-if="SelectDev.a00210.valuePV_VOL!=null">太阳能板电压： {{SelectDev.a00210.valuePV_VOL}}</p>
                            <p v-if="SelectDev.a00210.valueCHARGE_CURRENT!=null">充电电流： {{SelectDev.a00210.valueCHARGE_CURRENT}}</p>
                            <p v-if="SelectDev.a00210.valueDISCHARE_CHARGE!=null">放电电流： {{SelectDev.a00210.valueDISCHARE_CHARGE}}</p>
                            <p v-if="SelectDev.a00210.valueSUM_CURRENT!=null">当天已充电量： {{SelectDev.a00210.valueSUM_CURRENT}}</p>
                            <p v-if="SelectDev.a00210.valueTEMPERTURE!=null">当前环境温度： {{SelectDev.a00210.valueTEMPERTURE}}</p>   
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </transition>

              

    </div>
</template>

<script>
    import { getMapDev } from '@/interface/getData';

    export default {
        name:'Map',
        props:['mapData','mapJudge','type','locationDev'],  //接收传递过来的地图数据
        data(){
            return{
                mapOnit:false,  //地图初始化
                devData:null, 
                map:null,
                SelectDev:{
                     a00201:'',a00202:'',a00203:'',a00204:'',a00205:'',a00206:'',a00207:'',a00208:'',a00209:'',a00210:'',
                     a00211:'',a00212:'',a00213:'',a00214:'',a00215:'',a00216:'',a00217:'',a00218:'',
                },
                range:null, //地图可视范围
                prevMarker:null,
                rangeFrom:{lng:"",lat:""},  //范围坐标起点 （可视区域左上角坐标）
                rangeTo:{lng:"",lat:""},     //范围坐标终点 （可视区域右下角坐标）
                markerClusterer:null,
                devMsgShow:false,
            }
        },
        mounted(){
            this.mapOnInit();     
        },
        methods:{
            async getDev(arg1,arg2){       //获取设备及坐标信息
                if(this.devData){
                    this.setMarker();
                    return;
                }
                const result = await getMapDev({nw:arg1,es:arg2,status:this.type}); 
                if(result.status == 0) {
                    this.devData = result.data.data;
                    this.setMarker();
                }
            },
            createMap(){        //地图初始显示位置
                var data = this.mapData;
                var judge = this.mapJudge;
                this.devMsgShow = false;
                /**
                 *   判断   
                 *   1.  存在选中设备   根据设备坐标 初始定位
                 *   2.  若搜索条件存在数据  则根据数据的坐标进行定位
                 *   3.  若搜索条件的存在的数据无坐标信息  使用搜索地址进行定位
                 *   4.  若搜索条件不存在数据  则根据搜索地址进行定位
                 *   5.  以上均不存在   默认选择 厦门
                 */
                if(this.locationDev){
                    if(this.locationDev.a00204 && this.locationDev.a00204.length>0){
                        var point = this.locationDev.a00204;
                        this.map.centerAndZoom(new BMap.Point(point[0],point[1]),18);
                        this.setOneMarker();
                        return; 
                    }
                }
                //**********存在 getRange 无法获取区域经纬度 问题 *********
                // if(judge.address){  //存在地址 
                //     if(!judge.a00202&&!judge.a00203&&!judge.a00211&&!judge.a00212){
                //         console.log('根据地址来定位')
                //         this.map.centerAndZoom(judge.address,14);
                //         this.map.enableScrollWheelZoom(true); 
                //         return;
                //     }
                // }

                if(data.length == 0 ){   //若无数据 则根据 地址定位
                    if(judge.a00214){
                        this.map.centerAndZoom(judge.a00214,14);
                        this.getDev("","");
                        return;
                    }
                }
                for(var i in data){    //有数据则使用第一个 有坐标的设备进行定位
                    if(data[i].a00204 && data[i].a00204.length >0){
                        var point = data[i].a00204;
                        this.map.centerAndZoom(new BMap.Point(point[0],point[1]),14);
                        this.getRange();
                        return; 
                    }
                }

                if(judge.a00214){   //若数据中的坐标不存在 则使用地址定位
                        this.map.centerAndZoom(judge.a00214,18);
                        this.getDev("","");
                        return;
                }
                if(!this.mapOnit){
                    //默认展示厦门
                    this.map.centerAndZoom(new BMap.Point(118.10388605,24.48923061),14);
                }else{
                    this.$message({type:'warning',message:"暂无此设备"});
                }
            },
            mapOnInit(){   //创建地图
                if(this.map){return;}
                this.map = new BMap.Map("map"); //创建地图实例
                var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	            var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                this.map.addControl(top_left_control);        
		        this.map.addControl(top_left_navigation); 
                this.map.enableScrollWheelZoom(true);
                this.createMap();
                
                // this.map.addEventListener("dragend", this.getRange)
                // this.map.addEventListener("zoomend", this.getRange)
            },
            getRange(){  //获取地图可视范围
                // this.map.clearOverlays();
                this.range = this.map.getBounds();
                var rangeSW = this.range.getSouthWest(); // 可视区域左下角坐标
                var rangeNE = this.range.getNorthEast(); // 可视区域右上角角坐标
                this.rangeFrom.lng = rangeSW.lng;   //设置左上角坐标
                this.rangeFrom.lat = rangeNE.lat;   
                this.rangeTo.lng = rangeNE.lng;     //设置右下角坐标
                this.rangeTo.lat = rangeSW.lat;
                var nw = this.rangeFrom.lng + ',' + this.rangeFrom.lat;
                var es = this.rangeTo.lng + ',' + this.rangeTo.lat;
                this.getDev(nw,es);
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
            setOneMarker(){
                var data = this.locationDev;
                var point = new BMap.Point(data.a00204[0],data.a00204[1]);
                 var marker = new BMap.Marker(point);
                 this.map.addOverlay(marker);
                 this.SelectDev = {
                    a00201:data.a00201,a00202:data.a00202,a00203:data.a00203,a00204:data.a00204,
                    a00205:data.a00205,a00206:data.a00206,a00207:data.a00207,a00208:data.a00208,
                    a00210:data.a00210,a00211:data.a00211,a00212:data.a00212,a00213:data.a00213,
                    a00214:data.a00214,a00215:data.a00215,a00216:data.a00216,a00217:data.a00217,
                    a00218:data.a00218
                 };
                 marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                 this.devMsgShow = true;
                //  marker.addEventListener('click',()=>{
                //      this.SelectDev = {
                //          a00201:data.a00201,a00202:data.a00202,a00203:data.a00203,a00204:data.a00204,
                //          a00205:data.a00205,a00206:data.a00206,a00207:data.a00207,a00208:data.a00208,
                //          a00210:data.a00210,
                //      }        
                //  })
            },
            /**********************util******************************/
            toArray(str){   //数据处理
                if(typeof(str) == 'object'){ return str; }
                var arr = [];
                if(str && str.length > 0){ arr = str.split(','); }
                return arr;
		    },
            translate(arg){    //解析特殊属性
                try {
                    this.SelectDev.a00210 = JSON.parse(this.SelectDev.a00210);
                    console.log('1234')
                    return true;
                } catch (error) {
                    console.log('123')
                    return false;
                }
            },
            exChangeStatus(status){        //在线状态码 转换成字符
                switch(status){
                    case '0':  return '离线';break;
                    case '1':  return '在线'; break;
                    default: return '未知';
                }
            },
            errStatus(status){
                switch(status){
                    case '0':  return '正常';break;
                    case '1':  return '故障'; break;
                    default: return '未知';
                }
            }
        },
        watch:{
            mapData:function(val){
                 this.createMap();
            },
            // mapJudge:{  
            //     handler(val){
            //         var that = this;            //搜索优化
            //         var oldval = {
            //             a00202:val.a00202,a00203:val.a00203,a00206:val.a00206,a00211:val.a00211,
            //             a00212:val.a00212,a00214:val.a00214,currentPage:val.currentPage,
            //         };
            //         (function(old){
            //             setTimeout(()=>{
            //                 if(JSON.stringify(val) == JSON.stringify(old)){
            //                     that.createMap();
            //                 }
            //             },500)
            //         }(oldval))
            //         // this.createMap();
            //     },
            //     deep:true
            // },
        },      
    }
</script>

<style lang="less" scoped>
    .map_container{ background: #fff; width: 100%; height: 500px; position: relative;}
    #map{ height: 500px;width: 100%;}
    #msgbox{  width: 250px; position: absolute; right: 10px;top: 10px; background: #fff;}
    #msgbox p{ font-size: 14px; font-weight: bold; color: #808080;}
    #msgbox small{  font-weight: normal;}
    .form{ padding: 5px;}
    .edit_input{ width: 90%;}
</style>