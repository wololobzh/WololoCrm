const express = require("express");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/skills:
 *   get:
 *     summary: List all skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get("/", async (req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });
  res.json(skills);
});

/**
 * @openapi
 * /api/skills/{id}:
 *   get:
 *     summary: Get a skill by id
 *     tags: [Skills]
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
 *         description: Skill found
 *       404:
 *         description: Skill not found
 */
router.get("/:id", async (req, res) => {
  const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });

  if (!skill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  res.json(skill);
});

/**
 * @openapi
 * /api/skills:
 *   post:
 *     summary: Create a skill
 *     tags: [Skills]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  const { name, description } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: "Validation error", details: ["name is required"] });
  }

  const skill = await prisma.skill.create({
    data: { name, description: description || null },
  });

  res.status(201).json(skill);
});

/**
 * @openapi
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
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
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Skill updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Skill not found
 */
router.put("/:id", async (req, res) => {
  const existing = await prisma.skill.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "Skill not found" });
  }

  const { name, description, isActive } = req.body || {};

  if (name === "") {
    return res.status(400).json({ error: "Validation error", details: ["name is required"] });
  }

  const skill = await prisma.skill.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });

  res.json(skill);
});

module.exports = router;
