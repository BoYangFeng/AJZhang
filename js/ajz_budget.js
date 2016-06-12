$(function(){
    budget_ajax_list();
    $(".budget_y").live('mouseover',function(){
        $(this).children().first().addClass("cur");
        $(this).children().next().show();
    }).live('mouseout',function(){
        $(this).children().first().removeClass("cur");
        $(this).children().next().hide();
    });
                
    $(".ys_text").live('click',function(e){
        e.stopPropagation();
        return false;
    });
    //灞曞紑瀛愬垎绫�
    $(".expand").live('click',function(){
        if($(this).children().first().hasClass("jian")){
            $(this).children().first().removeClass("jian");
            $(this).parent().find("ul").slideUp();
        }else{
            $(this).children().first().addClass("jian");
            $(this).parent().find("ul").slideDown();
        }
    });
                
    $("#rcy-up").click(function(){
        var year = parseInt($("input[name=tally_yeah]").val())+1;
        $("input[name=tally_yeah]").val(year);
        budget_ajax_list();
    });
    $("#rcy-down").click(function(){
        var year = parseInt($("input[name=tally_yeah]").val())-1;
        $("input[name=tally_yeah]").val(year);
        budget_ajax_list();
    });
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
        budget_ajax_list();
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
        budget_ajax_list();
    });
    $(".rcm-box a").click(function(){
        $(".rcm-box a").removeClass("on");
        $(this).addClass("on");
        budget_ajax_list();
    });
    $("input[name=account_id]").click(function(){
        $("input[name=account_id]").attr("checked",false);
        $(this).attr("checked",true);
        budget_ajax_list();
    });
                
    //淇濆瓨鏈湀棰勭畻
    $("input[name=update]").live('click',function(){
        var errorid = false;
        $(".father_budget").each(function(){
            var fathersum = parseInt($(this).val());
            if(isNaN(fathersum)){
                return true;
            }
            var sonsum = 0;
            $(this).parent().parent().next().find(".son_budget").each(function(){
                var sonval = $(this).val();
                sonval = sonval == '' || isNaN(sonval) ? 0 : parseInt(sonval);
                sonsum += sonval;
            });
            if(fathersum < sonsum){
                errorid = true;
                return false;
            }
        });
        if(errorid){
            error("澶у垎绫荤殑棰勭畻涓嶈兘灏忎簬灏忓垎绫婚绠楃殑鍜�");
            return false;
        }
        var b_in = '';
        var b_out = '';
        $("input[name*='money[in]']").each(function(){
            b_in += $(this).attr('sid')+'-'+$(this).val() + ',';
        });
        $("input[name*='money[out]']").each(function(){
            b_out += $(this).attr('sid')+'-'+$(this).val() + ',';
        });
        var year = $("input[name=tally_yeah]").val();
        var month = $(".rcm-box a[class=on]").attr("sid");
        $.ajax({
            url:'/user/budget/update/'+year+'/'+month,
            type:'POST',
            dataType:'html',
            data:'in='+b_in + "&out="+b_out,
            success:function(data){
                alert("淇濆瓨鎴愬姛!");
                budget_ajax_list();
            }
        });
    });    
});
            
//棰勭畻鍔犺浇
function budget_ajax_list(){
    var year = $("input[name=tally_yeah]").val();
    var month = $(".rcm-box a[class=on]").attr("sid");
    var param ="year="+year+"&month="+month;
    $.ajax({
        url:'/user/budget/budget_ajax_list/'+year+'/'+month,
        type:'POST',
        dataType:'html',
        success:function(data){
            budget_charts();
            $("#loading").hide();
            $("#budget_list").html(data);
        }
    });
}
            
function budget_charts(){
    var year = $("input[name=tally_yeah]").val();
    var month = $(".rcm-box a[class=on]").attr("sid");
    $.ajax({
        url:'/user/budget/budget_charts/'+year+'/'+month,
        type:'POST',
        dataType:'html',
        cache:false,
        success:function(data){
            $(".myactualxfmain").html(data);
        }
    });
}
//澶嶅埗涓婃湀
function copyprev(){
    var year = $("input[name=tally_yeah]").val();
    var month = $(".rcm-box a[class=on]").attr("sid");
    $.ajax({
        url:'/user/budget/copyprev/'+year+'/'+month,
        type:'POST',
        dataType:'html',
        success:function(data){
            alert("澶嶅埗涓婃湀棰勭畻鎴愬姛!");
            budget_ajax_list();
        }
    });
}
//娓呴櫎鏈湀棰勭畻
function clearmonth(){
    var year = $("input[name=tally_yeah]").val();
    var month = $(".rcm-box a[class=on]").attr("sid");
    $.ajax({
        url:'/user/budget/clearmonth/'+year+'/'+month,
        type:'POST',
        dataType:'html',
        success:function(data){
            alert("娓呯┖鏈湀棰勭畻鎴愬姛!");
            budget_ajax_list();
        }
    });
}