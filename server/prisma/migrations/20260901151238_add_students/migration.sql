-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "discord_login" TEXT,
    "city" TEXT,
    "campus_id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,
    "is_alerte" BOOLEAN NOT NULL DEFAULT false,
    "is_abandon" BOOLEAN NOT NULL DEFAULT false,
    "is_hyppo_refused" BOOLEAN NOT NULL DEFAULT false,
    "is_hyppo_accepted" BOOLEAN NOT NULL DEFAULT false,
    "is_financement_ok" BOOLEAN NOT NULL DEFAULT false,
    "is_admin_status_ok" BOOLEAN NOT NULL DEFAULT false,
    "is_material_setup_ok" BOOLEAN NOT NULL DEFAULT false,
    "is_employability_initialised" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "students_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "students_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
