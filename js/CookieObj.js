/**
 * @description :对cookie的操作：
 * 1、保存（按照生命周期区分：1、关闭浏览器即失效；2、保存一周再失效）
 * 2、删除
 * 3、获取
 * @author : ZhangQiang
 */
var CookieObj = {};

CookieObj = {
	//写cookie，生命周期为7天
	setCookieSeven: function(name, value) {
		var Days = 7;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + "; path=/" + ";expires=" + exp.toGMTString();

		/*if(Days==null||Days==undefined||Days==""){
				  	document.cookie = name + "="+ escape (value) + "; path=/";
				  }else{
				  	//正整数正则表达式
				    var zs= /^[0-9]*[1-9][0-9]*$/;
				    if(value<0 || value!=parseInt(value)){
		           alert("cookie的生命周期必须为正整数！");
				    }else{
				    	var exp = new Date(); 
							exp.setTime(exp.getTime() + Days*24*60*60*1000);
							document.cookie = name + "="+ escape (value) + "; path=/"+";expires=" + exp.toGMTString();
				    }				   
		      }*/
	},

	//写cookie,浏览器关闭即失效
	setCookie: function(name, value) {
		document.cookie = name + "=" + escape(value) + "; path=/";
	},

	//读取cookie 
	getCookie: function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

		if (arr = document.cookie.match(reg))

			return unescape(arr[2]);
		else
			return null;
	},

	//初始化用户信息
	initUserInfo:function() {
		var user = {
			userID: "1",
			userCode: "00000001",
			userName: "蔡兰英",
			orgID: "164",
			orgCode: "010187",
			orgName: "集团总经理室",
			orgType:"0",
			postID: "9",
			postCode: "10001",
			postName: "董事长",
			token: "token123"
		};
		userStr = JSON.stringify(user);
		this.setCookie("userinfo", userStr);
	},

	getUserInfo: function() {
		var userStr = this.getCookie("userinfo");
		if (userStr == null) {
			this.initUserInfo();
		}
		userStr = this.getCookie("userinfo");

		var userObj;
		if (userStr != null) {
			userObj = jQuery.parseJSON(userStr);
		}

		return userObj;
	},

	//读取token
	getToken: function() {
		var userStr = this.getCookie("userinfo");
		if (userStr == null) {
			this.initUserInfo();
		}
		userStr = this.getCookie("userinfo");
		
		if (userStr != null) {
			var userObj = jQuery.parseJSON(userStr);
			var token = userObj.token;
			return token;
		} else {
			return null;
		}

	},

	//删除cookies
	delCookie: function(name) {
		var cval = this.getCookie(name);
		if (cval != null)
			document.cookie = name + "=" + cval;
	}
}