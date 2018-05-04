import { baseUrl } from '@/util/env'
import { Message } from 'element-ui';
import { Notification } from 'element-ui';
import store from '@/store/index';
/****************************封装ajax******************************************/
const mAJAX = (url,data) => { 
    return $.ajax({
        url: url,type:'POST',data:data,
        xhrFields: {withCredentials: true},crossDomain:true,
        success(res){ 
            console.log(res)
            if(res.status == 1 && res.msg == '登录失效'){  //统一处理对所有登录失效操作进行重新登录
                Notification.info('由于长时间未操作，正在执行重连');
                var obj = {a00103:store.state.userInfo.a00106,a00104:store.state.userInfo.a00104};
                $.ajax({url: baseUrl+'g00101',type:'POST',data:obj,xhrFields: {withCredentials: true},crossDomain:true,
                    success(res){ 
                        if(res.status == 0){ 
                            Notification.info('重连成功');
                            mAJAX(url,data);   //重新执行上一次ajax操作
                        } 
                    },
                    error(){ Message.error('服务器异常');} });
            }
        },
        error(){ Message.error('服务器异常');} 
    });
}

/******************************首页数据显示**********************************/

/**
 * 首页设备数据获取 g20001
 */
export const DevTendencyData = data => $.ajax({url: baseUrl+'g20001',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DevTendencyData = data => mAJAX(baseUrl+'g20001',data);
/**
 *  首页故障数据获取 g20002
 */
export const ErrTendencyData = data => $.ajax({url: baseUrl+'g20002',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const ErrTendencyData = data => mAJAX(baseUrl+'g20002',data);
/**
 *  首页售后数据获取 g20003
 */
export const AfterTendencyData = data => $.ajax({url: baseUrl+'g20003',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AfterTendencyData = data => mAJAX(baseUrl+'g20003',data);
/**
 *  首页概览数据获取 g20000
 */
export const GetOverView = () => $.ajax({url: baseUrl+'g20000',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} }); 
// export const GetOverView = () => mAJAX(baseUrl+'g20000');
/******************************账户管理**********************************/

/**
 *  登录  g00101
 */
export const Login = data => $.ajax({url: baseUrl+'g00101',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const Login = data => mAJAX(baseUrl+'g00101',data);
/**
 * 验证身份 g00100
 */
export const checkUser = () => $.ajax({url: baseUrl+'g00100',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const checkUser = () => mAJAX(baseUrl+'g00100');
/**
 * 获取菜单 g10100
 */
export const getMenu = () =>  $.ajax({url: baseUrl+'g10100',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const getMenu = () =>  mAJAX(baseUrl+'g10100');
/**
 * 添加账户 g00102
 */
export const Addaccount = data => $.ajax({url: baseUrl+'g00102',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const Addaccount = data => mAJAX(baseUrl+'g00102',data);
/**
 * 账户信息列表 g00103
 */
export const AccountList = data => $.ajax({url: baseUrl+'g00103',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AccountList = data => mAJAX(baseUrl+'g00103',data);
/**
 * 修改账户信息 g00104
 */
export const editAccount = data => $.ajax({url: baseUrl+'g00104',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const editAccount = data => mAJAX(baseUrl+'g00104',data);
/**
 * 删除账户 g00105
 */
export const deleteAccount = data => $.ajax({url: baseUrl+'g00105',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const deleteAccount = data => mAJAX(baseUrl+'g00105',data);
/**
 * 多条件用户查询 g00106
 */
export const SearchAccount = data => $.ajax({url: baseUrl+'g00106',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const SearchAccount = data => mAJAX(baseUrl+'g00106',data);
/**
 * 发送验证码 g00180
 */
export const SendCode = () => $.ajax({url: baseUrl+'g00180',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const SendCode = () => mAJAX(baseUrl+'g00180');
/**
 * 发送验证码(根据手机号) g00181
 */
export const SendCodeByPhone = data => $.ajax({url: baseUrl+'g00181',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const SendCodeByPhone = data => mAJAX(baseUrl+'g00181',data);
/**
 * 账户退出 g00199
 */
export const Logout = () => $.ajax({url: baseUrl+'g00199',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const Logout = () => mAJAX(baseUrl+'g00199');

/************************** 项目管理 **************************/
/**
 * 新增项目 g00301
 */
export const AddProject = data => $.ajax({url: baseUrl+'g00301',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AddProject = data => mAJAX(baseUrl+'g00301',data);

/**
 * 获取项目 g00302
 */
export const GetProject = data => $.ajax({url: baseUrl+'g00302',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetProject = data => mAJAX(baseUrl+'g00302',data);

/**
 * 修改项目 g00303
 */
export const EditProject = data => $.ajax({url: baseUrl+'g00303',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const EditProject = data => mAJAX(baseUrl+'g00303',data);

/**
 * 删除项目 g00304
 */
export const DeleteProject = data => $.ajax({url: baseUrl+'g00304',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DeleteProject = data => mAJAX(baseUrl+'g00304',data);

/**
 * 获取所有项目 g00305
 */
export const GetAllProject = () => $.ajax({url: baseUrl+'g00305',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetAllProject = () => mAJAX(baseUrl+'g00305');

/************************** 设备管理 **************************/
/**
 * 产品添加  g00401
 */
export const AddProduct = data => $.ajax({url: baseUrl+'g00401',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AddProduct = data = mAJAX(baseUrl+'g00401',data);

/**
 * 获取产品 g00402
 */
export const getProduct = data => $.ajax({url: baseUrl+'g00402',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const getProduct = data => mAJAX(baseUrl+'g00402',data);

/**
 * 产品修改 g00403
 */
export const EditProduct = data => $.ajax({url: baseUrl+'g00403',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const EditProduct = data => mAJAX(baseUrl+'g00403',data);

/**
 * 删除产品 g00404
 */
export const DelProduct = data => $.ajax({url: baseUrl+'g00404',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DelProduct = data => mAJAX(baseUrl+'g00404',data);

/**
 * 获取所有产品（不分页） g00405
 */
export const getAllProduct = () => $.ajax({url: baseUrl+'g00405',type:'POST',xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const getAllProduct = () => mAJAX(baseUrl+'g00405');

/**
 * 添加设备 g00201
 */
export const AddDevice = data => $.ajax({url: baseUrl+'g00201',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AddDevice = data => mAJAX(baseUrl+'g00201',data);

/**
 * 查询设备 g00204
 */
// export const SearchDevice = data => $.ajax({url: baseUrl+'g00204',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
export const SearchDevice = data => mAJAX(baseUrl+'g00204',data);

/**
 * 查询可更新固件的设备 g00225
 */
export const SearchUpdateDev = data => $.ajax({url: baseUrl+'g00225',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const SearchUpdateDev = data => mAJAX(baseUrl+'g00225',data);

/**
 * 删除设备 g00202
 */
export const DelDevice = data => $.ajax({url: baseUrl+'g00202',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DelDevice = data => mAJAX(baseUrl+'g00202',data);

/**
 * 修改设备 g00203
 */
export const EditDevice = data => $.ajax({url: baseUrl+'g00203',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const EditDevice = data => mAJAX(baseUrl+'g00203',data);

/**
 *获取经纬度范围内的设备 g00207
 */
export const getMapDev = data => $.ajax({url: baseUrl+'g00207',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const getMapDev = data => mAJAX(baseUrl+'g00207',data);

/**
 * 查询未编辑设备 g00208
 */
export const GetUnEdit = data => $.ajax({url: baseUrl+'g00208',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetUnEdit = data => mAJAX(baseUrl+'g00208',data);

/**
 * 移除设备的项目关系 g00210
 */
export const RemoveDevProject = data => $.ajax({url: baseUrl+'g00210',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const RemoveDevProject = data => mAJAX(baseUrl+'g00210',data);

/**
 * 数据透传 g00220
 */
export const DataPass = data => $.ajax({url: baseUrl+'g00220',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DataPass = data => mAJAX(baseUrl+'g00220',data);

/**
 * 设备批量控制  g00221
 */
export const DevBatchControl = data => $.ajax({url: baseUrl+'g00221',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DevBatchControl = data => mAJAX(baseUrl+'g00221',data);

/**
 * 查询已有小区名称 g00209
 */
export const getStreet = data => $.ajax({url: baseUrl+'g00209',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const getStreet = data => mAJAX(baseUrl+'g00209',data);

/**************************售后管理*************************/

/**
 * 添加工单 g00502
 */
export const AddWorkOrder = data => $.ajax({url: baseUrl+'g00502',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AddWorkOrder = data => mAJAX(baseUrl+'g00502',data);

/**
 * 查询工单(获取工单) g00501
 */
export const GetWorkOrder = data => $.ajax({url: baseUrl+'g00501',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetWorkOrder = data => mAJAX(baseUrl+'g00501',data);

/**
 * 派发工单  g00503
 */
export const AssignOrder = data => $.ajax({url: baseUrl+'g00503',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const AssignOrder = data => mAJAX(baseUrl+'g00503',data);

/**
 * 完成工单 g00504
 */
export const FinishOrder = data => $.ajax({url: baseUrl+'g00504',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const FinishOrder = data => mAJAX(baseUrl+'g00504',data);

/**
 * 编辑修改工单信息 g00505
 */
export const EditOrder = data => $.ajax({url: baseUrl+'g00505',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const EditOrder = data => mAJAX(baseUrl+'g00505',data);

/**
 * 获取工单设备信息 g00506
 */
export const GetOrderDev = data => $.ajax({url: baseUrl+'g00506',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetOrderDev = data => mAJAX(baseUrl+'g00506',data);

/**************************固件管理*************************/

/**
 * 获取产品最新固件版本  g00606
 */
export const GetLatestVersion = data => $.ajax({url: baseUrl+'g00606',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetLatestVersion = data => mAJAX(baseUrl+'g00606',data);

/**
 * 固件测试 g00649
 */
export const VersionTest = data => $.ajax({url: baseUrl+'g00649',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const VersionTest = data => mAJAX(baseUrl+'g00649',data);

/**
 * 单个设备固件更新 g00650
 * 批量设备固件更新 
 */
export const VersionUpdate = data => $.ajax({url: baseUrl+'g00650',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const VersionUpdate = data => mAJAX(baseUrl+'g00650',data);

/**
 * 单个设备定时更新 g00651
 * 批量设备定时更新 
 */
export const SetTimeUpdate = data => $.ajax({url: baseUrl+'g00651',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const SetTimeUpdate = data => mAJAX(baseUrl+'g00651',data);

/**
 * 获取产品版本历史信息 g00602
 */
export const GetVersionList = data => $.ajax({url: baseUrl+'g00602',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetVersionList = data => mAJAX(baseUrl+'g00602',data);

/**
 * 发布产品固件版本 g00603
 */
export const ReleaseVersion = data => $.ajax({url: baseUrl+'g00603',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const ReleaseVersion = data => mAJAX(baseUrl+'g00603',data);

/**
 * 删除未发布的固件版本 g00607
 */
export const DeleteVersion = data => $.ajax({url: baseUrl+'g00607',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const DeleteVersion = data => mAJAX(baseUrl+'g00607',data);

/**
 * 获取定时任务报表 g00704
 */
export const GetReport = data => $.ajax({url: baseUrl+'g00704',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetReport = data => mAJAX(baseUrl+'g00704',data);

/**
 * 根据批次获取更新记录 g00702
 */
export const GetReportByBatch = data => $.ajax({url: baseUrl+'g00702',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetReportByBatch = data => mAJAX(baseUrl+'g00702',data);

/**
 * 获取设备电池电压变化  g00800
 */
export const GetBattery = data => $.ajax({url: baseUrl+'g00800',type:'POST',data:data,xhrFields: {withCredentials: true},crossDomain:true,error(){ Message.error('服务器异常');} });
// export const GetBattery = data => mAJAX(baseUrl+'g00800',data);



