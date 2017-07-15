var pager;
var projectType;
$(document).ready(function() {

	//初始化网格
	$('#contentsGrid').datagrid({
		onLoadSuccess: function(data) {
			$("#orgContentsGrid").datagrid('doCellTip', {
				'max-width': '300px',
				'delay': 500
			});
		},
		rowStyler: function(index, row) {
			if(index % 2 != 0) {
				return 'background-color:#F2F2F2;'; // return inline style
			}
		}
	});

	//设置分页控件
	pager = $('#contentsGrid').datagrid('getPager');
	$(pager).pagination({
		onSelectPage: query,
		pageSize: 20,
		pageList: [20, 50, 100, 200],
		beforePageText: '第',
		afterPageText: '页	共{pages}页',
		displayMsg: '当前显示 {from} - {to} 条记录		共 {total} 条记录'
	});

//	$('#moduelPermissionGrid').treegrid({
//		url: '/api/module/list', //访问后台的地址 
//		method: 'get',
//		idField: 'id',
//		treeField: 'name',
//		checkbox: true,
//		loadFilter: function(data) {
//			return data.result;
//		},
//	});

	query()

	init()
	
	$(".toolselect").click(event,function(){
		projectType = $(event.target).attr("data")
		$('#toolDialog').dialog('close')
		dialogContentsOpen()
	})
	
});

function init() {
	//去掉结点前面的文件及文件夹小图标
	$(".tree-icon .tree-file").removeClass("tree-icon tree-file");
	$(".tree-icon .tree-folder").removeClass("tree-icon tree-folder tree-folder-open tree-folder-closed");
}
//关闭添加页面内容弹出框
function dialogContentsClose() {
	$('#contentsDialog').dialog('close');
}
//打开添加页面内容弹出框
function toolDialogContentsOpen() {
	
	$('#toolDialog').dialog('open');
}

function dialogContentsOpen() {
	$('#contentsDialog').dialog({
		title: "创建项目"
	});
	$('#contentsDialog').dialog('open');
}

//添加页面内容弹出框
function addContents() {

//	$('#contentsDialog').dialog({
//		title: "创建项目"
//	});
//	$('#contentsDialog').dialog('open');
	toolDialogContentsOpen()

}

//打开修改页面内容弹出框
function updateContent() {

	$('#contentsDialog').dialog({
		title: "编辑项目"
	});
	$('#contentsDialog').dialog('open');

}

function uploadFile(){
	alert($(this).attr("class"))
}

//列表查询
function query() {
	var pagerOptions = $(pager).pagination('options');
	var PAGESIZE = pagerOptions.pageSize;
	var PAGEINDEX = pagerOptions.pageNumber < 1 ? 1 : pagerOptions.pageNumber;

	var searchParam = {

//		name: $('#searchRoleName').textbox('getValue'),
//		projectNo: $('#searchRoleCode').textbox('getValue'),
//		orgId: $("#searchDeptId").combobox('getValue'),
//		userId: $("#searchDeptId").combobox('getValue'),
//		startTime:,
//		completedTime:,
//		projectType:,
		currentPage: PAGEINDEX,
		pageSize: PAGESIZE
	}

	var searchParamStr = JSON.stringify(searchParam);

	$('#contentsGrid').datagrid("loading", "玩命加载。。。");

	$.ajax({
		type: "POST",
		url: '/api/project/list',
		async: true,
		data: searchParamStr,
		contentType: 'application/json', // 告诉jQuery不要去设置Content-Type请求头
		success: function(data, textStatus) {
			$('#contentsGrid').datagrid("loaded");
			var code = data.code;
			var msg = data.description;
			if(code == 0) {
				if(data.result.list === undefined || data.result.list.length == 0) {
					$('#contentsGrid').datagrid('loadData', {
						total: 0,
						rows: []
					}); //清空网格数据
					showInfo('查询结果为空');
					return;
				}
				$('#contentsGrid').datagrid('loadData', {
					"total": data.result.totalCount,
					"rows": data.result.list
				});
			} else {
				showInfo(msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('#contentsGrid').datagrid("loaded");
			showError("访问服务失败");
		}
	});
}
//保存岗位
function submit() {
	var params={
       			id:$("#txtProjectId").val(),
	    projectNo:$("#txtProjectNo").textbox('getValue'),
	  projectType:projectType,
		     name:$("#txtName").textbox('getValue'),
		    orgId:$("#txtDeptId").combobox('getValue'),
		   userId:$("#txtUser").combobox('getValue'),
		startTime:$("#txtStartTime").datebox('getValue'),
		   common:$("#txtNote").val(),
		     file:$("#fileUrl_1").val(),
     introduction:$("#txtIntroduction").val()
     }

	var noReg = /^[a-zA-Z0-9]{1,30}$/;
	if(!noReg.test(params.projectNo)) {
		showError("项目编号必须数字或字母,长度1到30个字符")
		return;
	}

	if(isEmpty(params.name)) {
		showError("项目名称不能为空")
		return;
	}

	if(params.name.length >= 200) {
		showError("项目名称长度不能超过200个字符")
		return;
	}

	if(isEmpty(params.orgId)) {
		showError("请选择责任部门")
		return;
	}
	
	if(isEmpty(params.userId)) {
		showError("请选择负责人")
		return;
	}
	
	if(isEmpty(params.startTime)) {
		showError("项目开始时间不能为空")
		return;
	}
	
	if(!isEmpty(params.introduction) && params.introduction.length >= 500) {
		showError("项目简介字数过长")
		return;
	}
	
	if(!isEmpty(params.common) && params.common.length >= 500) {
		showError("备注字数过长")
		return;
	}
	
	if(isEmpty(params.file) ) {
		showError("请选择附件")
		return;
	}

	

	if(params.modules.length === 0) {
		showError("请选择模块菜单")
		return;
	}

	ajaxLoading()

	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(params),
		url: "/api/project/save",
		contentType: "application/json",
		async: true,
		success: function(data, res) {
			ajaxLoadEnd()
			if(data.code === '0') {
				//showInfo("保存成功")
				dialogContentsClose()
				$('#contentsGrid').datagrid("reload");
				query()
			} else {
				showError(data.description)
			}
		},
		error: function(res) {
			ajaxLoadEnd()
			showError("访问服务错误")
		}
	});
}

function findRoleDetail() {

	var row = $('#orgContentsGrid').datagrid("getSelected");
	if(row == null) {
		showError("请选中一行数据")
	}
	var url = '/api/role/' + row.id + '?time=' + new Date()
	$.ajax({
		type: "GET",
		url: url,
		async: true,
		beforeSend: ajaxLoading,
		contentType: false, // 告诉jQuery不要去设置Content-Type请求头
		success: function(data, textStatus) {
			clearAllParam()
			ajaxLoadEnd()
			var code = data.code;
			var msg = data.description;
			if(code == 0) {
				if(isEmpty(data.result)) {
					showInfo('查询结果为空');
					return;
				}
				var role = data.result;
				$("#txtRoleId").val(role.id)
				$("#txtRoleCode").textbox('setValue', role.roleCode)
				$("#txtRoleName").textbox('setValue', role.roleName)
				$("#txtDeptId").combotree('setValue', role.deptId)
				var modulesData = role.modules

				var modulesMap = {}
				for(var i = 0; i < modulesData.length; i++) {
					modulesMap[modulesData[i].id] = modulesData[i]
				}
				var modules = $(".moduleCheck")
				for(var i = 0; i < modules.length; i++) {
					modules[i].checked = false
					var moduleId = $(modules[i]).attr("moduleid")
					if(contains(modulesData, moduleId)) {
						modules[i].checked = true
							//取功能权限
						var permissionsNode = $((".permission_") + moduleId)
						if(permissionsNode === undefined)
							continue
						var perData = modulesMap[moduleId].permissions
						for(var j = 0; j < permissionsNode.length; j++) {
							permissionsNode[j].checked = false
							var permission = $(permissionsNode[j]).attr("data")

							if(containsPermission(perData, jQuery.parseJSON(permission).operate)) {
								permissionsNode[j].checked = true
							}
						}
					}

				}
			} else {
				showInfo(msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			ajaxLoadEnd()
			showError("访问服务失败");
		}
	});
}

function deleteData() {

	var row = $('#orgContentsGrid').datagrid("getSelected");
	if(row == null) {
		showError("请选中一行数据")
	}
	var url = '/api/role/delete/' + row.id + '?time=' + new Date()
	$.ajax({
		type: "DELETE",
		url: url,
		async: true,
		beforeSend: ajaxLoading,
		contentType: false, // 告诉jQuery不要去设置Content-Type请求头
		success: function(data, textStatus) {
			var code = data.code;
			var msg = data.description;
			ajaxLoadEnd()
			if(code == 0) {
				query()
			} else {
				showInfo(msg)
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			ajaxLoadEnd()
			showError("访问服务失败");
		}
	});
}

function contains(arr, obj) {
	var i = arr.length;

	while(i--) {
		if(arr[i].id.toString() === obj) {
			return true;
		}
	}
	return false;
}

function containsPermission(arr, obj) {
	var i = arr.length;

	while(i--) {
		if(arr[i].perValue.toString() === obj) {
			return true;
		}
	}
	return false;
}

function clearAllParam() {
	$("#txtRoleId").val("")
	$("#txtRoleCode").textbox('setValue', '')
	$("#txtRoleName").textbox('setValue', '')
	$("#txtDeptId").combotree('setValue', '')
	var modules = $(".moduleCheck");
	for(var i = 0; i < modules.length; i++) {
		modules[i].checked = false
		var moduleId = $(modules[i]).attr("moduleid")
			//取功能权限
		var permissions = $((".permission_") + moduleId)
		for(var j = 0; j < permissions.length; j++) {
			permissions[j].checked = false
		}
	}
}

function cancel() {
	$("#searchRoleCode").textbox('setValue', '')
	$("#searchRoleName").textbox('setValue', '')
	$("#searchDeptId").combotree('setValue', '')
}

function formatOrgData(data) {
	return data.result;
}

function operateFormatter(row) {
	return '<a href="javascript:findContent()" plain="true">详情</a>'
}