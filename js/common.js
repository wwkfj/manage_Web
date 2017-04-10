function showError(msg) {
	$.messager.alert('消息', msg, 'error');
}

function showInfo(msg) {
	$.messager.alert('消息', msg, 'info');
}

function page404() {
	document.write("404\n页面不存在");
}

function isEmpty(str){
	if(str === '' || str === undefined || str === null)
		return true;
	return false;
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

(function () {    
   $.extend($.fn.datagrid.methods, {    
	    //显示遮罩    
	    loading: function (jq, msg) {    
	        return jq.each(function () {    
	            var panel = $(this).datagrid("getPanel");    
	            if (msg == undefined) {    
	                msg = "正在加载数据，请稍候...";    
	            }    
	            $("<div class=\"datagrid-mask\"></div>").css({'z-index':99999, display: "block", width: panel.width(), height: panel.height() }).appendTo(panel);    
	            $("<div class=\"datagrid-mask-msg\"></div>").html(msg).appendTo(panel).css({ 'z-index':99999,display: "block", left: (panel.width() - $("div.datagrid-mask-msg", panel).outerWidth()) / 2, top: (panel.height() - $("div.datagrid-mask-msg", panel).outerHeight()) / 2 });    
	            });    
	    },    
	    //隐藏遮罩    
	    loaded: function (jq) {    
	        return jq.each(function () {    
	            var panel = $(this).datagrid("getPanel");    
	            panel.find("div.datagrid-mask-msg").remove();    
	            panel.find("div.datagrid-mask").remove();    
	            });    
	        }    
    });    
})(jQuery);   

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
