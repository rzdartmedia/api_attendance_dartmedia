const InvariantError = require("../exceptions/InvariantError");

const WhereGetPermission = ({ name, statusApproval, startDateFilter, endDateFilter }) => {
    let where = '';
    let countFilter = 0;

    if (name) {
        if (countFilter > 0) {
            where += ` AND employees.name LIKE '%${name}%'`;
        } else {
            where = `WHERE employees.name LIKE '%${name}%'`;
        }
        countFilter = countFilter + 1;
    }

    if (statusApproval) {
        if (countFilter > 0) {
            where += ` AND status_approval = :statusApproval`;
        } else {
            where = `WHERE status_approval = :statusApproval`;
        }
        countFilter = countFilter + 1;
    }

    if (startDateFilter && endDateFilter) {
        const countStartDate = new Date(startDateFilter).getTime();
        const countEndDate = new Date(endDateFilter).getTime();
        if (countStartDate > countEndDate) throw new InvariantError('End date filter cannot be less than start date filer');

        if (countFilter > 0) {
            where += ` AND start_permit_date BETWEEN :startDateFilter AND :endDateFilter`;
        } else {
            where = `WHERE start_permit_date BETWEEN :startDateFilter AND :endDateFilter`;
        }
        countFilter = countFilter + 1;
    }

    return where;
}


module.exports = WhereGetPermission;