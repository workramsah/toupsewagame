-- Add price; DEFAULT 0 keeps existing rows valid before you backfill if needed
ALTER TABLE `users` ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0;
