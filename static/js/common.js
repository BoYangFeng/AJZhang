//应用扩展
Ajzhan.common = {
    confirm: function(msg, yes,no) {
        $.dialog({
            id: 'Confirm',
            icon: 'question',
            fixed: true,
            lock: true,
            opacity: .1,
            content: msg,
            ok: function (here) {
                return yes.call(this, here);
            },
            cancel: function (here) {
                return no && no.call(this, here);
            }
        });
        return false;
    },
    alert:function(content){
        $.dialog({
            id: 'Alert',
            icon: 'warning',
            fixed: true,
            lock: true,
            content: content,
            ok: true
        });
    },
    tips:function(content,time){
        artDialog({
            id: 'Tips',
            title: false,
            cancel: false,
            fixed: true,
            lock: false
        })
        .content('<div style="padding: 0 10px;"><img src="/images/success.gif" style="vertical-align: middle;"/>' + content + '</div>')
        .time(time || 1.5);  
    },
    write: function(id, fn) {
        if (!id) return;
        if (!$(document).data("write" + id)) {
            Ajzhan.api.get("write", {
                id: id
            }, function(json) {
                if (json.code == 1) {
                    $(document).data("write" + id, json.result);
                    fn(json.result);
                }
            });
        } else {
            fn($(document).data("write" + id));
        }
    },
    
    errorAnimation: function(obj) {
        obj.stop(false, true);
        var _o_bgcolor = obj.css("backgroundColor");
        obj.css({
            backgroundColor: "#FFC8C8"
        }).animate({
            backgroundColor: _o_bgcolor
        }, 1000);
        return false;
    },
    errorAnimation1:function(obj){
        obj.animate({
            opacity: 0
        }, 1000).animate({
            opacity: 100
        }, 1000);
    },
    errorAnimationShock:function(obj,targetObj)
    {   
        var box_left = obj.css('left');
        targetObj.attr("disabled",true);
        for (var i = 1; i < 4; i++)
        {
            obj.animate({
                'left': '-=15'
            }, 3, function() {
                $(this).animate({
                    'left': '+=30'
                }, 3, function() {
                    $(this).animate({
                        'left': '-=15'
                    }, 3, function() {
                        $(this).animate({
                            'left': box_left
                        }, 3, function() {
                            // shock end
                            targetObj.attr("disabled",false);
                        });
                    });
                });
            });
        }
    },   
    tally:{
        //上传记账图片
        uploadImg:function(id){
            var uploadDialog = $.dialog({
                title:'上传图片',
                id:"upload_dialog",
                lock:true,
                content:'<form onsubmit="return Ajzhan.common.tally.ajaxFileUpload();" target="hidden_frame" method="post" enctype="multipart/form-data" name="imageform" id="imageform" action="/user/tally/upload_pic"><div class="fast-top" style="padding:20px"><input type="hidden" value="'+id+'" id="img_upoad_id"/>'+
                '<iframe style="display:none" id="hidden_frame" name="hidden_frame"></iframe>'+
                '<input type="hidden" name="tally_id" value="'+id+'"/>'+
                '<input style=" padding: 5px;margin-top: 10px;margin-bottom: 10px" size="30"  type="file" name="file" id="imagefile">'+
                '<p style=" margin-top: 10px;text-align:center"><input style=" padding: 5px; color:#333;" name="uploadfile" id="uploadfile"  type="submit" value="上传图片"/><span id="upload_loading" style="margin-left: 10px;display:none;">正在上传</span></p></div></form>'
            });
        
        },
        ajaxFileUpload:function(){
        
            $("#imagefile").attr("disabled",true);
            return true;
        },
        upload_re:function(err,msg,big){
            if(err==0){
                var id = $("input[name='tally_id']").val();
                $("#upload_"+id).parent().attr('rel','lightbox');
                $("#upload_"+id).parent().attr('href',Ajzhan.IMAGE_URL+big);
                $("#upload_"+id).attr("src",Ajzhan.IMAGE_URL+msg+"?"+Math.random());
                $("#upload"+id).find(".del-upload").show();
                
                $.dialog({
                    id:"upload_dialog"
                }).close();
            }else{
                alert(msg);  
                $("#imagefile").attr("disabled",false);
            }
      
        },
        delImg:function(id){
            if(!confirm("确认删除这笔记录的图片吗？")){
                return;
            }
            $.ajax({
                url:"/user/tally/del_img/"+id,
                success:function(data){
                    if(data=='success'){
                        $("#upload_"+id).parent().attr('rel','');
                         $("#upload_"+id).parent().attr('href','#none');
                        $("#upload_"+id).attr("src","/uploads/tally/define.png"); 
                        $("#upload"+id).find(".del-upload").hide();
                    }else{
                        alert("删除失败！");
                    }
                },
                error:function(e){
                
                }
            });
        },
       
        preview_img:function(url){
            if(url=="") return;
            art.dialog({
                padding: 0,
                title: '大图片',
                left: "50%",
                top: '50%',
                content: '<img src="'+url+'"/>',
                lock: true
            });
        }
    },
    user: {
        checklogin: function(){
            if(Ajzhan.common.user.info.user_id<=0){
                try{
                    Ajzhan.common.expert.expert_dialog.close();
                }catch(e){
                    
                }
                var logintpl = '<div><form method="POST" action="http://www.kuuke.com/user/login?url='+encodeURIComponent('http://ear.kuuke.com')+'" id="loginfrm"><div class="login_con clearfix" style="padding:0"><div class="sign_in">'+
                '<label class="name">帐号</label>'+
                ' <input name="username" type="text" class="lo_text c_text">'+
                ' <span class="tag okey">请输入您之前注册或捆绑的邮箱帐号</span>'+
                '</div>'+
                '<div class="sign_in">'+
                ' <label class="name">密码</label>'+
                '<input name="password" type="password" class="lo_text">'+
                ' <span class="tag wrong">请输入6~18位字符（限数字与字母、符号）</span>'+
                '</div>'+
                '<div class="sign_in">'+
                ' <label class="name">&nbsp;</label>'+
                '<input type="submit" class="lo_btn" value="">'+
                '<span class="tag "><p><a href="http://www.kuuke.com/user/register">注册酷客帐号</a> <a href="http://www.kuuke.com/user/getpasswd">忘记密码？</a></p></span>'+
                '</div>'+
                ' <div class="sign_in">'+
                '<label class="name">&nbsp;</label>'+
                ' <label><img style="cursor:pointer" onclick="open_wind(\'http://www.kuuke.com/connect/tencent?url='+encodeURIComponent('http://ear.kuuke.com')+'\',490,420);" src="/static/images/qq_weibo.gif"/><img onclick="open_wind(\'http://www.kuuke.com/connect/sina?url='+encodeURIComponent('http://ear.kuuke.com')+'\',572,430);" style="cursor:pointer" src="/static/images/sina_weibo.gif"/></label>'+
                ' </div>'+
                ' </div></form></div>';
                Ajzhan.dialog.layer("请先登录",{
                    width:480,
                    height:200,
                    content:logintpl,
                    className: "dialog_error",
                    mask:true
                });
                $("#loginfrm").submit(function(){
                    if(!Ajzhan.tools.isEmail($("input[name='username']").val())){
                        Ajzhan.common.errorAnimation($("input[name='username']"));
                        return false;
                    }
                    if($("input[name='password']").val()==''){
                        Ajzhan.common.errorAnimation($("input[name='password']"));
                      
                        return false;
                    }
                });
                return false;
            }
            return true;
        },
        changeTallytype:function(type){
            var html='<div class="'+(type==1?'choose_bg2':'choose_bg1')+'"><form action="/user/tally_type" method="post">'+
            '<button style="border:0;cursor:pointer" name="type" type="submit" value="'+(type==1?'0':'1')+'" class="'+(type==1?'choose_btn2':'choose_btn1')+'" href="javascript:;">'+(type==1?'专业模式':'快记模式')+'</button>'+
            '</form></div>';
            $.dialog({
                id:"reg_dialog",
                padding:0,
                title:'记账模式切换！',
                lock:true,
                content:html
            });
           
        }
    },
       
    message: {
        filter: function(id){
            Ajzhan.api.get("readnotice",{
                id: id,
                status: 2
            },function(json){
                if(json.code == 1){
                    $(this).closest("tbody").fadeOut(function(){
                        if($(this).siblings().length == 0) 
                            $(".index_notice2").remove();
                        else
                            $(this).remove();
                    });
                }else{
                    Ajzhan.dialog.notice(json.result);
                }
            }.bind(this));
        },
        check: function() {
            var noteTips =$(".navico")
            Ajzhan.api.get("checknote", {}, function(json) {
                if (json.code > 0) {
                    if (json.result.length > 0) {
					
                        noteTips.show().find("span").html(json.result.length);
                    } else {
                        noteTips.hide().find("span").html(0);
                       
                    }
                }
            }, false, true, {
                global: false
            });
            setTimeout(arguments.callee.bind(this), Kuuke.NOTEFREQUENCY);
        }
    },
    //通用初始化
    init:function(){
    //初始引导
	
    }
};
/*
 * jQuery Color Animations
 */
(function(jQuery){
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
        jQuery.fx.step[attr] = function(fx){
            if ( fx.state == 0 ) {
                fx.start = getColor( fx.elem, attr );
                fx.end = getRGB( fx.end );
            }
            fx.elem.style[attr] = "rgb(" + [
            Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
            Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
            Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
            ].join(",") + ")";
        }
    });
    function getRGB(color) {
        var result;
        if ( color && color.constructor == Array && color.length == 3 )
            return color;
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
        return "";
    }
    function getColor(elem, attr) {
        var color;
        do {
            color = jQuery.curCSS(elem, attr);
            if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
                break; 
            attr = "backgroundColor";
        } while ( elem = elem.parentNode );
        return getRGB(color);
    };
})(jQuery);
function open_wind(url, width, height){
    var top=($(window).height()-height)/2;
    var left=($(window).width()-width)/2;
    window.open(url,'txweibowindow', 'height='+height+', width='+width+', toolbar =no, menubar=no, scrollbars=yes, resizable=no,top='+top+',left='+left+', location=no, status=no');
}
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
    return false;     
}










