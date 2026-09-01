const express = require("express");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/campuses:
 *   get:
 *     summary: List all campuses
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campuses
 */
router.get("/", async (req, res) => {
  const campuses = await prisma.campus.findMany({ orderBy: { name: "asc" } });
  res.json(campuses);
});

/**
 * @openapi
 * /api/campuses/{id}:
 *   get:
 *     summary: Get a campus by id
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campus found
 *       404:
 *         description: Campus not found
 */
router.get("/:id", async (req, res) => {
  const campus = await prisma.campus.findUnique({ where: { id: req.params.id } });

  if (!campus) {
    return res.status(404).json({ error: "Campus not found" });
  }

  res.json(campus);
});

/**
 * @openapi
 * /api/campuses:
 *   post:
 *     summary: Create a campus
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campus created
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  const { name, city } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: "Validation error", details: ["name is required"] });
  }

  const campus = await prisma.campus.create({
    data: { name, city: city || null },
  });

  res.status(201).json(campus);
});

/**
 * @openapi
 * /api/campuses/{id}:
 *   put:
 *     summary: Update a campus
 *     tags: [Campuses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Campus updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Campus not found
 */
router.put("/:id", async (req, res) => {
  const existing = await prisma.campus.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "Campus not found" });
  }

  const { name, city, isActive } = req.body || {};

  if (name === "") {
    return res.status(400).json({ error: "Validation error", details: ["name is required"] });
  }

  const campus = await prisma.campus.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(city !== undefined ? { city: city || null } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });

  res.json(campus);
});

module.exports = router;
