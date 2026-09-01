const express = require("express");

const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

function toPublicManager(user) {
  if (!user) return undefined;
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}

function toPublicStudent(student) {
  const { promotion, studentSkills, ...rest } = student;
  return {
    ...rest,
    promotion: promotion
      ? { ...promotion, manager: toPublicManager(promotion.manager) }
      : undefined,
    ...(studentSkills ? { skills: studentSkills.map((s) => s.skill) } : {}),
  };
}

const STUDENT_INCLUDE = {
  campus: true,
  promotion: { include: { manager: true } },
  studentSkills: { include: { skill: true } },
};

async function validateStudentRefs({ campusId, promotionId }, details) {
  if (campusId) {
    const campus = await prisma.campus.findUnique({ where: { id: campusId } });
    if (!campus) details.push("campus does not exist");
  }

  if (promotionId) {
    const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
    if (!promotion) details.push("promotion does not exist");
  }
}

function normalizeEmail(email) {
  return email === "" ? null : email;
}

// The explicitly provided flag in this request wins over the previous stored value.
function resolveHyppoFlags(body, current) {
  let isHyppoAccepted = body.isHyppoAccepted !== undefined ? body.isHyppoAccepted : current.isHyppoAccepted;
  let isHyppoRefused = body.isHyppoRefused !== undefined ? body.isHyppoRefused : current.isHyppoRefused;

  if (body.isHyppoAccepted === true) {
    isHyppoRefused = false;
  } else if (body.isHyppoRefused === true) {
    isHyppoAccepted = false;
  }

  return { isHyppoAccepted, isHyppoRefused };
}

/**
 * @openapi
 * /api/students:
 *   get:
 *     summary: List students, optionally filtered by campus, promotion or a name/email search
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: campusId
 *         schema:
 *           type: string
 *       - in: query
 *         name: promotionId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/", async (req, res) => {
  const { campusId, promotionId, search } = req.query;

  const where = {
    ...(campusId ? { campusId } : {}),
    ...(promotionId ? { promotionId } : {}),
    ...(search
      ? {
          OR: [
            { firstname: { contains: search } },
            { lastname: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  };

  const students = await prisma.student.findMany({
    where,
    orderBy: { lastname: "asc" },
    include: { campus: true, promotion: true },
  });

  res.json(students);
});

/**
 * @openapi
 * /api/students/{id}:
 *   get:
 *     summary: Get a student with campus, promotion and promotion manager
 *     tags: [Students]
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
 *         description: Student found
 *       404:
 *         description: Student not found
 */
router.get("/:id", async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: STUDENT_INCLUDE,
  });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(toPublicStudent(student));
});

/**
 * @openapi
 * /api/students:
 *   post:
 *     summary: Create a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, campusId, promotionId]
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               discordLogin:
 *                 type: string
 *               city:
 *                 type: string
 *               campusId:
 *                 type: string
 *               promotionId:
 *                 type: string
 *               isAlerte:
 *                 type: boolean
 *               isAbandon:
 *                 type: boolean
 *               isHyppoRefused:
 *                 type: boolean
 *               isHyppoAccepted:
 *                 type: boolean
 *               isFinancementOk:
 *                 type: boolean
 *               isAdminStatusOk:
 *                 type: boolean
 *               isMaterialSetupOk:
 *                 type: boolean
 *               isEmployabilityInitialised:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Student created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
router.post("/", async (req, res) => {
  const body = req.body || {};
  const { firstname, lastname, campusId, promotionId } = body;
  const email = normalizeEmail(body.email);
  const details = [];

  if (!firstname) details.push("firstname is required");
  if (!lastname) details.push("lastname is required");
  if (!campusId) details.push("campusId is required");
  if (!promotionId) details.push("promotionId is required");

  await validateStudentRefs({ campusId, promotionId }, details);

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  if (email) {
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  const hyppo = resolveHyppoFlags(body, { isHyppoAccepted: false, isHyppoRefused: false });

  const student = await prisma.student.create({
    data: {
      firstname,
      lastname,
      phone: body.phone || null,
      email,
      discordLogin: body.discordLogin || null,
      city: body.city || null,
      campusId,
      promotionId,
      isAlerte: body.isAlerte ?? false,
      isAbandon: body.isAbandon ?? false,
      isHyppoAccepted: hyppo.isHyppoAccepted ?? false,
      isHyppoRefused: hyppo.isHyppoRefused ?? false,
      isFinancementOk: body.isFinancementOk ?? false,
      isAdminStatusOk: body.isAdminStatusOk ?? false,
      isMaterialSetupOk: body.isMaterialSetupOk ?? false,
      isEmployabilityInitialised: body.isEmployabilityInitialised ?? false,
    },
    include: STUDENT_INCLUDE,
  });

  res.status(201).json(toPublicStudent(student));
});

/**
 * @openapi
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
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
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               discordLogin:
 *                 type: string
 *               city:
 *                 type: string
 *               campusId:
 *                 type: string
 *               promotionId:
 *                 type: string
 *               isAlerte:
 *                 type: boolean
 *               isAbandon:
 *                 type: boolean
 *               isHyppoRefused:
 *                 type: boolean
 *               isHyppoAccepted:
 *                 type: boolean
 *               isFinancementOk:
 *                 type: boolean
 *               isAdminStatusOk:
 *                 type: boolean
 *               isMaterialSetupOk:
 *                 type: boolean
 *               isEmployabilityInitialised:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Student updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Student not found
 *       409:
 *         description: Email already in use
 */
router.put("/:id", async (req, res) => {
  const existing = await prisma.student.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "Student not found" });
  }

  const body = req.body || {};
  const details = [];

  if (body.firstname === "") details.push("firstname is required");
  if (body.lastname === "") details.push("lastname is required");
  if (body.campusId === "") details.push("campusId is required");
  if (body.promotionId === "") details.push("promotionId is required");

  await validateStudentRefs({ campusId: body.campusId, promotionId: body.promotionId }, details);

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation error", details });
  }

  const email = body.email !== undefined ? normalizeEmail(body.email) : undefined;

  if (email && email !== existing.email) {
    const emailTaken = await prisma.student.findUnique({ where: { email } });
    if (emailTaken) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  const hyppo = resolveHyppoFlags(body, existing);

  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      ...(body.firstname !== undefined ? { firstname: body.firstname } : {}),
      ...(body.lastname !== undefined ? { lastname: body.lastname } : {}),
      ...(body.phone !== undefined ? { phone: body.phone || null } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(body.discordLogin !== undefined ? { discordLogin: body.discordLogin || null } : {}),
      ...(body.city !== undefined ? { city: body.city || null } : {}),
      ...(body.campusId !== undefined ? { campusId: body.campusId } : {}),
      ...(body.promotionId !== undefined ? { promotionId: body.promotionId } : {}),
      ...(body.isAlerte !== undefined ? { isAlerte: body.isAlerte } : {}),
      ...(body.isAbandon !== undefined ? { isAbandon: body.isAbandon } : {}),
      isHyppoAccepted: hyppo.isHyppoAccepted,
      isHyppoRefused: hyppo.isHyppoRefused,
      ...(body.isFinancementOk !== undefined ? { isFinancementOk: body.isFinancementOk } : {}),
      ...(body.isAdminStatusOk !== undefined ? { isAdminStatusOk: body.isAdminStatusOk } : {}),
      ...(body.isMaterialSetupOk !== undefined ? { isMaterialSetupOk: body.isMaterialSetupOk } : {}),
      ...(body.isEmployabilityInitialised !== undefined
        ? { isEmployabilityInitialised: body.isEmployabilityInitialised }
        : {}),
    },
    include: STUDENT_INCLUDE,
  });

  res.json(toPublicStudent(student));
});

/**
 * @openapi
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
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
 *         description: Student deleted
 *       404:
 *         description: Student not found
 */
router.delete("/:id", async (req, res) => {
  const existing = await prisma.student.findUnique({ where: { id: req.params.id } });

  if (!existing) {
    return res.status(404).json({ error: "Student not found" });
  }

  await prisma.student.delete({ where: { id: req.params.id } });

  res.status(204).send();
});

/**
 * @openapi
 * /api/students/{studentId}/skills/{skillId}:
 *   post:
 *     summary: Assign a skill to a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Skill assigned
 *       404:
 *         description: Student or skill not found
 *       409:
 *         description: Skill already assigned to this student
 */
router.post("/:studentId/skills/:skillId", async (req, res) => {
  const { studentId, skillId } = req.params;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  const existing = await prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId, skillId } },
  });
  if (existing) {
    return res.status(409).json({ error: "Skill already assigned to this student" });
  }

  await prisma.studentSkill.create({ data: { studentId, skillId } });

  res.status(201).json(skill);
});

/**
 * @openapi
 * /api/students/{studentId}/skills/{skillId}:
 *   delete:
 *     summary: Remove a skill from a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Skill removed
 *       404:
 *         description: Assignment not found
 */
router.delete("/:studentId/skills/:skillId", async (req, res) => {
  const { studentId, skillId } = req.params;

  const existing = await prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId, skillId } },
  });
  if (!existing) {
    return res.status(404).json({ error: "Assignment not found" });
  }

  await prisma.studentSkill.delete({ where: { studentId_skillId: { studentId, skillId } } });

  res.status(204).send();
});

module.exports = router;
