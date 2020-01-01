import http from './config.js'
import store from '../store/index'
var commonHeader = store.state.login.header;
var userId = store.state.userId;
var body = {
    "clinicId": "90000",
    "roleType": "1",
    "roleId": userId,
};

export const baseUrl = 'https://nfys-test.kinglian.cn';   //测试
//export const baseUrl = 'https://nfys.kinglian.cn';   //正式



//获取购物车特推商品
export function recommendComList(params) {
    params.header = commonHeader;
    var url = baseUrl + '/mall/appMall/recommendComList';
    return http.post(url, params)
}


//获取用户相关信息及xmpp相关
export var getAccountInfoByOrderId = function (params) {
    var url = baseUrl + '/appService/accountInfo/getAccountInfoByOrderId';
    return http.post(url, params)
}

//获取订单状态
export var getVisitOrderState = function (params, orderId) {
    params.header = commonHeader;
    params.body = body;
    params.body.orderId = orderId;
    var url = baseUrl + '/appService/inquiryOrder/getInquiryOrderDetails';
    return http.post(url, params)
}

//获取病人信息
export var getVisitPatient = function (params, orderId) {
    params.header = commonHeader;
    params.body = body;
    params.body.orderId = orderId;
    var url = baseUrl + '/appService/inquiryOrder/visitPatientDetail';
    return http.post(url, params)
}

//获取医生名片
export var getNameCard = function (params) {
    var url = baseUrl + '/appService/employee/getEmployeeInfoById';
    return http.post(url, params)
}

//获取聊天信息
export var queryMsgByOrderId = function (params) {
    var url = baseUrl + '/appService/msgoffline/queryMsgByOrderId';
    return http.post(url, params)
}

//保存聊天信息
export var saveMsg = function (params) {
    var url = baseUrl + '/appService/msgoffline/saveMsg';
    return http.post(url, params)
}

//上传图片
export var chatImgUpload = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/oss/oss/upload';
    return http.post(url, params, { headers: { "Content-Type": 'multipart/form-data', 'processData': false } })
}

//上传图片
export var visitPatientDetail = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/inquiryOrder/visitPatientDetail';
    return http.post(url, params)
}
//获取渠道商品 或 栏目商品 列表
export var getChannelClassiCommodityList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/channelComm/getChannelClassiCommodityList';
    return http.post(url, params)
}
//获取分类
export var getChannelClassification = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/channelCommClassification/getChannelClassification';
    return http.post(url, params)
}
//搜索
export var searchComm = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/channelComm/searchComm';
    return http.post(url, params)
}

//首页banner
export var pic = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/appPic/pic';
    return http.post(url, params)
}

//获取栏目列表
export var getColumnList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/column/getColumnList';
    return http.post(url, params)
}
//获取推荐商品
export var getRecommendComm = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/columnComm/getRecommendComm';
    return http.post(url, params)
}
//商品详情
export var getCommDetails = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/channelComm/getCommDetails';
    return http.post(url, params)
}

//加入购物车
export var saveComm = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/saveComm';
    return http.post(url, params)
}

//获取购物车数量
export var getShopCarNum = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/getShopCarNum';
    return http.post(url, params)
}

//获取用户购物车/需求清单内数量
export var getShoppingCarComm = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/getShoppingCarComm';
    return http.post(url, params)
}

//更改购物车/需求清单选中状态
export var changeSelect = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/changeSelect';
    return http.post(url, params)
}

//购物车全选/全不选
export var chooseAll = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/chooseAll';
    return http.post(url, params)
}

//更改购物车数量
export var changeCarNum = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/changeCarNum';
    return http.post(url, params)
}

//获取购物车/需求清单失效商品
export var getUnEfficacyCom = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/getUnEfficacyCom';
    return http.post(url, params)
}

//批量删除购物车/需求清单商品
export var delBatchShopCar = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/shoppingCar/delBatchShopCar';
    return http.post(url, params)
}


//预下单
export var perOrder = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/perOrder';
    return http.post(url, params)
}

//预下单
export var placeOrder = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/placeOrder';
    return http.post(url, params)
}

//微信支付
export var getPay = function (params) {
    params.header = commonHeader;
    //http://192.168.52.77:2033
    var url = baseUrl + '/placeMall/order/getPay';
    return http.post(url, params)
}

//是否已经支付
export var isPay = function (params) {
    params.header = commonHeader;
    //http://192.168.52.77:2033
    var url = baseUrl + '/placeMall/order/isPay';
    return http.post(url, params)
}
//获取支付信息
export var getPayInfo = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/getPayInfo';
    return http.post(url, params)
}

//获取用药人信息列表
export var getPatientList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/patient/getPatientList';
    return http.post(url, params)
}
//我的 订单数量获取
export var getOrderCount = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/orderCountExpressInfo';
    return http.post(url, params)
}
//订单列表
export var getMyOrderList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/getOrderList';
    return http.post(url, params)
}
//订单详情
export var getOrderDetail = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/getOrderDetail';
    return http.post(url, params)
}
//获取问诊订单详情
export var getInquiryOrderDetails = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/inquiryOrder/getInquiryOrderDetails';
    return http.post(url, params)
}
//确认收货
export var confirmGoods = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/confirmGoods';
    return http.post(url, params)
}
//取消订单
export var cancelOrder = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/cancelOrder';
    return http.post(url, params)
}
//重新购买查看失效商品
export var rebuyCheck = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/order/rebuyCheck';
    return http.post(url, params)
}
//物流列表
export var expressList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/orderComm/expressList';
    return http.post(url, params)
}
//物流进度详情
export var expressDetail = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/orderComm/expressDetail';
    return http.post(url, params)
}
//查询订单包裹数量
export var expressNum = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/orderComm/expressNum';
    return http.post(url, params)
}
//地址列表
export var getAddressList = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/receivingSite/list';
    return http.post(url, params)
}
//新增收货地址
export var saveAddress = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/receivingSite/save';
    return http.post(url, params)
}
//编辑收货地址
export var updateAddress = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/receivingSite/update';
    return http.post(url, params)
}
//删除收货地址
export var deleteAddress = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/receivingSite/delete';
    return http.post(url, params)
}

//申请售后
export var getOrderCommodity = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/refundApply/getOrderCommodity';
    return http.post(url, params)
}

//提交售后
export var saveRefundOrder = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/refundApply/saveRefundOrder';
    return http.post(url, params)
}

//图片上传
export var upload = function (params) {
    params.header = commonHeader;
    var url = javaUrl + '/oss/oss/upload';
    return http.post(url, params, { headers: { "Content-Type": 'multipart/form-data', 'processData': false } })
}

//获取售后详情
export var getRefundOrder = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/refundApply/getRefundOrder';
    return http.post(url, params)
}

//售后列表
export var getRefundPage = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/refundApply/getRefundPage';
    return http.post(url, params)
}
//获取用户信息
export var getUserAccountInfo = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/accountInfo/getUserAccountInfo';
    return http.post(url, params)
}
//我的 个人信息修改
export var updatePersonInfo = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/personInfo/updatePersonInfo';
    return http.post(url, params)
}
//修改手机号码
export var updatePhoneNumber = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/personInfo/updatePhoneNumber';
    return http.post(url, params)
}
//联想家登录
export var lxjlogin = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/lxjlogin';
    return http.post(url, params)
}

//根据手机获取token（存在于注册后获取token）
export var getToken = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/getToken';
    return http.post(url, params)
}

//用户名登录
export var loginByUserName = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/loginByUserName';
    return http.post(url, params)
}

//获取手机验证码
export var sendMesForReg = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/sendMesForReg';
    return http.post(url, params)
}

//使用手机号码登录
export var loginByMobile = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/loginByMobile';
    return http.post(url, params)
}

//注册
export var register = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/register';
    return http.post(url, params)
}

//重置密码
export var resetPassword = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/app/resetPassword';
    return http.post(url, params)
}
//更新用药人信息
export var savePatientInfo = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/appService/patient/savePatientInfo';
    return http.post(url, params)
}

//商品获取处方药品信息
export var queryRxDrugs = function (params) {
    params.header = commonHeader;
    var url = baseUrl + '/placeMall/drug/queryRxDrugs';
    return http.post(url, params)
}

//获取处方笺
export var getPrescriptionSign = function (params) {
    var url = baseUrl + '/appService/prescription/getPrescriptionSign';
    return http.post(url, params)
}


//微信授权
export var getWXRequestUrl = function (params) {
    var url = baseUrl + '/placeMall/weChat/snsapiBase';
    return http.post(url, params)
}
//微信code值解析

export var getSnsapiOpenId = function (params) {
    var url = baseUrl + '/placeMall/weChat/getSnsapiOpenId';
    return http.post(url, params)
}
//微信JSDK支付参数

export var getWxJsdkPay = function (params) {
    var url = baseUrl + '/placeMall/weChat/getWxPay';
    return http.post(url, params)
}