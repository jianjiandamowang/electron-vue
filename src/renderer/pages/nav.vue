<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<h3 class="title">锦众科技光伏智慧终端</h3>
                <h4 class="title">产品管理后台</h4>
                <el-menu :default-active="defaultActive"
                 style="min-height: 100%;width:100%;"  
                 background-color=#324057
                 @open="handleOpen"
                 text-color="#fff"
                 :unique-opened="true"
                 active-text-color="#ffd04b"
                 theme="dark" 
                 router>
					<el-menu-item index="home"><i class="el-icon-menu"></i>首页</el-menu-item>
					<!--<el-submenu index="2">
						<template slot="title"><i class="el-icon-setting"></i>账户管理</template>
						<el-menu-item index="operations">运维人员</el-menu-item>
                        <el-menu-item index="aftersale">售后人员</el-menu-item>
                        <el-menu-item index="property">物业人员</el-menu-item>
                        <el-menu-item index="accountmanage">用户列表</el-menu-item>
						<el-menu-item index="addaccount">添加账户</el-menu-item>
					</el-submenu>
                    <el-menu-item index="3"><i class="el-icon-edit-outline"></i>项目管理</el-menu-item>
                    <el-menu-item index="devmanage"><i class="el-icon-location-outline"></i>设备管理</el-menu-item>
                    <el-submenu index="5">
						<template slot="title"><i class="el-icon-tickets"></i>售后管理</template>
						<el-menu-item index="workorder">售后工单</el-menu-item>
                        <el-menu-item index="errdevice">故障设备</el-menu-item>
					</el-submenu>-->

                    <!--<div v-for="(item,index) in menu" :key="item.a10101" v-if="menu">
                        <el-menu-item v-if="item.menus.length < 1" :index="item.a10109"><i class="el-icon-location-outline"></i>{{item.a10102}}</el-menu-item>
                        <el-submenu v-else :index="index+1">
                            <template slot="title"><i class="el-icon-setting"></i>{{item.a10102}}</template>
                            <el-menu-item v-for="items in item.menus" :key="items.a10101" :index="items.a10109">{{items.a10102}}</el-menu-item>
                        </el-submenu>
                    </div>-->
                    <el-submenu v-for="(item,index) in menu" :key="item.a10101" :index="(index+1+'')">
                        <template slot="title"><i :class="Permision.NavIcon[index]"></i>{{item.a10102}}</template>
                        <el-menu-item v-for="items in item.menus" :key="items.a10101" :index="items.a10109">{{items.a10102}}</el-menu-item>
					</el-submenu>


                    <el-menu-item index="personal"><i class="el-icon-view"></i>个人信息</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto; background: #EAEDF2">
				    <router-view></router-view>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    import { getMenu } from '@/interface/getData'
    import { mapState } from 'vuex'
    // import { permision,nav } from '@/util/permision'

    export default {
        name:"Nav",
        data(){
            return{
                menu:null,
            }
        },
        created(){
            this.getmenu();           
        },
        updated(){
            // this.menu.forEach(function(item,index){
            //     nav.forEach(function(items,i){
            //         if(item.a10102 == items.name){
            //             for(var i=0,len=item.menus.length;i<len;i++){
            //                  for(var j=0,l=items.node.length;j<l;j++){
            //                      if(item.menus[i].a10102 == items.node[j].name){
            //                          item.menus[i].a10109 = items.node[j].path;
            //                          console.log(item.menus[i].a10109);
            //                      }             
            //                  }
            //             }
            //         }
            //     })
            // })
        },
        methods:{
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            async getmenu(){
                const result = await getMenu();
                if(result.status == 0){
                    this.menu = result.data;
                }else{
                    this.$message({type:'error',message:"获取菜单失败,请重试或联系管理员"});
                }
            },
            rendernav(item,index){
                index ++;  index = index +'';
                if(item.menus.length > 0){
                    return index;
                }else{
                    return ''+item.a10109
                }
            }
        },
		computed: {
            ...mapState(['Permision']),
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less">
	@import '../assets/mixin';
	.manage_page{
		height: 100%;
        min-width: 1260px;
	}
    .title{
        color: #fff;padding-left: 25px;
    }
</style>
