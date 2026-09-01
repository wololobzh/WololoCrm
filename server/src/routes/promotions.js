const express = require("express");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

function toPublicManager(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}

function toPublicPromotion(promotion) {
  return {
    ...promotion,
    manager: promotion.manager ? toPublicManager(promotion.manager) : undefined,
  };
}

async function validatePromotionInput({ name, campusId, managerUserId, startDate, endDate }, details) {
  if (!name) details.push("name is required");
  if (!campusId) details.push("campusId is required");
  if (!managerUserId) details.push("managerUserId is required");

  if (campusId) {
    const campus = await prisma.campus.findUnique({ where: { id: campusId } });
    if (!campus) details.push("campus does not exist");
  }

  if (managerUserId) {
    const manager = await prisma.user.findUnique({ where: { id: managerUserId } });
    if (!manager) details.push("manager does not exist");
    else if (!manager.isActive) details.push("manager must be an active user");
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    details.push("endDate must be after or equal to startDate");
  }
}

/**
 * @openapi
 * /api/promotions:
 *   get:
 *     summary: List all promotions with their campus and manager
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get("/", async (req, res) => {
  const promotions = await prisma.promotion.findMany({
    orderBy: { name: "asc" },
    include: { campus: true, manager: true },
  });
  res.json(promotions.map(toPublicPromotion));
});

/**
 * @openapi
 * /api/promotions/{id}:
 *   get:
 *     summary: Get a promotion by id
 *     tags: [Promotions]
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
 *         description: Promotion found
 *       404:
 *         description: Promotion not found
 */
router.get("/:id", async (req, res) => {
  const promotion = await prisma.promotion.findUnique({
    where: { id: req.params.id },
    include: { campus: true, manager: true },
  });

  if (!promotion) {
    return res.status(404).json({ error: "Promotion not found" });
  }

  res.json(toPublicPromotion(promotion));
});

/**
 * @openapi
 * /api/promotions:
 *   post:
 *     summary: Create a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, campusId, managerUserId]
 *             properties:
 *               name:
 *                 type: string
 *               campusId:
 *                 type: string
 *               managerUserId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Promotion created
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  const { name, campusId, managerUserId, startDate, endDate } = req.body || {};
  const details = [];

  await validatePromotionInput({ name, campusId, managerUserId, startDate, endDate }, details);

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const promotion = await prisma.promotion.create({
    data: {
      name,
      campusId,
      managerUserId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
    include: { campus: true, manager: true },
  });

  res.status(201).json(toPublicPromotion(promotion));
});

/**
 * @openapi
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
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
 *               campusId:
 *                 type: string
 *               managerUserId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Promotion updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Promotion not found
 */
router.put("/:id", async (req, res) => {
  const existing = await prisma.promotion.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "Promotion not found" });
  }

  const { name, campusId, managerUserId, startDate, endDate, isActive } = req.body || {};
  const details = [];

  if (name === "") details.push("name is required");
  if (campusId === "") details.push("campusId is required");
  if (managerUserId === "") details.push("managerUserId is required");

  if (campusId) {
    const campus = await prisma.campus.findUnique({ where: { id: campusId } });
    if (!campus) details.push("campus does not exist");
  }

  if (managerUserId) {
    const manager = await prisma.user.findUnique({ where: { id: managerUserId } });
    if (!manager) details.push("manager does not exist");
    else if (!manager.isActive) details.push("manager must be an active user");
  }

  const nextStartDate = startDate !== undefined ? startDate : existing.startDate;
  const nextEndDate = endDate !== undefined ? endDate : existing.endDate;
  if (nextStartDate && nextEndDate && new Date(nextEndDate) < new Date(nextStartDate)) {
    details.push("endDate must be after or equal to startDate");
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const promotion = await prisma.promotion.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(campusId !== undefined ? { campusId } : {}),
      ...(managerUserId !== undefined ? { managerUserId } : {}),
      ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
    include: { campus: true, manager: true },
  });

  res.json(toPublicPromotion(promotion));
});

module.exports = router;
