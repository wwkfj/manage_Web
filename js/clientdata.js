/** DataSetClient��װ��ʵ��****************************************************************************/
function Clientdata(options){ 
	this.DataSetName = ''; 
	this.lstTable = new Array(); 

	this.setDataModel = function(datamodle){
		this.dataModel=datamodle;
	}
	
	this.clientDataToJson = function(clientdata){
		return JSON.stringify(clientdata);
	}
	
	this.ObjectToString= function(clientdata){
		return JSON.stringify(map);
	}
	
} 


/** Clientdata��װ��ʵ��****************************************************************************/
function Clientdata(options){ 
	this.clienttype = options.clienttype; 
	this.entid = options.entid; 
	this.modulecode = options.modulecode; 
	this.systemid = options.systemid; 
	this.token = options.token; 
	this.code = options.code; 
	this.msg = options.msg; 
	this.msgdetail = options.msgdetail; 
	this.msgdetailext = options.msgdetailext; 
	this.searchMap = ''; 
	this.pagesize = options.pagesize;
	this.startRow = options.startRow;
	this.totalCount = options.totalCount;
	//this.dataModel = {}; 
	
	this.setSearchMap = function(map){
		this.searchMap=ObjectToString(map).replaceAll('"','\"');
	}
	
	/**this.getSearchMap = function(map){
		var searchMap=clientDataToJson(map);
		searchmap=jsstr.replace('"{','{');
		searchmap=sss.replace('}"','}');
		searchmap=sss.replace('\"','"');
		this.searchMap=searchmap;
		return searchmap;
	}*/

	this.setDataModel = function(datamodle){
		this.dataModel=datamodle;
	}
	
	this.clientDataToJson = function(clientdata){
		return JSON.stringify(clientdata);
	}
	
	this.ObjectToString= function(clientdata){
		return JSON.stringify(map);
	}
	
} 

function clientDataToJson(clientdata){
	return JSON.stringify(clientdata);
}

function ObjectToString(map){
	return JSON.stringify(map);
}

function ObjectToclientData(map){
	return jQuery.parseJSON(map);
}


String.prototype.replaceAll  = function(s1,s2){     
		return this.replace(new RegExp(s1,"gm"),s2);     
}

function getSearchMap(map){
	var searchMap=ObjectToclientData(map);
	this.searchMap=searchMap;
	/**var searchmap=searchMap.replace('"{','{');
	var searchmap=searchMap.replace('}"','}');
	var searchmap=searchMap.replaceAll('\"','"');
	
	var sss=searchMap.replace('"{','{');
	var ssss=sss.replace('}"','}');
	alert(ssss);
	var ssssss=ssss.replace('\"','');
	ssssss=ssssss.replaceAll('\"','');
	alert(ssssss);
	var searchmap=ObjectToString(searchmap);*/
	return searchMap;
}





