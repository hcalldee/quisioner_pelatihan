/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 8.0.45 : Database - db_quisioner
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_quisioner` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `db_quisioner`;

/*Table structure for table `tb_kategori_1` */

DROP TABLE IF EXISTS `tb_kategori_1`;

CREATE TABLE `tb_kategori_1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `tipe` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_kategori_1` */

/*Table structure for table `tb_kejuruan` */

DROP TABLE IF EXISTS `tb_kejuruan`;

CREATE TABLE `tb_kejuruan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_kejuruan` */

/*Table structure for table `tb_kelas` */

DROP TABLE IF EXISTS `tb_kelas`;

CREATE TABLE `tb_kelas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kelas` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_kelas` */

/*Table structure for table `tb_komentar` */

DROP TABLE IF EXISTS `tb_komentar`;

CREATE TABLE `tb_komentar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_transact` int NOT NULL,
  `id_si` int DEFAULT NULL,
  `id_peserta` int NOT NULL,
  `komentar` text,
  PRIMARY KEY (`id`),
  KEY `id_transact` (`id_transact`),
  CONSTRAINT `tb_komentar_ibfk_1` FOREIGN KEY (`id_transact`) REFERENCES `tb_master_transact_pelatihan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_komentar` */

/*Table structure for table `tb_master_si` */

DROP TABLE IF EXISTS `tb_master_si`;

CREATE TABLE `tb_master_si` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_media` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_master_si` */

/*Table structure for table `tb_master_transact_pelatihan` */

DROP TABLE IF EXISTS `tb_master_transact_pelatihan`;

CREATE TABLE `tb_master_transact_pelatihan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_pelatihan` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `g_tenaga` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tb_master_transact_pelatihan` */

/*Table structure for table `tb_pertanyaan` */

DROP TABLE IF EXISTS `tb_pertanyaan`;

CREATE TABLE `tb_pertanyaan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `id_sub_kategori` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_pertanyaan` */

/*Table structure for table `tb_sub_kategori_1` */

DROP TABLE IF EXISTS `tb_sub_kategori_1`;

CREATE TABLE `tb_sub_kategori_1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `master_kategori` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_sub_kategori_1` */

/*Table structure for table `tb_tenaga` */

DROP TABLE IF EXISTS `tb_tenaga`;

CREATE TABLE `tb_tenaga` (
  `NI` varchar(50) DEFAULT NULL,
  `Nama` varchar(255) DEFAULT NULL,
  `Kelas` varchar(100) DEFAULT NULL,
  `Kejuruan` varchar(100) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_tenaga` */

/*Table structure for table `tb_transact_jawaban` */

DROP TABLE IF EXISTS `tb_transact_jawaban`;

CREATE TABLE `tb_transact_jawaban` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_komentar` int NOT NULL,
  `id_pertanyaan` int NOT NULL,
  `jawaban` enum('1','2','3','4','5') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_komentar` (`id_komentar`),
  KEY `id_pertanyaan` (`id_pertanyaan`),
  CONSTRAINT `tb_transact_jawaban_ibfk_1` FOREIGN KEY (`id_komentar`) REFERENCES `tb_komentar` (`id`),
  CONSTRAINT `tb_transact_jawaban_ibfk_2` FOREIGN KEY (`id_pertanyaan`) REFERENCES `tb_pertanyaan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `tb_transact_jawaban` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
