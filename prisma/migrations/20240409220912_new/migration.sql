/*
  Warnings:

  - The values [user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('waiting', 'dispatched', 'returned');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'deliveryman');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'deliveryman';

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'dispatched',
    "size" INTEGER NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(150) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "identification" VARCHAR(30) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
