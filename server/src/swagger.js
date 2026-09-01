const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WololoCrm API",
      version: "1.0.0",
      description: "API du CRM WololoCrm",
    },
    servers: [{ url: "/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJSDoc(options);
