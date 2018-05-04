<template>
    <!--添加设备-->
    <div style="height: 100%" class="body">
        <div>
            <el-row class="content_container">
                <el-col :span="14" :offset="4">
                    <header class="form_header">选择产品种类</header>
                    <el-form :model="deviceForm" ref="categoryForm" label-width="110px" class="form">
                        <el-row class="category_select">
                            <el-form-item label="产品种类">
                                <el-select v-model="deviceForm.a00202" @focus="productList" @change="selectProduct" placeholder="请选择种类" style="width:100%;">
                                    <el-option
                                        v-for="(item,index) in categoryList"
                                        :key="item.a00401"
                                        :label="item.a00402"
                                        :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row class="add_category_row" :class="showAddCategory? 'showEdit': ''">
                            <el-form class="add_category" :model="productForm" :rules="rules" label-width="110px">
                                <el-form-item label="产品名称" prop="a00402">
                                    <el-input v-model="productForm.a00402"></el-input>
                                </el-form-item>
                                <el-form-item label="产品描述" prop="a00403">
                                    <el-input v-model="productForm.a00403"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" size="small" @click="addProduct()">提交</el-button>
                                </el-form-item>
                            </el-form>
                        </el-row>
                        <div class="add_category_button" @click="showAddCategory = !showAddCategory">
                            <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i>
                            <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
                            <span>添加产品</span>
                        </div>
                    </el-form>
                    <header class="form_header">添加设备</header>
                    <el-form :model="deviceForm" size="small" :rules="devicerules" ref="deviceForm" label-width="110px" class="form device_form">
                        <el-form-item label="设备别名" prop="a00215">
						    <el-input v-model="deviceForm.a00215" style="width: 90%;"></el-input>
					    </el-form-item>
                        <el-form-item label="设备IMEI" prop="a00211">
						    <el-input v-model="deviceForm.a00211" style="width: 90%;"></el-input>
					    </el-form-item>
                        <el-form-item label="所属项目" prop="a00212">
                            <el-select v-model="deviceForm.a00212"  @focus="setProjectOptions" filterable placeholder="请选择">
                                <el-option v-for="(item,index) in ProjectOptions" :key="item.a00301" 
                                :label="item.a00302" :value="index">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="详细地址" prop="a00214">
						    <!--<area-select id="aselect" type='text' :level='2' v-model="deviceForm.a00214"></area-select>-->
                            <SelectAddress :address="address" @SetAddress="setAddress"></SelectAddress>
            
                        </el-form-item>
                        <el-form-item label="小区名称" prop="a00203">
						    <el-input v-model="deviceForm.a00203" style="width: 90%;"></el-input>
					    </el-form-item>
                        <el-form-item label="售后帐号" prop="a00208">
						    <!--<el-input v-model="deviceForm.a00208" style="width: 90%;"></el-input>-->
                            <el-select v-model="deviceForm.a00208"  @focus="setAftersaleOptions" filterable placeholder="请选择售后">
                                <el-option v-for="item in AftersaleOptions" :key="item.a00101" 
                                :label="item.a00102" :value="item.a00106">
                                    <span style="float: left">{{ item.a00106 }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物业帐号" prop="a00209">
						    <!--<el-input v-model="deviceForm.a00209" style="width: 90%;"></el-input>-->
                            <el-select v-model="deviceForm.a00209"  @focus="setPropertyOptions" filterable placeholder="请选择物业">
                                <el-option v-for="item in PropertyOptions" :key="item.a00101" 
                                :label="item.a00102" :value="item.a00106">
                                    <span style="float: left">{{ item.a00106 }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.a00102 }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        

                        <el-form-item>
                            <el-button type="primary" @click="addDev('deviceForm')">确认添加设备</el-button>
                        </el-form-item>
                        
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style>
    #aselect .area-select .area-selected-trigger{ padding: 0px 12px 0px 20px;}
</style>

<script>
    import { getAllProduct,AddProduct,AddDevice,AccountList,GetAllProject } from '@/interface/getData'
    import SelectAddress from '@/components/selectAddress'

    export default {
        name:'DeviceAdd',
        data(){
            var checkAddress = (rule,value,callback) =>{
                if(value){
                   if(value.province == "" || value.city == "" || value.district == ""){ 
                        return callback(new Error('请将地址信息补充完整'));
                   }else{
                       callback();
                   }
                }else{
                    return callback(new Error('请将地址信息补充完整'));
                }
            };
            return {
    			categoryList:null, //产品列表
                deviceForm:{
                    a00202:'',a00203:'',a00208:'',a00209:'',a00211:'',
                    a00212:'',a00214:'',a00215:'',a00217:'',a00218:'',
                },
                devicerules:{   //添加设备的 表单验证规则
                    a00215:[{ required:true,message:'设备别名不能为空', trigger: 'blur'}],
                    a00211:[{required:true,message:'设备IMEI不能为空', trigger: 'blur'}],
                    a00212:[{required:true,message:'请选择所属项目', trigger: 'blur'}],
                    a00214:[{ validator: checkAddress, trigger: 'blur'}],
                    a00203:[{required:true,message:'请填写小区名称', trigger: 'blur'}],
                    a00208:[{required:true,message:'请填写售后帐号', trigger: 'blur'}],
                    a00209:[{required:true,message:'请填写物业帐号', trigger: 'blur'}],
                },  
                productForm:{ a00402:"",a00403:""},
                rules:{ a00402:[{ required: true, message: '请输入产品名称', trigger: 'blur' },],},  //添加产品的 表单验证规则
                showAddCategory: false,
                AftersaleOptions:[],  //售后人员下拉数据
                PropertyOptions:[],   //物业人员下拉数据
                ProjectOptions:[],    //项目列表下拉数据
                address:{ province:'',city:'',district:''}
            }
        },
        mounted(){},
        methods:{
            /*************************获取数据*********************************/
            async productList(){  //获取产品
                const result = await getAllProduct();
                // console.log(result)
                if(result.status == 0){
                    this.categoryList = result.data
                }else{
                    this.$notify.error({title: '错误',message: '获取产品列表失败'});
                }
            },
            selectProduct(val){        //选中产品
                this.deviceForm.a00217 = this.categoryList[val].a00401;
                this.deviceForm.a00202 = this.categoryList[val].a00402;  
            },
            async setProjectOptions(){  //获取所有项目 数据
                const result = await GetAllProject();
                if(result.status == 0){
                    this.ProjectOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取项目列表失败'});
                }
            },
            async setAftersaleOptions(){  //获取售后人员 数据
                const result = await AccountList({a00105:'2'});
                if(result.status == 0){
                    this.AftersaleOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取售后人员列表失败'});
                }
            },
            async setPropertyOptions(){   //获取物业人员数据
                const result = await AccountList({a00105:'3'});
                if(result.status == 0){
                    this.PropertyOptions = result.data;
                }else{
                    this.$notify.error({title: '错误',message: '获取物业人员列表失败'});
                }
            },
            async addProduct(){ //添加产品
                if(!this.checkProForm()){ return; }
                const result = await AddProduct(this.productForm);
                if(result.status == 0){
                    this.$notify({title:'成功',message:'添加产品成功',type:'success'});
                }else{
                    this.$notify.error({title: '错误',message: '添加失败,请重试'});
                }
            },
            addDev(formName){  //添加设备
                if(!this.checkDevForm()){ return; }
                this.$refs[formName].validate(async (valid) => {
                     if(valid){
                        var form = this.deviceForm;
                        var data = {
                             a00202:form.a00202,a00203:form.a00203,a00208:form.a00208,
                             a00209:form.a00209,a00211:form.a00211,a00212:this.ProjectOptions[form.a00212].a00302,
                             a00214:form.a00214.province + form.a00214.city + form.a00214.district,
                             a00215:form.a00215,a00217:form.a00217,a00218:this.ProjectOptions[form.a00212].a00301,
                        }
                        const result = await AddDevice(data);
                        if(result.status == 0){
                            this.$notify({title:'成功',message:'设备添加成功',type:'success'});
                            this.resetForm();   
                        }else{
                            this.$notify.error({title: '错误',message: '操作失败,请重试'});
                        }
                     }
                })   
            },
            resetForm(){    //重置表单
                    this.deviceForm.a00202 = '';this.deviceForm.a00203 = '';this.deviceForm.a00208 = '';
                    this.deviceForm.a00209 = '';this.deviceForm.a00211 = '';this.deviceForm.a00212 = '';
                    this.deviceForm.a00215 = '';this.deviceForm.a00217 = '';this.deviceForm.a00218 = '';
                    this.deviceForm.a00214 = '';this.address = { province:'',city:'',district:''};
            },
            setAddress(val){       //设置地址信息
                this.deviceForm.a00214 = val;
            },
            checkDevForm(){         //设备 字段检查策略
                if(!this.deviceForm.a00202 && this.deviceForm.a00202 == ''){
                    this.$message({type:'warning',message:"请选择设备的产品类型"});
                    return false;
                }
                if(!this.deviceForm.a00217 && this.deviceForm.a00217 == ''){
                    this.$message({type:'warning',message:"请选择设备的产品类型"});
                    return false;
                }
                return true;
            },
            checkProForm(){         //产品 字段检查策略
                if(!this.productForm.a00402 && this.productForm.a00402 == ''){
                    this.$message({type:'warning',message:"请填写需要添加的产品类型名称"});
                    return false;
                }
                return true;
            }
        },
        components:{
            SelectAddress
        }
    }


</script>

<style lang="less" scoped>
    .content_container{ padding: 40px;  background: #fff;  }
    .form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
    .device_form{border: 1px solid #eaeefb;padding: 10px 10px 0;}
   .form_header{text-align: center;margin-bottom: 10px;}
   .category_select{border: 1px solid #eaeefb;padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;border-top-left-radius: 6px;}
    .add_category_row{height: 0;overflow: hidden;transition: all 400ms;background: #f9fafc;}
    .showEdit{height: 185px ;}
    .add_category{background: #f9fafc;padding: 10px 30px 0px 10px;border: 1px solid #eaeefb;border-top: none;}
	.add_category_button{
		text-align: center;line-height: 40px;
		border-bottom-right-radius: 6px;border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;border-top: none;transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{font-size:14px;color:#999;transition: all 400ms;	}
		.edit_icon{color: #ccc;transition: all 400ms;}
	}
</style>
