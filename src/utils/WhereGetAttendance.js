const InvariantError = require("../exceptions/InvariantError");

const WhereGetAttendance = ({ name, statusAttendanceIn, startDateFilter, endDateFilter }) => {
    let where = '';
    let countFilter = 0;

    if (name) {
        if (countFilter > 0) {
            where += ` AND name LIKE '%${name}%'`;
        } else {
            where = `WHERE name LIKE '%${name}%'`;
        }
        countFilter = countFilter + 1;
    }

    if (statusAttendanceIn) {
        if (countFilter > 0) {
            where += ` AND status_attendance_in = :statusAttendanceIn`;
        } else {
            where = `WHERE status_attendance_in = :statusAttendanceIn`;
        }
        countFilter = countFilter + 1;
    }

    if (startDateFilter && endDateFilter) {
        const countStartDate = new Date(startDateFilter).getTime();
        const countEndDate = new Date(endDateFilter).getTime();
        if (countStartDate > countEndDate) throw new InvariantError('End date filter cannot be less than start date filer');

        if (countFilter > 0) {
            where += ` AND date BETWEEN :startDateFilter AND :endDateFilter`;
        } else {
            where = `WHERE date BETWEEN :startDateFilter AND :endDateFilter`;
        }
        countFilter = countFilter + 1;
    }

    return where;
}

module.exports = WhereGetAttendance;