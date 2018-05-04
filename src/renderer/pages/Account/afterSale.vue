<template>
    <div>
        <!--售后账户列表-->
        
        <UserTable :accountData="accountData" :title="title" :type="type"></UserTable>
    </div>
</template>

<script>
    import HeadTop from '@/components/headTop'
    import UserTable from '@/components/usertable'
    import { AccountList } from '@/interface/getData'

    export default {
        name:'AfterSale',
        data(){
            return {
                accountData:[],
                title:'售后人员列表',
                type:'2'
            }
        },
        mounted(){
            this.GetList();
        },
        methods:{
            async GetList(){  //获取售后人员列表
                const result  = await AccountList({a00105:"2"});
                this.accountData = result.data;
            }
        },
        components:{
            UserTable
        }
    }


</script>

<style lang="less" scoped>

</style>