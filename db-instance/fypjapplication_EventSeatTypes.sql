-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: fypjapplication
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Dumping data for table `EventSeatTypes`
--

LOCK TABLES `EventSeatTypes` WRITE;
/*!40000 ALTER TABLE `EventSeatTypes` DISABLE KEYS */;
INSERT INTO `EventSeatTypes` VALUES (4,'General','G',0,'general','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(5,'Handicapped','H',0,'handicapped','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(6,'General','G',0,'general','2020-11-16 13:30:05','2020-11-16 13:30:05',8),(7,'Handicapped','H',0,'handicapped','2020-11-16 13:30:05','2020-11-16 13:30:05',8),(8,'Previous Alumni','a',1,'a','2020-11-16 13:30:05','2020-11-16 13:30:05',8),(9,'General','G',0,'general','2020-11-16 13:30:43','2020-11-16 13:30:43',9),(10,'Handicapped','H',0,'handicapped','2020-11-16 13:30:43','2020-11-16 13:30:43',9),(18,'General','G',0,'general','2020-11-16 13:30:14','2020-11-16 13:30:14',12),(19,'Handicapped','H',0,'handicapped','2020-11-16 13:30:14','2020-11-16 13:30:14',12),(20,'VIP','a',1,'a','2020-11-16 13:30:14','2020-11-16 13:30:14',12),(21,'Previous Alumni','b',1,'b','2020-11-16 13:30:14','2020-11-16 13:30:14',12),(22,'Late Comers','c',0,'c','2020-11-16 13:30:14','2020-11-16 13:30:14',12),(25,'Dancers','b',1,'b','2020-11-16 13:30:05','2020-11-16 13:30:05',8),(29,'Late Comers','c',0,'c','2020-11-16 13:30:05','2020-11-16 13:30:05',8),(36,'General','G',0,'general','2020-11-15 13:46:24','2020-11-15 13:46:24',NULL),(37,'Handicapped','H',0,'handicapped','2020-11-15 13:46:24','2020-11-15 13:46:24',NULL),(38,'Late Comers','a',0,'a','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(39,'DIT Graduates','b',1,'b','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(40,'DSF DWM','c',1,'c','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(41,'DIT DWM','d',1,'d','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(42,'DSF Graduates','e',1,'e','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(43,'Award Winners','f',1,'f','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(44,'DEI/DCS Graduates','g',1,'g','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(45,'DCS DWM','h',1,'h','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(46,'Guests of AW','i',1,'i','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(47,'VIP','j',1,'j','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(48,'Industrial Guests','k',1,'k','2020-11-16 13:30:37','2020-11-16 13:30:37',7),(49,'General','G',0,'general','2020-11-16 13:30:10','2020-11-16 13:30:10',13),(50,'Handicapped','H',0,'handicapped','2020-11-16 13:30:10','2020-11-16 13:30:10',13),(51,'Graduates','a',1,'a','2020-11-16 13:30:10','2020-11-16 13:30:10',13),(52,'VIP','b',1,'b','2020-11-16 13:30:10','2020-11-16 13:30:10',13);
/*!40000 ALTER TABLE `EventSeatTypes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-16 21:34:40
