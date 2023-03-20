function formatDateTimeForDB(currentDate) {
    currentDate = currentDate ? new Date(currentDate) : new Date();

    let date = currentDate.getDate();
    date = date.toString();
    date = date.length === 1 ? `0${date}` : date;
    let month = currentDate.getMonth() + 1; // 0-based
    month = month.toString();
    month = month.length === 1 ? `0${month}` : month;
    const year = currentDate.getFullYear();

    let hours = currentDate.getHours();
    hours = hours.toString();
    hours = hours.length === 1 ? `0${hours}` : hours;
    let minutes = currentDate.getMinutes();
    minutes = minutes.toString();
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;
    let seconds = currentDate.getSeconds();
    seconds = seconds.toString();
    seconds = seconds.length === 1 ? `0${seconds}` : seconds;

    const dateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    return dateTime;
}

module.exports = formatDateTimeForDB;