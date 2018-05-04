<template>
    <div>
        <!--设备特殊属性-->
        <p v-if="special.valueLED_STATE!=null">开关状态: {{special.valueLED_STATE}}</p>
        <p v-if="special.valueLOW_VOL!=null">低电压状态: {{special.valueLOW_VOL}}</p>
        <p v-if="special.valueGAR_STATE!=null">桶满状态： {{special.valueGAR_STATE}}</p>
        <p v-if="special.valueRAIN_STATE!=null">雨水传感器状态： {{special.valueRAIN_STATE}}</p>
        <p v-if="special.valueGATE_STATE!=null">门开关传感器状态： {{special.valueGATE_STATE}}</p>
        <p v-if="special.valueDISPLAY_TYPE!=null">彩虹灯显示样式： {{special.valueDISPLAY_TYPE}}</p>
        <p v-if="special.valueLED_FLASH!=null">闪烁频率： {{special.valueLED_FLASH}}</p>
        <p v-if="special.valuePURPLE_PWM!=null">紫灯当前亮度： {{special.valuePURPLE_PWM}}</p>
        <p v-if="special.valueWHITE_PWM!=null">白灯当前亮度： {{special.valueWHITE_PWM}}</p>
        <p v-if="special.valueCOLOR_PWN!=null">彩色灯当前亮度： {{special.valueCOLOR_PWN}}</p>
        <!--<p v-if="special.valueLAMP_VOL!=null">草坪灯编号： {{special.valueLAMP_VOL}}</p>-->
        <p v-if="special.valueBAT_VOL!=null">电池电压： {{special.valueBAT_VOL}}</p>
        <p v-if="special.valuePV_VOL!=null">太阳能板电压： {{special.valuePV_VOL}}</p>
        <p v-if="special.valueCHARGE_CURRENT!=null">充电电流： {{special.valueCHARGE_CURRENT}}</p>
        <p v-if="special.valueDISCHARE_CHARGE!=null">放电电流： {{special.valueDISCHARE_CHARGE}}</p>
        <p v-if="special.valueSUM_CURRENT!=null">当天已充电量： {{special.valueSUM_CURRENT}}</p>
        <p v-if="special.valueTEMPERTURE!=null">当前环境温度： {{special.valueTEMPERTURE}}</p> 
        <p v-if="special.valueLAMP_VOL!=null">
            <el-row>
            <el-col :span='8' v-for="item in special.valueLAMP_VOL" :key="item.no">
               <span>草坪灯{{item.no}}:  {{item.val}}</span>
            </el-col>
            </el-row>
        </p> 
    </div>
</template>

<script>


    export default {
        name:'DevSpecial',
        props:['special'],
        data(){
            return{
            }
        },
        mounted(){
        },
        methods:{
            parseLAMP(str){
                if( typeof(str) == 'string'){
                    try{
                        JSON.parse(str);
                        if(str.indexOf('{') > -1 || str.indexOf('[') > -1){
                            return JSON.parse(str);
                        }
                    }catch(e){ return ''}
                }else{
                    return ''
                }
            }
        },
        watch:{
            special:function(val){
                if(val.valueLAMP_VOL != null){
                    val.valueLAMP_VOL = this.parseLAMP(val.valueLAMP_VOL);
                }
                // console.log(val);
            }
        }
    }


</script>
<style lang="less" scope>

</style>