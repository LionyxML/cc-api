const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/swagger/swagger_output.json";
const endpointsFiles = ["./src/api/routes/root.ts"];

swaggerAutogen(outputFile, endpointsFiles);
