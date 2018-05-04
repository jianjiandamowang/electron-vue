// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import store from './store/index';
import NProgress from 'nprogress'
// import 'babel-polyfill'    //兼容IE 的预处理 

import 'element-ui/lib/theme-chalk/index.css';
import 'jquery';

import 'nprogress/nprogress.css'
import '@/assets/scrollbar.css'
import '@/assets/reset.css'

Vue.use(ElementUI);

import DropdownPlugin from './m/dropdown'
import NavbarPlugin from './m/navbar'
// import ContextMenuPlugin from './m/context-menu'
// import MButton from '@/m/button'
// import MSwitch from '@/m/switch'
// import MAlert from '@/m/alert'
// import MCheckbox from '@/m/checkbox'
// import MInput from '@/m/input'
// import MLoading from '@/m/loading'
// import Mkeyboard from '@/m/keyboard'
// import MNumberkeyboard from '@/m/number-keyboard'
// import MBox from '@/m/box'
import MBackTop from '@/m/back-top'
// import MLoader from '@/m/loader'
// import MContainer from '@/m/container'
Vue.use(DropdownPlugin)
Vue.use(NavbarPlugin)
// Vue.use(ContextMenuPlugin)
// Vue.use(MButton)
// Vue.use(MSwitch)
// Vue.use(MAlert)
// Vue.use(MCheckbox)
// Vue.use(MInput)
// Vue.use(MLoading)
// Vue.use(Mkeyboard)
// Vue.use(MNumberkeyboard)
// Vue.use(MBox)
Vue.use(MBackTop)
// Vue.use(MLoader)
// Vue.use(MContainer)





Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
