const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FarmOS API",
      version: "1.0.0",
      description: "API documentation for the FarmOS agriculture platform"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ]
  },

  apis: [
    "./routes/*.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
