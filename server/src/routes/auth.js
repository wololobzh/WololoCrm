const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function toPublicUser(user) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials or inactive user
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return res.json({ token, user: toPublicUser(user) });
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Missing, invalid or expired token
 *       404:
 *         description: User not found
 */
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user || !user.isActive) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(toPublicUser(user));
});

module.exports = router;
