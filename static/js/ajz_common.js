function changeTallytype(type){
    var html='<div class="'+(type==1?'choose_bg2':'choose_bg1')+'" style="position:relative"><form action="/user/tally_type"  method="post"><input type="hidden" name="t_type" value="'+(type==1?'0':'1')+'"/>'+
    '<button style="border:0;cursor:pointer"  type="submit" class="'+(type==1?'choose_btn2':'choose_btn1')+'" href="javascript:;">'+(type==1?'传统模式':'快记模式')+'</button>'+
    '</form><p id="c_loading" style="position:absolute;top:366px;left:211px;text-align:center;display:none"><img src="/images/loading.gif"><br>请稍候....</p></div>';
    $.dialog({
        id:"reg_dialog",
        padding:0,
        title:'记账模式切换！',
        lock:true,
        content:html
    });
           
}