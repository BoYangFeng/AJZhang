$(function(){
    $("#begindate,#enddate").datepicker();  //日期选择
    inout_charts();
    inout_list();
    
    //收入、支出分类单选按钮
    $("input[name=inout_type]").click(function(){
        $("input[name=type]").val($(this).val());
        inout_charts();
        inout_list();
    });
    //年增加
    $("#rcy-up").click(function(){
        var year = parseInt($("input[name=tally_yeah]").val())+1;
        $("input[name=tally_yeah]").val(year);
        rebuildmonth();
        inout_charts();
        inout_list();
    });
    $("#rcy-down").click(function(){
        var year = parseInt($("input[name=tally_yeah]").val())-1;
        $("input[name=tally_yeah]").val(year);
        rebuildmonth();
        inout_charts();
        inout_list();
    });
    
    //月份 
    $(".prev_month").click(function(){
        var temp = $(".rcm-box div").position().left+50;
        if(temp <= 0){
            $(".rcm-box div").css("left",temp);
            $(".rcm-box a[class=on]").removeClass("on").prev().addClass("on");
        }else{
            if($(".rcm-box a[class=on]").attr("sid")!="1"){
                $(".rcm-box a[class=on]").removeClass("on").prev().addClass("on");
            }else{
                $(".rcm-box div").css("left",-350);
                var year =  parseInt($("input[name=tally_yeah]").val())-1;
                $("input[name=tally_yeah]").val(year);
                $(".rcm-box a[class=on]").removeClass("on");
                $(".rcm-box a:last-child").addClass("on");
            }
        }
        rebuildmonth();
        inout_charts();
        inout_list();
    });
    $(".next_month").click(function(){
        var temp = $(".rcm-box div").position().left-50;
        if(temp >= -350){
            $(".rcm-box div").css("left",temp);
            $(".rcm-box a[class=on]").removeClass("on").next().addClass("on");
        }else{
            if($(".rcm-box a[class=on]").attr("sid")!="12"){
                $(".rcm-box a[class=on]").removeClass("on").next().addClass("on");
            }else{
                $(".rcm-box div").css("left",0);
                var year =  parseInt($("input[name=tally_yeah]").val())+1;
                $("input[name=tally_yeah]").val(year);
                $(".rcm-box a[class=on]").removeClass("on");
                $(".rcm-box a:first-child").addClass("on");
            }
        }
        rebuildmonth();
        inout_charts();
        inout_list();
    });
    
    //月份点击
    $(".rcm-box a").click(function(){
        $(".rcm-box a").removeClass("on");
        $(this).addClass("on");
        $("input[name=starttime]").val("");
        $("input[name=endtime]").val("");
        // $("#rc-choose span a").removeClass("choose");
        rebuildmonth();
        inout_charts();
        inout_list();
    });
    
    //点击 时间范围
    $("#rcc-d a").click(function(){
        $("#rcc-s").removeClass("on_this");//去掉本季选中
        $("#rcc-y").removeClass("on_this");//去掉本年选中
        if($(this).parent().attr("class")=="choose_time on_time"){
            $("#rcc-date").hide();
            $(this).parent().removeClass("on_time");
        }else{
            $("#rcc-date").show();
            $(this).parent().addClass("on_time");
        }
    });

    //确定时间按钮事件
    $("#rcc-sure").click(function(){
        $("input[name=starttime]").val($("input[name=starttime_tally]").val());
        $("input[name=endtime]").val($("input[name=endtime_tally]").val());
        $("input[name=year],input[name=month]").val("");
        $("#rcc-date").hide();
        $("#rcc-d").removeClass("on_time");
        inout_charts();
        inout_list();
    });
    //本季  本年点击事件
    $("#rcc-s a,#rcc-y a").click(function(){
        $("input[name=starttime]").val($(this).attr("start"));
        $("input[name=endtime]").val($(this).attr("end"));
        $("input[name=year],input[name=month]").val("");
        $("#rcm-m a").removeClass("on"); //去掉月份选中
        $("#rcc-s").removeClass("on_this");//去掉本季选中
        $("#rcc-y").removeClass("on_this");//去掉本年选中
        $("#rcc-d").removeClass("on_time");//去掉时间段选中
        $("#rcc-date").hide();//隐藏时间段
        $(this).parent().addClass("on_this");
        inout_charts();
        inout_list();
    });
    
    $(".cate_show").click(function(){
        $(this).parent().next().toggle();
        if($(this).hasClass("jian")){
            $(this).removeClass("jian");	 
        }else{
            $(this).addClass("jian");	
        }
    });
    
    $(".fcat input").click(function(){
        if($(this).attr("checked")=="checked"){ 
            $(this).parent().next().find("input").attr("checked","checked");
            if(!$(this).hasClass("sel_all_cat")){
                $(".sel_all_cat").attr("checked",false);
            }
        }else{
            $(this).parent().next().find("input").attr("checked",false);
            if($(".fcat input:checked").size()==0){
                $(".sel_all_cat").attr("checked",true) ;	
            }
        }
        inout_charts();
        inout_list();
    });
    $(".icat input").click(function(){
        if($(this).parent().parent().find("input[checked*=checked]").length==0){
            $(this).parent().parent().prev().find("input").attr("checked",false);
            if($(".fcat input").attr("checked")==false){
                $(".sel_all_cat").attr("checked",true);
            }
        }else if($(this).parent().parent().find("input").length==$(this).parent().parent().find("input[checked=checked]").length){
            $(this).parent().parent().prev().find("input").attr("checked","checked");
            $(".sel_all_cat").attr("checked",false) ;
        }
        inout_charts();
        inout_list();
    });
    $(".myzhanghu_main input").click(function(){
        inout_charts();
        inout_list();
    });
});
function rebuildmonth() {
    $("input[name=year]").val($("input[name=tally_yeah]").val());
    $("input[name=month]").val($(".rcm-box a[class=on]").attr("sid"));
}
//构造选择的分类
function rebuildcategory()  {
    var cat = '';
    $(".icat input:checked").each(function(){
        cat = cat+$(this).val()+",";
    });
    return cat;
}

function rebuildaccount() {
    var cat = '';
    $("input[name=account_id]:checked").each(function(){
        cat = cat+$(this).val()+",";
    });
    return cat;
}
function inout_list(){
    var category = $("input[name=typeid]").val();
    if(category==''){
        category = rebuildcategory();
    }
    var account = rebuildaccount();
    var type = $("input[name=type]").val();
    var year = $("input[name=year]").val();
    var month = $("input[name=month]").val();
    var starttime = $("input[name=starttime]").val();
    var endtime = $("input[name=endtime]").val();
    var param = "type="+type+"&category="+category+"&account="+account+"&starttime="+
    starttime+"&endtime="+endtime+"&year="+year+"&month="+month;
    $.ajax({
        url:'/user/daily/inout_ajax',
        type:'POST',
        dataType:'json',
        data:param,
        success:function(data){
            if(data.totle){
                $("#list_title").show();
            }else{
                $("#list_title").hide();
            }
            $("#inout_detail").html(data.str);
        }
    });
}
function inout_charts(){
    $("input[name=typeid]").val('');
    var category = rebuildcategory();
    var account = rebuildaccount();
    var type = $("input[name=type]").val();
    var year = $("input[name=year]").val();
    var month = $("input[name=month]").val();
    var starttime = $("input[name=starttime]").val();
    var endtime = $("input[name=endtime]").val();
    var param = "type="+type+"&category="+category+"&account="+account+"&starttime="+
    starttime+"&endtime="+endtime+"&year="+year+"&month="+month;
    $.ajax({
        url:"/user/daily/inout_charts",
        type:'POST',
        dataType:'html',
        data:param,
        success:function(data){
            $("#inout_charts").html(data);
        }
    });
}
function set_inout_category(tid){
    $("input[name=typeid]").val(tid);
    inout_list();
}