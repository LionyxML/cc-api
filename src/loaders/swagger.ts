import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger/swagger_output.json";
const endpointsFiles = ["../api/routes/root.ts"];

swaggerAutogen(outputFile, endpointsFiles);
