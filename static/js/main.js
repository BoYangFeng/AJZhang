var SYSTEM_ERROR_TIP_INTERVAL = 10000;
var SYSTEM_TIP_INTERVAL = 5000;
$(function(){
    //鍒楄〃鍩烘湰鎿嶄綔 鍏ㄩ€�/鍒犻櫎
    $(".checkall").click(function() {
        if ($(this).attr("checked") == true) {
            $("input[name='ids[]']").each(function() {
                $(this).attr("checked", true);
            });
            $(".checkall").attr("checked",true) ;
        } else {
            $("input[name='ids[]']").each(function() {
                $(this).attr("checked", false);
            });
            $(".checkall").attr("checked",false);
        }
    });

    $(".error_close").click(function() {
        $(".error_box").hide(300);
    });

    $(".ties").mouseover(function(){
        $(".loginbtninput").addClass("tips_on");
        $(this).next().show();
    });

    $(".ties").mouseout(function(){
        $(".loginbtninput").removeClass("tips_on");
        $(this).next().hide();
    });
    
    $(".multi").click(function(){
        if($(this).val()=="鍒犻櫎" && !confirm("纭鍒犻櫎閫変腑椤癸紵")) return false;
        $("input[name='multi']").val($(this).attr("id"));
        $("#listform").submit();
    });
   
});
function success(content,is_reload){
    alertmsg("success",content,is_reload);
}
function error(content,is_reload){
    alertmsg("error",content,is_reload);
}
function help(content,is_reload){
    alertmsg("help",content,is_reload);
}

function successTip(msg){
    $("#idActionTip").attr("className","success_tip").html(msg);
    SYSTEM_TIP = setInterval(clearTip,SYSTEM_TIP_INTERVAL);
    adjustTipPosition();
}
function clearTip(msg){
    $("#idActionTip").attr("className","").html("");
    clearInterval(SYSTEM_TIP);
    adjustTipPosition();
}
function adjustTipPosition(){
    var scrollTop = document.body.scrollTop;
    if(document.getElementById("Main")){
        scrollTop = document.getElementById("Main").scrollTop
    }
    if(scrollTop>0){
        $("#idActionTip").css("top",scrollTop+"px");
    }else{
        $("#idActionTip").css("top","37px");
    }
}

artDialog.alert = function (content, callback) {
    return artDialog({
        id: 'Alert',
        icon: 'warning',
        fixed: true,
        lock: true,
        content: content,
        ok: true,
        close: callback
    });
};

function alertmsg(type,content,is_reload){
    $.dialog({
        title:content,
        x:'center',
        y:'150',
        lock:true,
        type:'content',
        width:440,
        height:200,
        fixed:true,
        time:1,
        content:'<div align="center" class="alertmsg"><img src="/images/tips/'+type+'.gif"><b>'+content+'</b></div>',
        close: function () {
            if(!is_reload){
                window.location.reload();   
            } 
        }
    });
}
function ask(content,ok,cancel)
{
    var did = 'askdialog';
    $.dialog({
        id:did,
        title:'璇㈤棶',
        x:'center',
        y:'150',
        lock:true,
        type:'content',
        width:440,
        height:200,
        fixed:true,
        content:'<div align="center" class="alertmsg"><img src="/images/tips/help.gif"><b>'+content+'</b></div>',
        style:'no_close',
        ok:function(){
            $.dialog.close(did);
            if(ok!='undefined'){
                ok()
            };
        },
        cancel:function(){
            if(cancel!='undefined'){
                cancel()
            };
        }
    });
}


function formatDate(formatStr, fdate)
{
    var fTime, fStr = 'ymdhis';
    if (!formatStr)
        formatStr= "y-m-d h:i:s";
    if (fdate)
        fTime = new Date(fdate);
    else
        fTime = new Date();
    var formatArr = [
    fTime.getFullYear().toString(),
    (fTime.getMonth()+1).toString(),
    fTime.getDate().toString(),
    fTime.getHours().toString(),
    fTime.getMinutes().toString(),
    fTime.getSeconds().toString() 
    ]
    for (var i=0; i<formatArr.length; i++)
    {
        formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
    }
    return formatStr;
}

function getParam(paramName)
{
    paramValue = "";
    isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=")>1)
    {
        arrSource = unescape(this.location.search).substring(1,this.location.search.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound)
        {
            if (arrSource[i].indexOf("=") > 0)
            {
                if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase())
                {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }   
    }
    return paramValue;
}

function copyurl(set_url)
            {
                if (window.clipboardData){
                    if(window.clipboardData.setData("Text",set_url)){
                        $.dialog.alert('鍦板潃宸插鍒讹紝璇锋墦寮€娴忚鍣ㄧ矘璐村埌鍦板潃鏍忚闂紒');
                    }
                }
                else{
                    alert("浣犵敤鐨勬祻瑙堝櫒涓嶆敮鎸佸櫌锛屾崲IE璇曡瘯锛�");
                }
            }