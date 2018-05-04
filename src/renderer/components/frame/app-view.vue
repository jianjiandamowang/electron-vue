<template>

<el-container class="app-container" style="min-width: 1260px;"
  :class="{
    'mini-side': isCollapse,
    'hide-side': hideSide
  }"
  >
  <el-aside class="app-side" :width="hideSide ? '0' : sideWidth + 'px'"
    :style="{background: theme.theme.backgroundColor}"
    >
    <div class="app-header-logo-box"
      :style="{height: headerHeight + 'px', color: theme.theme.activeTextColor}"
      >
      <img src="../../assets/LOGO-1.png" alt="" class="header-logo">
      <span class="header-logo-text" >锦众科技</span>
    </div>
    <app-side :collapse="isCollapse" :theme="theme.theme"></app-side>
  </el-aside>
  <el-container style="overflow-x: auto;">
    <el-header class="app-header" :height="headerHeight + 'px'">
      <app-header @switch="handleSideSwitch" @set-theme="handleSetTheme" @hide-side="handleSwitchHideSide"></app-header>
    </el-header>
    <el-main class="app-body">
      <el-container style="height: 100%;min-height: 100%;overflow: auto" id="appBody">
        <el-main class="app-page-body"><router-view></router-view></el-main>
        <!--<el-footer class="app-footer" :height="footerHeight + 'px'">
          <app-footer></app-footer>
        </el-footer>-->
      </el-container>
    </el-main>
  </el-container>
  <m-back-top body-id="appBody"></m-back-top>
</el-container>


</template>
<script type="text/javascript">

import { mapState,mapMutations } from 'vuex';
import { socketUrl } from '@/util/env';
import AppHeader from '@/components/frame/app-header'
import AppSide from '@/components/frame/app-side'
export default {
  name: 'app-view',
  data () {
    return {
      isCollapse: false,
      hideSide: false,
      sideWidth: 200,
      footerHeight: 50,
      headerHeight: 50,
      theme: {theme: {}},
      
      /*********websocket*************/
      socket:null,
      timer:null
    }
  },
  components: {
    AppHeader,
    AppSide
  },
  computed:{
    ...mapState(['userInfo','WebSocket','Permision']),
  },
  mounted(){
    this.OnInitWebsocket();
  },
  methods: {
    ...mapMutations(['setWebSocket']),
    handleSideSwitch (val) {
      this.isCollapse = val
      this.sideWidth = val ? 60 : 200
    },
    handleSwitchHideSide () {
      this.hideSide = !this.hideSide
    },
    handleSetTheme (theme) {
      this.theme = theme
    },
    /*************************************************/
    OnInitWebsocket(){
        if(this.socket) return;
        if(this.WebSocket){ 
            this.socket = this.WebSocket; 
        }else{
           if(window.WebSocket){
              console.log('创建socket');
              this.socket = new WebSocket(encodeURI('ws://'+socketUrl+':8686'));
              this.setWebSocket(this.socket);
           }else{
               alert("该浏览器不支持长连接。<br/>建议使用高版本的浏览器，<br/>如 IE10、火狐 、谷歌  、搜狗等");
           }
        }
        if(this.socket){        //这里判断socket是否成功创建
            console.log('socket创建成功')
            this.socket.onopen = () => {
            console.log('socket已连接')
            this.socket.send('online'+this.userInfo.a00106);
              if(!this.timer){
                  this.timer = setInterval(()=>{
                      this.keepLive(this.socket)
                  },30000);
              }
            };
            this.socket.onerror = () => {
                 this.$notify.error({title: '错误',message: 'websocket连接发生错误'});
            };
            this.socket.onclose = () => {
                 window.clearInterval(this.timer);
                 this.timer = null;
                 this.$notify.error({title: '错误',message: 'websocket已断开'});
                 this.OnInitWebsocket();
            };
            this.socket.myMethod = (data) =>{
                if(this.Permision.DevWarning){
                  this.$notify({title:'设备告警',dangerouslyUseHTMLString: true,type:'error',onClick:() =>{ this.$router.push('errdevice') }, position: 'bottom-right',
                      message:'<small>设备Imei:'+data.a00211+'告警(点击跳转)</small>'+'<br> <small>设备类型:' +data.a00202+ '地址:' +data.a00214+data.a00203 +'</small>',    
                  });
                }
            }
             // 消息接收
            this.socket.onmessage = message => {
                // this.socket.myMethod(message);
                var data = JSON.parse(message.data);
                switch(data.cmd){
                  case 500:
                      this.socket.myMethod(data.device);
                      break;
                }
            };
        }
                
    },
    keepLive(wsocket){  //心跳
          wsocket.send('heartbeat');
    },
    /****************************/
  }
}
</script>
<style type="text/css">
  .app-container{
    margin: 0 auto;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .app-container .app-header{
    padding: 0;
    background: #16AAD8;
    overflow: visible;
    z-index: 100;
  }
  .app-container .app-side{
    width: 200px;
    transition: all 0.5s ease;
  }
  .app-container .app-body{
    background: #ECF0F5;
    padding: 0;
  }
  .app-container .app-footer{
    background: #fff;
    border-top: solid 1px rgba(48, 54, 62, 0.14);
  }
  .app-container .app-page-body{
    overflow: visible;
    padding: 0px;
  }
  .app-header-logo-box{
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .app-header-logo-box .header-logo{
    height: 42px;
    margin-top: -17px;
    margin-right: 5px;
    vertical-align: middle;
  }
  .app-header-logo-box .header-logo-text{
    font-size: 20px;
    font-weight: bold;
    opacity: 1;
  }

  /*mini-side*/
  .app-container.mini-side .app-side{
    overflow: visible;
  }
  .app-container.mini-side .app-side .el-menu--collapse{
    width: 60px;
  }
  .app-container.mini-side .header-logo{
    margin-left: -10px;
  }
  .app-container.mini-side .header-logo-text{
    opacity: 0;
  }
  /*hide-side*/
  .app-container.hide-side .app-side{
    display: none;
  }
</style>
