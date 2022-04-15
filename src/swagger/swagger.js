/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "CC REST API",
    description: "",
  },
  host: "",
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    // by default: empty Array
    {
      name: "Users",
      description: "User administration",
    },
    {
      name: "Root",
      description: "Fallback URL",
    },
    // { ... }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  definitions: {
    User: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
        },
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
        username: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
  }, // by default: empty object (Swagger 2.0)
  components: {
    examples: {
      User: {
        value: {
          firstName: "foo",
          lastName: "bar",
          username: "foobar",
          email: "foo@bar.com",
          password: "foobarium",
        },
      },
    },
  }, // by default: empty object (OpenAPI 3.x)
};

const outputFile = "./src/swagger/swagger_output.json";
const endpointsFiles = [
  "./src/api/routes/root.ts",
  "./src/api/routes/users.ts",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
