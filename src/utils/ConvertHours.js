function ConvertHours(time) {
    if (!time) {
        return '';
    }

    const date = new Date(time);
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    const seconds = new Date(date).getSeconds();

    const result = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    return result;
}

module.exports = ConvertHours;