-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: us-cdbr-east-02.cleardb.net    Database: heroku_4ccfb94b6b8a44d
-- ------------------------------------------------------
-- Server version	5.5.62-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@mymail.nyp.edu.sg','$2b$10$fFa9pF3n2igqepN554DYqOsIhwheea4GHLb.84qt3mFlX5S2pP0t2','Admin',NULL,1,0,0,0,'2020-10-14 10:11:03','2020-10-14 10:11:03'),(2,'173560N@mymail.nyp.edu.sg','$2b$10$7i/6BXhLLb/6ad5EhPc/8Ocvg4dSn2dBg4qr18.jvsbyWKHW6j76m','Vignesh',91864675,0,0,1,0,'2020-10-14 10:11:03','2020-10-14 10:11:03'),(3,'john_doe@mymail.nyp.edu.sg','$2b$10$oB4JiW92q0LMyjIWS2yM6uBGirey6pVG4XCDaoRDjZEI8U9viROFe','John Doe',NULL,0,1,0,0,'2020-10-14 10:11:03','2020-10-14 10:11:03'),(4,'jane_eod@mymail.nyp.edu.sg','$2b$10$a8F5ljra.st8MJ3J1ARInuF0PI5V2mK08WWee3uceHYrtGoWw.JYO','Jane Eod',NULL,0,1,0,0,'2020-10-14 11:58:46','2020-10-14 11:58:46'),(5,'maude@mymail.nyp.edu.sg','$2b$10$bYaHefNFOvB8g1KhripOW.l0ybyZGNjAGCBwU2rGZvM8R69KWWrY2','Maude',NULL,0,1,0,0,'2020-10-14 11:59:14','2020-10-14 11:59:14'),(6,'182084q@mymail.nyp.edu.sg','$2b$10$kgqPAl0laLj9Y.2.1eszce013ZCKFv7ffZ4H8SHBBkIdIz8YvIi6u','Aqil',90894675,0,0,1,0,'2020-10-14 12:00:10','2020-10-14 12:00:10'),(7,'183762o@mymail.nyp.edu.sg','$2b$10$sFFN1J1979zD1OfRbC4RQe6BAI/3XLmff8W54VQjHYXWOVVvIgm4O','Natasha',89764656,0,0,1,0,'2020-10-14 12:00:24','2020-10-14 12:00:24'),(8,'mark@mymail.nyp.edu.sg','$2b$10$1IQi7lDDhTC2ZIQerCRDYugYp/BMJcIHNHxifGh8kea.ZOw3Dte8q','Mark',NULL,0,1,0,0,'2020-10-15 07:14:11','2020-10-15 07:14:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-16 22:35:26
