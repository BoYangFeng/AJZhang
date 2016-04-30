/// <reference path="jquery-1.3.2-vsdoc2.js" />
//基础框架
Ajzhan = $.extend(Ajzhan, {
    module: {
        "core.template": "template-min",
        "core.flash": "swfobject-min",
        "core.widget": "widget",
        "core.form": "formValidator",
        "core.overlay": "jquery.colorbox",
        "tools.addthis": "addthis-jq"
    },
    _loadModule: [],
    _loadedModule: [],
    init: function(module, fn) {
        if (arguments.length == 1 && module.constructor == Function) {
            fn = module;
            module = "";
        }
        var flag = [],
        timer = 0,
        overtime = 10, //超时秒数
        arr_module = module.split(",");
        var self = this;
        if (module) {
            $.each(arr_module, function(n, item) {
                if (self._loadModule.unique().include(item)) return;
                self._loadModule.push(item);
                if (!self._loadedModule.include(item)) {
                    self.include(self.RESOURCEURL + "/js/" + self.module[item] + ".js", function() {
                        switch (item) {
                            case "core.form":
                                $.extend(true, $.formValidator.settings, {
                                    alertmessage: false,
                                    autotip: true,
                                    errorfocus: false,
                                    submitonce: false
                                });
                                self._loadedModule.push(item);
                                self.include(self.RESOURCEURL + "/style/common/validatorAuto.css");
                                break;
                            case "tools.addthis":
                                self.include(self.RESOURCEURL + "/style/common/addthis.css");
                                self._loadedModule.push(item);
                                break;
                            case "tools.imgareaselect":
                                self.include(self.RESOURCEURL + "/style/common/imgareaselect-default.css");
                                self._loadedModule.push(item);
                                break;
                            default:
                                self._loadedModule.push(item);
                                break;
                        }
                    });
                }
            });
        }
        var checkInterval = setInterval(function() {
            if (this._loadedModule.length == $.merge(this._loadModule, this._loadedModule).unique().length || timer / 10 > overtime) {
                clearInterval(checkInterval);
                typeof fn == "function" ? fn() : eval(fn);
            }
            timer++;
        } .bind(this), 100);
              
    },
    include: function(url, callback) {
        var afile = url.toLowerCase().replace(/^\s|\s$/g, "").match(/([^\/\\]+)\.(\w+)$/);
        if (!afile) return false;
        switch (afile[2]) {
            case "css":
                var el = $('<link rel="stylesheet" id="' + afile[1] + '" type="text/css" />').appendTo("head").attr("href", url);
                if ($.browser.msie) {
                    el.load(function() {
                        if (typeof callback == 'function') callback();
                    });
                } else {
                    var i = 0;
                    var checkInterval = setInterval(function() {
                        if ($("head>link").index(el) != -1) {
                            if (i < 10) clearInterval(checkInterval)
                            if (typeof callback == 'function') callback();
                            i++;
                        }
                    }, 200);
                }
                break;
            case "js":
                $.ajax({
                    global: false,
                    cache: true,
                    ifModified: false,
                    dataType: "script",
                    url: url,
                    success: callback
                });
                break;
            default:
                break;
        }
    },
    namespace: function(module) {
        var space = module.split('.');
        var s = '';
        for (var i in space) {
            if (space[i].constructor == String) {
                if (0 == s.length)
                    s = space[i];
                else
                    s += '.' + space[i];
                eval("if ((typeof(" + s + ")) == 'undefined') " + s + " = {};");
            }
        }
    },
    register: function(module) {
        var _this = this;
        var _func = function(module) {
            if (module && _this[module]) {
                for (var i in _this[module]) {
                    this[i] = _this[module][i];
                }
            }
            return this;
        };
        return new _func(module);
    },
    tools: {
        copy: function(txt) {
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", txt);
            } else if (navigator.userAgent.indexOf("Opera") != -1) {
                window.location = txt;
            } else if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试");
                    return false;
                }
                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                if (!clip) return false;
                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                if (!trans) return false;
                trans.addDataFlavor('text/unicode');
                var str = new Object();
                var len = new Object();
                var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
                var copytext = txt;
                str.data = copytext;
                trans.setTransferData("text/unicode", str, copytext.length * 2);
                var clipid = Components.interfaces.nsIClipboard;
                if (!clip) return false;
                clip.setData(trans, null, clipid.kGlobalClipboard);
            }
            return true;
        },
        string: {
            format: function() {
                if (arguments.length == 0) return "";
                var args = arguments;
                var str = args[0];
                return str.replace(/\{(\d+)\}/gm, function() {
                    return args[parseInt(arguments[1]) + 1];
                });
            },
            length: function(str){
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) >= 0x4e00 && str.charCodeAt(i) <= 0x9fa5) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            }
        },
        date:{
            format: function(date, mask, utc){	
                var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function (val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len) val = "0" + val;
                    return val;
                };
                this.i18n = {
                    dayNames: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                    ],
                    monthNames: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]
                };
                if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }
                date = date ? new Date(date) : new Date;
                if (isNaN(date)) throw SyntaxError("invalid date");

                mask = mask || "ddd mmm dd yyyy HH:MM:ss";
                if (mask.slice(0, 4) == "UTC:") {
                    mask = mask.slice(4);
                    utc = true;
                }
                var	_ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  this.i18n.dayNames[D],
                    dddd: this.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  this.i18n.monthNames[m],
                    mmmm: this.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };
                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            }
        },
        hashString: function(item) {
            if (!item) return location.hash.substring(1);
            var sValue = location.hash.match(new RegExp("[\#\&]" + item + "=([^\&]*)(\&?)", "i"));
            sValue = sValue ? sValue[1] : "";
            return sValue == location.hash.substring(1) ? "" : sValue == undefined ? location.hash.substring(1) : decodeURIComponent(sValue);
        },
        cookie: function(name, value, options) {
            if (typeof value != 'undefined') {
                options = options || {};
                if (value === null) {
                    value = '';
                    $.extend({}, options);
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                var cookieValue = '';
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].tirm();
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        checkAll: function(obj, elName) {
            $(obj).closest("form").find("input:checkbox[name=" + elName + "]").attr("checked", $(obj).attr("checked"));
        },
        checkCount:function(obj,maxNum){
            var chks = document.getElementsByName(obj.name);
            var count = 0;
            for(var i=0; i<chks.length; i++)
            {
                if(chks[i].checked == true)
                {
                    count ++;
                }
                if(count > maxNum)
                {
                    obj.checked = false;
                    alert('最多只能选择' + maxNum + '项');
                    return false;
                }
            }
        },
        insertSelection: function(obj, str) {
            var tc = obj;
            var tclen = tc.value.length;
            tc.focus();
            if (typeof document.selection != "undefined") {
                document.selection.createRange().text = str;
                obj.createTextRange().duplicate().moveStart("character", -str.length);
            } else {
                var m = tc.selectionStart;
                tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
                tc.selectionStart = m + str.length;
                tc.setSelectionRange(m + str.length, m + str.length);
            }
        },
        msglen: function (text) { // 微博字数计算规则 汉字 1 英文 0.5 网址 11 除去首尾空白
            text = text.replace(new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*","gi"),'填充填充填充填充填充填');
            return Math.ceil(($.trim(text.replace(/[^\u0000-\u00ff]/g,"aa")).length)/2);
        },
        json_encode_js:function(aaa){
            function je(str){
                var a=[],i=0;
                var pcs="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                for (;i<str.length;i++){
                    if(pcs.indexOf(str[i]) == -1)
                        //a[i]="\\u"+("0000"+str.charCodeAt(i).toString(16)).slice(-4);
                        a[i]=str[i];
                    else
                        a[i]=str[i];
                }
                return a.join("");
            }
            var i,s,a,aa=[];
            if(typeof(aaa)!="object") {
                alert("ERROR json");
                return;
            }
            for(i in aaa){
                s=aaa[i];
                a='"'+je(i)+'":';
                if(typeof(s)=='object'){
                    a+=json_encode_js(s);
                }else{
                    if(typeof(s)=='string')
                        a+='"'+je(s)+'"';
                    else if(typeof(s)=='number')
                        a+=s;
                }
                aa[aa.length]=a;
            }
            return "{"+aa.join(",")+"}";
        },
        /*
		中国电信：133、153、180、189
		中国联通：130、131、132、155、156、185、186
		中国移动：134、135、136、137、138、139、147、150、151、152、157、158、159、182、187、188
		*/
        isPhone:function(phone){
            if(phone == '' || phone.length != 11){
                return false;
            }
            if(!phone.match(/^1[3|4|5|8]\d{9}$/)){
                return false;
            }else{
                return true;
            }
        },
		
        isEmail:function(email){
            if(email == '' || email.length < 6){
                return false;
            }
            if(!email.match(/^\w+((-+\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)){
                return false;
            }else{
                return true;
            }
        }
    },
    widget: {},
    api: {	//接口调用方法
        ajax: function(type, action, data, callback, cache, async, options) {
            if (action != undefined)
                var url = (Ajzhan.BASEURL=='/'?'':Ajzhan.BASEURL)+Ajzhan.SERVICEURL + "/" + action;
            else
                var url = location.pathname;
            $.ajax($.extend({
                url: url,
                data: data,
                async: typeof async != "undefined" ? async : true,
                type: typeof type != "undefined" ? type : "GET",
                //dataType: "json",
                //contentTypeString:"appliction/json; charset=UTF-8",
                ifModified: false,
                timeout: 8000,
                traditional: true,
                cache: typeof cache != "undefined" ? cache : true,
                success: callback,
                //dataFilter: function(data) {
                //return eval("(" + data + ")");
                //},
                error: function() {
                    if (async == false) {
                        Ajzhan.dialog.alert(Ajzhan.LANG.syserror);
                    }
                    $("#dialog_loading").remove();
                    return false;
                },
                beforeSend: function(XMLHttpRequest) {
                }
            }, options || {}));
        },
        get: function(action, data, callback, cache, async, options) {
            this.ajax("GET", action, data, callback, cache, async, options);
        },
        post: function(action, data, callback, cache, async, options) {
            this.ajax("POST", action, data, callback, cache, async, options);
        }
    },
    template: function(tplname, data) {	//模板
        return $("#_" + tplname.toUpperCase() + "_TPL_").html().process(data);
    },
    dialog: {	//模态框
        init: function(options) {
            this.opt = $.extend({
                title: "",
                content: "",
                className: "",
                foot: "",
                width: 400,
                height: "",
                pos: false,
                mask: false,
                close: null,
                blur: false,
                maximize: false,
                minimize: false,
                open: null,
                drag: true,
                buttons: [],
                config: null,
                parentEl: null,
                func: $.noop
            },
            options || {});
            this.buttons = [];
            this._config = $.extend({}, this.config);
            return Ajzhan.register("dialog");
        },
        _init: function() {
            $("#dialog_loading").remove();
            this.pannel = this.pannel || $('<div />').appendTo(this.opt.parentEl || document.body);
            if (this.opt.mask) {
                this.mask = this.mask || $('<div class="Iframe_HideSelect" scrolling="no" frameborder="0" />').appendTo(document.body).hide();
                if(this.opt.blur){
                    this.pannel.out("click",this.close.bind(this),true)
                }
            }
            this._createLayer();
        },
        config: {
            title: "div.title",
            head: "div.d_header",
            body: "div.d_body",
            foot: "div.d_footer",
            content: "div.d_content",
            button: "div.d_footer .button",
            closeEl: "a.btn_close",
            frame: "iframe.Iframe_Content",
            dialogBox: "div.dialog",
            mainButtonClass: "submit",
            subButtonsClass: "cancel",
            buttonClass: "button",
            loaddingHtml: "<div class='load-page'></div>"
        },
        _getEls: function() {
            this._els = {
                title: $(this._config.title, this.pannel),
                head: $(this._config.head, this.pannel),
                body: $(this._config.body, this.pannel),
                foot: $(this._config.foot, this.pannel),
                content: $(this._config.content, this.pannel),
                closeEl: $(this._config.closeEl, this.pannel),
                dialogBox: $(this._config.dialogBox, this.pannel)
            }
        },
        _createLayer: function() {
            var _html = [];
            _html.push('<div class="dialog ');
            _html.push(this.opt.className);
            _html.push('" style="width:');
            _html.push(this.opt.width);
            _html.push('px;"><iframe class="maskIframe" scrolling="no" frameborder="0"></iframe><div class="d_layout"><span class="d_tl"><span class="d_tr"><span class="d_br"><span class="d_bl"></span></span></span></span></div><div class="d_main">');
            if (typeof this.opt.title != null) {
                _html.push('<div class="d_header" style="display:none"><div style="display:none" class="d_header_tl"> </div><div class="d_header_tr"></div><h4 class="title">');
                _html.push(this.opt.title);
                _html.push('</h4>');
                _html.push('<div class="options">');
                if (this.opt.minimize) _html.push('<a href="javascript:void(0)" class="icon btn_minimize" title="最小化"></a>');
                if (this.opt.maximize) _html.push('<a href="javascript:void(0)" class="icon btn_maximize" title="最大化"></a>');
                if (this.opt.close) _html.push('<a href="javascript:void(0)" class="icon btn_close" title="关闭"></a>');
                _html.push('</div></div>');
            }
            _html.push('<div class="d_body" style="height:')
            _html.push(this.opt.height);
            _html.push('px;"><div class="d_content">');
            _html.push(this.opt.content);
            _html.push('</div></div>');
            _html.push('<div class="d_footer">');
            _html.push(this.opt.foot);
            _html.push('</div>');
            _html.push('</div></div>');
            this.pannel.hide().html(_html.join(""));
            this.body = $(this._config.body, this.pannel).length > 0 || this.pannel;
            this._getEls();
            this.setButtons(this.opt.buttons);
            this.inUse = true;
            this._regEvent();
            if (this.opt.foot) {
                this._els.foot.show();
            }
            if (this.opt.title != null && this.opt.title) {
                this._els.head.show();
            }
        },
        resize: function(options) {
            if (options) {
                if (options.width)
                    this._els.dialogBox.width(options.width);
                if (options.height)
                    this._els.body.height(options.height);
            }
            if ($.browser.msie6)
                $(".maskIframe", this.pannel).height(this._els.dialogBox.height() - 4).width(this._els.dialogBox.width() - 4);
            if (this.opt.mask && !$.browser.msie6)
                this._els.dialogBox[0].style.position = "fixed";
            return this;
        },
        _regEvent: function() {
            var _dialog = this._els.dialogBox;
            if (this._els.closeEl && this._els.closeEl.length > 0) {
                this._els.closeEl.click(this.close.bind(this));
            }
            $(document).bind('keydown', this._keyEvent.bindEvent(this));
            $(window).resize(function() {
                if (!this.windowSize) {
                    this.windowSize = {
                        width: $(window).width(),
                        height: $(window).height()
                    };
                }
                if ($.browser.msie) {	//ie resize bug
                    if ($(window).width() == this.windowSize.width && $(window).height() == this.windowSize.height)
                        return;
                }
                this.setPos(this.opt.pos);
            } .bind(this));
            if (this.opt.drag) this._els.head.drag(window, _dialog, {
                x: 10, 
                y: 10
            });
        },
        _show: function() {
            this.pannel.show();
            this.resize();
            this.setPos(this.opt.pos);
            if (this.opt.mask) {
                this.mask.show();
            }
            if (this.opt.close && this.opt.close.time) {
                this.close(this.opt.close.time);
            }
            if (this._mainButton != undefined && this.buttons[this._mainButton] && this.buttons[this._mainButton].find('button').length > 0) {
                this.buttons[this._mainButton].find('button').focus();
            }
            if (this.opt.open && this.opt.open.callback) {
                this.opt.open.callback.bind(this)();
            }
            return this;
        },
        _close: function() {
            this.inUse = false;
            if (this.opt.close && this.opt.close.callback) {
                this.opt.close.callback.bind(this)();
            }
            if (this.opt.mask && this.mask && this.mask.length > 0) {
                this.mask.remove();
            }
            if (this.pannel && this.pannel.length > 0) {
                this.pannel.remove();
                this._clearDom();
            }
        },
        _clearDom: function() {
            this._els = null;
            this.body = null;
            this.pannel = null;
            this.buttons = null;
            this.mask = null;
            this.timer = null;
        },
        _keyEvent: function(e) {
            if (e.keyCode == 27 && this.inUse) {
                this.close();
            }
        },
        setClassName: function(name, reset) {
            reset = reset || false;
            if (reset)
                this._els.dialogBox.attr("class", name);
            else
                this._els.dialogBox.addClass(name);
            return this;
        },
        setButtons: function(_buttons) {
            if (_buttons && _buttons != [] && _buttons != {}) {
                if (_buttons.constructor == Object) {
                    _buttons = [_buttons];
                }
                if (_buttons.length > 0) {
                    $.each(_buttons, function(i, item) {
                        if (item && item.constructor == String) {
                            var _title = item;
                            item = {};
                            item.title = _title;
                            item.classType = this._config.subButtonsClass;
                            item.type = '';
                        }
                        if (!item.type) {
                            item.type = '';
                        }
                        if (item && item.constructor == Object) {
                            item.classType = item.type.indexOf("main") > -1 ? this._config.mainButtonClass : this._config.subButtonsClass;
                            item.buttonType = item.form ? item.form : 'button';
                        }
                        this.setFoot($("<span class='button " + item.classType + "'><span><button type='" + item.buttonType + "' title='" + item.title + "'>" + item.title + "</button></span></span>"));
                    } .bind(this));
                }
                var buttons = this.pannel.find(this._config.button);
                if (buttons.length > 0) {
                    this.buttons = [];
                    buttons.each(function(i, item) {
                        if (_buttons[i]) {
                            this.buttons.push($(item));
                            if (_buttons[i].func && _buttons[i].func.constructor == Function) {
                                $(item).click(_buttons[i].func.bind(this));
                            }
                            if (_buttons[i].close == true) {
                                $(item).click(this.close.bind(this));
                            }
                            if (_buttons[i].focus || _buttons[i].type == 'main') {
                                if (this.pannel.is(":visible")) {
                                    $(item).find('button').focus();
                                } else {
                                    this._mainButton = i;
                                }
                            }
                        }
                    } .bind(this));
                }
            } else {
                this.setFoot(this.opt.foot);
                this._mainButton = undefined;
            }
            return this;
        },
        setPos: function(pos) {
            if (!this.inUse) {
                return;
            };
            var pannelBox = (this._els.dialogBox && this._els.dialogBox.length > 0) ? this._els.dialogBox : this.pannel;
            if (pos && pos.left != undefined && pos.top != undefined) {
                this.opt.pos = pos;
                pannelBox.css(pos);
            } else {
                if (this.opt.parentEl) {
                    pannelBox.css({
                        "top": "auto", 
                        "left": "auto"
                    });
                } else {
                    var top = pannelBox.offset().top;
                    var dHeight = pannelBox.height() == 0 ? 180 : pannelBox.height();
                    var dWidth = pannelBox.width() == 0 ? 180 : pannelBox.width();
                    var bHeight = $(window).height();
                    var bWidth = $(window).width();
                    var bTop = (this.opt.mask && !$.browser.msie6) ? 0 : $(document).scrollTop();
                    pannelBox.css("left", (bWidth - dWidth) / 2 + "px");
                    if (dHeight < bHeight - 30) {
                        pannelBox.css("top", (bHeight - dHeight) / 2 - 30 + bTop + "px");
                    } else {
                        pannelBox.css("top", "30px");
                    }
                }
            }
            return this;
        },
        setTitle: function(html) {
            if (this._els.title && this._els.title.length > 0) {
                this._els.title.html(html);
            }
            return this;
        },
        setFoot: function(html) {
            if (this._els.foot && this._els.foot.length > 0) {
                if ((html.constructor == Object && html.length == 0) || (html.constructor == String && html.trim() == "")) {
                    this._els.foot.empty().hide();
                    this._mainButton = null;
                    return this;
                } else {
                    this._els.foot.show();
                }
                if (html.constructor == Object)
                    this._els.foot.append(html);
                else {
                    this._els.foot.html(html);
                }
            }
            return this;
        },
        setContent: function(html) {
            if (this._els.body && this._els.body.length > 0) {
                if (html.constructor == Object)
                    this._els.content.append(html);
                else
                    this._els.content.html(html);
            }
            this.setPos(this.opt.pos);
            var _iframe = this._els.content.find(this.config.frame);
            if (_iframe.length > 0) {
                _iframe.css('height', this.opt.height + "px");
            }
            return this;
        },
        setHtml: function(html) {
            if (this._els.body && this._els.body.length > 0) {
                this._els.body.empty().append(html);
            }
            this.setPos(this.opt.pos);
            var _iframe = this._els.body.find(this.config.frame);
            if (_iframe.length > 0) {
                _iframe.css('height', this.opt.height + "px");
            }
            return this;
        },
        _optionsExtend: function(opt, options) {
            var _options = options;
            if (options.buttons) {
                var _temp = _options.buttons;
                delete _options.buttons;
                if (_temp.constructor == Array) {
                    if (!opt.buttons) {
                        opt.buttons = [];
                    } else if (opt.buttons.constructor == Object) { 
                        opt.buttons = [opt.buttons];
                    };
                    for (var i = 0; i < _temp.length; i++) {
                        opt.buttons[i] = $.extend(opt.buttons[i], _temp[i]);
                    }
                } else if (_temp.constructor == Object) {
                    if (!opt.buttons) {
                        opt.buttons = {};
                    };
                    opt.buttons = $.extend(opt.buttons, _temp)
                }
            };
            if (options.close) {
                var _temp = _options.close;
                delete _options.close;
                if (!opt.close) {
                    opt.close = {}
                };
                opt.close = $.extend(opt.close, _temp);
            };
            return $.extend(opt, _options);
        },
        show: function() {
            if (this.timer) clearTimeout(this.timer);
            if (this.opt.open && this.opt.open.time) {
                this.show.timeout(this.opt.open.time);
            } else {
                this._show();
            }
            if(this.opt.mask) $(document).bind("DOMMouseScroll.dialog", function() {
                return false;
            });
            this.hideStatus = false;
            return this;
        },
        hide: function(time) {
            if (time && time.constructor == Number) {
                this.timer = this.hide.bind(this).timeout(time);
                return;
            }
            this.pannel.hide();
            if (this.mask) {
                this.mask.hide();
            }
            if(this.opt.mask) $(document).unbind("DOMMouseScroll.dialog");
            this.hideStatus = true;
            return this;
        },
        toggle: function() {
            if (this.hideStatus)
                return this.show();
            else
                return this.hide();
        },
        close: function(time) {
            if (time && time.constructor == Number) {
                if (!$.browser.msie && this.opt.close.duration) {
                    this.timer = function() {
                        this._els.dialogBox.animate({
                            opacity: 0.1
                        }, function() {
                            this.close.bind(this)();
                        } .bind(this));
                    } .bind(this).timeout(time);
                } else {
                    this.timer = this.close.bind(this).timeout(time);
                }
                return;
            }
            if(this.opt.mask) $(document).unbind("DOMMouseScroll.dialog");
            clearTimeout(this.timer);
            this._close();
            return false;
        },
        setClose: function(num) {
            var _num = num || 2;
            setTimeout(function() {
                this.close();
            } .bind(this), _num * 1000);
        },
        setCloseOptions: function(options) {
            if (!this.opt) this.opt = {};
            this.opt.close = options
        },
        alert: function(info, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.buttons = {
                title: '确定',
                type: 'main',
                close: true,
                func: options.callback || $.noop
            };
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        notice: function(info, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.close = {
                duration: true,
                time: 2.2
            };
            _this.opt.buttons = {
                title: '关闭',
                type: 'main',
                close: true,
                func: options.callback || $.noop
            };
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        confirm: function(info, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.buttons = [{
                title: '确定',
                type: 'main',
                close: true,
                func: options.yes || $.noop
            },
            {
                title: '取消',
                type: 'cancel',
                close: true,
                func: options.no || $.noop
            }
            ];
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        loading: function(title, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.title = title || "加载中...";
            _this.opt.drag = false;
            _this.opt.content = _this._config.loaddingHtml;
            _this.opt.close = {};
            _this.opt.buttons = [];
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.pannel.attr("id", "dialog_loading");
            _this.show();
            return _this;
        },
        ajax: function(title, options) {
            var _this = this.init();
            var options = options || {};
            if (options.action) {
                if (title) {
                    _this.opt.title = title;
                }
                _this.opt.content = _this._config.loaddingHtml;
                _this.opt.mask = true;
                _this.opt.close = {};
                _this._optionsExtend(_this.opt, options);
                _this._init();
                _this.show();
                Ajzhan.api.get(options.action, options.params || {}, function(html) {
                    if(!this) return;
                    this.setContent(html);
                    this.show();
                } .bind(_this), true, true, {
                    dataType:"text/html"
                });
            }
            return _this;
        },
        layer: function(title, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.title = title;
            _this.opt.close = true;
            var olayer = $(options.content);
            options.content = "";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            if (olayer.data("tpl_dialog") == null) {
                olayer.data("tpl_dialog", olayer.contents().clone(true)).empty();
            }
            _this.setHtml(olayer.data("tpl_dialog"));
            _this.show();
            return _this;
        },
        iframe: function(title, options) {
            var _this = this.init();
            if (options.url) {
                var options = options || {};
                if (title) {
                    this.opt.title = title;
                }
                _this.opt.close = {};
                _this.opt.mask = true;
                _this.opt.content = _this._config.loaddingHtml;
                _this.opt.buttons = options.buttons || [];
                _this._optionsExtend(_this.opt, options);
                _this._init();
                _this.show();
                $(_this._config.loaddingHtml, _this.dialogBox).remove();
                _this.setHtml($('<iframe />', {
                    "class": "Iframe_Content",
                    "src": options.url,
                    "css": {
                        "border": "none",
                        "width": "100%"
                    },
                    "frameborder": "0"
                }).clone());
            }
            return _this;
        },
        tooltip: function(tiptype, title, options) {
            options = $.extend({
                mask: false,
                className: "tooltip",
                drag: false,
                buttons: []
            }, options || {});
            return this[tiptype](title, options);
        },
        suggest: function(info, options) {
            var _this = this.init();
            _this.opt.title = "";
            _this.opt.content = "";
            _this.opt.mask = false;
            _this.opt.width = 230;
            _this.opt.close = null;
            _this.opt.head = null;
            _this.opt.drag = false;
            _this.opt.className = "suggest";
            _this._optionsExtend(_this.opt, options || {});
            _this._init();
            _this.setHtml(info);
            _this.show();
            var bTop = $(document).scrollTop();
            _this._els.dialogBox.stop(true, true).css({
                "top": ($(window).height() - _this.pannel.height()) / 4 * 3 + bTop,
                "opacity": 0.1
            }).animate({
                "opacity": 1,
                "top": _this._els.dialogBox.position().top - 30
            }, 800, function() {
                this._els.dialogBox.delay(1200).animate({
                    "opacity": 0.1,
                    "top": this._els.dialogBox.position().top - 30
                }, 1200, function() {
                    this.close();
                } .bind(this))
            } .bind(_this));
            return _this;
        }
    },
    tabs: {	//页签
        bind: function(obj, cobj) {
            $("dd>ul:eq(0)>li", obj).click(function() {
                var _class = this.className.split(" ");
                if ($.inArray("none", _class) == -1 && $.inArray("more", _class) == -1) {
                    var _index = $(this).parent().children(":not(.more,.none)").index($(this).addClass("curr").siblings().removeClass("curr").end()[0]);
                    var tab_content = $(obj).siblings(cobj);
                    if (tab_content.length > 0) 
                        tab_content.hide().eq(_index).show();
                }
            });
            $("dd>ul.tabs_sub>li>a", obj).click(function() {
                var _this = $(this).parent();
                var _class = _this[0].className.split(" ");
                if ($.inArray("none", _class) == -1) {
                    _this.addClass("curr").siblings().removeClass("curr");
                }
            });
            if ($(".more_list li", obj).length > 0) {
                $("li.more>a:eq(0)", obj).click(function() {
                    var _this = $(".more_list", obj);
                    _this.toggle().out("click", function(e) {
                        var found = $(e.target).closest(_this).length || e.target == this;
                        if (found == 0) _this.hide();
                    } .bind(this), true);
                });
            }
        }
    },
    form: {
        bindDefault: function(obj) {
            $(obj || "input.default,textarea.default").live("focus", function() {
                if (this.value == this.defaultValue) {
                    this.value = '';
                    this.style.color = "#000";
                }
            }).live("blur", function() {
                if (this.value == '') {
                    this.value = this.defaultValue;
                    this.style.color = '#ccc';
                }
            });
        },
        bindFocus: function(obj) {
            $(obj || "input.text,textarea.textarea").live("focus", function() {
                $(this).addClass("focus");
            }).live("blur", function() {
                $(this).removeClass("focus");
            });
        },
        isInputNull: function(obj) {
            obj = $(obj);
            if (obj.length == 0) return false;
            var _value = obj.val().trim();
            if (_value == "" || _value == obj[0].defaultValue) {
                return true;
            }
            return false;
        },
        bindSelect: function(obj) {
            var self = $(obj);
            var box = $('<div class="dropselectbox" />').appendTo(self.hide().wrap('<div class="dropdown" />').parent());
            $('<h4><span class="symbol arrow">▼</span><strong>' + self.children("option:selected").text() + '</strong></h4>').hover(function() {
                $(this).toggleClass("hover", option.is(":visible") ? true : null);
            }).appendTo(box).one("click", function() {
                self.children("option").each(function(i, item) {
                    $('<li><a href="javascript:void(0)">' + $(item).text() + '</a></li>').appendTo(option).click(function() {
                        option.prev().children("strong").html($(item).text());
                        self.val(item.value).change();
                        option.hide();
                    });
                });
            }).click(function() {
                option.toggle();
            }).out("click", function() {
                $(this).removeClass("hover");
                option.hide();
            }, true);
            var option = $('<ul />').appendTo(box);
        }
    },
    pager: {	//分页控件
        init: function(obj, options) {
            this.element = $(obj);
            this.opt = $.extend({
                pageindex: 1,
                pagesize: 10,
                totalcount: -1,
                type: "numeric", //text
                total: false,
                skip: false,
                breakpage: 3,
                ajaxload: false
            }, options || {});
            return Ajzhan.register("pager");
        },
        bind: function(obj, options) {
            var _this = this.init(obj, options);
            if (_this.opt.pageindex < 1) _this.opt.pageindex = 1;
            if (_this.opt.totalcount > -1) {
                _this.opt.pagecount = Math.ceil(_this.opt.totalcount / _this.opt.pagesize);
                if (_this.opt.pageindex > _this.opt.pagecount) _this.opt.pageindex = _this.opt.pagecount;
            } else {
                _this.opt.pagecount = 99999;
            }
            if (_this.opt.breakpage > _this.opt.pagecount - 2) {
                _this.opt.breakpage = _this.opt.pagecount - 2;
                _ellipsis = [true, true];
            } else {
                _ellipsis = [false, false];
            }
            var _html = [];
            if (_this.opt.pagecount > 1 || _this.opt.total)
                _html.push('<div class="pager ' + (_this.opt.type == "numeric" ? "pager_numeric" : "") + '">\n');
            if (_this.opt.total) {
                _html.push('<div class="p_options">');
                _html.push('<span class="p_ptotal">' + _this.opt.pageindex + '页/' + _this.opt.pagecount + '页</span>\n');
                _html.push('<span class="p_total">共' + _this.opt.totalcount + '条</span>\n');
                _html.push('</div>');
            }
            if (_this.opt.pagecount > 1) {
                if (_this.opt.type == "text") {
                    if (_this.opt.pageindex > 1) {
                        if (_this.opt.pagecount < 9999) _html.push('<a class="p_start" href="' + _this._getUrl(1) + '">首页</a>\n');
                        _html.push('<a class="p_prev" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上一页</a>\n');
                    }
                    if (_this.opt.pageindex != _this.opt.pagecount) {
                        _html.push('<a class="p_next" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下一页</a>\n');
                        if (_this.opt.pagecount < 9999) _html.push('<a class="p_end" href="' + _this._getUrl(_this.opt.pagecount) + '">尾页</a>\n');
                    }
                }
                if (_this.opt.type == "numeric") {
                    if (_this.opt.pageindex > 1) {	//第一页
                        _html.push('<a class="p_prev" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上页</a>\n');
                    }
                    var _page = [1, _this.opt.pagecount, _this.opt.pageindex, _this.opt.pageindex - 1, _this.opt.pageindex + 1];
                    _page = $.grep(_page, function(item, i) {
                        return item > 0 && item <= _this.opt.pagecount;
                    }).unique();
                    var _count = _page.length;
                    for (var i = 1; i <= _this.opt.breakpage + 2 - _count; i++) {
                        _page.push(_this.opt.pageindex + (_this.opt.pageindex + i < _this.opt.pagecount ? i + 1 : -i - 1));
                    }
                    _page = _page.sort(function sortNumber(a, b) {
                        return a - b;
                    }).unique();
                    var title = "";
                    $.each(_page, function(i, item) {
                        if (this.opt.pageindex == item) {
                            _html.push('<strong>' + item + '</strong>\n');
                        } else {
                            if (item == 1) {
                                title = "首页";
                            } else if (item == _this.opt.pagecount) {
                                title = "尾页";
                            } else {
                                title = "第" + item + "页";
                            }
                            if (_ellipsis[1] == false && this.opt.pageindex <= this.opt.pagecount - this.opt.breakpage && this.opt.pagecount == item) {
                                _html.push('<span>...</span>\n');
                                _ellipsis[1] = true;
                            }
                            _html.push('<a class="p_start" href="' + this._getUrl(item) + '" title="' + title + '">' + item + '</a>\n');
                            if (_ellipsis[0] == false && this.opt.pageindex > this.opt.breakpage) {
                                _html.push('<span>...</span>\n');
                                _ellipsis[0] = true;
                            }
                        }
                    } .bind(_this));
                    if (_this.opt.pageindex < _this.opt.pagecount) {
                        _html.push('<a class="p_next" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下页</a>\n');
                    }
                }
                if (_this.opt.skip) {
                    _html.push('<div class="p_skip">跳转到:');
                    _html.push('<input type="text" class="p_text" maxlength="8" onclick="this.select()" size="3" name="page" value="' + _this.opt.pageindex + '" />');
                    _html.push('<button class="p_btn" onclick="location.href=\'' + _this._getUrl() + '\'">GO</button>');
                    _html.push('</div>');
                }
            }
            if (_this.opt.pagecount > 1 || _this.opt.total)
                _html.push('</div>');
            _this.element.html(_html.join(""));
        },
        _getUrl: function(page) {
            if (this.opt.ajaxload) {
                return "javascript:goPageIndex(" + page + ");";
            }
            var _url = location.pathname + "?";
            if (page && page.constructor == Number) {
                if (page <= 0) page = 1;
                return _url + Ajzhan.params.set({
                    page: page
                }).serialize() + location.hash;
            }
            return _url + location.hash;
        },
        goPageIndex: function(page) {
            this.element.html("数据加载中...");
            this.bind(this.element, $.extend(this.opt, {
                pageindex: page
            }));
        }
    },
    params: {	//参数操作
        init: function(url) {
            this.list = {};
            $.each(location.search.match(/(?:[\?|\&])[^\=]+=[^\&|#|$]*/gi) || [], function(n, item) {
                var _item = item.substring(1);
                var _key = _item.split("=", 1)[0];
                var _value = _item.replace(eval("/" + _key + "=/i"), "");
                this.list[_key.toLowerCase()] = _value;
            } .bind(this));
            return this;
        },
        get: function(item) {
            if (typeof this.list == "undefined") this.init();
            var _item = this.list[item.toLowerCase()];
            return _item ? _item : "";
        },
        set: function(options) {
            if (typeof this.list == "undefined") this.init();
            this.list = $.extend(true, this.list, options || {});
            return this;
        },
        serialize: function() {
            if (typeof this.list == "undefined") this.init();
            return $.param(this.list);
        }
    },
    delayLoader: {
        init: function(options) {
            var opt = $.extend({
                elements: "img[dynamic-src][src=]",
                threshold: 0,
                failurelimit: 1,
                event: "scroll",
                direction: 1, //0:横、纵   1:纵   2:横
                effect: "show",
                effectspeed: 0,
                container: window
            }, options || {});
            var _this = this;
            opt.elements = $(opt.elements);
            opt.container = $(opt.container);
            if (opt.event == "scroll") {
                $(opt.container).bind("scroll.loader resize.loader", function(event) {
                    var _counter = 0;
                    opt.elements.each(function() {
                        if (_this._scrollY(this, opt) && _this._scrollX(this, opt)) {
                            if (!this.loaded) {
                                if (opt.effectspeed > 0) {
                                    $(this).hide().attr("src", this.getAttribute("dynamic-src")).removeAttr("dynamic-src")[opt.effect](opt.effectspeed);
                                } else {
                                    this.src = this.getAttribute("dynamic-src");
                                    this.removeAttribute("dynamic-src");
                                }
                                this.loaded = true;
                            }
                            if (this.loaded) {
                                opt.elements = opt.elements.not(this);
                            }
                        } else {
                            if (_counter++ > opt.failurelimit) {
                                return false;
                            }
                        }
                    });
                });
            }
            opt.elements.each(function(i, item) {
                if ($(item).attr("dynamic-src") == undefined) {
                    $(item).attr("dynamic-src", function() {
                        return this.src;
                    });
                }
                var src = $(item).attr("src") || "";
                if (opt.event != "scroll" || src == "" || src == opt.placeholder) {
                    if (opt.placeholder) {
                        $(item).attr("src", opt.placeholder);
                    } else {
                        $(item).removeAttr("src");
                    }
                    item.loaded = false;
                } else {
                    item.loaded = true;
                }
            });
            opt.container.triggerHandler(opt.event);
            return this;
        },
        _scrollY: function(element, opt) {
            if (opt.direction == 0 || opt.direction == 1) {
                if (opt.container[0] === window) {
                    var fold = $(window).height() + $(window).scrollTop();
                } else {
                    var fold = opt.container.offset().top + opt.container.height();
                }
                return fold > $(element).offset().top - opt.threshold;
            } else {
                return true;
            }
        },
        _scrollX: function(element, opt) {
            if (opt.direction == 0 || opt.direction == 2) {
                if (opt.container[0] === window) {
                    var fold = $(window).width() + $(window).scrollLeft();
                } else {
                    var fold = opt.container.offset().left + opt.container.width();
                }
                return fold > $(element).offset().left - opt.threshold;
            } else {
                return true;
            }
        }
    }
});

jQuery.extend({
    out: function(el, name, func, canMore) {
        var callback = function(e) {
            var src = e.target || e.srcElement;
            var isIn = false;
            while (src) {
                if (src == el) {
                    isIn = true;
                    break;
                }
                src = src.parentNode;
            }
            if (!isIn) {
                func.call(el, e);
                if (!canMore) {
                    jQuery.event.remove(document.body, name, c);
                    if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
                        var arr = el._EVENT.out;
                        for (var i = 0, il = arr.length; i < il; i++) {
                            if (arr[i].efunc == c && arr[i].name == name) {
                                arr.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
            }
        }
        var c = callback.bindEvent(window);
        if (!el._EVENT) {
            el._EVENT = {
                out: []
            }
        }
        el._EVENT.out.push({
            name: name,
            func: func,
            efunc: c
        });
        jQuery.event.add(document.body, name, c);
    },
    unout: function(el, name, func) {
        if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
            var arr = el._EVENT.out;
            for (var i = 0, il = arr.length; i < il; i++) {
                if ((func == undefined || arr[i].func == func) && arr[i].name == name) {
                    jQuery.event.remove(document.body, name, arr[i].efunc);
                    arr.splice(i, 1);
                    return;
                }
            }
        }
    }
});
jQuery.fn.extend({	//jQuery 扩展
    drag: function(position,target,offset) {
        target = jQuery(target || this);
        position = position || window;
        offset = offset || {
            x: 0, 
            y: 0
        };
        return this.css("cursor", "move").bind("mousedown.drag", function(e) {
            e.preventDefault();
            e.stopPropagation();
            //if (e.which && (e.which != 1)) return;
            //if (e.originalEvent.mouseHandled) { return; }
            if (document.defaultView) {
                var _top = document.defaultView.getComputedStyle(target[0], null).getPropertyValue("top");
                var _left = document.defaultView.getComputedStyle(target[0], null).getPropertyValue("left");
            } else {
                if (target[0].currentStyle) {
                    var _top = target.css("top");
                    var _left = target.css("left");
                }
            }
            var width = target.outerWidth(),
            height = target.outerHeight();
            if (position == window) {
                var mainW = jQuery(position).width() - offset.x,
                mainH = jQuery(position).height() - offset.y;
            } else {
                var mainW = jQuery(position).outerWidth() - offset.x,
                mainH = jQuery(position).outerHeight() - offset.y;
            }
            target.posX = e.pageX - parseInt(_left);
            target.posY = e.pageY - parseInt(_top);
            if (target[0].setCapture) target[0].setCapture();
            else if (window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            jQuery(document).unbind(".drag").bind("mousemove.drag", function(e) {
                var posX = e.pageX - target.posX,
                posY = e.pageY - target.posY;
                target.css({
                    left: function() {
                        if (posX > 0 && posX + width < mainW)
                            return posX;
                        else if (posX <= 0)
                            return offset.x;
                        else if (posX + width >= mainW)
                            return mainW - width
                    },
                    top: function() {
                        if (posY > 0 && posY + height < mainH)
                            return posY;
                        else if (posY <= 0)
                            return offset.y;
                        else if (posY + height >= mainH)
                            return mainH - height;
                    }
                });
            }).bind("mouseup.drag", function(e) {
                if (target[0].releaseCapture) target[0].releaseCapture();
                else if (window.releaseEvents) window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                jQuery(this).unbind(".drag");
            });
        });
    },
    out: function(name, listener, canMore) {
        return this.each(function() {
            jQuery.out(this, name, listener, canMore);
        });
    },
    unout: function(name, listener) {
        return this.each(function() {
            jQuery.unout(this, name, listener);
        });
    },
    scrolling: function(options, func) {
        var defaults = {
            target: 1, 
            timer: 1000, 
            offset: 0
        };
        func = func || $.noop;
        var o = jQuery.extend(defaults, options || {});
        this.each(function(i) {
            switch (o.target) {
                case 1:
                    var targetTop = jQuery(this).offset().top + o.offset;
                    jQuery("html,body").animate({
                        scrollTop: targetTop
                    }, o.timer, func.bind(this));
                    break;
                case 2:
                    var targetLeft = jQuery(this).offset().left + o.offset;
                    jQuery("html,body").animate({
                        scrollLeft: targetLeft
                    }, o.timer, func.bind(this));
                    break;
            }
            return false;
        });
        return this;
    }
});
$.browser.msie6 = $.browser.msie && /MSIE 6\.0/i.test(window.navigator.userAgent) && !/MSIE 7\.0/i.test(window.navigator.userAgent);
//函数扩展
Function.prototype.bind = function() {	//绑定域
    var method = this,
    _this = arguments[0],
    args = [];
    for (var i = 1,
        il = arguments.length; i < il; i++) {
        args.push(arguments[i]);
    }
    return function() {
        var thisArgs = args.concat();
        for (var i = 0,
            il = arguments.length; i < il; i++) {
            thisArgs.push(arguments[i]);
        }
        return method.apply(_this, thisArgs);
    };
};
Function.prototype.timeout = function(time) {	//延时执行
    if ($.browser.mozilla) {
        var f = this;
        return setTimeout(function() {
            f();
        },
        time * 1000);
    }
    return setTimeout(this, time * 1000);
};
Function.prototype.interval = function(time) {	//循环执行
    return setInterval(this, time * 1000);
};
Function.prototype.bindEvent = function() {	//绑定Event
    var method = this,
    _this = arguments[0],
    args = [];
    for (var i = 1,
        il = arguments.length; i < il; i++) {
        args.push(arguments[i]);
    }
    return function(e) {
        var thisArgs = args.concat();
        thisArgs.unshift(e || window.event);
        return method.apply(_this, thisArgs);
    };
};

