/*
  Warnings:

  - You are about to drop the `permisson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permisson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_permisson` DROP FOREIGN KEY `role_permisson_permisson_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permisson` DROP FOREIGN KEY `role_permisson_roleid_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_roleid_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_userid_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isadmin` BOOLEAN NULL DEFAULT false;

-- DropTable
DROP TABLE `permisson`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `role_permisson`;

-- DropTable
DROP TABLE `user_role`;
