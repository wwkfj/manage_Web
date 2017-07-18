var pager;
var projectType;
$(document).ready(function() {

	//初始化网格
	$('#contentsGrid').datagrid({
		onLoadSuccess: function(data) {
			$("#contentsGrid").datagrid('doCellTip', {
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

	query()

	init()
	
	$(".toolselect").click(event,function(){
		projectType = $(event.target).attr("data")
		$("#txtProjectType").val(projectType)
		$('#toolDialog').dialog('close')
		dialogContentsOpen()
	})
	
	$("#txtDeptId").combotree({
		onSelect:function(rec){
            var url = '/api/org/user/'+rec.id;
            $('#txtUser').combobox('reload', url);
        }
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
	clearContent()
}
//打开添加页面内容弹出框
function toolDialogContentsOpen() {
	$('#toolDialog').dialog('open');
	clearContent()
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
function updateContent(id) {
	clearContent()
	$('#contentsDialog').dialog({
		title: "编辑项目"
	});
	$('#contentsDialog').dialog('open');
	findDetail(id)
}

function uploadFile(){
	alert($(this).attr("class"))
}

function clearContent(){
	$("#txtProjectId").val("")
	$("#txtProjectNo").textbox('setValue','')
	$("#txtProjectType").val("")
	$("#txtName").textbox('setValue','')
	$("#txtDeptId").combotree('setValue','')
	$("#txtUser").combobox('setValue','')
	$("#txtStartTime").datetimebox('setValue','')
	$("#txtNote").val("")
	$("#fileUrl_1").val("")
	$("#txtIntroduction").val("")
}

function setData(data){
	$("#txtProjectId").val(data.id)
	$("#txtProjectNo").textbox('setValue',data.projectNo)
	$("#txtProjectType").val(data.projectType)
	$("#txtName").textbox('setValue',data.name)
	$("#txtDeptId").combotree('setValue',data.orgId)
	$("#txtUser").combobox('setValue',data.userId)
	$("#txtStartTime").datetimebox('setValue',data.startTime)
	$("#txtNote").val(data.comment)
	$("#fileUrl_1").val(data.file)
	$("#txtIntroduction").val(data.introduction)
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
	
	post("/api/project/list",searchParamStr,'json',function(data){
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
	})
}
//保存岗位
function submit(status) {
	var params={
       		   id:$("#txtProjectId").val(),
	    projectNo:$("#txtProjectNo").textbox('getValue'),
	  projectType:$("#txtProjectType").val(),
		     name:$("#txtName").textbox('getValue'),
		    orgId:$("#txtDeptId").combobox('getValue'),
		   userId:$("#txtUser").combobox('getValue'),
		startTime:$("#txtStartTime").datetimebox('getValue'),
		   comment:$("#txtNote").val(),
		     file:$("#fileUrl_1").val(),
     introduction:$("#txtIntroduction").val(),
           status:status
     }
	if(isEmpty(params.projectType)) {
		showError("项目类别不能为空")
		return;
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

	ajaxLoading()
	
	post("/api/project/save",JSON.stringify(params),"json",function(data){
		//showInfo("保存成功")
		dialogContentsClose()
		$('#contentsGrid').datagrid("reload");
		query()
	})

}

function viewContent(id){
	var url = '/api/project/' + id + '?time=' + new Date()
	
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

function viewFile(){
	var fileUrl = $("#fileUrlDetail").val()
	if(isEmpty(fileUrl)){
		showError('文件路径参数不存在')
		return
	}
	window.open('../file_view_test.html?source='+fileUrl)
}

function dialogDetailClose(){
	$('#detailDialog').dialog('close')
}

function setDataDetail(data){
	$("#txtProjectIdDetail").val(data.id)
	$("#txtProjectNoDetail").textbox('setValue',data.projectNo)
	$("#txtProjectTypeDetail").val(data.projectTypeName)
	$("#txtNameDetail").textbox('setValue',data.name)
	$("#txtDeptIdDetail").textbox('setValue',data.orgId)
	$("#txtUserDetail").textbox('setValue',data.userName)
	$("#txtStartTimeDetail").textbox('setValue',data.startTime)
	$("#txtNoteDetail").val(data.comment)
	$("#fileUrlDetail").val(data.file)
	$("#txtIntroductionDetail").val(data.introduction)
}

function findDetail(id) {

	var url = '/api/project/' + id + '?time=' + new Date()
	
	get(url,'','json',function(data){
		if(isEmpty(data.result)) {
			showInfo('查询结果为空');
			return;
		}
		var content = data.result;
		setData(content)
	})
}

function deleteData() {

	var rows = $('#contentsGrid').datagrid("getSelections");
	if(rows == null || rows.length == 0) {
		showError("请选中数据")
	}
	var ids = [];
	
	rows.forEach(function(val,index,arr){
		if("2" === rows[index].status){
			showError("已提交的数据不能删除")
			return;
		}
		ids.push(rows[index].id)
	})
	var url = '/api/project/del';
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


function cancel() {
	$("#searchRoleCode").textbox('setValue', '')
	$("#searchRoleName").textbox('setValue', '')
	$("#searchDeptId").combotree('setValue', '')
}

function formatOrgData(data) {
	return data.result;
}

function operateFormatter(value,row,index) {
	var id = isEmpty(row) ? null : row.id
	var status = row.status
	//提交状态不显示  编辑按钮
	if(status === '2')
		return '<a href="javascript:viewContent('+id+')" plain="true">详情</a>'
	return '<a href="javascript:updateContent('+id+')"  plain="true">编辑</a>'
	
}


 //查询要的项目
function searchProject() {

	var url = "../dialog/ProjectQueryDialog.html?confirmMethod=confirmShop&isSingleSelect=true&needAllshop=false"
	url = encodeURI(url);
	$('#iframeDialog').attr('src', url);

	$('#searchtitle').dialog({
		height: 450,
		width: 500,
		title: '选择项目',
		closed: false
	});
}

 //门店弹出框确认后的返回事件
function confirmShop(rows) {
	var i = 0;
	var names;
	var ids;
	for (i = 0; i < rows.length; i++) {
		if (i == 0) {
			names = rows[0].name;
			ids = rows[0].id;
		}
		if (i != 0) {
			names = names + "," + rows[i].name;
			ids = ids + "," + rows[i].id;
		}
	}
	alert(names);
}