<template>
    <div class="loginPage">
        <transition name="el-zoom-in-center" mode="in-out">
            <div class="form_container" v-show="showLogin">
                
                <div class="manage_tip">
                    <img src="../assets/LOGO-1.png" alt="">
                    <p>锦众科技光伏智慧终端产品</p>
                    <p>管理后台</p>
                </div>  
                <el-form :model="LoginForm" :rules="rules" ref="LoginForm"> 
                    <el-form-item prop="username">
						<el-input v-model="LoginForm.username" auto-complete="off" placeholder="工号/手机号" clearable ><span></span></el-input>
					</el-form-item>
					<el-form-item prop="password">
                        <el-input placeholder="密码" type="password" v-model="LoginForm.password" auto-complete="off" clearable style="display: none"></el-input>
                        <el-input placeholder="密码" type="password" v-model="LoginForm.password" auto-complete="off" clearable></el-input>
                    </el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('LoginForm')" :loading="loading" class="submit_btn">登陆</el-button>
                    </el-form-item>
                    <p class="forgetpass"><a @click="ForgetPass">忘记密码?</a></p>
                </el-form>
                <p class="tip">温馨提示：</p>
				<p class="tip">©2017 JZKJ.All Rights Reserved.</p>
                <p class="tip">厦门锦众科技有限公司 版权所有</p>
            </div>
        </transition>

        <!--修改密码-->
        <el-dialog title="重置密码" :visible.sync="forgetpassShow" width="40%">
            <el-steps :active="active" finish-status="success">
                <el-step title="验证身份"></el-step>
                <el-step title="修改密码"></el-step>
            </el-steps>
            <!--验证身份-->
            <el-form :model="forgetpassForm" :rules="rules2" ref="forgetpassForm" v-if="active == 0" label-position="right" style="margin-top: 20px;">
                <el-form-item label="手机号" label-width="100px" prop="a00103">
                   <el-input v-model="forgetpassForm.a00103"  auto-complete="off" style="width: 85%;" placeholder="请输入帐号的手机号码"></el-input>
                </el-form-item>
                <el-form-item label="验证码" label-width="100px">
                    <el-input v-model="recode"  auto-complete="off" style="width: 60%;" placeholder="输入验证码"></el-input>
                    <el-button @click="sendCode" :loading="codeLoading" type="primary" plain>{{codeText}}</el-button>
                 </el-form-item>
            </el-form>
            <!--修改密码-->
            <el-form :model="forgetpassForm" :rules="rules3" ref="editPassForm" v-if="active == 1" label-position="right" style="margin-top: 20px;">
                <el-form-item label="新密码" label-width="100px" prop="a00104">
                   <el-input v-model="forgetpassForm.a00104" type="password" auto-complete="off" style="width: 85%;" placeholder="请输入你的新密码"></el-input>
                </el-form-item>
                <el-form-item label="再次输入" label-width="100px">
                   <el-input v-model="repass" type="password"  auto-complete="off" style="width: 85%;" placeholder="再次输入你的新密码"></el-input>
                </el-form-item>
            </el-form>
            <!--结果-->
            <h4 v-if="active == 2">修改成功, 快去登录吧。</h4>

            <div slot="footer" class="dialog-footer">
                <el-button v-if="active > 0 && active <= 1" @click="prev">上一步</el-button>
                <el-button v-if="active < 1" @click="next('forgetpassForm')">下一步</el-button>
                <el-button v-if="active == 1" @click="finish('editPassForm')">完成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { Login,SearchAccount,SendCodeByPhone,editAccount } from '@/interface/getData'
    import { Permision } from '@/util/permision'

    export default {
        name: 'Login',
        data(){
            var checkAccount = (rule,value,callback) => {
                if(!value || value == ''){
                    return callback(new Error('手机号码不能为空'));
                }
                var obj = {a00102:'',a00103:value,a00105:'' };
                this.searchAccount(obj,callback);
            };
            return{
                LoginForm: {
                    username: '',
                    password: '',
                },
                password:'',
                rules:{         //登录表单的验证规则
	                username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
					password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
                rules2:{
                    a00103:[{ validator: checkAccount, trigger: 'blur' }]
                },
                rules3:{
                    a00104:[
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { min: 5, message: '密码长度至少5个字符', trigger: 'blur' }
                    ]
                },
                showLogin:false,
                forgetpassShow:false,     //找回密码 窗口
                forgetpassForm:{
                     a00102:'',a00103:'',a00104:'',a00105:''
                },
                isSend:false,           // 60秒发送一次验证码
                codeText:'发送验证码',  //验证码按钮文字提示
                code:'',                 //验证码
                recode:'',
                repass:'',              
                codeLoading:false,        //发送验证码 过渡
                active:0,
                loading:false,
            }
        },
        mounted(){
            this.showLogin = true;

            $(function(){ 
                 // 去掉所有input的autocomplete, 显示指定的除外 
                 $('input').attr('autocomplete', 'new-password');      
            }); 
        },
        computed:{
        },
        methods:{
            ...mapMutations(['saveUserInfo','setPermision']),
            next(formName){ 
                 this.$refs[formName].validate((valid) => {
                     if(valid){
                         if(this.code == this.recode && this.code != ''){
                             this.active++; 
                         }else{
                             this.$message({type:'error',message:"验证码错误"});
                         }
                     }
                })
            },
            prev(){ 
                this.code = ''; //重置验证码
                this.active--;  
            },
            finish(formName){     //完成修改
                this.$refs[formName].validate(async (valid) => {
                     if(valid){
                         if(this.forgetpassForm.a00104 != this.repass){
                             this.$message({type:'warning',message:"两次输入的密码不一致"});
                             return;
                         }
                         const result = await editAccount(this.forgetpassForm);
                         if(result.status == 0){
                             this.active++;
                         }else{
                             this.$message({type:'error',message:"修改密码失败"});
                         }
                     }
                })    
            },
            submitForm(formName){         //登录
                this.$refs[formName].validate(async (valid) => {
                    if(!valid) return;
                    this.loading = true;
                    var data = {a00103:this.LoginForm.username,a00104:this.LoginForm.password};
                    const r = await Login(data);
                    console.log(r);
                    this.LoginForm = { username: '',password: '',};
                    if(r.status != 0){
                        this.$message({type:'error',message:r.msg});
                        this.loading = false;
                    }else{
                        this.saveUserInfo(r.data); //将用户数据存入state
                        this.setPermision(Permision(r.data.a00105));  //判断权限并存储
                        this.$message({type:"success",message:"登录成功"});
                        this.$router.push('home');
                        this.loading = false;              
                    }
                    
                    
                })
            },
            async searchAccount(obj,callback){       //验证账户是否存在
                const result = await SearchAccount(obj);
                if(result.status == 0){
                    if(result.data.length >= 1){
                        callback();
                    }else{
                        callback(new Error('该用户不存在！'));
                    }
                }else{
                    callback(new Error('该用户不存在！'));
                }
            },
            ForgetPass(){
                this.forgetpassShow = true;
                this.active = 0;
                this.code = '';
            },
            async sendCode(){     //发送验证码
                if(this.isSend){; return;}
                this.codeLoading = true;
                const result = await SendCodeByPhone({a00103:this.forgetpassForm.a00103});
                if(result.status == 0){
                    this.code = result.data;
                    this.changeText();
                }else{
                    this.$message({type:'error',message:"发送验证码失败, 请重试"});
                }
                this.codeLoading = false;
            },
            changeText(){   //改变发送验证码的文字
                var that = this;
                for(var i=1,t=60;i<=t;i++){
                    (function(_i,_t){
                        setTimeout(()=>{
                            if(_i == _t){
                                that.isSend = false;
                                that.codeText = "发送验证码";
                                that.code = '';     //重置验证码   实现验证码60秒失效一次
                            }else{
                                that.isSend = true;
                                that.codeText = _t-_i + "秒后重发";
                            }
                        },_i*1000)
                    }(i,t))
                }
            },
            
        }
    }
</script>


<style lang="less" scoped>
 @import '../assets/mixin.less';
.loginPage{
    background-color:#324057; 
    background-image: url(../assets/img/background3.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
}
.manage_tip{
    position: absolute;
    top: -170px;left: 0;
    width: 100%;
    p{
        font-size:22px;
        color:#fff;
        text-align:center;
        margin:0;
    }
    img{ width: 100px;height: 100px;}
}
.form_container{
    width: 300px;
    height: 250px;
	.ctp(300px, 250px);
	padding: 25px;
	border-radius: 5px;
	text-align: center;
	background-color: #fff;
	.submit_btn{
		width: 100%;
		font-size: 16px;
	}
}

.tip{
    margin: 0;
    font-size: 12px;
    color: #808080;
}
.forgetpass{ text-align: right; margin: 0;}
.forgetpass a{ text-decoration: underline; color: red;font-size: 14px; cursor: pointer;}

</style>