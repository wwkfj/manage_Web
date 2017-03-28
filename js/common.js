/**
 * 一些通用的工具方法
 */

//系统ID
var systemId = "OTO";

//查询弹出框宽度
var queryDiaWidth = 520;

//查询弹出框高度
var queryDiaHeight = 394;

//编辑弹出框宽度
var editDiaWidth = 520;

//编辑弹出框高度
var editDiaHeight = 520;

//OSS URL
var ossUrl = "http://zjlh-wx.oss-cn-hangzhou.aliyuncs.com/";

//素材URL
var pageContentsPath = "/WxMobile/pages/content/DC01300102_Detail.html?pageId=";

function getNullStr(str){
	if(isEmpty(str)){
		return '';
	}
	
	return str;
}


/*===============DataGrid 鼠标移动上去显示被隐藏的内容======================*/
 $.extend($.fn.datagrid.methods, {  
    /**  
     * 开打提示功能  
     * @param {} jq  
     * @param {} params 提示消息框的样式  
     * @return {}  
     */  
    doCellTip: function(jq, params){  
        function showTip(data, td, e){  
            if ($(td).text() == "")   
                return;  
            data.tooltip.text($(td).text()).css({  
                top: (e.pageY + 10) + 'px',  
                left: (e.pageX + 20) + 'px',  
                'z-index': $.fn.window.defaults.zIndex,  
                display: 'block'  
            });  
        };  
        return jq.each(function(){  
            var grid = $(this);  
            var options = $(this).data('datagrid');  
            if (!options.tooltip) {  
                var panel = grid.datagrid('getPanel').panel('panel');  
                var defaultCls = {  
                    'border': '1px solid #1997ea',  
                    'padding': '6px',  
                    'color': '#333',  
                    'background': '#FFFFFF', 
                    'position': 'absolute',  
                    'max-width': '200px',  
                    'border-radius' : '4px',  
                    '-moz-border-radius' : '4px',  
                    '-webkit-border-radius' : '4px',  
                    'display': 'none'  
                }  
                var tooltip = $("<div id='celltip'></div>").appendTo('body');  
                tooltip.css($.extend({}, defaultCls, params.cls));  
                options.tooltip = tooltip;  
                panel.find('.datagrid-body').each(function(){  
                    var delegateEle = $(this).find('> div.datagrid-body-inner').length ? $(this).find('> div.datagrid-body-inner')[0] : this;  
                    $(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td', {  
                        'mouseover': function(e){  
                            if (params.delay) {  
                                if (options.tipDelayTime)   
                                    clearTimeout(options.tipDelayTime);  
                                var that = this;  
                                options.tipDelayTime = setTimeout(function(){  
                                    showTip(options, that, e);  
                                }, params.delay);  
                            }  
                            else {  
                                showTip(options, this, e);  
                            }  
                              
                        },  
                        'mouseout': function(e){  
                            if (options.tipDelayTime)   
                                clearTimeout(options.tipDelayTime);  
                            options.tooltip.css({  
                                'display': 'none'  
                            });  
                        },  
                        'mousemove': function(e){  
                            var that = this;  
                            if (options.tipDelayTime)   
                                clearTimeout(options.tipDelayTime);  
                            //showTip(options, this, e);  
                            options.tipDelayTime = setTimeout(function(){  
                                    showTip(options, that, e);  
                                }, params.delay);  
                        }  
                    });  
                });  
                  
            }  
              
        });  
    },  
    /**  
     * 关闭消息提示功能  
     *  
     * @param {}  
     *            jq  
     * @return {}  
     */  
    cancelCellTip: function(jq){  
        return jq.each(function(){  
            var data = $(this).data('datagrid');  
            if (data.tooltip) {  
                data.tooltip.remove();  
                data.tooltip = null;  
                var panel = $(this).datagrid('getPanel').panel('panel');  
                panel.find('.datagrid-body').undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove')  
            }  
            if (data.tipDelayTime) {  
                clearTimeout(data.tipDelayTime);  
                data.tipDelayTime = null;  
            }  
        });  
    }  
}); 


/*
 * 获取URL参数
 * 传入：key
 * 返回：value
 */
function getQueryParam(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);

	if (r != null)
		return r[2];
	return null;
}

function showError(msg) {
	$.messager.alert('消息', msg, 'error');
}

function showInfo(msg) {
	$.messager.alert('消息', msg, 'info');
}

function page404() {
	document.write("404\n页面不存在");
}

/**
 * 字典
 */
var wordBooks;
/**
 * 根据关键字取字典列表
 */
function getWordBookByKeyword(keyWord) {
	var wordBook;
	if (wordBooks != null) {
		wordBook = wordBooks[keyWord];
	}
	return wordBook;
}

/**
 * 根据关键字和字典的值，取字典显示
 */
function getDisplayByValue(keyWord, value) {
		var wordBook = getWordBookByKeyword(keyWord);
		if (wordBook == null) {
			return null;
		}

		for (var i = 0; i < wordBook.length; i++) {
			if (value == wordBook[i].wordValue) {
				return wordBook[i].wordDisplay;
			}
		}
	}
	/**
	 * 初始化下拉列表
	 */

function initCombobox(keyword, id) {
		var wordBook = getWordBookByKeyword(keyword);
		if (wordBook != null) {
			$('#' + id).combobox({
				data: wordBook,
				valueField: 'wordValue',
				textField: 'wordDisplay'
			});
		}
	}

	function initHasNullCombobox(keyword, id) {
		var wordBook = getWordBookByKeyword(keyword);
		var worddefault = {wordValue:'',wordDisplay:'空'};
		wordBook.unshift(worddefault);
		if (wordBook != null) {
			$('#' + id).combobox({
				data: wordBook,
				valueField: 'wordValue',
				textField: 'wordDisplay'
			});
		}
	}
	/**
	 * 调用服务查询字典
	 */

function initWordBook(keyWords, callback) {
	var cd = new Clientdata({
		clienttype: 1,
		token: '',
		code: 0,
		systemid: systemId,
		modulecode: '01300102'
	});

	cd.setSearchMap({
		KEYWORDS: keyWords
	});
	var cdStr = JSON.stringify(cd);
	cdStr = encodeURI(cdStr);
	var url = "/otowordbook/?data=" + cdStr;

	$.ajax({
		type: "GET",
		url: url,
		headers: {
			method: 'getWordBookByKeyword'
		},
		async: true,
		processData: false, // 告诉jQuery不要去处理发送的数据
		contentType: false, // 告诉jQuery不要去设置Content-Type请求头
		success: function(data, status) {
			if (status == 'success') {
				var resultJson = jQuery.parseJSON(data);
				var code = resultJson.code;
				var msg = resultJson.msg;
				if (code == 0) {
					wordBooks = resultJson.dataModel.wordBooks;
					//回调初始化下拉列表
					if (!isEmpty(callback)) {
						window[callback]();
					}
				} else {
					showError(msg);
				}
			} else {
				showError("访问服务失败");
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			showError("访问服务失败");
		}
	});
}

function getUserModuleInfo(token,modulecode,callback){
	var cd = new Clientdata({
		clienttype: 1,
		token: token,
		code: 0,
		systemid: systemId,
		modulecode: '01300102'
	});

	cd.setSearchMap({
		MODULECODE:modulecode
	});
	var cdStr = JSON.stringify(cd);
	cdStr = encodeURI(cdStr);
	var url = "/otosys/?data=" + cdStr;

	$.ajax({
					type: "GET",
					url: url,
					headers: {
						method: 'getUserModuleInfo'
					},
					async: true,
					processData: false, // 告诉jQuery不要去处理发送的数据
					contentType: false, // 告诉jQuery不要去设置Content-Type请求头
					success: function(data, textStatus) {
						var resultJson = jQuery.parseJSON(data);
						var code = resultJson.code;
						var msg = resultJson.msg;
						if (code == 0) {
							//回调
							if (callback != null) {
								window[callback](resultJson.dataModel.dataRange);
							}
						} else {
							showError(msg);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						showError("访问服务失败");
					}
				});
}

/**根据token获取用户信息**/
function getUserInfoByToken(token,callback){
	
	var cd = new Clientdata({
		clienttype: 1,
		token: token,
		code: 0,
		systemid: systemId,
		modulecode: '01300102'
	});

	cd.setSearchMap({
	});
	var cdStr = JSON.stringify(cd);
	cdStr = encodeURI(cdStr);
	var url = "/otosys/?data=" + cdStr;

	$.ajax({
					type: "GET",
					url: url,
					headers: {
						method: 'getUserInfo'
					},
					async: true,
					processData: false, // 告诉jQuery不要去处理发送的数据
					contentType: false, // 告诉jQuery不要去设置Content-Type请求头
					success: function(data, textStatus) {
						var resultJson = jQuery.parseJSON(data);
						var code = resultJson.code;
						var msg = resultJson.msg;
						if (code == 0) {
							//回调
							if (callback != null) {
								window[callback](resultJson.dataModel.userInfo);
							}
						} else {
							showError(msg);
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						showError("访问服务失败");
					}
				});
	
}

function getSearchBoxSplitValue(value) {
	return value.split("|")[0];
}

function isEmpty(obj){
	return (obj==null||obj=='undefined'||obj==''||obj.length==0||obj=='null');
}

/**
 * 验证手机号码
 * @param {Object} phoneNum
 */
function checkPhone(phoneNum){
	var reg = /^1\d{10}$/;
	return reg.test(phoneNum);
}

/**
 * 验证身份证号
 * @param {Object} idNo
 */
function checkIdNo(idNo){
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return reg.test(idNo);
}

/**
 * 检查数字
 * @param {Object} num
 */
function checkNum(num){
	var reg = /^[0-9]*$/;
	return reg.test(num);
}

/**
 * 检查URL
 */
function checkURL(linkUrl){
	return linkUrl.substring(0,4)==='http';
}

/**
 * 获取复选框的值
 * @param {Object} id
 */
function getChkVal(id){
	if(document.getElementById(id).checked==false){
		return '0';
	}else{
		return '1';
	}
}

/**
 * 设置复选框的值
 * @param {Object} id
 * @param {Object} value
 */
function setChkVal(id,value){
	if('0'==value){
		document.getElementById(id).checked=false;
	}
	else if('1'==value){
		document.getElementById(id).checked=true;
	}
}

/**
 *加载中弹出框 
 */
function ajaxLoading() {
	$("<div class=\"datagrid-mask\"></div>").css({
		display: "block",
		'z-index':9998,
		width: "100%",
		height: $(window).height()
	}).appendTo("body");
	$("<div class=\"datagrid-mask-msg\"></div>").html("正在处理中，请稍候。。。").appendTo("body").css({
		display: "block",
		'z-index':99999,
		left: ($(document.body).outerWidth(true) - 190) / 2,
		top: ($(window).height() - 45) / 2
	});
}

function ajaxLoadEnd() {
	$(".datagrid-mask").remove();
	$(".datagrid-mask-msg").remove();
}