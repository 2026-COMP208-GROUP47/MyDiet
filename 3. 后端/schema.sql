-- ==========================================
-- MyDiet Complete Database Setup
-- ==========================================

-- ==========================================
-- DATABASE 1: mydiet_db (users, posts, comments)
-- ==========================================
CREATE DATABASE IF NOT EXISTS mydiet_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydiet_db;

CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255),
  `provider` VARCHAR(255) NOT NULL DEFAULT 'local',
  `provider_user_id` VARCHAR(255),
  `avatar_url` VARCHAR(255),
  `avatar_gradient` VARCHAR(255),
  `created_at` DATETIME(6),
  `age` INT,
  `gender` VARCHAR(255),
  `height_cm` DOUBLE,
  `weight_kg` DOUBLE,
  `target_weight` DOUBLE,
  `goal` VARCHAR(255),
  `activity_level` VARCHAR(255),
  `allergies` JSON,
  `restrictions` JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `image_url` LONGTEXT,
  `likes` INT DEFAULT 0,
  `tags` JSON,
  `nutrition` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `parent_id` BIGINT NULL,
  `content` TEXT NOT NULL,
  `likes` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `post_likes` (
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`, `user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `comment_likes` (
  `comment_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`, `user_id`),
  FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_follows` (
  `follower_id` BIGINT NOT NULL,
  `following_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- DATABASE 2: mydiet_nutrition (recipes + DRI)
-- ==========================================
CREATE DATABASE IF NOT EXISTS mydiet_nutrition DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydiet_nutrition;

CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT NOT NULL PRIMARY KEY COMMENT 'Food.com RecipeId',
  `name` VARCHAR(255) NOT NULL,
  `total_time` VARCHAR(255),
  `image_url` TEXT,
  `category` VARCHAR(255),
  `keywords` JSON,
  `ingredients` JSON,
  `quantities` JSON,
  `instructions` JSON,
  `calories` FLOAT,
  `fat_g` FLOAT,
  `saturated_fat_g` FLOAT,
  `cholesterol_mg` FLOAT,
  `sodium_mg` FLOAT,
  `carbohydrate_g` FLOAT,
  `fiber_g` FLOAT,
  `sugar_g` FLOAT,
  `protein_g` FLOAT,
  `servings` INT,
  `recipe_yield` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `dietary_references` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `age_group` VARCHAR(50),
  `gender` VARCHAR(20),
  `calories` INT,
  `protein_g` FLOAT,
  `carbohydrate_g` FLOAT,
  `fiber_g` FLOAT,
  `fat_g` FLOAT,
  `saturated_fat_g` FLOAT,
  `cholesterol_mg` FLOAT,
  `sodium_mg` FLOAT,
  `sugar_g` FLOAT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- MOCK DATA (optional)
-- ==========================================
USE mydiet_db;

INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `provider`, `avatar_gradient`) VALUES
(1, 'Sarah_Fit', 'sarah@example.com', '123456', 'local', 'from-[#FBBF24] to-[#F97316]'),
(2, 'ChefMike', 'mike@example.com', '123456', 'local', 'from-[#4ADE80] to-[#22D3EE]');

INSERT IGNORE INTO `posts` (`id`, `user_id`, `title`, `content`, `image_url`, `likes`, `tags`, `nutrition`) VALUES
(1, 1, '30-Day Fat Loss Journey: Week 2 Results!', 'Week 2 is done! Down 3.5kg already. The meal plans from MyDiet have been incredible...', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', 3245, '["#30DayFatLoss"]', null),
(2, 2, 'Low-Cal Quick Dinner: Under 400kcal', 'This grilled salmon with roasted veggies is only 380 calories and takes 15 minutes!', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=350&fit=crop', 2100, '["#LowCalDinner", "#QuickMeals"]', '{"calories": 380, "protein": 35, "carbs": 22, "fats": 16}');

INSERT IGNORE INTO `comments` (`id`, `post_id`, `user_id`, `content`, `likes`) VALUES
(1, 1, 2, 'Amazing progress! Keep going!', 24);
