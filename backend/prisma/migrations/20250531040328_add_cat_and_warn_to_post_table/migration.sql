/*
  Warnings:

  - You are about to drop the column `upvotes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Vote` DROP FOREIGN KEY `Vote_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Vote` DROP FOREIGN KEY `Vote_userId_fkey`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `upvotes`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'other',
    ADD COLUMN `relatableCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `warning` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Vote`;

-- CreateTable
CREATE TABLE `Relatable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Relatable_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Relatable` ADD CONSTRAINT `Relatable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relatable` ADD CONSTRAINT `Relatable_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
