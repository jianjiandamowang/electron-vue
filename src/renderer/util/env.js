/*
 *  baseUrl: 域名地址
 *  routerMode: 路由模式
 */


let baseUrl = '';
let socketUrl = '';
let imgPath = '';
let routerMode = 'history';

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://193.112.1.73:8080/';
	socketUrl = '193.112.1.73';
	// baseUrl = 'http://192.168.169.109:8080/';
	// socketUrl = '192.168.169.109';
}else{
	baseUrl = 'http://193.112.1.73:8080/';
	socketUrl = '193.112.1.73';
}

export {
	baseUrl,
	imgPath,
	socketUrl,
	routerMode,
}
