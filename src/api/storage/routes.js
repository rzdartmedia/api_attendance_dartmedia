const path = require("path");

const routes = (storage) => [
  {
    method: "GET",
    path: "/images/{param*}",
    handler: {
      directory: {
        path: path.resolve(`${storage}/images`),
      },
    },
  },
  {
    method: "GET",
    path: "/default/{param*}",
    handler: {
      directory: {
        path: path.resolve(`${storage}/default`),
      },
    },
  },
];

module.exports = routes;