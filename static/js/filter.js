(function (w) {
    var filter = {
        init: function (data, selectedListData) {
            Date.prototype.format = function (format) {
                var o = {
                    "M+": this.getMonth() + 1, //month
                    "d+": this.getDate(), //day
                    "h+": this.getHours(), //hour
                    "m+": this.getMinutes(), //minute
                    "s+": this.getSeconds(), //second
                    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                    "S": this.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            };
            this.getDoms();
            this.renderSelect(data, selectedListData);
            this.renderInput(selectedListData);
            this.initShowMore(data);
            this.initDatePickData(selectedListData);
            this.bindEvent();
        },

        getDoms: function () {
            this.doms = {
                $filterMenu: $('#filter .widget-menu'),
                $showmorebtn: $('.showmore-btn'),
                $filterAvanced: $('.filter-advanced'),
                $showmoreIconUp: $('.showmore-icon-up'),
                $showmoreIconDown: $('.showmore-icon-down'),
                $viewType: $('input[name="view_type"]'),
                $perPageInput: $('input[name="per_page"]'),
                $queryBtn: $('#filters_form_open .query-btn'),
                $form: $('#filters_form_open')
            };
        },

        // 鑾峰彇select2涓嬫媺妗嗛€変腑鐨刬d鏁扮粍
        getSelectedIds: function (data) {
            var selectedList = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id) {
                    selectedList.push(data[i].id);
                }
            }
            return selectedList;
        },

        // 鑾峰彇鏈懆 鍛ㄤ竴鑷冲懆鏃ョ殑鏃堕棿
        getWeekRange: function () {
            var now = new Date();
            var nowTime = now.getTime();
            var day = now.getDay();
            var oneDayLong = 24 * 60 * 60 * 1000;

            var MondayTime = nowTime - (day - 1) * oneDayLong;
            var SundayTime = nowTime + (7 - day) * oneDayLong;

            var monday = new Date(MondayTime);
            var sunday = new Date(SundayTime);

            var weekRange = {
                start: monday.format('yyyy-MM-dd'),
                end: sunday.format('yyyy-MM-dd')
            };
            return weekRange;
        },

        // 鑾峰彇骞存湀鏃ュ€�
        getDateVal: function (momentTime) {
            var timeArr = momentTime.split('-');
            var year = parseInt(timeArr[0], 10);
            var month = parseInt(timeArr[1], 10);
            var day = parseInt(timeArr[2], 10);
            return {
                year: year,
                month: month,
                day: day
            };
        },

        // 璁剧疆鎻愪氦寮€濮嬫棩鏈�
        setSubmitStartDate: function (dateObj) {
            $('input[name = "start_year"]').val(dateObj.year);
            $('input[name = "start_month"]').val(dateObj.month);
            $('input[name = "start_day"]').val(dateObj.day);
        },

        // 璁剧疆鎻愪氦缁撴潫鏃ユ湡
        setSubmitEndDate: function (dateObj) {
            $('input[name = "end_year"]').val(dateObj.year);
            $('input[name = "end_month"]').val(dateObj.month);
            $('input[name = "end_day"]').val(dateObj.day);
        },

        // 璁剧疆鏇存柊寮€濮嬫棩鏈�
        setUpdateStartDate: function (dateObj) {
            $('input[name = "last_updated_start_year"]').val(dateObj.year);
            $('input[name = "last_updated_start_month"]').val(dateObj.month);
            $('input[name = "last_updated_start_day"]').val(dateObj.day);
        },

        // 璁剧疆鏇存柊缁撴潫鏃ユ湡
        setUpdateEndDate: function (dateObj) {
            $('input[name = "last_updated_end_year"]').val(dateObj.year);
            $('input[name = "last_end_start_month"]').val(dateObj.month);
            $('input[name = "last_end_start_day"]').val(dateObj.day);
        },

        // 鍒濆鍖栨棩鍘嗘暟鎹�
        initDatePickData: function (selectedListData) {
            var submitStartDateObj = {};
            var submitEndDateObj = {};
            var lastUpdatedStartDateObj = {};
            var lastUpdatedEndDateObj = {};

            var submitStartDate = '';
            var submitStartYear = selectedListData['start_year'];
            var submitStartMonth = selectedListData['start_month'];
            var submitStartDay = selectedListData['start_day'];

            var submitEndDate = '';
            var submitEndYear = selectedListData['end_year'];
            var submitEndMonth = selectedListData['end_month'];
            var submitEndDay = selectedListData['end_day'];

            var lastUpdatedStartDate = '';
            var lastUpdatedStartYear = selectedListData['last_updated_start_year'];
            var lastUpdatedStartMonth = selectedListData['last_updated_start_month'];
            var lastUpdatedStartDay = selectedListData['last_updated_start_day'];

            var lastUpdatedEndDate = '';
            var lastUpdatedEndYear = selectedListData['last_updated_end_year'];
            var lastUpdatedEndMonth = selectedListData['last_end_start_month'];
            var lastUpdatedEndDay = selectedListData['last_end_start_day'];

            if (submitStartYear && submitStartMonth && submitStartDay) {
                submitStartDateObj = {
                    year: submitStartYear,
                    month: submitStartMonth,
                    day: submitStartDay
                };
                submitStartDate = new Date(submitStartYear, submitStartMonth - 1, submitStartDay).format('yyyy-MM-dd');
            }

            if (submitEndYear && submitEndMonth && submitEndDay) {
                submitEndDateObj = {
                    year: submitEndYear,
                    month: submitEndMonth,
                    day: submitEndDay
                };
                submitEndDate = new Date(submitEndYear, submitEndMonth - 1, submitEndDay).format('yyyy-MM-dd');
            }

            if (lastUpdatedStartYear && lastUpdatedStartMonth && lastUpdatedStartDay) {
                lastUpdatedStartDateObj = {
                    year: lastUpdatedStartYear,
                    month: lastUpdatedStartMonth,
                    day: lastUpdatedStartDay
                };
                lastUpdatedStartDate = new Date(lastUpdatedStartYear, lastUpdatedStartMonth - 1, lastUpdatedStartDay).format('yyyy-MM-dd');
            }

            if (lastUpdatedEndYear && lastUpdatedEndMonth && lastUpdatedEndDay) {
                lastUpdatedEndDateObj = {
                    year: lastUpdatedEndYear,
                    month: lastUpdatedEndMonth,
                    day: lastUpdatedEndDay
                };
                lastUpdatedEndDate = new Date(lastUpdatedEndYear, lastUpdatedEndMonth - 1, lastUpdatedEndDay).format('yyyy-MM-dd');
            }

            this.setSubmitStartDate(submitStartDateObj);
            this.setSubmitEndDate(submitEndDateObj);
            this.setUpdateStartDate(lastUpdatedStartDateObj);
            this.setUpdateEndDate(lastUpdatedEndDateObj);

            this.initDatePick({
                submitStartDate: submitStartDate,
                submitEndDate: submitEndDate,
                lastUpdatedStartDate: lastUpdatedStartDate,
                lastUpdatedEndDate: lastUpdatedEndDate
            });
        },

        // 鍒濆鍖栭〉闈㈡棩鍘嗘帶浠�
        initDatePick: function (data) {
            var that = this;
            var $dateTimePickIconLeft = null;
            var $dateTimePickIconRight = null;

            var submitStartDate = data.submitStartDate;
            var submitEndDate = data.submitEndDate;
            var lastUpdatedStartDate = data.lastUpdatedStartDate;
            var lastUpdatedEndDate = data.lastUpdatedEndDate;

            $(".submit-start-datetime, .submit-end-datetime, .update-start-datetime, .update-end-datetime").datetimepicker({
                format: 'yyyy-mm-dd',
                minView: "month",
                autoclose: true,
                todayBtn: true,
                clearBtn: true
            });

            $(".submit-start-datetime").val(submitStartDate)
                .on('changeDate', function (e) {
                    //鑾峰彇浜嬩欢瀵硅薄
                    var e = e || window.event;
                    //榧犳爣鐐瑰嚮鐨勭洰鏍囦綅缃�
                    var target = e.target || e.srcElement;
                    var dateObj = {
                        year: '',
                        month: '',
                        day: '',
                    };
                    if (target.value) {
                        var momentTime = target.value;
                        dateObj = that.getDateVal(momentTime);
                    }
                    that.setSubmitStartDate(dateObj);
                });

            $(".submit-end-datetime").val(submitEndDate)
                .on('changeDate', function (e) {
                    //鑾峰彇浜嬩欢瀵硅薄
                    var e = e || window.event;
                    //榧犳爣鐐瑰嚮鐨勭洰鏍囦綅缃�
                    var target = e.target || e.srcElement;
                    var dateObj = {
                        year: '',
                        month: '',
                        day: '',
                    };
                    if (target.value) {
                        var momentTime = target.value;
                        var dateObj = that.getDateVal(momentTime);
                    }
                    that.setSubmitEndDate(dateObj);
                });

            $(".update-start-datetime").val(lastUpdatedStartDate)
                .on('changeDate', function (e) {
                    //鑾峰彇浜嬩欢瀵硅薄
                    var e = e || window.event;
                    //榧犳爣鐐瑰嚮鐨勭洰鏍囦綅缃�
                    var target = e.target || e.srcElement;
                    var dateObj = {
                        year: '',
                        month: '',
                        day: '',
                    };
                    if (target.value) {
                        var momentTime = target.value;
                        var dateObj = that.getDateVal(momentTime);
                    }
                    that.setUpdateStartDate(dateObj);
                });

            $(".update-end-datetime").val(lastUpdatedEndDate)
                .on('changeDate', function (e) {
                    //鑾峰彇浜嬩欢瀵硅薄
                    var e = e || window.event;
                    //榧犳爣鐐瑰嚮鐨勭洰鏍囦綅缃�
                    var target = e.target || e.srcElement;
                    var dateObj = {
                        year: '',
                        month: '',
                        day: '',
                    };
                    if (target.value) {
                        var momentTime = target.value;
                        var dateObj = that.getDateVal(momentTime);
                    }
                    that.setUpdateEndDate(dateObj);
                });

            $dateTimePickIconLeft = $('.datetimepicker .icon-arrow-left');
            $dateTimePickIconRight = $('.datetimepicker .icon-arrow-right');
            $dateTimePickIconLeft.addClass('fa fa-arrow-left');
            $dateTimePickIconRight.addClass('fa fa-arrow-right');
        },

        // 鍒濆鍖栧睍绀烘洿澶氭寜閽姸鎬侊紝浠ュ強楂樼骇閫夋嫨鍣ㄦ姌鍙犵姸鎬�
        initShowMore: function (data) {
            var isShowAdvanced = data['view_type'];
            if (isShowAdvanced == 'advanced') {
                this.showAdvanced();
            } else if (isShowAdvanced == 'simple') {
                this.hideAdvanced();
            }
        },

        // 鏄剧ず楂樼骇绛涢€�
        showAdvanced: function () {
            var doms = this.doms;
            var $filterAvanced = doms.$filterAvanced;
            var $showmoreIconUp = doms.$showmoreIconUp;
            var $showmoreIconDown = doms.$showmoreIconDown;
            var $viewType = doms.$viewType;
            $filterAvanced.slideDown('slow');
            $showmoreIconUp.show();
            $showmoreIconDown.hide();
            $viewType.val('advanced');
        },

        // 闅愯棌楂樼骇绛涢€�
        hideAdvanced: function () {
            var doms = this.doms;
            var $filterAvanced = doms.$filterAvanced;
            var $showmoreIconUp = doms.$showmoreIconUp;
            var $showmoreIconDown = doms.$showmoreIconDown;
            var $viewType = doms.$viewType;
            $filterAvanced.slideUp('slow');
            $showmoreIconUp.hide();
            $showmoreIconDown.show();
            $viewType.val('simple');
        },

        // select2妯℃澘
        template: function (data, container) {
            return data.text;
        },

        // 鍒濆鍖栭〉闈nput妗嗗€�
        renderInput: function (data) {
            var $perPageInput = this.doms.$perPageInput;
            var value = data.per_page;
            $perPageInput.val(value);
        },

        // 娓叉煋椤甸潰鎵€鏈変笅鎷夋
        renderSelect: function (data, selectedListData) {
            var selectArr = [];
            for (var key in data) {
                selectArr = data[key];
                this.renderOptions(key, selectArr, selectedListData);
            }
        },

        // 鏍规嵁鍚庡彴鏁版嵁娓叉煋涓嬫媺妗嗛€夐」
        renderOptions: function (key, selectArr, selectedListData) {
            var that = this;
            var selectTpl = '';
            var optionsArr = [];
            var $select = $('#' + key);
            var selectName = $select.data('name');
            var $input = $('input[name="' + selectName + '"]');
            var initSelData = selectedListData ? selectedListData[selectName] : [];
            if (selectName && $select) {
                if (initSelData && initSelData.length == 0) {
                    $input.val(0);
                } else {
                    $input.val(initSelData);
                }
                for (var i = 0; i < selectArr.length; i++) {
                    var optionObj = selectArr[i];
                    var id = optionObj.id;
                    var name = optionObj.name;
                    var optionTpl = '<option value="' + id + '">' + name + '</option>';
                    optionsArr.push(optionTpl);
                }
                selectTpl = optionsArr.join('');
                $select.append(selectTpl).select2({
                    multiple: true,
                    theme: "bootstrap",
                    allowClear: true,
                    placeholder: "璇烽€夋嫨",
                    templateSelection: that.template,
                });
                $select.val(initSelData).trigger('change');
                $select.on("change", function (e) {
                    var ele = e.currentTarget;
                    var $ele = $(ele);
                    var sel2data = $ele.select2("data");
                    var selectedList = that.getSelectedIds(sel2data);
                    var $curInput = $('.data-' + ele.id);
                    if (selectedList.length == 0) {
                        $curInput.val(0);
                    } else {
                        $curInput.val(selectedList);
                    }
                });
            }
        },

        bindEvent: function () {
            var that = this;
            var doms = this.doms;
            // 涓嬫媺妗嗘姌鍙�
            doms.$filterMenu.on('click', function (e) {
                var $this = $(this);
                if ($this.hasClass('open')) {
                    $(this).removeClass('open');
                } else {
                    $(this).addClass('open');
                }
            });
            // 灞曠ず鏇村
            doms.$showmorebtn.on('click', function (e) {
                if (doms.$filterAvanced.is(':visible')) {
                    that.hideAdvanced();
                } else {
                    that.showAdvanced();
                }
            });
            // 鏌ヨ
            doms.$queryBtn.on('click', function (e) {
                doms.$form.submit();
            });
        }
    };

    var defaultData = {};
    var defaultSelectedData = {};
    var data = window.flitervaluejson || defaultData;
    var selectedListData = window.tempflitervaluejson || defaultSelectedData;
    filter.init(data, selectedListData);
    window.filter = filter;

})(window);