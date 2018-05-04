<template>
        <!--用户组件-->
        <el-row type="flex" justify="center">
        <el-col :span="23" class="content">
            <div class="head">
                <h4 class="left">{{title}}({{count}})</h4>
                <div class="right" style="margin-right: 20px">
                    <el-tooltip class="item" effect="dark" content="添加人员" placement="top">
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addaccount">添加</el-button>
                    </el-tooltip>
                </div>
                <div class="right" style="margin-right: 20px">
                    <el-input
                        placeholder="根据姓名查询"
                        prefix-icon="el-icon-search"
                        size="mini"
                        v-model="search">
                    </el-input>
                    <!--<input type="text" name="" value="">-->
                </div>
                <div class="clearbotn"></div>
            </div>
            <!---->
            <div class="table_container">
            <el-table :data="tableData"  highlight-current-row size="small"
                v-loading="loading"  element-loading-text="拼命加载中"  :row-key="row => row.a00101"
                style="width: 100%;min-height: 490px;">
                <el-table-column property="a00106" label="工号"></el-table-column>
                <el-table-column property="a00102" label="姓名"></el-table-column>
                <el-table-column property="a00103" label="帐号"></el-table-column>
                <el-table-column property="a00103" label="手机"></el-table-column>
                <el-table-column label="角色类型">
                  <template slot-scope="scope">
                    <span  v-if='scope.row.a00105 == 0'>超级管理员</span>
                    <span  v-if='scope.row.a00105 == 1'>运维人员</span>
                    <span  v-if='scope.row.a00105 == 2'>售后人员</span>
                    <span  v-if='scope.row.a00105 == 3'>物业人员</span>
                  </template>
                </el-table-column>
                <el-table-column property="" label="特定角色信息"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="openEdit(scope.row,scope.$index)">编辑</el-button>
                        <el-button @click="handleClick(scope.row,scope.$index)" type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="count">
                </el-pagination>
            </div>
            </div>
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
            <el-dialog title="编辑信息" :visible.sync="dialogShow">
            <el-form :model="form" v-if="form" size="small">
                <el-form-item label="姓名" label-width="100px">
                    <el-input v-model="form.a00102" auto-complete="off"  style="width: 65%" :disabled="allow"></el-input>
                </el-form-item>
                <el-form-item label="工号" label-width="100px">
                    <p style="margin: 0;"><span class="el-icon-tickets">{{form.a00106}}</span></p>
                </el-form-item>
                <el-form-item label="手机号" label-width="100px">
                    <p style="margin: 0;"><span class="el-icon-phone">{{form.a00103}}</span> <el-button type="text" size="small" @click="editPhoneShow = true" v-if="!allow">修改手机号</el-button></p>
                </el-form-item>
                <el-form-item label="密码" label-width="100px">
                    <el-input v-if="!allow && Permision.passVisible" type="password" auto-complete="off"  v-model="form.a00104"  style="width: 65%;display: none;"></el-input>
                    <el-input v-if="!allow && Permision.passVisible" type="password" auto-complete="off"  v-model="form.a00104"  style="width: 65%"></el-input>
                    <el-input v-else  auto-complete="off" style="width: 65%" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" label-width="100px">
                    <el-select v-model="form.a00105" placeholder="请选择" @focus='typeChange' :disabled="allow">
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
                <el-button @click="dialogShow = false">返 回</el-button>
                <el-button type="primary" @click="edit()">保 存 修 改</el-button>
            </div>
            </el-dialog>
        </el-col>
        </el-row>
</template>

<script>
    import { mapState } from 'vuex'
    import { deleteAccount,editAccount,SearchAccount } from '@/interface/getData'

    export default {
        name:'UserTable',
        data(){
            return{
                tableData:null,  //表单显示的数据
                currentPage:1,  //当前页
                count:null,    //总数
                pageSize:10,   //每页显示的数目
                search:'',
                searchList:null,  
                loading:true,  //加载过渡   
                dialogShow:false,
                EditIndex:null,   //当前正在编辑的索引
                form:{
                    a00101:'',a00102:'',a00103:'',a00104:'',a00105:'',a00106:''
                },
                options:[
                    {label:"超级管理员",value:"0"},
                    {label:"运维人员",value:"1"},
                    {label:"售后人员",value:"2"},
                    {label:"物业人员",value:"3"},
                ],
                allow:false,        //权限开关
                phoneForm:{
                    password:'',newPhone:''
                },
                editPhoneShow:false,
       
            }
        },
        props:['accountData','title','type'],
        mounted(){ },
        methods:{
             handleClick(row,index) {
                var that = this;
                // console.log(row);
                var DelPermision = this.setDelPermision(row.a00105);
                if(!DelPermision){
                    this.$message({type:'warning',message:"权限不足,无法执行该操作"});
                    return;
                }
                this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var flag = that.delete(row);
                    if(flag){  //删除成功
                        this.$notify({ title: '成功', message: '已成功删除该账户', type: 'success' });
                        this.tableData.splice(index,1); 
                    }else{   //删除失败
                        this.$notify.error({ title: '错误', message: '删除失败,请重试或联系超级管理员'});
                    }
                }).catch(() => {
                    this.$notify.info({title: '消息', message: '已取消删除该账户' });        
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.sortPage(this.accountData); //分页显示
                // this.offset = (val - 1)*this.limit;
               
            },
            addaccount(){  //添加账户
                this.$router.push('addaccount');
            },
            async delete(item){
                const result = await deleteAccount({a00106:item.a00106});
                if(result.status == 0){
                    return true;
                }else{
                    return false;
                }
            },
            sortPage(data){  //数据分页
                this.tableData = [];
                this.count = data.length;
                for(var i=(this.currentPage-1)*this.pageSize;i<(this.currentPage*this.pageSize);i++ ){  //分页
                      if(i == this.count) break;
                       this.tableData.push(data[i]); 
                }
                this.loading = false;
            },
            goSearch(){  // 查询 并 匹配结果
                var that = this;
                this.searchList = [];
                this.accountData.forEach(function(item,index){
                    if( item.a00102.indexOf(that.search) >= 0 ){
                        that.searchList.push(item);
                    }
                })
                this.sortPage(this.searchList);
                // this.tableData = this.searchList;
            },
            openEdit(row,index){  //打开编辑信息页
                this.allow = this.setPermision(row.a00105); //权限判断
                this.form.a00101 = row.a00101;
                this.form.a00102 = row.a00102;
                this.form.a00103 = row.a00103;
                this.form.a00104 = row.a00104;
                this.form.a00105 = row.a00105;
                this.form.a00106 = row.a00106;
                
                this.EditIndex = index;
                this.dialogShow = true;
            },
            async editPhone(){    //修改电话
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
            async edit(){  //编辑信息
                const result = await editAccount({a00102:this.form.a00102,a00104:this.form.a00104,a00105:this.form.a00105,a00106:this.form.a00106});
                if(result.status == 0){
                    this.$notify({title: '成功',message: '修改账户信息成功', type: 'success' });
                    var obj = Object.assign({},this.form);
                    this.tableData.splice(this.EditIndex,1,obj);
                    this.dialogShow = false;
                }else{
                    this.$notify.error({ title: '错误',message: '修改失败'});
                }
            },
            setPermision(args){  //修改权限设置
                switch(args){
                    case '0':
                        if(this.Permision.MsgChange[0]){ return false;}else{ return true;}
                        break;
                    case '1':
                        if(this.Permision.MsgChange[1]){ return false;}else{ return true;}
                        break;
                    case '2':
                        if(this.Permision.MsgChange[2]){ return false;}else{ return true;}
                        break;
                    case '3':
                        if(this.Permision.MsgChange[3]){ return false;}else{ return true;}
                        break;
                }
            },
            setDelPermision(args){  //删除权限设置
                switch(args){
                    case '0':
                        if(this.Permision.MsgDel[0]){ return true;}else{ return false;}
                        break;
                    case '1':
                        if(this.Permision.MsgDel[1]){ return true;}else{ return false;}
                        break;
                    case '2':
                        if(this.Permision.MsgDel[2]){ return true;}else{ return false;}
                        break;
                    case '3':
                        if(this.Permision.MsgDel[3]){ return true;}else{ return false;}
                        break;
                }
            },
            typeChange(){
                this.options = [
                    {label:"超级管理员",value:"0",disabled:this.Permision.typeChange[0]},
                    {label:"运维人员",value:"1",disabled:this.Permision.typeChange[1]},
                    {label:"售后人员",value:"2",disabled:this.Permision.typeChange[2]},
                    {label:"物业人员",value:"3",disabled:this.Permision.typeChange[3]},
                ]
            }
        },
        computed:{
            ...mapState(['userInfo','Permision']),
        },
        watch:{
            accountData:function(){
                // console.log(this.accountData)
                this.sortPage(this.accountData)
            },
            search:function(){
                this.goSearch();
            }
        }
    }

</script>

<style lang="less" scoped>
    .head{
        color: #333; height: 60px; 
        border-bottom:1px solid #eee;
        background: #f8f8f8; 
    }
    .left{ float: left;  padding:0 15px; background: #2ABB9C; color: #fff; margin: 0; height: 60px; line-height: 60px;}
    .right{ float:right; margin-top: 16px;}
    .clearbotn{ clear: both;}
    .content_container{
        padding: 40px;
        background: #EAEDF2;
    }
    .table_container{
        border: 1px solid #f8f8f8;
        padding: 5px;
        background: #fff;
    }
</style>
