const express = require("express");
const bcrypt = require("bcryptjs");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

const ROLES = ["ADMIN", "MANAGER", "USER"];

function toPublicUser(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { lastname: "asc" } });
  res.json(users.map(toPublicUser));
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
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
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(toPublicUser(user));
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password, role]
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, USER]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
router.post("/", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body || {};
  const details = [];

  if (!firstname) details.push("firstname is required");
  if (!lastname) details.push("lastname is required");
  if (!email) details.push("email is required");
  if (!password) details.push("password is required");
  if (!role) details.push("role is required");
  else if (!ROLES.includes(role)) details.push(`role must be one of ${ROLES.join(", ")}`);

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { firstname, lastname, email, passwordHash, role },
  });

  res.status(201).json(toPublicUser(user));
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
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
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, USER]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 */
router.put("/:id", async (req, res) => {
  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "User not found" });
  }

  const { firstname, lastname, email, role, isActive } = req.body || {};
  const details = [];

  if (firstname === "") details.push("firstname is required");
  if (lastname === "") details.push("lastname is required");
  if (email === "") details.push("email is required");
  if (role !== undefined && !ROLES.includes(role)) {
    details.push(`role must be one of ${ROLES.join(", ")}`);
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  if (email && email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email } });
    if (emailTaken) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(firstname !== undefined ? { firstname } : {}),
      ...(lastname !== undefined ? { lastname } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });

  res.json(toPublicUser(user));
});

module.exports = router;
