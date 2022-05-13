CREATE DATABASE  IF NOT EXISTS `bulldogfinancial` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bulldogfinancial`;
-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: bulldogfinancial
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `user` varchar(45) NOT NULL,
  `first_name` varchar(45) NOT NULL DEFAULT 'Default',
  `last_name` varchar(45) NOT NULL DEFAULT 'Default',
  `email` varchar(45) NOT NULL DEFAULT 'default',
  `role` varchar(45) NOT NULL DEFAULT 'default',
  `balance` int NOT NULL DEFAULT '100',
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'anewuser','Default','Default','default','default',100,'$2b$10$o2kcWaZoCJc7MpETCJVblOKNZSb0VK0KlFYwYKXul5rM7gTYAalLS'),(3,'brandnewaccount','Default','Default','default','default',100,'$2b$10$W/IoNrh0ekHL83ILd2AF/OoNT/AEIoU6SghYWPRbmmHHBPDr12UD.'),(4,'example@email.com','Default','Default','default','default',100,'$2b$10$TnwvRigaGRAESJXncvfFmOpNGHdYB7WOFhkPKfKZYf6iw9ayChA32'),(5,'newuserdawg','Default','Default','itdidit@email.com','default',100,'$2b$10$e3ZmFyPyCwDrN8L5jP8OIuuvc9L/sNEhiEdb.SRrT5SzhCvfqa9ii'),(8,'seansaccount','Sean','Walker','seanleewalkerjr@gmail.com','customer',5000,'$2b$10$DIzGhomsyvs6BoB16nkXCOM9UL2v8EGR1fY5XkzcS6VEybwn/BvLy'),(9,'username','Billy','Bob','randomemail@gmail.com','employee',8000,'$2b$10$WrX/4fLS19ACz7DXQRYhwu/Y7qfLEXz6Ou/yzL8zPf/fzR/MTrjgC'),(10,'lilwayne','Wayne','Carter','waynecarter@gmail.com','customer',1000000,'$2b$10$SeVH.8R75M7JLjhVKYAoOeZbXpqB9aR3eVLTvqfQtKCHTDMY9ZBlu');
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

-- Dump completed on 2022-05-12 20:26:32
