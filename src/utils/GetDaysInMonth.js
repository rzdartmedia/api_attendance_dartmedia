function GetDaysInMonth(month, year) {
    if (month && year) {
        const daysInMonth = new Date(year, month, 0).getDate();

        return daysInMonth;
    } else {

        const today = new Date();
        const currentMonth = today.getMonth();

        // Mendapatkan jumlah hari dalam bulan saat ini
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        return daysInMonth;
    }
}

module.exports = GetDaysInMonth;