/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/swagger/swagger_output.json";
const endpointsFiles = [
  "./src/api/routes/root.ts",
  "./src/api/routes/users.ts",
];

swaggerAutogen(outputFile, endpointsFiles);
