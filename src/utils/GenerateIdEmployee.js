const {
    sprintf
} = require("sprintf-js");
const db = require("../../models");

async function GenerateIdEmployee() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month.toString().length == 2 ? month : `0${month}`;
    // let day = date.getDate();
    // day = day.toString().length == 2 ? day : `0${day}`;
    const dateNow = `${year}${month}`;

    const [result] = await db.sequelize.query(`
        SELECT id_employee FROM employees
        WHERE id_employee LIKE 'DMA-${dateNow}%'
        ORDER BY id_employee DESC LIMIT 1
    `);

    let orderNo;
    if (result.length > 0) {
        orderNo = result[0].id_employee.substr(13, 6);
        orderNo++;
        orderNo = sprintf("%06s", orderNo);
    }

    const id_employee = result.length < 1 ? `DMA-${dateNow}000001` :
        `DMA-${dateNow}${orderNo}`;
    return id_employee;
}

module.exports = GenerateIdEmployee;