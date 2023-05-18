/*
  Warnings:

  - The primary key for the `role_permisson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Permisson_id` on the `role_permisson` table. All the data in the column will be lost.
  - You are about to drop the column `RoleId` on the `role_permisson` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `role_permisson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `role_permisson` table. All the data in the column will be lost.
  - The primary key for the `user_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `user_role` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `user_role` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_role` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_role` table. All the data in the column will be lost.
  - You are about to drop the `Permisson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `permisson_id` to the `role_permisson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleid` to the `role_permisson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `role_permisson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleid` to the `user_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `user_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `user_role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `role_permisson` DROP FOREIGN KEY `role_permisson_Permisson_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permisson` DROP FOREIGN KEY `role_permisson_RoleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_userId_fkey`;

-- AlterTable
ALTER TABLE `role_permisson` DROP PRIMARY KEY,
    DROP COLUMN `Permisson_id`,
    DROP COLUMN `RoleId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `permisson_id` INTEGER NOT NULL,
    ADD COLUMN `roleid` INTEGER NOT NULL,
    ADD COLUMN `updatedat` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`roleid`, `permisson_id`);

-- AlterTable
ALTER TABLE `user_role` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `roleId`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `roleid` INTEGER NOT NULL,
    ADD COLUMN `updatedat` DATETIME(3) NOT NULL,
    ADD COLUMN `userid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userid`, `roleid`);

-- DropTable
DROP TABLE `Permisson`;

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `googleid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_googleid_key`(`googleid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permisson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedat` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_roleid_fkey` FOREIGN KEY (`roleid`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permisson` ADD CONSTRAINT `role_permisson_roleid_fkey` FOREIGN KEY (`roleid`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permisson` ADD CONSTRAINT `role_permisson_permisson_id_fkey` FOREIGN KEY (`permisson_id`) REFERENCES `permisson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
