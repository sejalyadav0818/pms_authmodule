-- CreateTable
CREATE TABLE `Permisson` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permisson` (
    `RoleId` INTEGER NOT NULL,
    `Permisson_id` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`RoleId`, `Permisson_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permisson` ADD CONSTRAINT `role_permisson_RoleId_fkey` FOREIGN KEY (`RoleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permisson` ADD CONSTRAINT `role_permisson_Permisson_id_fkey` FOREIGN KEY (`Permisson_id`) REFERENCES `Permisson`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
