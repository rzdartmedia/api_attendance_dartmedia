function getMountFromNumber(number) {
    const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ];

    const currentMonthName = months[number - 1];

    return currentMonthName
}

module.exports = getMountFromNumber;