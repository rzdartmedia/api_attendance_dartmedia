const {
    sprintf
} = require("sprintf-js");
const db = require("../../models");

async function GenerateIdAttendance() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month.toString().length == 2 ? month : `0${month}`;
    let day = date.getDate();
    day = day.toString().length == 2 ? day : `0${day}`;
    const dateNow = `${year}${month}${day}`;

    const [result] = await db.sequelize.query(`
        SELECT id_attendance FROM attendances
        WHERE id_attendance LIKE 'ATC-${dateNow}%'
        ORDER BY id_attendance DESC LIMIT 1
    `);

    let orderNo;
    if (result.length > 0) {
        orderNo = result[0].id_attendance.substr(13, 6);
        orderNo++;
        orderNo = sprintf("%06s", orderNo);
    }

    const id_attendance = result.length < 1 ? `ATC-${dateNow}000001` :
        `ATC-${dateNow}${orderNo}`;
    return id_attendance;
}

module.exports = GenerateIdAttendance;