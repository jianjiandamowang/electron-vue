<template>
    <div class="header_container">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta.nav" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown>
			<span class="el-dropdown-link">
				{{userInfo.a00102}}<i class="el-icon-arrow-down el-icon--right"></i>
  			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item ><span class="dropitem" @click="$router.push('home')">首页</span></el-dropdown-item>
				<el-dropdown-item ><span class="dropitem" @click="$router.push('personal')">个人中心</span></el-dropdown-item>
				<el-dropdown-item><span class="dropitem" @click="logout">退出账户</span></el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import { Logout } from '@/interface/getData'

export default {
    name:'HeadTop',
    data() {
        return{

        }
    },
	mounted(){
	},
	methods: {
		async logout(){
			const result = await Logout();
			if(result.status == 0){
				this.$router.push('/');
			}
		}
	},
	computed:{
		...mapState(['userInfo']),
	}
}    
</script>


<style lang="less">
 	@import '../assets/mixin.less';
	.header_container{  
		background-color: #fff;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:0 15px;
		border-bottom:1px solid #f8f8f8;
	}

	.dropitem{
		display: block;
		width: 100%;
	}

</style>