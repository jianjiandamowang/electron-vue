<template>
    <div >
        <div class="content_container">
            <!--个人信息-->
            <header class="admin_title">个人信息</header>
            <div class="admin_set">
                <ul>
                    <li>
                        <span>姓名：</span><span>{{userInfo.a00102}}</span>
                    </li>
                    <li>
                        <span>工号：</span><span>{{userInfo.a00106}}</span>
                    </li>
                    <li>
                        <span>账户权限：</span><span>{{userInfo.a00105}}</span>
                        <span v-if="userInfo.a00105 == '0'">(超级管理员)</span>
                        <span v-if="userInfo.a00105 == '1'">(运维人员)</span>
                        <span v-if="userInfo.a00105 == '2'">(售后人员)</span>
                        <span v-if="userInfo.a00105 == '3'">(物业人员)</span>
                    </li>
                    <li>
                        <span>账户 ID：</span><span>{{userInfo.a00101}}</span>
                    </li>
                    <li>
                        <span>手机号码：</span><span>{{userInfo.a00103}}</span>
                    </li>
                    <li>
                        <el-button type="primary" icon="el-icon-edit" @click='openEdit'>修改信息</el-button>
                        <el-button type="primary" @click='logout'>退出帐号</el-button>
                    </li>
                </ul>
                <!--个人信息编辑框-->
               	<el-dialog title="编辑信息" :visible.sync="dialogShow" size="small">
                    <el-form :model="form" v-if="form" label-position="left">
                        <el-form-item label="姓名" label-width="100px">
                        <el-input v-model="form.a00102" auto-complete="off" style="width: 50%;"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" label-width="100px">
                            <p style="margin: 0;"><span class="el-icon-phone">{{form.a00103}}</span> <el-button type="text" size="small" @click="editPhoneShow = true">修改手机号</el-button></p>
                        </el-form-item>
                        
                        <!--<el-form-item label="密码" label-width="100px">
                       
                        <a @click="passwordShow = true" style="color:dodgerblue;cursor: pointer;"><span class="el-icon-edit"></span>点击修改密码</a>
                        </el-form-item>-->

                        <el-form-item label="用户类型" label-width="100px">
                        <el-select v-model="form.a00105" placeholder="请选择" :disabled="disabled">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="info" @click="dialogShow = false">返 回</el-button>
                        <el-button type="primary" @click="passwordShow = true" >修改密码</el-button>
                        <el-button type="success" @click="edit()">保 存 修 改</el-button>
                    </div>
                </el-dialog>
                <!--修改手机号-->
                <el-dialog title="修改手机号" width="400px" :visible.sync="editPhoneShow">
                    <el-form :model="phoneForm"  size='small'>
                        <el-form-item label="新手机" label-width="100px">
                            <el-input v-model="phoneForm.newPhone" auto-complete="off" style="width: 80%" placeholder="请输入你的新手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" label-width="100px">
                            <el-input v-model="phoneForm.password" auto-complete="off" style="width: 80%" placeholder="请输入你的登入密码"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="editPhoneShow = false" size="small">取消</el-button>
                        <el-button type="primary" size="small" @click="editPhone()">修改手机</el-button>
                    </div>
                </el-dialog>
                <!---->
                <!--修改密码-->
                <el-dialog title="修改密码" :visible.sync="passwordShow" width="40%">
                    <el-form :model="passwordForm" label-position="left">
                        <el-form-item label="新密码" label-width="100px">
                            <el-input v-model="passwordForm.a00104" type="password" auto-complete="off" style="width: 85%;" placeholder="请输入你的新密码"></el-input>
                        </el-form-item>
                        <el-form-item label="再次输入" label-width="100px">
                            <el-input v-model="repass" type="password" auto-complete="off" style="width: 85%;" placeholder="再次输入你的新密码"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" label-width="100px">
                            <el-input v-model="recode"  auto-complete="off" style="width: 60%;" placeholder="输入验证码"></el-input>
                            <el-button @click="sendCode" :loading="passLoading" type="primary" plain>{{codeText}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="reset">取 消</el-button>
                        <el-button type="primary" @click="setPassword">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { editAccount, Logout, SendCode, SearchAccount } from '@/interface/getData'  
    export default {
        name:'Personal',
        data(){
            return {
                dialogShow:false,       //编辑个人信息窗口
                passwordShow:false,     //编辑修改密码窗口
                options:[
                    {label:"超级管理员",value:"0"},
                    {label:"运维人员",value:"1"},
                    {label:"售后人员",value:"2"},
                    {label:"物业人员",value:"3"},
                ],
                form:{
                     a00101:'',a00102:'',a00103:'',a00104:'',a00105:'',a00106:''
                },
                temForm:{},
                passwordForm:{
                    a00101:'',a00102:'',a00103:'',a00104:'',a00105:'',a00106:''
                },
                repass:'',          //验证新密码
                code:'',      //验证码
                recode:'',
                isSend:false,              // 60秒发送一次验证码
                passLoading:false,       //发送验证码过渡效果
                codeText:'发送验证码',  //验证码按钮文字提示
                disabled:true,
                pass:true,    //修改密码
                editPhoneShow:false,  //修改手机号
                phoneForm:{
                    password:'',newPhone:''
                },

            }
        },
        created(){
            this.setPermision();
        },
        mounted(){
        },
        methods:{
            openEdit(){
                this.dialogShow = true;
                this.form.a00101 = this.userInfo.a00101;
                this.form.a00102 = this.userInfo.a00102;
                this.form.a00103 = this.userInfo.a00103;
                this.form.a00104 = "";
                this.form.a00105 = this.userInfo.a00105;
                this.form.a00106 = this.userInfo.a00106;
            },
            async edit(){
                // if(this.form.a00102 == this.userInfo.a00102 && this.form.a00105 == this.userInfo.a00105 && this.form.a00103 == this.userInfo.a00103){
                //     this.dialogShow = false;        //个人信息未发生变化
                //     return;
                // }
                const result = await editAccount({a00102:this.form.a00102,a00105:this.form.a00105,a00106:this.form.a00106});
                if(result.status == 0){
                    this.$notify({title: '成功',message: '修改个人信息成功,下次登录即可生效', type: 'success' });
                    this.dialogShow = false;
                }else{
                    this.$notify.error({ title: '错误',message: '修改失败'});
                }
            },
            async editPhone(){        //修改电话
                if(!this.phoneForm.newPhone || this.phoneForm.newPhone == "" ){
                    this.$message({type:'warning',message:"请输入新的手机号"});
                    return;
                }
                if(this.phoneForm.password != this.userInfo.a00104 ){
                    this.$message({type:'warning',message:"密码错误"});
                    return;
                }
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
                if (!myreg.test(this.phoneForm.newPhone)) {  
                    return this.$message({type:'warning',message:"手机格式不正确"});
                }
                //判断手机是否已经存在
                const result = await SearchAccount({a00102:'',a00103:this.phoneForm.newPhone,a00105:''})
                if(result.status == 0){
                    if(result.data.length <= 0){
                        this.finishEditPhone();
                    }else{
                         this.$message({type:'warning',message:"该手机号已被使用"});
                    }
                }
            },
            async finishEditPhone(){
                const result = await editAccount({a00106:this.form.a00106,a00103:this.phoneForm.newPhone});
                if(result.status == 0){
                     this.form.a00103 = this.phoneForm.newPhone;
                     this.editPhoneShow = false;
                     this.$notify({title: '成功',message: '手机修改成功', type: 'success' });
                     var obj = Object.assign({},this.form);
                     this.tableData.splice(this.EditIndex,1,obj);
                }else{
                    this.$notify({title: '错误',message: '手机修改失败', type: 'error' });
                }
            },
            async logout(){
                const result = await Logout();
                if(result.status == 0){
                    this.$router.push('/');
                }else{
                    this.$router.push('/');
                }
            },
            setPermision(){  //权限设置
                
                if(this.Permision.Level == '0') this.disabled = false;
                if(this.Permision.Level == '1') this.disabled = false; this.options[0].disabled = true;
            },
            async sendCode(){     //发送验证码
                if(this.isSend) { return;}
                this.passLoading = true;
                const result = await SendCode();
                if(result.status == 0){
                    this.code = result.data;
                    this.changeText();
                }else{
                    this.$message({type:'error',message:"发送验证码失败, 请重试"});
                }
                this.passLoading = false;
            },
            changeText(){   //改变发送验证码的文字
                var that = this;
                for(var i=1,t=60;i<=t;i++){
                    (function(_i,_t){
                        setTimeout(()=>{
                            if(_i == _t){
                                that.isSend = false;
                                that.codeText = "发送验证码";
                                that.code = '';
                            }else{
                                that.isSend = true;
                                that.codeText = _t-_i + "秒后重发";
                            }
                        },_i*1000)
                    }(i,t))
                }
            },
            async setPassword(){    //确认密码修改
                if(this.checkPass()){
                    this.passwordForm.a00103 = this.userInfo.a00103;  
                    const result = await editAccount(this.passwordForm);
                    if(result.status == 0){
                        this.$notify({title: '成功',message: '密码修改成功', type: 'success' });
                        this.reset();
                    }else{
                        this.$notify({title: '失败',message: '密码修改发生异常,请重试', type: 'error' });
                    }
                    
                }
            },
            reset(){  //重置修改密码表单
                this.passwordForm.a00104 = "";   this.repass = ""; 
                this.code = "";    this.recode = ""; this.passwordShow = false;
            },
            checkPass(){   //检查修改密码输入 策略
                if(!this.passwordForm.a00104 && this.passwordForm.a00104 == ''){
                    this.$message({type:'warning',message:"请输入您的新密码"});
                    return false;
                }
                if(this.passwordForm.a00104 != this.repass){
                    this.$message({type:'warning',message:"两次输入的新密码不一致"});
                    return false;
                }
                if(!this.recode && this.recode == ''){
                    this.$message({type:'warning',message:"请输入验证码"});
                    return false;
                }
                if(this.code != this.recode){
                    this.$message({type:'warning',message:"验证码错误"});
                    return false;
                }
                return true;

            }
        },
        computed:{
            ...mapState(['userInfo','Permision']),
        }
    }

</script>

<style lang="less" scoped>

    .content_container{
        padding: 20px;
    }


    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            list-style:none;
            padding: 20px;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        font-size:24px; color:#666;
        text-align: center;
    }

</style>