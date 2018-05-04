import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import { checkUser } from '@/interface/getData'
import { MessageBox  } from 'element-ui'
import { Permision } from '@/util/permision'
import NProgress from 'nprogress'
/** 
//声明引入页面组件
import Login from '@/pages/login'
import Nav from '@/pages/nav'
import Home from '@/pages/home'

// 账户管理
import AccountManage from '@/pages/Account/accountManage'
import accountAdd from '@/pages/Account/accountadd'
import AfterSale from '@/pages/Account/afterSale'
import Operations from '@/pages/Account/operations'
import Property from '@/pages/Account/property'

//售后管理
import WorkOrder from '@/pages/AfterSale/workorder'
import ErrDevice from '@/pages/AfterSale/errDevice'
import OrderAdd from '@/pages/AfterSale/addorder'

//个人信息
import Personal from '@/pages/personal'

//设备管理
import DeviceList from '@/pages/Device/devicelist'
import DeviceAdd from '@/pages/Device/deviceadd'
import Product from '@/pages/Device/product'

//项目管理
import projectList from '@/pages/Project/projectlist' 
import projectAdd from '@/pages/Project/projectadd'
**/

//声明引入页面组件
const Login = r => require.ensure([], () => r(require('@/pages/login')), 'Login');
// const Nav = r => require.ensure([], () => r(require('@/pages/nav')), 'Nav');
const Home = r => require.ensure([], () => r(require('@/pages/home')), 'Home');

// 账户管理
const AccountManage = r => require.ensure([], () => r(require('@/pages/Account/accountManage')), 'AccountManage');
const accountAdd = r => require.ensure([], () => r(require('@/pages/Account/accountadd')), 'accountAdd');
const AfterSale = r => require.ensure([], () => r(require('@/pages/Account/afterSale')), 'AfterSale');
const Operations = r => require.ensure([], () => r(require('@/pages/Account/operations')), 'Operations');
const Property = r => require.ensure([], () => r(require('@/pages/Account/property')), 'Property');

//售后管理
const WorkOrder = r => require.ensure([], () => r(require('@/pages/AfterSale/workorder')), 'WorkOrder');
const ErrDevice = r => require.ensure([], () => r(require('@/pages/AfterSale/errDevice')), 'ErrDevice');
const OrderAdd = r => require.ensure([], () => r(require('@/pages/AfterSale/addorder')), 'OrderAdd');

//个人信息
const Personal = r => require.ensure([], () => r(require('@/pages/personal')), 'Personal');

//设备管理
const DeviceList = r => require.ensure([], () => r(require('@/pages/Device/devicelist')), 'DeviceList');
const DeviceAdd = r => require.ensure([], () => r(require('@/pages/Device/deviceadd')), 'DeviceAdd');
const Product = r => require.ensure([], () => r(require('@/pages/Device/product')), 'Product');
const UnEdit = r => require.ensure([], () => r(require('@/pages/Device/unedit')), 'UnEdit');

//项目管理
const projectList = r => require.ensure([], () => r(require('@/pages/Project/projectlist')), 'projectList');
const projectAdd = r => require.ensure([], () => r(require('@/pages/Project/projectadd')), 'projectAdd');


//固件管理
const VersionManage = r => require.ensure([], () => r(require('@/pages/Version/versionmanage')),'VersionManage');
const VersionUpload = r => require.ensure([], () => r(require('@/pages/Version/versionupload')),'VersionUpload');
const VersionUpdate = r => require.ensure([], () => r(require('@/pages/Version/versionupdate')),'VersionUpdate');
const UpdateReport = r => require.ensure([], () => r(require('@/pages/Version/updatereport')),'UpdateReport');

import AppView from '@/components/frame/app-view'

Vue.use(Router)


const routes = [
    { path: '', name: 'Login',component: Login,meta:{ check:false}},
    { path: '/login', name: 'Login',component: Login,meta:{ check:false}},
    {
      // 
      path:'/home',
      component:AppView,
      children:[{
          path:'',
          component:Home,
          meta:{ check:true }
      },
      {
          path:'/accountmanage',
          component:AccountManage,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','账户列表'] }
      },
      {
          path:'/addaccount',
          component:accountAdd,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','添加账户'] }
      },
      {
          path:'/operations',
          component:Operations,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','运维人员'] }
      },
      {
          path:'/aftersale',
          component:AfterSale,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','售后人员'] }
      },
      {
          path:'/property',
          component:Property,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','物业人员'] }
      },
      {
          path:'/workorder',
          component:WorkOrder,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','售后工单']}
      },
      {
          path:'/errdevice',
          component:ErrDevice,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','故障设备']}
      },
      {
          path:'/orderadd',
          component:OrderAdd,
          meta:{ check:true,Permision:[true,true,false,false],nav:['锦众科技','添加工单']}
      },
      {
          path:'/personal',
          component:Personal,
          meta:{ check:true,Permision:[true,true,true,true],nav:['锦众科技','个人信息']}
      },
      {
          path:'/devicelist',
          component:DeviceList,
          meta:{check:true,Permision:[true,true,true,true],nav:['锦众科技','设备管理']}
      },
      {
          path:'/uneditmanage',
          component:UnEdit,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','未编辑设备']}
      },
      {
          path:'/adddevice',
          component:DeviceAdd,
          meta:{check:true,Permision:[true,true,true,true],nav:['锦众科技','设备新增']}
      },
      {
          path:'/product',
          component:Product,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','产品管理']}
      },
      {
          path:'/projectlist',
          component:projectList,
          meta:{check:true,Permision:[true,true,true,true],nav:['锦众科技','项目管理']}
      },
      {
          path:'/addproject',
          component:projectAdd,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','新增项目']}
      },
      {
          path:'/versionmanage',
          component:VersionManage,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','固件管理']}
      },
      {
          path:'/versionupload',
          component:VersionUpload,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','固件上传']}
      },
      {
          path:'/versionupdate',
          component:VersionUpdate,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','更新设备']}
      },
      {
          path:'/report',
          component:UpdateReport,
          meta:{check:true,Permision:[true,true,false,false],nav:['锦众科技','任务报表']}
      },
      ]
      // 
    }
  ]


const router = new Router({
    routes
})

router.beforeEach((to, from , next) => {
    //   console.log(to)
    //   console.log(from)
    //   console.log(next)
     NProgress.start()
     if(to.meta.check){
        var check = async function(){
            const result = await checkUser();
            // console.log(result);
            if(result.status == 0){
                store.state.userInfo = result.data; 
                store.state.Permision = Permision(result.data.a00105);
                var index = store.state.Permision.Level * 1;
                if(to.meta.hasOwnProperty('Permision')){
                    console.log(to.meta.Permision[index])
                    if(!to.meta.Permision[index]) return NProgress.done(); 
                }
                // NProgress.done()
                next();
            }else{
                // NProgress.done()
                MessageBox.alert('用户未登录', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    next({path:'/'})
                    }
                });
            }
        }
        check();  //后台验证session
      }else{
        next();
      }
})

router.afterEach(transition => {
  setTimeout(() => {
    NProgress.done()
  })
})


export default router