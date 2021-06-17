function getHumanReadableDateTime(string) {
    var date = new Date(string);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    if (month <= 9) {
        month = '0' + month;
    }
    if (day <= 9) {
        day = '0' + day;
    }
    if (hours <= 9) {
        hours = '0' + hours;
    }
    if (minutes <= 9) {
        minutes = '0' + minutes;
    }
    if (seconds <= 9) {
        seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' UTC';
}
