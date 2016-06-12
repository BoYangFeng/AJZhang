(function($) { 
    var today = new Date();
    var months = '一月,二月,三月,四月,五月,六月,七月,八月,九月,十月,十一月,十二月'.split(',');
    var monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
    var dateregex = /^\d{2}|\d{4}-\d{1,2}-\d{1,2}$/;
    var yearregex = /^\d{4,4}$/;
    var allpicker = new Array();
    var datearray = new Array();
    $.fn.datepicker = function(options) {
        var opts = jQuery.extend({}, jQuery.fn.datepicker.defaults, options);
        set_year_range();
        function set_year_range () {
            var startyear, endyear;
            if (opts.startdate.constructor == Date) {
                startyear = opts.startdate.getFullYear();
            } else if (opts.startdate) {
                if (yearregex.test(opts.startdate)) {
                    startyear = opts.startdate;
                } else if (dateregex.test(opts.startdate)) {
                    opts.startdate = get_dateobj(opts.startdate);
                    startyear = opts.startdate.getFullYear();
                } else {
                    startyear = today.getFullYear();
                }
            } else {
                startyear = today.getFullYear();
            }
            opts.startyear = startyear;
            if (opts.enddate.constructor == Date) {
                endyear = opts.enddate.getFullYear();
            } else if (opts.enddate) {
                if (yearregex.test(opts.enddate)) {
                    endyear = opts.enddate;
                } else if (dateregex.test(opts.enddate)) {
                    opts.enddate = get_dateobj(opts.enddate);
                    endyear = opts.enddate.getFullYear();
                } else {
                    endyear = today.getFullYear();
                }
            } else {
                endyear = today.getFullYear();
            }
            opts.endyear = endyear;
        }
        function new_datepicker_html () {
            var years = [];
            for (var i = 0; i <= opts.endyear - opts.startyear; i ++) years[i] = opts.startyear + i;
            var table = jQuery('<table class="dp_datepicker" cellpadding="0" cellspacing="0"></table>');
            table.append('<thead></thead>');
            table.append('<tfoot></tfoot>');
            table.append('<tbody></tbody>');
            var monthselect = '<select name="dp_month">';
            for (i in months) monthselect += '<option value="'+i+'">'+months[i]+'</option>';
            monthselect += '</select>';
            var yearselect = '<select name="dp_year">';
            for (i in years) yearselect += '<option>'+years[i]+'</option>';
            yearselect += '</select>';
            jQuery("thead",table).append('<tr class="dp_controls"><th colspan="7"><span class="dp_prevmonth">&laquo;</span>&nbsp;'+yearselect+" "+monthselect+'&nbsp;<span class="dp_nextmonth">&raquo;</span></th></tr>');
            jQuery("thead",table).append('<tr class="dp_days"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>');
            jQuery("tfoot",table).append('<tr><td colspan="2"><span class="dp_today">今天</span></td><td colspan="3">&nbsp;</td><td colspan="2"><span class="dp_close">关闭</span></td></tr>');
            for (i = 0; i < 6; i++) jQuery("tbody",table).append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
            return table;
        }
        function get_position (obj) {
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return [curleft,curtop];
            } else {
                return false;
            }
        }
        function load_month (e, el, dpobj, currentdate) {
            var mo = jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex;
            var yr = jQuery("select[name=dp_year]", dpobj).get(0).selectedIndex;
            var yrs = jQuery("select[name=dp_year] option", dpobj).get().length;
            if (e && jQuery(e.target).hasClass('dp_prevmonth')) {
                if (0 == mo && yr) {
                    yr -= 1;
                    mo = 11;
                    jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex = 11;
                    jQuery("select[name=dp_year]", dpobj).get(0).selectedIndex = yr;
                } else {
                    mo -= 1;
                    jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex = mo;
                }
            } else if (e && jQuery(e.target).hasClass('dp_nextmonth')) {
                if (11 == mo && yr + 1 < yrs) {
                    yr += 1;
                    mo = 0;
                    jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex = 0;
                    jQuery("select[name=dp_year]", dpobj).get(0).selectedIndex = yr;
                } else {
                    mo += 1;
                    jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex = mo;
                }
            }
            if (0 == mo && !yr) jQuery("span.dp_prevmonth", dpobj).hide();
            else jQuery("span.dp_prevmonth", dpobj).show();
            if (yr + 1 == yrs && 11 == mo) jQuery("span.dp_nextmonth", dpobj).hide();
            else jQuery("span.dp_nextmonth", dpobj).show();
            var cells = jQuery("tbody td", dpobj).unbind().empty().removeClass('date');
            var m = jQuery("select[name=dp_month]", dpobj).val();
            var y = jQuery("select[name=dp_year]", dpobj).val();
            var d = new Date(y, m, 1);
            var startindex = d.getDay();
            var numdays = monthlengths[m];
            if (1 == m && ((y%4 == 0 && y%100 != 0) || y%400 == 0)) numdays = 29;
            if (opts.startdate.constructor == Date) {
                var startMonth = opts.startdate.getMonth();
                var startDate = opts.startdate.getDate();
            }
            if (opts.enddate.constructor == Date) {
                var endMonth = opts.enddate.getMonth();
                var endDate = opts.enddate.getDate();
            }
            for (var i = 0; i < numdays; i++) {
                var cell = jQuery(cells.get(i+startindex)).removeClass('dp_current');
                if (
                    (yr || ((!startDate && !startMonth) || ((i+1 >= startDate && mo == startMonth) || mo > startMonth))) &&
                    (yr + 1 < yrs || ((!endDate && !endMonth) || ((i+1 <= endDate && mo == endMonth) || mo < endMonth)))) {
                    cell
                    .text(i+1)
                    .addClass('dp_date')
                    .hover(
                        function () {
                            jQuery(this).addClass('dp_over');
                        },
                        function () {
                            jQuery(this).removeClass('dp_over');
                        })
                    .click(function () {
                        var currentdateObj = new Date(jQuery("select[name=dp_year]", dpobj).val(), jQuery("select[name=dp_month]", dpobj).val(), jQuery(this).text());
                        close_it(el, dpobj, currentdateObj);
                    });
                    if (i+1 == currentdate.getDate() && m == currentdate.getMonth() && y == currentdate.getFullYear()) cell.addClass('dp_current');
                }
            }
        }
        function close_it (el, dpobj, dateobj) {
            if (dateobj && dateobj.constructor == Date) el.val(jQuery.fn.datepicker.formatOutput(dateobj,opts.showtime));
            dpobj.remove();
            el.change();//触发change事件
            dpobj = null;
            jQuery.data(el.get(0), "datepicker", {
                hasDatepicker : false
            });
        }
        function get_dateobj(str)
        {
            datearray = str.split("-");
            //var currentdate = new Date(initialDate);
            return new Date(datearray[0],datearray[1]-1,datearray[2]);
        }
        return this.each(function() {
            if ( jQuery(this).is('input') && 'text' == jQuery(this).attr('type')) {
                var dpobj;
                jQuery.data(jQuery(this).get(0), "datepicker", {
                    hasDatepicker : false
                });
                allpicker.push(jQuery(this).get(0));
                jQuery(this).click(function (ev) {
                    if(opts.hideother)
                    {
                        $(".dp_datepicker").hide();
                        for(var i=0;i<allpicker.length;i++)
                        {
                            jQuery.data(allpicker[i], "datepicker", {
                                hasDatepicker : false
                            });
                        }
                    }
                    var $this = jQuery(ev.target);
                    if (false == jQuery.data($this.get(0), "datepicker").hasDatepicker) {
                        jQuery.data($this.get(0), "datepicker", {
                            hasDatepicker : true
                        });
                        var initialDate = $this.val().split(" ");
                        var currentdate = today;
                        initialDate = initialDate[0];
                        if (initialDate && dateregex.test(initialDate)) {
                            currentdate = get_dateobj(initialDate);
                        } else if (opts.currentdate.constructor == Date) {
                            currentdate = opts.currentdate;
                        } else if (opts.currentdate) {
                            currentdate = get_dateobj(opts.currentdate);
                        } else {
                            currentdate = today;
                        }
                        dpobj = new_datepicker_html();
                        jQuery("body").prepend(dpobj);
                        var elPos = get_position($this.get(0));
                        var x = (parseInt(opts.x) ? parseInt(opts.x) : 0) + elPos[0];
                        var y = (parseInt(opts.y) ? parseInt(opts.y) : $this.height()+2) + elPos[1];
                        //判断是否超过浏览器高度,则从文本框上方弹出
                        if(($(document).height()-y)<dpobj.height()) y = y-dpobj.height()-$this.height()-8;
                        jQuery(dpobj).css({
                            position: 'absolute',
                            left: x,
                            top: y
                        });
                        jQuery("span", dpobj).css("cursor","pointer");
                        jQuery("select", dpobj).bind('change', function () {
                            load_month (null, $this, dpobj, currentdate);
                        });
                        jQuery("span.dp_prevmonth", dpobj).click(function (e) {
                            load_month (e, $this, dpobj, currentdate);
                        });
                        jQuery("span.dp_nextmonth", dpobj).click(function (e) {
                            load_month (e, $this, dpobj, currentdate);
                        });
                        jQuery("span.dp_today", dpobj).click(function () {
                            close_it($this, dpobj, new Date());
                        });
                        jQuery("span.dp_close", dpobj).click(function () {
                            close_it($this, dpobj);
                        });
                        jQuery("select[name=dp_month]", dpobj).get(0).selectedIndex = currentdate.getMonth();
                        jQuery("select[name=dp_year]", dpobj).get(0).selectedIndex = Math.max(0, currentdate.getFullYear() - opts.startyear);
                        load_month(null, $this, dpobj, currentdate);
                    }
                });
            }
        });
    };
    jQuery.fn.datepicker.formatOutput = function (dateobj,showtime) {
        var year = dateobj.getFullYear();
        var month = parseInt(dateobj.getMonth()) + 1;
        month = month >= 10 ? month : "0" + month.toString();
        var day = dateobj.getDate();
        day = day >= 10 ? day : "0" + day.toString();
        var nowobj = new Date();
        var hours = nowobj.getHours();
        hours = hours >= 10 ? hours : "0" + hours.toString();
        var minutes = nowobj.getMinutes();
        minutes = minutes >= 10 ? minutes : "0" + minutes.toString();
        var seconds = nowobj.getSeconds();
        seconds = seconds >= 10 ? seconds : "0" + seconds.toString();
        var result = year + "-" + month + "-" + day;
        return (showtime) ? result + " " + hours + ":" + minutes + ":" + seconds : result;
    };
    jQuery.fn.datepicker.defaults = {
        currentdate : today,//默认选择日期
        startdate : today.getFullYear(),//开始日期
        enddate : today.getFullYear() + 1,//结束日期
        hideother : true,
        showtime : false,
        x : null,//X轴
        y : null//y轴
    };
})(jQuery);
