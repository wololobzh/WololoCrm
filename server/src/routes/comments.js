const express = require("express");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

const STATUSES = ["INFO", "TODO", "IMPORTANT", "DONE"];

function toPublicAuthor(user) {
  if (!user) return undefined;
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  };
}

function toPublicComment(comment) {
  const { author, ...rest } = comment;
  return { ...rest, author: toPublicAuthor(author) };
}

/**
 * @openapi
 * /api/students/{studentId}/comments:
 *   get:
 *     summary: List comments for a student, most recent first
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Student not found
 */
router.get("/students/:studentId/comments", async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.studentId } });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const comments = await prisma.comment.findMany({
    where: { studentId: req.params.studentId },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  res.json(comments.map(toPublicComment));
});

/**
 * @openapi
 * /api/students/{studentId}/comments:
 *   post:
 *     summary: Add a comment to a student, authored by the authenticated user
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [INFO, TODO, IMPORTANT, DONE]
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 */
router.post("/students/:studentId/comments", async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.studentId } });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const { content, status } = req.body || {};
  const details = [];

  if (!content) details.push("content is required");
  if (status !== undefined && !STATUSES.includes(status)) {
    details.push(`status must be one of ${STATUSES.join(", ")}`);
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      status: status || "INFO",
      studentId: req.params.studentId,
      authorUserId: req.userId,
    },
    include: { author: true },
  });

  res.status(201).json(toPublicComment(comment));
});

/**
 * @openapi
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment's content or status
 *     tags: [Comments]
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
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [INFO, TODO, IMPORTANT, DONE]
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment not found
 */
router.put("/comments/:id", async (req, res) => {
  const existing = await prisma.comment.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Comment not found" });
  }

  const { content, status } = req.body || {};
  const details = [];

  if (content === "") details.push("content is required");
  if (status !== undefined && !STATUSES.includes(status)) {
    details.push(`status must be one of ${STATUSES.join(", ")}`);
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const comment = await prisma.comment.update({
    where: { id: req.params.id },
    data: {
      ...(content !== undefined ? { content } : {}),
      ...(status !== undefined ? { status } : {}),
    },
    include: { author: true },
  });

  res.json(toPublicComment(comment));
});

/**
 * @openapi
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted
 *       404:
 *         description: Comment not found
 */
router.delete("/comments/:id", async (req, res) => {
  const existing = await prisma.comment.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Comment not found" });
  }

  await prisma.comment.delete({ where: { id: req.params.id } });

  res.status(204).send();
});

module.exports = router;
