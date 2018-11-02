CREATE DATABASE  IF NOT EXISTS `soulmate` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `soulmate`;
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: soulmate
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `userinfo`
--

DROP TABLE IF EXISTS `userinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userinfo` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `userpassword` varchar(255) NOT NULL,
  `usercontact` varchar(45) DEFAULT NULL,
  `userbio` varchar(225) DEFAULT NULL,
  `userdob` varchar(45) DEFAULT NULL,
  `age` varchar(45) DEFAULT NULL,
  `sex` varchar(45) DEFAULT NULL,
  `useremail` varchar(45) NOT NULL,
  `userdp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userid`,`useremail`),
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  UNIQUE KEY `useremail_UNIQUE` (`useremail`),
  UNIQUE KEY `userdp_UNIQUE` (`userdp`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinfo`
--

LOCK TABLES `userinfo` WRITE;
/*!40000 ALTER TABLE `userinfo` DISABLE KEYS */;
INSERT INTO `userinfo` VALUES (1,'devbrat','$2a$10$QviCUf88drRFmOiPNIJYcu6M/yT5b0Ey8U78rv7qSiFe1NX9RoBy2',NULL,NULL,'2018-10-03',NULL,NULL,'devbratdash@yahoo.in','uploads/1539873287352download.jpg'),(2,'devdas','$2a$10$Q3Llk75dQ6EoU058Tc/88uuQ1stVvRnHvfxx57GC15r4/WYnHnvha',NULL,NULL,'2018-10-13',NULL,NULL,'devbratdash98@yahoo.in','uploads/1539873941019Zayn-malik 2.jpg');
/*!40000 ALTER TABLE `userinfo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-01 23:27:38
