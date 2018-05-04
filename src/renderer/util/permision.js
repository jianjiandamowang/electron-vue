//用户权限设置文件
//权限  后台同时控制

/*********管理人员权限*********/
const Manager = {    
    type:"超级管理员",
    Level:'0',                  //权限等级
    NavIcon:['el-icon-setting','el-icon-edit-outline','el-icon-location-outline','el-icon-tickets','el-icon-share'], //左侧导航栏 管理员拥有所有导航
    homeDataVisible:[true,true,true,true],    //首页 总数据、产品数据、故障数据、工单数据 是否可见
    DevWarning:true,            //设备告警
    DevVisible:true,            //设备数据是否可见
    ProjectEdit:true,           //项目管理的权限
    passVisible:true,           //其他账户密码是否可见
    MsgChange:[true,true,true,true],    //修改他人帐号的权限  [管理员,运维, 售后, 物业,]  true为开放
    MsgDel:[false,true,true,true],      //删除他人帐号的权限
    typeChange:[false,false,false,false],   //身份转换的权限  true表示禁止
    createAccount:true,         //创建用户的权限
    editDev:true,               //修改设备的权限
    delDev:true,                //删除设备的权限
    orderRight:true,            //对工单的管理修改的权限
    orderAssign:true,           //对工单的指派权利
    orderAccept:false,          //接单权利  对售后开放
    orderFinish:true,           //完成工单的权利
}

/*********运维人员权限*********/
const Operations = {  
    type:"运维",
    Level:'1',
    NavIcon:['el-icon-setting','el-icon-edit-outline','el-icon-location-outline','el-icon-tickets','el-icon-share'],
    homeDataVisible:[true,true,true,true],
    DevWarning:true,
    DevVisible:true,
    ProjectEdit:true,
    passVisible:true,      
    MsgChange:[false,false,true,true], 
    MsgDel:[false,false,true,true],
    typeChange:[true,true,false,false],
    createAccount:true,
    editDev:true,  
    delDev:false,
    orderRight:true,  
    orderAssign:true,        
    orderAccept:false,     
    orderFinish:true,
}

/*********物业人员权限*********/
const Property = {  
    type:"物业",
    Level:'3',
    NavIcon:['el-icon-setting','el-icon-tickets','el-icon-share'],
    homeDataVisible:[true,true,false,true],
    DevWarning:false,
    DevVisible:false,
    ProjectEdit:false,
    passVisible:false,
    MsgChange:[false,false,false,false],
    MsgDel:[false,false,false,false],
    typeChange:[true,true,true,true], 
    createAccount:false,   
    editDev:false, 
    delDev:false, 
    orderRight:true,
    orderAssign:false,
    orderAccept:false,
    orderFinish:false,
}

/*********售后人员权限*********/
const AfterSale = { 
    type:"售后",
    Level:'2',
    NavIcon:['el-icon-setting','el-icon-tickets','el-icon-share'],
    homeDataVisible:[true,true,true,true],
    DevWarning:false,
    DevVisible:true,
    ProjectEdit:false,
    passVisible:false,  
    MsgChange:[false,false,false,false],
    MsgDel:[false,false,false,false], 
    typeChange:[true,true,true,true], 
    createAccount:false,  
    editDev:true, 
    delDev:false, 
    orderRight:false,
    orderAssign:false, 
    orderAccept:true,
    orderFinish:true,
}

var Permisions = { }; //用户权限

const Permision = type => {
    switch(type){
        case '0': Permisions = Manager; break;
        case '1': Permisions = Operations; break;
        case '2': Permisions = AfterSale; break;
        case '3': Permisions = Property; break;
    }
    return Permisions;
}


export {
    Permision,
}