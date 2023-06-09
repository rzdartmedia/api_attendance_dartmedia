function LateComparassion() {
    // Mengambil waktu saat ini
    const currentTime = new Date();

    // Menentukan waktu absen
    const absenTime = new Date();
    absenTime.setHours(9, 1, 0, 0); // Menetapkan jam 09:01 WIB

    // Membandingkan waktu saat ini dengan waktu absen
    if (currentTime.getTime() <= absenTime.getTime()) {
        return 'on time'
    } else {
        return 'late'
    }
};

module.exports = LateComparassion;