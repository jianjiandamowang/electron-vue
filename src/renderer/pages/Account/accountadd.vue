<template>
    <div>
        <div class="content_container">
        <el-row style="padding-top: 20px;">
            <el-col :span="14" :offset="4">
                <el-form ref="form" :model="form" :rules="rules" label-width="110px" class="form">
                   <div class="form_header">选择账户类型</div>
                    <el-row class="category_form">
                        <el-radio v-model="form.a00105" label="1" :disabled="disabled[0]">运维管理员</el-radio>
                        <el-radio v-model="form.a00105" label="2" :disabled="disabled[1]">售后人员</el-radio>
                        <el-radio v-model="form.a00105" label="3" :disabled="disabled[2]">物业人员</el-radio>
                    </el-row>
                     <div class="form_header">填写账户信息</div>
                    <el-row class="base_form">
                        <el-form-item label="用户名" prop="a00102">
                            <el-input v-model="form.a00102" placeholder="请输入你的用户名" required="required"></el-input>
                        </el-form-item>
                        <el-form-item label="工号" prop="a00106">
                            <el-input v-model="form.a00106" placeholder="请输入你的工号" required="required"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="a00103">
                            <el-input v-model="form.a00103" placeholder="请输入你的手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="a00104">
                            <el-input v-model="form.a00104" type="password" placeholder="请输入你的密码"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="repass" type="password" placeholder="再次输入密码"></el-input>
                        </el-form-item>
                       <el-form-item> 
                            <el-button @click="reset">取 消</el-button>
                            <el-button type="primary" @click="add('form')">确 定</el-button>
                       </el-form-item> 
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { Addaccount } from '@/interface/getData'

    export default {
        name:'accountAdd',
        data(){
            var checkPhone = (rule, value, callback) => {
                var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
                if (!myreg.test(value)) {  
                    return callback(new Error('手机格式不正确'));    
                }else{
                    callback();
                }
            };
            return{
                repass:null,
                form:{
                    a00102:'', //用户名
                    a00103:'',  //手机
                    a00104:'',  //密码
                    a00105:'', 
                    a00106:''   //工号
                },
                rules:{
                    a00102: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
                    a00103: [{ required: true, message: '请输入手机号', trigger: 'blur' },
                             { validator: checkPhone, trigger: 'blur' }],
                    a00104: [{ required: true, message: '请输入密码', trigger: 'blur' },],
                    a00106: [{ required: true, message: '请输入工号', trigger: 'blur' },],
                },
                permision:null,  //权限等级
                disabled:[true,true,true],    //创建用户的权限限制
            }
        },
        created(){
            this.setPermision(); 
        },
        methods:{
            add(formName){  //添加账户
                if(this.form.a00105 == ''){this.$message({message: '请选择账户类型',type: 'warning'}); return;}
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        if(this.form.a00104 != this.repass){this.$message({message: '两次输入的密码不一致',type: 'warning'}); return;}
                        const result = await Addaccount(this.form);
                        if(result.status == 0){
                            this.$notify({ title: '成功',message: '已成功添加账户', type: 'success'});
                            this.reset();
                        }else{
                            this.$notify.error({ title: '错误', message: '添加失败, '+result.msg});
                        }
                    }
                })
            },
            reset(){    //取消重置表单
                this.form = { a00102:"",a00103:"",a00104:"",a00105:"",a00106:""};
                this.repass = '';
            },
            setPermision(){  //权限控制    运维可以创建售后和业务帐号
                if(this.Permision.Level == '0') this.disabled = [false,false,false];
                if(this.Permision.Level == '1') this.disabled = [true,false,false];
                
            }
        },
        computed:{
            ...mapState(['userInfo','Permision']),
        },
    }
</script>

<style lang="less" scoped>

	.form{
		min-width: 400px;
		margin-bottom: 30px;
        background: #fff;
	}
    .category_form{
        padding:30px;
        text-align: center;
        border: 1px solid #eaeefb;
        &:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
    }

    .base_form{
        padding: 20px 30px 10px 10px;
        border: 1px solid #eaeefb;
        &:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
    }
    
    .form_header{
		text-align: center;
		margin: 20px 0;
	}

    .content_container{
        padding: 40px;
        background: #fff;
        border-top: 1px solid #eee;
    }

</style>