<template>
    <el-menu default-active="home"
      :collapse="collapse"
      style="width:100%;"  
      :background-color="theme.backgroundColor"
      @open="handleOpen"
      :text-color="theme.textColor"
      :unique-opened="true"
      :active-text-color="theme.activeTextColor"
      router>
					<el-menu-item index="home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>  
          </el-menu-item>
          <el-submenu v-for="(item,index) in menu" :key="item.a10101" :index="(index+1+'')">
                <template slot="title">
                  <i :class="Permision.NavIcon[index]"></i>
                  <span slot="title">{{item.a10102}}</span>
                </template>
                <el-menu-item v-for="items in item.menus" :key="items.a10101" :index="items.a10109">
                  <span slot="title">{{items.a10102}}</span>
                </el-menu-item>
					</el-submenu>
          <el-menu-item index="personal">
            <i class="el-icon-view"></i>
            <span slot="title">个人信息</span>  
          </el-menu-item>
	</el-menu>



</template>
<script type="text/javascript">
import { getMenu } from '@/interface/getData'
import { mapState } from 'vuex'

export default {
  props: {
    collapse: Boolean,
    theme: Object
  },
  data () {
    return {
      menu:null,
    }
  },
  created(){
            this.getmenu();           
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
<style type="text/css">
  .el-menu.side-menu{
    border-right: none;
  }
  .el-menu .fa{
    font-size: 18px;
    margin-right: 7px;
    display: inline-block;
    width: 23px;
    text-align: center;
  }
  .el-menu.side-menu .el-menu-item.is-active {
    color: #409EFF;
    border-right: solid 2px #36c1fa;
    background: #eef3f5;
  }
   .el-menu.side-menu{
    border-right: none;
  }
</style>
