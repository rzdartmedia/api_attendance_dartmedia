const ConvertHours = require("./ConvertHours");
const formatDateTimeForDB = require("./formatDateTime");

const MapEmployeeByNik = ({
    id_employee,
    name,
    position,
    division,
    gender,
    nik,
    npwp,
    place_of_birth,
    date_of_birth,
    address_ktp,
    address,
    no_hp,
    religion,
    email_personal,
    email_employee,
    ptkp,
    blood,
    photo_ktp,
    photo_npwp,
    photo_swa,
    name_family,
    connection_family,
    no_hp_family,
    address_family,
    status_employee,
    work_location,
    role,
}) => ({
    idEmployee: id_employee,
    name,
    position,
    division,
    gender,
    nik,
    npwp: npwp ? "npwp" : null,
    placeOfBirth: place_of_birth,
    dateOfBirth: date_of_birth,
    addressKtp: address_ktp,
    address,
    noHp: no_hp,
    religion: religion,
    emailPersonal: email_personal,
    emailEmployee: email_employee,
    ptkp,
    blood,
    photoKtp: `${process.env.URL}${photo_ktp}`,
    photoNpwp: photo_npwp ? `${process.env.URL}${photo_npwp}` : null,
    photoSwa: `${process.env.URL}${photo_swa}`,
    nameFamily: name_family,
    connectionFamily: connection_family,
    noHpFamily: no_hp_family,
    addressFamily: address_family,
    statusEmployee: status_employee,
    workLocation: work_location,
    role
})

const MapAttendanceByIdAndNik = ({
    id_attendance,
    date,
    attendance_in,
    photo_attendance_in,
    attendance_out,
    photo_attendance_out,
    status,
    status_attendance_in,
}) => ({
    idAttendance: id_attendance,
    date,
    attendanceIn: new Date(attendance_in),
    photoAttendanceIn: `${process.env.URL}${photo_attendance_in}`,
    attendanceOut: attendance_out ? new Date(attendance_out) : null,
    photoAttendanceOut: photo_attendance_out
        ? `${process.env.URL}${photo_attendance_out}`
        : null,
    status,
    statusAttendanceIn: status_attendance_in
})

const MapPermissions = ({
    id_permission,
    category_permission,
    start_permit_date,
    end_permit_date,
    status_approval,
    name,
    createdAt,
    updatedAt,
}) => ({
    idPermission: id_permission,
    categoryPermission: category_permission,
    startPermitDate: start_permit_date,
    endPermitDate: end_permit_date,
    statusApproval: status_approval,
    name,
    createdAt: formatDateTimeForDB(createdAt),
    updatedAt: formatDateTimeForDB(updatedAt),
})

const MapPermissionById = ({
    id_permission,
    nik,
    category_permission,
    start_permit_date,
    end_permit_date,
    length_permit_day,
    attachment,
    information_permission,
    status_approval,
    information_approval,
    createdAt,
    updatedAt,
    name,
}) => ({
    idPermission: id_permission,
    nik,
    name,
    categoryPermission: category_permission,
    startPermitDate: start_permit_date,
    endPermitDate: end_permit_date,
    lengthPermitDay: length_permit_day,
    attachment: MapImage(attachment),
    informationPermission: information_permission,
    statusApproval: status_approval,
    informationApproval: information_approval,
    createdAt: formatDateTimeForDB(createdAt),
    updatedAt: formatDateTimeForDB(updatedAt),
});

const MapPermissionByIdForUpdate = ({
    id_permission,
    nik,
    category_permission,
    start_permit_date,
    end_permit_date,
    length_permit_day,
    attachment,
    information_permission,
    status_approval,
    information_approval,
    createdAt,
    updatedAt,
}) => ({
    idPermission: id_permission,
    nik,
    categoryPermission: category_permission,
    startPermitDate: start_permit_date,
    endPermitDate: end_permit_date,
    lengthPermitDay: length_permit_day,
    attachment: attachment,
    informationPermission: information_permission,
    statusApproval: status_approval,
    informationApproval: information_approval,
    createdAt,
    updatedAt,
});

const MapImage = (image) => {
    const images = [];
    image = JSON.parse(image);
    image.map((img) => {
        images.push(`${process.env.URL}${img}`)
    });

    return images;
}

const groupBy = (objects, key) => {
    const data = [];
    objects.map((object) => {
        if (!data.includes(object[key])) {
            data.push(object[key])
        }
    });

    return data;
}

const MapGetAttandances = ({
    id_attendance,
    name,
    date,
    attendance_in,
    status_attendance_in,
    attendance_out
}) => ({
    idAttendance: id_attendance,
    name,
    date,
    attendanceIn: ConvertHours(attendance_in),
    statusAttendanceIn: status_attendance_in,
    attendanceOut: attendance_out ? formatDateTimeForDB(attendance_out) : null
})

const MapAttendanceById = ({
    id_attendance,
    date,
    attendance_in,
    photo_attendance_in,
    attendance_out,
    photo_attendance_out,
    status,
    status_attendance_in
}) => ({
    idAttendance: id_attendance,
    date,
    attendanceIn: ConvertHours(attendance_in),
    photoAttendanceIn: `${process.env.URL}${photo_attendance_in}`,
    attendanceOut: attendance_out ? formatDateTimeForDB(attendance_out) : null,
    photoAttendanceOut: photo_attendance_out
        ? `${process.env.URL}${photo_attendance_out}`
        : null,
    status,
    statusAttendanceIn: status_attendance_in
})

module.exports = {
    MapEmployeeByNik,
    MapAttendanceByIdAndNik,
    MapPermissionById,
    MapPermissionByIdForUpdate,
    groupBy,
    MapGetAttandances,
    MapAttendanceById,
    MapPermissions
}
