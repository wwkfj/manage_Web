/**
  项目JS主入口
  以依赖Layui的layer和form模块为例
**/    
layui.define(['layer', 'form'], function(exports){
	var layer = layui.layer
	,form = layui.form();
	
	layer.msg('Hello World');
	
	exports('test2', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    

layui.use(['form', 'upload'], function(){  //如果只加载一个模块，可以不填数组。如：layui.use('form')
  var form = layui.form() //获取form模块
  ,upload = layui.upload; //获取upload模块
  
  //监听提交按钮
  form.on('submit(uploadFile)', function(data){
    console.log(data);
  });
  
  //实例化一个上传控件
  upload({
	    url: '上传接口url'
	    ,title:'上传文件'
	    ,success: function(data){
	      console.log(data);
	    }
  })
});
