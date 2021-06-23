export default {
    weekArr: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    // 获取时间毫秒数(传入时间戳)
    getDateTime: function (_date) {
        return new Date(_date).getTime();
    },
    // 获取时间详情对象 (传入毫秒数)
    getDateObj: function (_time) {
        var date = _time ? new Date(_time) : new Date();
        var yyyy = this.dateStrFormat(date.getFullYear());
        var mm = this.dateStrFormat(date.getMonth() + 1);
        var m = date.getMonth() + 1;
        var dd = this.dateStrFormat(date.getDate());
        var d = date.getMonth() + 1
        var hours = this.dateStrFormat(date.getHours());
        var minute = this.dateStrFormat(date.getMinutes());
        var seconds = this.dateStrFormat(date.getSeconds());
        var week = this.weekArr[date.getDay()];
        var dateTime = `${yyyy}-${mm}-${dd}`;
        var time = `${hours}:${minute}:${seconds}`;
        var dateAll = `${dateTime} ${time}`;
        return {
            yyyy: yyyy,
            mm: mm,
            dd: dd,
            m: m,
            d: d,
            week: week,
            hours: hours,
            minute: minute,
            seconds: seconds,
            dateTime: dateTime,
            dateAll: dateAll
        }
    },

    // 时间字符串格式化
    dateStrFormat: function (_str) {
        return _str >= 10 ? _str + '' : '0' + (_str + '');
    },

}