/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET NAMES utf8 */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
CREATE TABLE IF NOT EXISTS `countries` (
    `id` int NOT NULL AUTO_INCREMENT,
    `abbreviation` text,
    `name` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb3;
CREATE TABLE IF NOT EXISTS `demographics` (
    `id` int NOT NULL AUTO_INCREMENT,
    `state` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'United States',
    `country` text,
    `race` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `population` bigint DEFAULT NULL,
    `gender` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `ecoPosMean` double DEFAULT '0',
    `socPosMean` double DEFAULT '0',
    `polarization` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1.5',
    PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 929 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `demoPositions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `demoID` int DEFAULT NULL,
    `type` text,
    `-5` float DEFAULT NULL,
    `-4` double DEFAULT NULL,
    `-3` double DEFAULT NULL,
    `-2` double DEFAULT NULL,
    `-1` double DEFAULT NULL,
    `0` double DEFAULT NULL,
    `1` double DEFAULT NULL,
    `2` double DEFAULT NULL,
    `3` double DEFAULT NULL,
    `4` double DEFAULT NULL,
    `5` float DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1801 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `fundRequests` (
    `id` int NOT NULL AUTO_INCREMENT,
    `party` int NOT NULL DEFAULT '0',
    `requester` int NOT NULL DEFAULT '0',
    `requesting` int NOT NULL DEFAULT '0',
    `reason` varchar(50) NOT NULL DEFAULT '',
    `fulfilled` int DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 39 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `legislaturePositions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `countryId` int NOT NULL,
    `legislatureId` int NOT NULL,
    `officeName` text,
    `isElected` int NOT NULL,
    `electionFrequency` int NOT NULL,
    `type` varchar(50) NOT NULL DEFAULT 'singleSeat',
    `numElected` int DEFAULT NULL,
    `statesElected` text,
    `abilities` text,
    `votePower` int DEFAULT '1',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `legislatures` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    `countryId` int DEFAULT NULL,
    `rules` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `legislatureVotes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `author` int DEFAULT NULL,
    `legislature` int NOT NULL DEFAULT '0',
    `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
    `actions` text NOT NULL,
    `ayes` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '[]',
    `nays` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '[]',
    `passed` int DEFAULT '-1',
    `expiresAt` int DEFAULT NULL,
    `status` int DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `parties` (
    `id` int NOT NULL AUTO_INCREMENT,
    `partyBio` varchar(1000) DEFAULT '',
    `partyPic` varchar(900) DEFAULT 'https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/partyPics%2Fdefault.png?alt=media&token=1658ffc3-add7-4701-86b1-52673b5e0dee',
    `nation` varchar(50) DEFAULT NULL,
    `name` varchar(60) DEFAULT NULL,
    `initialEcoPos` double DEFAULT NULL,
    `initialSocPos` double DEFAULT NULL,
    `ecoPos` double DEFAULT NULL,
    `socPos` double DEFAULT NULL,
    `partyRoles` mediumtext,
    `discord` varchar(16) DEFAULT '0',
    `partyTreasury` double DEFAULT '0',
    `fees` double unsigned NOT NULL DEFAULT '0',
    `votes` int DEFAULT '250',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `partyVotes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `author` int DEFAULT NULL,
    `party` int DEFAULT NULL,
    `name` varchar(65) DEFAULT NULL,
    `actions` longtext,
    `ayes` varchar(900) DEFAULT '[]',
    `nays` varchar(900) DEFAULT '[]',
    `passed` int DEFAULT '-1',
    `expiresAt` bigint DEFAULT NULL,
    `delay` int DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 56 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `patrons` (
    `id` int NOT NULL AUTO_INCREMENT,
    `rank` text,
    `discord` text,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `states` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `abbreviation` varchar(255) NOT NULL,
    `active` int DEFAULT '0',
    `country` varchar(255) DEFAULT NULL,
    `flag` text,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 51 DEFAULT CHARSET = utf8mb3;
CREATE TABLE IF NOT EXISTS `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `admin` int DEFAULT '0',
    `username` text CHARACTER SET utf8 NOT NULL,
    `password` text CHARACTER SET utf8 NOT NULL,
    `email` text CHARACTER SET utf8,
    `regCookie` varchar(255) CHARACTER SET utf8 NOT NULL,
    `currentCookie` varchar(255) CHARACTER SET utf8 NOT NULL,
    `regIP` text CHARACTER SET utf8 NOT NULL,
    `currentIP` text CHARACTER SET utf8 NOT NULL,
    `hsi` double NOT NULL DEFAULT '10',
    `politicianName` varchar(55) CHARACTER SET utf8 NOT NULL,
    `lastOnline` varchar(500) CHARACTER SET utf8 NOT NULL DEFAULT '0',
    `profilePic` varchar(2500) CHARACTER SET utf8 DEFAULT 'https://firebasestorage.googleapis.com/v0/b/authorityimagestorage.appspot.com/o/userPics%2Fdefault.jpg?alt=media&token=554a387f-ee3c-4224-bfd8-47562c223a77',
    `bio` varchar(2500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'I am gay!',
    `state` varchar(255) CHARACTER SET utf8 NOT NULL,
    `nation` varchar(255) CHARACTER SET utf8 NOT NULL,
    `ecoPos` double NOT NULL DEFAULT '0',
    `socPos` double NOT NULL DEFAULT '0',
    `authority` double DEFAULT '50',
    `campaignFinance` bigint DEFAULT '50000',
    `party` int DEFAULT '0',
    `partyInfluence` double DEFAULT '0',
    `partyVotingFor` int DEFAULT '0',
    `office` int DEFAULT '0',
    `officeSeats` int DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 71 DEFAULT CHARSET = latin1 COLLATE = latin1_general_ci COMMENT = 'officeSeats is only if the office they are elected to is a "multiple" type';
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */
;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */
;