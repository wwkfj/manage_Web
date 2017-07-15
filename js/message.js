/**
  项目JS主入口
  以依赖Layui的layer和form模块为例
**/    
layui.define(['layer', 'form','element'], function(exports){
  var layer = layui.layer
  ,form = layui.form()
  ,$    = layui.jquery;
  var element = layui.element();
  layer.msg('Hello World');
  
   //一些事件监听
  element.on('tab(messageTab)', function(data){
    console.log(data);
  });
  
  	// 初始化表格
	$('#dateTable').DataTable({
	    "dom": '<"top">rt<"bottom"flp><"clear">',
	    "autoWidth": false,                     // 自适应宽度
	    "stateSave": true,                      // 刷新后保存页数
	    "order": [[ 1, "desc" ]],               // 排序
	    "searching": false,                     // 本地搜索
	    "info": true,                           // 控制是否显示表格左下角的信息
	    "stripeClasses": ["odd", "even"],       // 为奇偶行加上样式，兼容不支持CSS伪类的场合
	    "aoColumnDefs": [{                      // 指定列不参与排序
	        "orderable": false,
	        "aTargets": [0,6]                   // 对应你的表格的列数
	    }],
	    "pagingType": "full_numbers",         // 分页样式 simple,simple_numbers,full,full_numbers
	    "language": {                           // 国际化
	        "url":'./../json/language.json'
	    },
	    "ajax": {
	        "url": "./../json/data_table.json" // ajax
	    },
	    "sServerMethod" : "POST",               // POST
	    "deferRender": true,                    // 当处理大数据时，延迟渲染数据，有效提高Datatables处理能力
	    "columns": [                            // 自定义数据列
	        {data:function(obj){                // 后台需要返回[data=>['id'=>1,ip=>0.0.0.0]]这样的数据
	            return '<input type="checkbox" class="my-checkbox" lay-filter="oneChoose" data-id="'+obj.id+'"/>';
	        }},
	        {data: 'account'},
	        {data: 'auth_group_name'},
	        {data: 'last_login_ip'},
	        {data: 'last_login_time'},
	        {data: 'create_time'},
	        {data: function(obj){
	            return  '<a class="layui-btn layui-btn-small btn-edit" data-id="'+obj.id+'">查看</a>' +
	                    '<a class="layui-btn layui-btn-small layui-btn-normal btn-edit" data-id="'+obj.id+'">编辑</a>' +
	                    '<a class="layui-btn layui-btn-small layui-btn-danger btn-edit" data-id="'+obj.id+'">删除</a>';
	        },width:'155'}
	    ],
	    "stateSaveParams": function () {           // 初始化完成调用事件
	        // 重新渲染form checkbox 如果你要使用layui的复选框样式打开这个
	        // form.render('checkbox');
	    }
	});
  
  
  exports('message', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    
      