var pager;
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

function dialogContentsOpen() {
	$('#contentsDialog').dialog({
		title: "创建评估"
	});
	$('#contentsDialog').dialog('open');
}

//查询要的项目
function searchProject() {

	var url = "../dialog/ProjectQueryDialog.html?confirmMethod=confirmProject&isSingleSelect=true&needAllshop=false"
	url = encodeURI(url);
	$('#iframeDialog').attr('src', url);

	$('#searchtitle').dialog({
		height: 450,
		width: 500,
		title: '选择项目',
		closed: false
	});
}


//添加页面内容弹出框
function addContents() {

//	$('#contentsDialog').dialog({
//		title: "创建项目"
//	});
//	$('#contentsDialog').dialog('open');
	clearContent();
	dialogContentsOpen();

}

//打开修改页面内容弹出框
function updateContent(id) {

	$('#contentsDialog').dialog({
		title: "编辑评估"
	});
	$('#contentsDialog').dialog('open');
	clearContent();
	findDetail(id);
}

function operateFormatter(value,row,index) {
	var id = isEmpty(row) ? null : row.id
	var status = row.status
	//提交状态不显示  编辑按钮
	if(status === 0) 
		return '<a href="javascript:viewContent('+id+')" plain="true">详情</a>'
	return '<a href="javascript:updateContent('+id+')"  plain="true">编辑</a>'
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
		docNo:$('#searchDocName').textbox('getValue'),
		projectName:$('#searchProjectName').textbox('getValue'),
		projectId:$("#searchDeptId").combobox('getValue'),
		projectEvaluationType:4,
		startDate:$('#searchEndTime').datebox('getValue'),
		endDate:$('#searchEndTime').datebox('getValue'),
		userName:$('#searchUserName').textbox('getValue'),
		currentPage: PAGEINDEX,
		pageSize: PAGESIZE
	}

	var searchParamStr = JSON.stringify(searchParam);

	$('#contentsGrid').datagrid("loading", "玩命加载。。。");

	$.ajax({
		type: "POST",
		url: '/api/prophase/evaluation/orders',
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
function submit(projectEvaluationType) {
	var params={
       			id:$("#txtEvalID").val(),
       			docNo:$("#txtDocNo").textbox('getValue'),
	    			projectId:$("#txtProjectID").val(),
		     	projectName:$("#txtProjectName").textbox('getValue'),
		   		deptId:$("#txtDeptId").combobox('getValue'),
		   	 	projectEvaluationType:projectEvaluationType,
		    		attachment:$("#fileUrl_1").val(),
				// userId:$("#txtUser").combobox('getValue'),
				projectTime:$("#txtStartTime").datebox('getValue')
     }

	var noReg = /^[a-zA-Z0-9]{1,30}$/;
	if(!noReg.test(params.docNo)) {
		showError("项目文号必须数字或字母,长度1到30个字符")
		return;
	}

	if(isEmpty(params.projectId)) {
		showError("项目名称不能为空")
		return;
	}


	if(isEmpty(params.deptId)) {
		showError("请选择责任部门")
		return;
	}
	

	if(isEmpty(params.projectTime)) {
		showError("时间不能为空")
		return;
	}
	
	
	if(isEmpty(params.attachment) ) {
		showError("请选择附件")
		return;
	}
 
	ajaxLoading()

	post("/api/prophase/evaluation/order",JSON.stringify(params),"json",function(data){
			//showInfo("保存成功")
			dialogContentsClose()
			$('#contentsGrid').datagrid("reload");
			query()
	})
}

function findDetail(id) {

	var url = '/api/prophase/evaluation/orders/' + id + '?time=' + new Date()
	
	get(url,'','json',function(data){
		if(isEmpty(data.result)) {
			showInfo('查询结果为空');
			return;
		}
		var content = data.result;
		setData(content)
	})
}
function setData(data){
	$("#txtEvalID").val(data.id)
	$("#txtProjectID").val(data.projectId)
	$("#txtProjectEvaluationType").val(data.projectEvaluationType)
	$("#txtProjectName").textbox('setValue',data.projectName)
	$("#txtDocNo").textbox('setValue',data.docNo)
	$("#txtDeptId").combotree('setValue',data.deptId)
	$("#fileUrl_1").val(data.attachment)
	$("#txtStartTime").datetimebox('setValue',data.projectTime)
	$("#fileImport_1").filebox('setValue',data.attachment)
}
function clearContent(){
	$("#txtEvalID").val("")
	$("#txtProjectID").val("")
	$("#txtProjectEvaluationType").val(data.projectEvaluationType)
	$("#txtProjectName").textbox('setValue','')
	$("#txtDocNo").textbox('setValue','')
	$("#txtDeptId").combotree('setValue','')
	$("#fileUrl_1").val('')
	$("#txtStartTime").datetimebox('setValue','')
	$("#fileImport_1").filebox('setValue','')
	alert(data.attachment)
}

function setDataDetail(data){
	$("#txtEvalIDDetail").val(data.id)
	$("#txtProjectIDDetail").val(data.projectId)
	$("#txtProjectEvaluationTypeDetail").val(data.projectEvaluationType)
	$("#txtProjectNameDetail").textbox('setValue',data.projectName)
	$("#txtDocNoDetail").textbox('setValue',data.docNo)
	$("#txtDeptIdDetail").textbox('setValue',data.deptName)
	$("#fileUrlDetail").val(data.attachment)
	$("#txtStartTimeDetail").textbox('setValue',data.projectTime)
	alert(data.attachment)
}

function viewContent(id){
	var url = '/api/prophase/evaluation/orders/' + id + '?time=' + new Date()
	
	get(url,'','json',function(data){
		if(isEmpty(data.result)) {
			showInfo('查询结果为空');
			return;
		}
		var content = data.result;
		setDataDetail(content)
	})
	$("#detailDialog").dialog('open')
}

function dialogDetailClose(){
	$('#detailDialog').dialog('close')
	clearContent()
}

function viewFile(){
	var fileUrl = $("#fileUrlDetail").val()
	if(isEmpty(fileUrl)){
		showError('文件路径参数不存在')
		return
	}
	window.open('../file_view_test.html?source='+fileUrl)
}
//查询要添加的部门，选择门店，显示组织机构弹出框
	function searchOrgName() {

		var url = "../public/dialog/ShopQueryDialog.html?confirmMethod=confirmShop&isSingleSelect=false&needAllshop=false"
		url = encodeURI(url);
		$('#iframeShop').attr('src', url);

		$('#searchtitle').dialog({
			height: queryDiaHeight,
			width: queryDiaWidth,
			closed: false
		});
	}
	


function deleteData() {

	var rows = $('#contentsGrid').datagrid("getSelections");
	if(rows == null || rows.length == 0) {
		showError("请选中数据")
	}
	var ids = [];
	
	rows.forEach(function(val,index,arr){
		if("1" === rows[index].status){
			showError("已提交的数据不能删除")
			return;
		}
		ids.push(rows[index].id)
	})
	var url = '/api/prophase/evaluation/orders/';
	var param = {ids:ids}
	post(url,JSON.stringify(param),"json",function(data){
		$('#contentsGrid').datagrid("reload");
//		showInfo("删除成功")
		query()
	})
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

 //弹出框确认后的返回事件
function confirmProject(rows) {
	var i = 0;
	var name;
	var id;
	for (i = 0; i < rows.length; i++) {
		if (i == 0) {
			name = rows[0].name;
			id = rows[0].id;
			$("#txtProjectID").val(id)
			$("#txtProjectName").textbox('setValue', name);
		}
	}
	$('#searchtitle').dialog({
			closed: true
		});
}