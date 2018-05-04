<template>
    <div>
       <div id="address" data-toggle="distpicker" data-value-type="name">
            <select data-province="---- 选择省 ----" v-model="address.province" @change="setProvince"></select>
            <select data-city="---- 选择市 ----" v-model="address.city" @change="setCity"></select>
            <select data-district="---- 选择区 ----" v-model="address.district" @change="setDistrict"></select>
        </div>
    </div>
</template>


<script>
    import 'distpicker/dist/distpicker.min.js'
    
    export default {
        name:"SelectAddress",
        props:['address'],
        data(){
            return {
            }
        },
        mounted(){
            $('#address').distpicker();
        },
        methods:{
            setProvince(){
                 this.address.city = ""; this.address.district="";
                 this.$emit('SetAddress',this.address);
            },
            setCity(){
                this.address.district = "";
                this.$emit('SetAddress',this.address);
            },
            setDistrict(){
                this.$emit('SetAddress',this.address);
            }
        },
      
    }


</script>

<style scoped>
    #address select{ height: 32px; outline: none; border-radius: 5px; border-color: #dcdfe6; padding: 0 10px;}
</style>