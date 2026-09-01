require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const authRoutes = require("./routes/auth");
const campusesRoutes = require("./routes/campuses");
const usersRoutes = require("./routes/users");
const promotionsRoutes = require("./routes/promotions");
const studentsRoutes = require("./routes/students");
const skillsRoutes = require("./routes/skills");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/campuses", campusesRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/skills", skillsRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`CRM API listening on port ${port}`);
  console.log(`Swagger UI available at /api-docs`);
});
