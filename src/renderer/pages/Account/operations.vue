<template>
    <div>
        <!--运维人员列表-->
        <UserTable :accountData="accountData" :title="title" :type="type"></UserTable>
    </div>
</template>

<script>
    import UserTable from '@/components/usertable'
    import { AccountList } from '@/interface/getData'

    export default {
        name:'Operations',
        data(){
            return {
                accountData:[],
                title:'运维人员列表',
                type:'1'
            }
        },
        mounted(){
            this.GetList();
        },
        methods:{
            async GetList(){  //获取售后人员列表
                const result  = await AccountList({a00105:"1"});
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