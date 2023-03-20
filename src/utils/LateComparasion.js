function LateComparassion() {
    // Mengambil waktu saat ini
    const currentTime = new Date();

    // Menentukan waktu absen
    const absenTime = new Date();
    absenTime.setHours(9, 0, 0, 0); // Menetapkan jam 09:00 WIB

    // Membandingkan waktu saat ini dengan waktu absen
    if (currentTime.getTime() <= absenTime.getTime()) {
        return 'not late'
    } else {
        return 'late'
    }
};

module.exports = LateComparassion;