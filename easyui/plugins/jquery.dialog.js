/**
 * jQuery EasyUI 1.4
 * 
 * Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at info@jeasyui.com
 *
 */
(function($){
function _1(_2){
var _3=$.data(_2,"dialog").options;
_3.inited=false;
$(_2).window($.extend({},_3,{onResize:function(w,h){
if(_3.inited){
_a(this);
_3.onResize.call(this,w,h);
}
}}));
var _4=$(_2).window("window");
if(_3.toolbar){
if($.isArray(_3.toolbar)){
$(_2).siblings("div.dialog-toolbar").remove();
var _5=$("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").appendTo(_4);
var tr=_5.find("tr");
for(var i=0;i<_3.toolbar.length;i++){
var _6=_3.toolbar[i];
if(_6=="-"){
$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var _7=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
_7[0].onclick=eval(_6.handler||function(){
});
_7.linkbutton($.extend({},_6,{plain:true}));
}
}
}else{
$(_3.toolbar).addClass("dialog-toolbar").appendTo(_4);
$(_3.toolbar).show();
}
}else{
$(_2).siblings("div.dialog-toolbar").remove();
}
if(_3.buttons){
if($.isArray(_3.buttons)){
$(_2).siblings("div.dialog-button").remove();
var _8=$("<div class=\"dialog-button\"></div>").appendTo(_4);
for(var i=0;i<_3.buttons.length;i++){
var p=_3.buttons[i];
var _9=$("<a href=\"javascript:void(0)\"></a>").appendTo(_8);
if(p.handler){
_9[0].onclick=p.handler;
}
_9.linkbutton(p);
}
}else{
$(_3.buttons).addClass("dialog-button").appendTo(_4);
$(_3.buttons).show();
}
}else{
$(_2).siblings("div.dialog-button").remove();
}
_3.inited=true;
$(_2).window("resize");
};
function _a(_b,_c){
var t=$(_b);
var tb=t.siblings(".dialog-toolbar");
var bb=t.siblings(".dialog-button");
tb.add(bb).css("position","absolute");
t._outerHeight(t._outerHeight()-tb._outerHeight()-bb._outerHeight()+tb.length+bb.length);
t.css({marginTop:(tb._outerHeight()-tb.length)+"px",marginBottom:(bb._outerHeight()-bb.length)+"px"});
tb.css({top:(t.position().top-1+parseInt(t.css("borderTopWidth")))+"px"});
bb.css({top:(t.position().top+t.outerHeight(true)-bb._outerHeight())+"px"});
tb.add(bb)._outerWidth(t._outerWidth());
var _d=$.data(_b,"window").shadow;
if(_d){
var cc=t.panel("panel");
_d.css({width:cc._outerWidth(),height:cc._outerHeight()});
}
};
$.fn.dialog=function(_e,_f){
if(typeof _e=="string"){
var _10=$.fn.dialog.methods[_e];
if(_10){
return _10(this,_f);
}else{
return this.window(_e,_f);
}
}
_e=_e||{};
return this.each(function(){
var _11=$.data(this,"dialog");
if(_11){
$.extend(_11.options,_e);
}else{
$.data(this,"dialog",{options:$.extend({},$.fn.dialog.defaults,$.fn.dialog.parseOptions(this),_e)});
}
_1(this);
});
};
$.fn.dialog.methods={options:function(jq){
var _12=$.data(jq[0],"dialog").options;
var _13=jq.panel("options");
$.extend(_12,{width:_13.width,height:_13.height,left:_13.left,top:_13.top,closed:_13.closed,collapsed:_13.collapsed,minimized:_13.minimized,maximized:_13.maximized});
return _12;
},dialog:function(jq){
return jq.window("window");
}};
$.fn.dialog.parseOptions=function(_14){
return $.extend({},$.fn.window.parseOptions(_14),$.parser.parseOptions(_14,["toolbar","buttons"]));
};
$.fn.dialog.defaults=$.extend({},$.fn.window.defaults,{title:"New Dialog",collapsible:false,minimizable:false,maximizable:false,resizable:false,toolbar:null,buttons:null});
})(jQuery);

