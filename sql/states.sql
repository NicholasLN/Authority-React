-- --------------------------------------------------------
-- Host:                         64.227.13.165
-- Server version:               10.1.48-MariaDB-1~stretch - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

-- Dumping data for table jwjfgexukw.states: ~50 rows (approximately)
/*!40000 ALTER TABLE `states`
    DISABLE KEYS */;
INSERT INTO `states` (`id`, `name`, `abbreviation`, `active`, `country`, `flag`)
VALUES (1, 'Alabama', 'AL', 0, 'United States', NULL),
       (2, 'Alaska', 'AK', 0, 'United States', NULL),
       (3, 'Arizona', 'AZ', 0, 'United States', NULL),
       (4, 'Arkansas', 'AR', 0, 'United States', NULL),
       (5, 'California', 'CA', 1, 'United States', 'ca.jpg'),
       (6, 'Colorado', 'CO', 0, 'United States', NULL),
       (7, 'Connecticut', 'CT', 0, 'United States', NULL),
       (8, 'Delaware', 'DE', 0, 'United States', NULL),
       (9, 'Florida', 'FL', 0, 'United States', NULL),
       (10, 'Georgia', 'GA', 0, 'United States', NULL),
       (11, 'Hawaii', 'HI', 0, 'United States', NULL),
       (12, 'Idaho', 'ID', 0, 'United States', NULL),
       (13, 'Illinois', 'IL', 0, 'United States', NULL),
       (14, 'Indiana', 'IN', 0, 'United States', NULL),
       (15, 'Iowa', 'IA', 0, 'United States', NULL),
       (16, 'Kansas', 'KS', 0, 'United States', NULL),
       (17, 'Kentucky', 'KY', 0, 'United States', NULL),
       (18, 'Louisiana', 'LA', 0, 'United States', NULL),
       (19, 'Maine', 'ME', 0, 'United States', NULL),
       (20, 'Maryland', 'MD', 0, 'United States', NULL),
       (21, 'Massachusetts', 'MA', 0, 'United States', NULL),
       (22, 'Michigan', 'MI', 0, 'United States', NULL),
       (23, 'Minnesota', 'MN', 0, 'United States', NULL),
       (24, 'Mississippi', 'MS', 0, 'United States', NULL),
       (25, 'Missouri', 'MO', 0, 'United States', NULL),
       (26, 'Montana', 'MT', 0, 'United States', NULL),
       (27, 'Nebraska', 'NE', 0, 'United States', NULL),
       (28, 'Nevada', 'NV', 0, 'United States', NULL),
       (29, 'New Hampshire', 'NH', 0, 'United States', NULL),
       (30, 'New Jersey', 'NJ', 0, 'United States', NULL),
       (31, 'New Mexico', 'NM', 0, 'United States', NULL),
       (32, 'New York', 'NY', 1, 'United States', 'ny.jpg'),
       (33, 'North Carolina', 'NC', 0, 'United States', NULL),
       (34, 'North Dakota', 'ND', 0, 'United States', NULL),
       (35, 'Ohio', 'OH', 0, 'United States', NULL),
       (36, 'Oklahoma', 'OK', 0, 'United States', NULL),
       (37, 'Oregon', 'OR', 0, 'United States', NULL),
       (38, 'Pennsylvania', 'PA', 0, 'United States', NULL),
       (39, 'Rhode Island', 'RI', 0, 'United States', NULL),
       (40, 'South Carolina', 'SC', 0, 'United States', NULL),
       (41, 'South Dakota', 'SD', 0, 'United States', NULL),
       (42, 'Tennessee', 'TN', 0, 'United States', NULL),
       (43, 'Texas', 'TX', 1, 'United States', 'tx.jpg'),
       (44, 'Utah', 'UT', 0, 'United States', NULL),
       (45, 'Vermont', 'VT', 0, 'United States', NULL),
       (46, 'Virginia', 'VA', 0, 'United States', NULL),
       (47, 'Washington', 'WA', 0, 'United States', NULL),
       (48, 'West Virginia', 'WV', 0, 'United States', NULL),
       (49, 'Wisconsin', 'WI', 0, 'United States', NULL),
       (50, 'Wyoming', 'WY', 0, 'United States', NULL);
/*!40000 ALTER TABLE `states`
    ENABLE KEYS */;

/*!40101 SET SQL_MODE = IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS = IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES = IFNULL(@OLD_SQL_NOTES, 1) */;
