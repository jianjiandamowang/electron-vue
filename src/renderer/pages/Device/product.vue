<template>
    <el-row type="flex" justify="center">
        <el-col :span="23"  class="content">
        <!--产品管理-->
            <!---->
            <div class="head">
                <h4 class="left">
                    产品管理<span v-if="count > 0">({{count}})</span>
                </h4>
                <div class="right" style="margin-right: 20px">
                    <el-tooltip class="item" effect="dark" content="添加产品" placement="top">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="openAdd()">添加产品</el-button>
                    </el-tooltip>
                </div>
                <div class="clearbotn"></div>
            </div>
            <!---->
            <div class="table_container">
                <el-table
                    :data="tableData" size="mini"
                    v-loading="loading"
                    highlight-current-row
                    element-loading-text="拼命加载中"
                    :row-key="row => row.index"
                    style="width: 100%">
                    <el-table-column label="#" width="50">
                    <template slot-scope="scope">#</template>
                    </el-table-column>
                    
                    <el-table-column property="a00402" label="产品名称" width="220"></el-table-column>
                    <el-table-column property="a00404" label="产品密钥">
                        <!--<template slot-scope="scope">
                            <span class="secretkey" @click="getSecretKey">获取密钥</span>
                        </template>-->
                    </el-table-column>
                    <el-table-column property="a00405" label="产品KeY"></el-table-column>
                    <el-table-column property="a00403" label="产品描述"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="openEdit(scope.row,scope.$index)">编辑</el-button>
                            <el-button @click="Del(scope.row,scope.$index)" type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="count">
                    </el-pagination>
                </div>
            </div>
            <!--编辑-->
            <el-dialog title="编辑" :visible.sync="dialogShow">
                <el-tabs  tab-position="left" style="min-height: 200px;">
                    <el-tab-pane label="产品编辑" >
                        <!---->
                        <el-form size="small" :model="editProduct" label-width="120px">
                            <el-form-item label="产品名称">
                                <el-input  v-model="editProduct.a00402" class="edit_input"></el-input>
                            </el-form-item>
                            <el-form-item label="产品描述">
                                <el-input type="textarea" v-model="editProduct.a00403" class="edit_input"></el-input>
                            </el-form-item>
                            <el-form-item>
                               <el-button type="primary" size="mini" @click="FinishEdit()">确 定 修 改</el-button>
                            </el-form-item>
                        </el-form>
                        <!---->
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogShow = false">返 回</el-button>
                </div>
            </el-dialog>
            <!--添加产品-->
            <el-dialog title="添加产品" :visible.sync="dialogShow2">
                <el-form :model="productFrom" :rules="rules" label-width="120px">
                    <el-form-item label="产品名称" prop="a00402">
                        <el-input  v-model="productFrom.a00402" class="edit_input"></el-input>
                    </el-form-item>
                    <el-form-item label="产品描述" prop="a00403">
                        <el-input type="textarea" v-model="productFrom.a00403" class="edit_input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="dialogShow2 = false">返 回</el-button>
                        <el-button type="primary" size="small" @click="AddProduct()">提 交</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import { AddProduct,getProduct,EditProduct,DelProduct,SearchDevice } from '@/interface/getData'

    export default {
        name:'Product',
        data(){
            return{
                tableData:[],
                loading:false,      //加载 过渡动画
                currentPage:1,
                pageSize:10,
                count:null,
                editProduct:{ a00401:'',a00402:'',a00403:''},  
                productFrom:{ a00402:'',a00403:''},
                rules:{
                    a00402: [{ required: true, message: '请输入产品名称', trigger: 'blur' },],
                },
                EditIndex:null,
                dialogShow:false,
                dialogShow2:false,

                devSearch:{     //查询设备关键字
                    a00202:'',a00203:'',a00206:'',a00211:'',a00212:'',a00214:'',currentPage:1
                }
            }
        },
        mounted(){
            this.getProductList(); 
        },
        methods:{
            handleCurrentChange(val){
                this.currentPage = val;
                this.getProductList();
            },
            openEdit(row,index){    //打开编辑窗口
                this.editProduct.a00401 = row.a00401;
                this.editProduct.a00402 = row.a00402;
                this.editProduct.a00403 = row.a00403;
                this.editProduct.a00404 = row.a00404;
                this.editProduct.a00405 = row.a00405;
                this.dialogShow = true;
                this.EditIndex = index; 
            },
            Del(row,index){  //删除产品
                this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
                    confirmButtonText: '确定',cancelButtonText: '取消', type: 'warning'
                }).then(async () => {
                    this.devSearch.a00202 = row.a00402;
                    const allow = await SearchDevice(this.devSearch);
                    if(allow.data.items.length > 0){
                        this.$notify({title: '警告',message: '该产品下拥有设备,无法删除',type:'warning'});
                        return;
                    }
                    
                    const result = await DelProduct({a00401:row.a00401});
                    if(result.status == 0){
                        this.$notify({title:'成功',message:'产品已删除',type:'success'});
                        this.getProductList();
                    }else{
                        this.$notify.error({title: '错误',message: '产品删除失败,请重试'});
                    }
                }).catch(()=>{
                    this.$notify.info({title:'消息',message:'已取消该操作'})
                })
            },
            async FinishEdit(){  //修改编辑
                const result = await EditProduct(this.editProduct);
                if(result.status == 0){
                    this.$notify({title:'成功',message:'产品信息编辑成功',type:'success'});
                    this.getProductList();
                    this.dialogShow = false;
                }else{
                    this.$notify.error({title: '错误',message: '修改产品信息失败,请重试'});
                }
                
            },
            openAdd(){  //打开产品添加窗口
                this.dialogShow2 = true
            },
            async AddProduct(){  //添加产品
                const result = await AddProduct(this.productFrom);
                if(result.status == 0){
                     this.$notify({title:'成功',message:'添加产品成功',type:'success'});
                     this.productFrom.a00402 = "";
                     this.productFrom.a00403 = "";
                     this.currentPage = 1;
                     this.getProductList(); //重新刷新数据
                }else{
                    this.$notify.error({title: '错误',message: '添加失败,请重试或者联系超级管理员'});
                }
            },
            async getProductList(){
                this.loading = true;
                const result = await getProduct({currentPage: this.currentPage});
                if(result.status == 0){
                    this.count = result.data.totalNum; 
                    this.tableData = result.data.items;
                    // this.pageSize = result.data.pageSize;
                    this.loading = false;
                }else{
                     this.$notify.error({title: '错误',message: '获取产品列表失败,请刷新页面或者重新登录'});
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .head{ color: #333; height: 60px; border-bottom:1px solid #eee;background: #f8f8f8; }
    .left{ float: left;  padding:0 15px; background: #2ABB9C; color: #fff; margin: 0; height: 60px; line-height: 60px;}
    .right{ float:right; margin-top: 16px; margin-right: 20px;}
    .clearbotn{ clear: both;}
    .table_container{border: 1px solid #f8f8f8; padding: 5px;background: #fff; }
    .edit_input{ width: 80%;}
    .secretkey{ cursor: pointer;text-decoration: underline;color:#66B1FF;  }
</style>