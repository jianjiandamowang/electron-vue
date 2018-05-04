<template>
	<div class="manage_page fillcontain">
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
			
                    <el-submenu v-for="(item,index) in menu" :key="item.a10101" :index="(index+1+'')">
                        <template slot="title"><i :class="Permision.NavIcon[index]"></i>{{item.a10102}}</template>
                        <el-menu-item v-for="items in item.menus" :key="items.a10101" :index="items.a10109">{{items.a10102}}</el-menu-item>
					</el-submenu>


                    <el-menu-item index="personal"><i class="el-icon-view"></i>个人信息</el-menu-item>
				</el-menu>
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
