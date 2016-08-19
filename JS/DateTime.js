var week_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months_of_year = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

Number.prototype.pad = function (count) {
    var num = this.valueOf();
    var ret = "";
    for (var i = 0; i < count - num.toString().length; i++) {
        ret += "0";
    }
    ret += num;
    return ret;
}

var dt = {
    datetime: {},
    getDateTime: function (d) {
        var suffix = "";
        var hr = 0;
        hr = Math.floor(Number(d) / 60); //hours
        var min = Number(d) % 60;

        if (hr >= 24) {
            var days = Math.floor(hr / 24);
            suffix = "Day";
            if (days > 1) suffix = "Days"
            var ret = days + " " + suffix + " ";
            hr = hr % 24;
            suffix = "Hour";
            if (hr > 1) suffix = "Hours"
            if (hr > 0) { ret += hr + " " + suffix; }
            return ret;
        }
        else {
            var ret = "";
            suffix = "Hour";
            if (hr > 1) suffix = "Hours"
            if (hr > 0) ret += hr + " " + suffix + " ";
            suffix = "Minute";
            if (min > 1) suffix = "Mins"
            if (min > 0) { ret += min + " " + suffix; }
            return ret;
        }
    },
    toLongDateString: function (d, splitter) {
        var md = new MyDate(d);
        return md.toLongDateString();
    },
    toShortDateString: function (d, splitter) {
        var md = new MyDate(d);
        return md.toShortDateString();
    }
}

function MyDate(d, splitter) {
    this.Day = 0;
    this.Month = 0;
    this.Year = 0;
    if (splitter == null) {
        splitter = "-";
    }
    if (d != null) {
        var dd = d.split(splitter);
        this.Day = Number(dd[2]);
        this.Month = Number(dd[1]);
        this.Year = Number(dd[0]);
    }
    this.toLongDateString = function () {
        var dt = new Date(d);
        return this.getDayString(dt.getDay())._left(3) + ", " + this.Day + " " + this.getMonthString(this.Month) + ", " + this.Year;
    }
    this.toShortDateString = function () {
        var dt = new Date(d);
        return this.getDayString(dt.getDay())._left(3) + ", " + this.Day + " " + this.getMonthString(this.Month)._left(3) + ", " + this.Year;
    }
    this.toVeryShortDateString = function () {
        var dt = new Date(d);
        return this.Day + " " + this.getMonthString(this.Month)._left(3) + ", " + this.Year.toString()._right(2);
    }
    this.getDayString = function (dd) {
        switch (dd) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday"
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
            default:
                return undefined;
        }
    }
    this.getMonthString = function (m) {
        switch (m ? m : this.Month) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";

            default:
                return undefined;
        }
    }
}

Date.prototype.addDays = function (days) {
    days = days || 1;
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

Date.prototype.addMonth = function (months) {
    months = months || 1;
    var dat = new Date(this.valueOf());
    dat.setMonth(dat.getMonth() + months);
    return dat;
}

Date.prototype.addYear = function (years) {
    years = years || 1;
    var dat = new Date(this.valueOf());
    dat.setYear(dat.getYear() + years);
    return dat;
}

Date.prototype.getDayOfWeek = function () {
    var d = this;
    d = d || new Date();
    return week_days[d.getDay()];
}

Date.prototype.getMonthOfYear = function () {
    var d = this;
    d = d || new Date();
    return months_of_year[d.getMonth()];
}

Date.prototype.toShortDate = function (format) {
    var d = this;
    d = d || new Date();
    return Date.ChangeFormat(d, format);
}

Date.prototype.toMediumDate = function (dayofweek) {
    var d = this;
    d = d || new Date();
    var ret = "";
    if (dayofweek) ret += d.getDayOfWeek()._left(3) + ", ";
    ret += d.getDate() + " " + d.getMonthOfYear()._left(3) + ", " + d.getFullYear();
    return ret;
}

Date.prototype.toLongDate = function () {
    var d = this;
    d = d || new Date();
    return d.getDayOfWeek() + ", " + d.getMonthOfYear() + " " + d.getDate() + ", " + d.getFullYear();
}

Date.prototype.toTime = function (mode) {
    var date = this;
    mode = mode || 24;
    var hours = date.getHours();
    var mins = date.getMinutes();
    var secs = date.getSeconds();
    var suffix = "";
    if (hours > 12) {
        if (mode != 24) {
            hours = hours % 12;
            suffix = "PM";
        }
    }
    else {
        if (mode != 24) {
            suffix = "AM";
        }
    }
    return hours.pad(2) + ":" + mins.pad(2) + ":" + secs.pad(2) + ":" + suffix;
}

Date.GetFormat = function () {
    var d = new Date(1950, 1, 21, 1, 1, 1, 1);
    var dstr = d.toLocaleDateString();
    if (dstr.search(/^\d\/\d{2}\/\d{4}/) == 0 || dstr.search(/^(\w+) \d{2} \d{4}/) == 0) {
        return "MM/DD/YYYY";
    }
    else if (dstr.search(/^\d\/\d{4}\/\d{2}/) == 0 || dstr.search(/^(\w+) \d{4} \d{2}/) == 0) {
        return "MM/YYYY/DD";
    }
    else if (dstr.search(/^\d{2}\/\d\/\d{4}/) == 0 || dstr.search(/^\d{2} (\w+) \d{4}/) == 0) {
        return "DD/MM/YYYY";
    }
    else if (dstr.search(/^\d{2}\/\d{4}\/\d/) == 0 || dstr.search(/^\d{2} \d{4} (\w+)/) == 0) {
        return "DD/YYYY/MM";
    }
    else if (dstr.search(/^\d{4}\/\d\/\d{2}/) == 0 || dstr.search(/^\d{4} (\w+) \d{2}/) == 0) {
        return "YYYY/MM/DD";
    }
    else if (dstr.search(/^\d{4}\/\d{2}\/\d/) == 0 || dstr.search(/^\d{4} \d{2} (\w+)/) == 0) {
        return "YYYY/DD/MM";
    }
    else {
        return "MM/DD/YYYY";
    }
}

Date.GetDate = function (short_date, format) {
    short_date = short_date || Date.ChangeFormat();
    format = format || "DD/MM/YYYY";
    var day = 0, month = 0, year = 0;
    var s = short_date.split("/");
    if (format == "DD/MM/YYYY") {
        day = s[0];
        month = s[1];
        year = s[2];
    }
    else if (format == "DD/YYYY/MM") {
        day = s[0];
        month = s[2];
        year = s[1];
    }
    else if (format == "MM/DD/YYYY") {
        day = s[1];
        month = s[0];
        year = s[2];
    }
    else if (format == "MM/YYYY/DD") {
        day = s[2];
        month = s[0];
        year = s[1];
    }
    else if (format == "YYYY/DD/MM") {
        day = s[1];
        month = s[2];
        year = s[0];
    }
    else if (format == "YYYY/MM/DD") {
        day = s[2];
        month = s[1];
        year = s[0];
    }
    else {
        day = s[0];
        month = s[1];
        year = s[2];
    }
    day = Number(day);
    month = Number(month);
    year = Number(year);
    //console.log(day);
    //console.log(month);
    //console.log(year);
    month -= 1;
    return new Date(year, month, day);
}

Date.ChangeFormat = function (d, format, splitter) {
    splitter = splitter || "/";
    d = d || new Date();
    format = format || Date.GetFormat(); //fix arguments

    var day = d.getDate().pad(2),
        month = (Number(d.getMonth()) + 1).pad(2),
        year = d.getFullYear().pad(4); //init

    if (format == "MM/DD/YYYY") {
        return month + splitter + day + splitter + year;
    }
    else if (format == "MM/YYYY/DD") {
        return month + splitter + year + splitter + day;
    }
    else if (format == "DD/MM/YYYY") {
        return day + splitter + month + splitter + year;
    }
    else if (format == "DD/YYYY/MM") {
        return day + splitter + year + splitter + month;
    }
    else if (format == "YYYY/MM/DD") {
        return year + splitter + month + splitter + day;
    }
    else if (format == "YYYY/DD/MM") {
        return year + splitter + day + splitter + month;
    }
    else {

    }
}

Date.prototype.ChangeFormat = function (format, splitter) {
    return Date.ChangeFormat(this, format, splitter);
}