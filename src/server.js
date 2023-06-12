require("dotenv").config(); // use data in file .env

const Hapi = require("@hapi/hapi"); // hapi framework for Back End
const Jwt = require("@hapi/jwt"); // jwt for create token jwt
const ClientError = require("./exceptions/ClientError");
const path = require("path"); // path for directory
const Inert = require("@hapi/inert");

// Employee
const employee = require('./api/employee');
const EmployeeService = require('./services/mysql/EmployeeService')
const EmployeeValidator = require('./validator/employee');

// User
const user = require('./api/user');
const UserService = require('./services/mysql/UserService');
const UserValidator = require('./validator/user');

// Storage
const storage = require('./api/storage');
const StorageService = require('./services/storage/StorageService');
const storagePublic = path.resolve(__dirname, "public");

// Authentication
const authentication = require('./api/authentication');
const AuthenticationService = require('./services/mysql/AuthenticationService');
const AuthenticationValidator = require('./validator/authentication');

// Token manager
const TokenManager = require('./tokenize/TokenManager');

// Attendance
const attendance = require('./api/attendance');
const AttendanceService = require('./services/mysql/AttendanceService');
const AttendanceValidator = require('./validator/attendance');

// Permission
const permission = require('./api/permission');
const PermissionService = require('./services/mysql/PermissionService');
const PermissionValidator = require('./validator/permission');

const init = async () => {
    const employeeService = new EmployeeService();
    const userService = new UserService();
    const storageService = new StorageService(storagePublic);
    const authenticationService = new AuthenticationService();
    const attendanceService = new AttendanceService();
    const permissionService = new PermissionService();

    const server = Hapi.server({
        port: process.env.PORT, //use data in .env
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"], //cors origin for allow from IP browser akess API
            },
        },
    });

    await server.register([{
        plugin: Jwt, // Register plugin token JWT for authentication
    },
    {
        plugin: Inert, // Register for hapi access file static in server
    },
    ]);

    // mendifiniskan strategy autentekasi jwt
    server.auth.strategy("employee_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY, // key for accessToken
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE, //check age token
        },
        validate: (artifacts) => ({ // if true sent token jwt 
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id, //return payload id in token jwt use signify user
                nik: artifacts.decoded.payload.nik, //return payload nik in token jwt use signify user
            },
        }),
    });

    //  Penganganan Error Server Pada Handler
    server.ext("onPreResponse", (request, h) => {
        // mendapatkan konteks response dari request
        const {
            response
        } = request;

        if (response instanceof ClientError) {
            // membuat response baru dari response toolkit sesuai kebutuhan error handling
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return response.continue || response;
    });

    await server.register([{
        plugin: employee,
        options: {
            service: employeeService,
            userService: userService,
            storageService: storageService,
            validator: EmployeeValidator
        }
    },
    {
        plugin: storage,
        options: {
            storage: storagePublic,
        }
    },
    {
        plugin: user,
        options: {
            service: userService,
            validator: UserValidator
        }
    },
    {
        plugin: authentication,
        options: {
            service: authenticationService,
            userService,
            tokenManager: TokenManager,
            validator: AuthenticationValidator
        }
    },
    {
        plugin: attendance,
        options: {
            service: attendanceService,
            storageService: storageService,
            validator: AttendanceValidator,
            userService
        },
    },
    {
        plugin: permission,
        options: {
            service: permissionService,
            storageService: storageService,
            validator: PermissionValidator,
            userService,
        },
    },
    ]);

    // Running hapijs
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();