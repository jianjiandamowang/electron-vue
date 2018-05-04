<template>
    <div class="body">
            <el-row class="content_container">
                <el-col :span="14" :offset="4">
                    <div>
                        <span class="version_p">产品:</span>
                        <el-select size="small" class="tendency_head" v-model="arg.a00602"  @change="setProduct" filterable placeholder="选择产品">
                            <el-option  v-if="ProductList" v-for="item in ProductList" :key="item.a00401"
                                :label="item.a00402":value="item.a00401">
                            </el-option>
                        </el-select>
                    </div>
                    <transition name="el-zoom-in-top">
                        <div v-if="latestversion">
                            <p class="version_p">当前最新固件版本: <span>{{latestversion}}</span></p>
                            <p class="version_p">
                                <span>发布的固件版本号:</span>
                                <el-input placeholder="请输入你需要发布的固件版本号" size="small" style="width:60%;" :maxlength="8" :minlength="8" v-model="arg.a00604" clearable></el-input>
                            </p>
                            <small class="tip">(<span style="color: red">Tip:</span>上传的版本号由八位数字组成,且需大于固件最新版本号, 版本号格式参见当前估计版本号) </small>
                        </div>
                    </transition>
                    
                    <p class="version_p">点击上传固件二进制版本文件：</p>
                    <div class="uploadBox">
                        <el-upload
                            drag
                            ref="versionUpload"
                            :action="baseUrl + 'g00600'"
                            :data="arg"
                            :limit="1"
                            :file-list="fileList"
                            name="file"
                            :show-file-list="true"
                            :on-success="uploadBinary"
                            :before-upload="beforeBinUpload"
                            :auto-upload="false"
                            :on-exceed="FileLimit">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">目前支持上传bin和hex文件,一次只能上传一个文件</div>
                        </el-upload>
                    </div>
                    <div style="margin-top:20px; ">
                        <el-button size="small" type="success" @click="submitUpload">上传固件</el-button>
                    </div>
                </el-col>
            </el-row> 
    </div>
</template>

<script>
    import { baseUrl } from '@/util/env'
    import { getAllProduct,GetLatestVersion } from '@/interface/getData'


    export default {
        name:'VersionUpload',
        data(){
            return{
                baseUrl,
                arg:{a00602:'',a00604:''},   
                ProductList:null,    //产品列表
                latestversion:'', //当前最新版本
                version:'',       //发布的固件版本
                fileList:[]
            }
        },
        mounted(){
            this.GetProductlist();
        },
        methods:{
            uploadBinary(res,file){
                if(res.status == 0){
                    this.$message({type:"success",message:"成功上传apk！"});
                    this.arg = {a00602:'',a00604:''};
                    this.latestversion = "";
                    this.version = "";
                }else{
                    this.$message({type:"error",message:"Error！上传apk失败！"});
                }
                this.fileList = [];
            },

            beforeBinUpload(file){
                var result = /\.[^\.]+/.exec(file.name);
                // var _bin = "(.bin)$";
                // var bin = new RegExp(_bin,['i']);
                if(!/[.](bin$)|[.](hex$)$/i.test(result[0])){
                    this.$message.error('文件格式不正确！目前只能上传二进制bin或hex文件');
                    this.fileList = [];
                    return false;
                }else{
                    return true;
                }
            },
            FileLimit(file,fileList){
                this.$message.warning('超出文件上传数量限制, 一次只能上传一个文件');
            },
            submitUpload(){     //上传固件
                if(!this.CheckVersion()) return;
                if(this.arg.a00604*1 <= this.latestversion*1){
                    this.$message.warning('上传的版本号不能低于当前版本');
                    return
                }
                this.$refs.versionUpload.submit();
            },
            async GetProductlist(){     //获取产品信息
                const result = await getAllProduct();
                if(result.status == 0){
                    this.ProductList = result.data;
                }else{
                    this.$message.error('获取产品列表失败,请重试');
                }
            },
            async setProduct(val){
                this.latestversion = "";
                const result = await GetLatestVersion({a00602:val});
                console.log(result);
                if(result.status == 0){
                    this.latestversion = result.data;
                }else{
                    this.$message.error('获取产品产品最新固件版本失败,请重试');
                }
            },
            CheckVersion(){    //验证上传的版本号 
                if(!this.latestversion){
                    this.$message.warning('请先选择产品');
                    return false;
                }
                if(!this.arg.a00604){
                    this.$message.warning('请输入上传的固件版本号');
                    return false;
                }
                if(!/^[0-9]*$/.test(this.arg.a00604)){
                    this.$message.warning('输入的版本号格式不正确');
                    return false;
                }
                if(!/\d{8}$/.test(this.arg.a00604)){
                    this.$message.warning('输入的版本号不能小于8位');
                    return false;
                }
                return true;
            
            }
        },

    }

</script>

<style>
   

</style>

<style lang="less" scoped>
    .content_container{ margin: 40px;padding: 30px; background: #fff;}
    #address select{ height: 38px; outline: none;}
    #address  option{ padding: 10px 2px !important; height: 20px !important;background: red; }
    .uploadBox{ width: 400px; }
    .tip{ font-size: 12px;  color: #606266; }
    .version_p{ font-size: 14px; font-weight: bold; color: #808080;}
</style>