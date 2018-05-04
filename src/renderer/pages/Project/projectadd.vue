<template>
    <div class="body">
        <div class="content_container">
            <el-row>
                <el-col :span="14" :offset="4">
                    <el-form size="small" ref="form" :model="form" :rules="rules" label-width="110px" class="form">
                        <header class="form_header">选择项目所在地</header>
                        <el-row class="category_form">
                            <SelectAddress :address="address" @SetAddress="setAddress"></SelectAddress>
                        </el-row>  

                        <header class="form_header">项目基本信息</header>
                        <el-row class="base_form">
                            <el-form-item label="项目名称" prop="a00302">
                                <el-input v-model="form.a00302" placeholder="" required="required"></el-input>
                            </el-form-item>
                            <el-form-item label="项目描述" prop="a00306">
                                <el-input v-model="form.a00306" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="项目负责人" prop="a00304">
                                <el-input v-model="form.a00304" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="责任人电话" prop='a00305'>
                                <el-input v-model="form.a00305" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="绑定物业" prop='a00307'>
                                <!--<el-input v-model="form.a00307" placeholder=""></el-input>-->
                                <!---->
                                <el-select v-model="form.a00307"  @focus="setPropertyOptions" filterable placeholder="请选择物业">
                                    <el-option v-for="item in PropertyOptions" :key="item.a00101" 
                                    :label="item.a00102" :value="item.a00106">
                                        <span style="float: left">{{ item.a00106 }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                    </el-option>
                                </el-select>
                                <!---->
                            </el-form-item>
                            <el-form-item label="绑定售后" prop='a00308'>
                                <!--<el-input v-model="form.a00308" placeholder=""></el-input>-->
                                <el-select v-model="form.a00308"  @focus="setAftersaleOptions" filterable placeholder="请选择售后">
                                    <el-option v-for="item in AftersaleOptions" :key="item.a00101" 
                                    :label="item.a00102" :value="item.a00106">
                                        <span style="float: left">{{ item.a00106 }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="截止日期" prop='a00306'>
                               <el-date-picker v-model="form.a00306" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="续费状态" prop='a00309'>
                               <!--<el-date-picker v-model="form.a00306" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>-->
                               
                            </el-form-item>
                            <el-form-item> 
                                <el-button @click="reset">取 消</el-button>
                                 <el-button type="primary" @click="submit('form')">提交</el-button>
                            </el-form-item> 
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import SelectAddress from '@/components/selectAddress'
    import { AddProject,AccountList } from '@/interface/getData'
 
    export default {
        name:'projectAdd',
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
                form:{ 
                    a00302:'',a00303:'',a00304:'',a00305:'',a00306:'',a00307:'',a00308:''  //第三次需求改动
                },
                rules:{
                    a00302:[ {required:true,message:'项目名称不能为空',trigger:'blur' }],
                    a00304:[{required:true,message:'请选择项目负责人',trigger:'blur' }],
                    a00305:[{required:true,message:'请填写责任人的联系方式',trigger:'blur'},
                            { validator: checkPhone, trigger: 'blur' }],
                    // a00307:[{required:true,message:'请选择项目的物业',trigger:'blur' }],
                    // a00308:[{required:true,message:'请选择项目的售后',trigger:'blur' }],
                },
                address:{province:'',city:'',district:''},
                PropertyOptions:[],  //物业人员下拉数据
                AftersaleOptions:[],  //售后人员下拉数据
            }
        },
        methods:{
            reset(){    //重置表单
                this.form = { a00302:'',a00303:'',a00304:'',a00305:'',a00306:''};
                this.address = {province:'',city:'',district:''};
            },
            setAddress(val){       //设置地址信息
                this.form.a00303 = val;
            },
            submit(forName){       //提交表单 新建项目
                if(!this.checkAddress()){ return; }
                this.$refs[forName].validate(async (valid) => {
                    if(!valid) return;
                    this.form.a00303 = this.objectToStr(this.address);
                    const result = await AddProject(this.form);
                    if(result.status == 0){
                        this.$notify({title:'成功',message:'新建项目成功,请在项目列表中编辑',type:'success'});
                        this.reset();
                    }else{
                        this.$notify.error({title: '错误',message: '新建项目失败,请重试'});
                    }
                })
            },
            async setAftersaleOptions(){  //获取售后人员 数据
                if(this.AftersaleOptions.length > 0) return;
                const result = await AccountList({a00105:'2'});
                if(result.status == 0){
                    this.AftersaleOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取售后人员列表失败'});
                }
            },
            async setPropertyOptions(){   //获取物业人员数据
                if(this.PropertyOptions.length > 0) return;
                const result = await AccountList({a00105:'3'});
                if(result.status == 0){
                    this.PropertyOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取物业人员列表失败'});
                }
            },
            /*******************util******************/
            checkAddress(){
                if(!this.form.a00303 || this.form.a00303 == ""){
                    this.$message({type:'warning',message:"请选择地址信息！"});
                    return false;
                }
                if(this.form.a00303.province == "" || this.form.a00303.city == "" || this.form.a00303.district == ""){
                    this.$message({type:'warning',message:"请选择地址信息！"});
                    return false;
                }
                return true;
            },
            objectToStr(obj){
                if(typeof(obj) == 'object'){
                    return obj.province + obj.city + obj.district;
                }else{
                    return '';
                }
            }
        },
        components:{
            SelectAddress
        }
    }

</script>

<style lang="less" scoped>
    .content_container{ padding: 40px; background: #fff;}
    .form{ background: #fff;}
    .form_header{   text-align: center; margin: 20px 0;}
    .category_form{ padding:30px;   text-align: center; border: 1px solid #eaeefb;
        &:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;	transition: all 400ms;
		}
    }

    .base_form{ padding: 20px 30px 10px 10px; border: 1px solid #eaeefb;
        &:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;	transition: all 400ms;
		}
    }


</style>

