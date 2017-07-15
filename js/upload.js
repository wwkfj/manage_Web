var policyBase64,accessid,signature,host,$file,dir,fileName,type;
var hasToken = false;
var maxFileSize = 10*1024*1024;  //10m大小
$(function(){
//	$('#uploadprogressbar').progressbar('setValue','0')
    $(".progressbar-value .progressbar-text").css("background-color","#1094FA");
    $('#uploadFile').bind('click', function(){
    		$('#uploadprogressbar').progressbar('setValue','0')
    		hasToken = false;
    		var file = $("#fileImport_1").filebox("getValue");
    		if(file.length == 0 ){
    			showError("文件不能为空");
    			return
    		}
    		
    		var fileInput = $("#importFileForm input[type=file]:eq(0)")[0];
    		$file = fileInput.files[0];
    		
    		if($file.size > maxFileSize){
    			showError("文件大小限制10M");
    			return
    		}
    		
		//文件类型
		type = $file.type
		type = type === undefined || type === ''
			? 'common':type
		
    		
    		//开始进程
    		var val = 0;
    		setInterval(startProgress(val),500);
    		//获取oss token
        getOsstoken()
        if(!hasToken)
        		return;
        fileName = dir+"/"+type+"/"+new Date().getTime()+$file.name ;
        var form = new FormData();
        form.append("key",fileName)
        form.append("Filename",fileName)
		form.append("policy",policyBase64)
		form.append("signature",signature)
		form.append("OSSAccessKeyId",accessid)
		form.append("success_action_status",'200')//让服务端返回200,不然，默认会返回204
		form.append('file',$("#importFileForm"))
		
		//ajax 上传文件到OSS
		$.ajax({
            url:host,
            type:"POST",
            data:form,
            processData:false,
            contentType:false,
            success:function(data){
            		$("#fileUrl_1").val("http://cdn-test.jxtykj.net/"+fileName);
                debugger
                console.log("over..");
                startProgress(100)
                clearInterval('startProgress')
            }
		});
        
    });
});
		
function getOsstoken(){

	$.ajax({
            url:'/api/oss/token?time='+new Date().getMilliseconds().toString(),
            type:"GET",
            data:{},
            processData:false,
            async : false,
            contentType:false,
            success:function(data){
                	if (data.code == 0) {
					policyBase64 = data.result.policy;
					accessid     = data.result.accessid;
					signature     = data.result.signature;
					host = data.result.host;
					dir = data.result.dir;
					hasToken = true;
		        }else{
		        		showError("获取token错误");
		        		return;
		        }
//              debugger
//              console.log("over..");
            },
            error:function(){
            		showError("获取token错误");
		        	return;
            }
		});
}

function startProgress(val){
	$('#uploadprogressbar').css("display","block")
	
	if(val <= 90){
		val += 10;
		$('#uploadprogressbar').progressbar('setValue',val);
	}
	if(val == 100){
		$('#uploadprogressbar').progressbar('setValue',val);
//		$('#uploadprogressbar').attr("display","none")
	}
}
		