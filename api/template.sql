-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2023 at 09:19 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `template`
--

-- --------------------------------------------------------

--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `slugName` text NOT NULL,
  `color` text NOT NULL DEFAULT 'white',
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `analytics`
--

INSERT INTO `analytics` (`id`, `name`, `slugName`, `color`, `date`) VALUES
('6df77039-4794-11ee-9725-6c02e0b9ae9e', 'Visitas', 'visitas', 'green', 1693441124136),
('6df78f00-4794-11ee-9725-6c02e0b9ae9e', 'Rebotes', 'rebotes', 'red', 1693441124136);

-- --------------------------------------------------------

--
-- Table structure for table `basictrigger`
--

CREATE TABLE `basictrigger` (
  `id` varchar(36) NOT NULL,
  `idEvent` varchar(36) NOT NULL,
  `language` text NOT NULL,
  `country` text NOT NULL,
  `url` text NOT NULL,
  `referrer` text NOT NULL,
  `device` text NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `basictrigger`
--

INSERT INTO `basictrigger` (`id`, `idEvent`, `language`, `country`, `url`, `referrer`, `device`, `date`) VALUES
('0bb29f26-47f3-11ee-a321-6c02e0b9ae9e', '6df78f00-4794-11ee-9725-6c02e0b9ae9e', 'en', 'US', 'https://www.example.com/page1', 'https://www.google.com', 'pc', 1698649200000),
('0bb2ac2a-47f3-11ee-a321-6c02e0b9ae9e', '6df78f00-4794-11ee-9725-6c02e0b9ae9e', 'es', 'ES', 'https://www.example.com/page2', 'https://www.bing.com', 'mobile', 1698649200000),
('22f6dba5-47f3-11ee-a321-6c02e0b9ae9e', '6df77039-4794-11ee-9725-6c02e0b9ae9e', 'fr', 'FR', 'https://www.example.com/page3', 'direct', 'pc', 1698649200000);

-- --------------------------------------------------------

--
-- Table structure for table `errors`
--

CREATE TABLE `errors` (
  `id` varchar(36) NOT NULL,
  `error` text NOT NULL,
  `user` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` varchar(36) NOT NULL,
  `idUser` varchar(36) NOT NULL,
  `operation` text NOT NULL,
  `date` bigint(16) NOT NULL,
  `observation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `idUser`, `operation`, `date`, `observation`) VALUES
('1059e9f2-562c-4318-8667-baaee7709df7', '60cf833f-61ef-4619-bf17-1d55596bbf17', 'sign-in', 1696446374676, 'sign out'),
('45ec20af-8b07-460d-8879-cef34bc774f0', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1696446367507, 'sign out'),
('5bde1c3e-1b86-4a36-b84f-6f8760cb72e9', '60cf833f-61ef-4619-bf17-1d55596bbf17', 'delete users', 1696446253617, '9643f053-c17f-4b6f-960d-6eb3c2fe0d9a');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(36) NOT NULL,
  `idUser` varchar(36) NOT NULL,
  `image` text NOT NULL DEFAULT '',
  `date` bigint(16) NOT NULL,
  `title` text NOT NULL DEFAULT '',
  `description` text NOT NULL DEFAULT '',
  `seen` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(36) NOT NULL,
  `operation` text NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `operation`, `date`) VALUES
('2085af4c-4745-11ee-aa57-6c02e0b9ae9e', 'users', 1693407267899),
('8234cc86-62e8-11ee-b5f0-6c02e0b9ae9e', 'pages', 1696446121633);

-- --------------------------------------------------------

--
-- Table structure for table `recovery`
--

CREATE TABLE `recovery` (
  `id` varchar(36) NOT NULL,
  `idUser` varchar(36) NOT NULL,
  `token` text NOT NULL,
  `expiration` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolespermissions`
--

CREATE TABLE `rolespermissions` (
  `id` varchar(36) NOT NULL,
  `idRole` tinyint(4) NOT NULL,
  `idPermission` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rolespermissions`
--

INSERT INTO `rolespermissions` (`id`, `idRole`, `idPermission`, `date`) VALUES
('a1a66d79-4745-11ee-aa57-6c02e0b9ae9e', 1, '2085af4c-4745-11ee-aa57-6c02e0b9ae9e', 1693407267899),
('c4299a2c-62e8-11ee-b5f0-6c02e0b9ae9e', 2, '8234cc86-62e8-11ee-b5f0-6c02e0b9ae9e', 1696446229711);

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` varchar(36) NOT NULL,
  `idUser` varchar(36) NOT NULL,
  `start` bigint(16) NOT NULL,
  `end` bigint(16) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `idUser`, `start`, `end`, `token`) VALUES
('b2a83b0e-3b68-4c74-bc31-c21c63f50a63', '60cf833f-61ef-4619-bf17-1d55596bbf17', 1696532774677, 1696532774677, 'U2FsdGVkX1+jXBXOvod4sor6SmJzMTjHCepkhbpoE2xSTIj3onwvwBlNypbcbtXgMjFoEvVH/Wstrm3/MJa1pBTtEWbD2m5HRK3jfy4/eZJgQnTBcfKDma9sWk2yRNXg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `user` text NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `userType` tinyint(4) NOT NULL DEFAULT 0,
  `pw` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `state` tinyint(4) NOT NULL,
  `lastOnline` bigint(16) NOT NULL,
  `date` bigint(16) NOT NULL,
  `photo` text NOT NULL DEFAULT '',
  `slugName` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user`, `name`, `email`, `userType`, `pw`, `status`, `state`, `lastOnline`, `date`, `photo`, `slugName`) VALUES
('60cf833f-61ef-4619-bf17-1d55596bbf17', 'developer', 'Developer Comunicador', 'developer@gmail.com', 2, '25d55ad283aa400af464c76d713c07ad', 1, 0, 1696447140477, 1693411735331, '/images/users/60cf833f-61ef-4619-bf17-1d55596bbf17-photo.png', 'developer-comunicador'),
('bb2be934-4203-4c94-bc9f-f89290858b01', 'sito8943', 'Carlos Andrés Mora González', 'sito8943@gmail.com', 1, '25d55ad283aa400af464c76d713c07ad', 0, 0, 1696447140474, 1691803729141, '/images/users/sito8943-photo.jpeg', 'sito8943');

-- --------------------------------------------------------

--
-- Table structure for table `usertypes`
--

CREATE TABLE `usertypes` (
  `id` tinyint(4) NOT NULL,
  `name` text NOT NULL,
  `date` bigint(16) NOT NULL,
  `slugName` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertypes`
--

INSERT INTO `usertypes` (`id`, `name`, `date`, `slugName`) VALUES
(1, 'Admin', 1691872833059, 'admin'),
(2, 'Comunicador', 1693404116737, 'comunicador');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `basictrigger`
--
ALTER TABLE `basictrigger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idEventBasicTriggered` (`idEvent`);

--
-- Indexes for table `errors`
--
ALTER TABLE `errors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUserLog` (`idUser`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUser` (`idUser`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recovery`
--
ALTER TABLE `recovery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUserRecovery` (`idUser`);

--
-- Indexes for table `rolespermissions`
--
ALTER TABLE `rolespermissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPermissionRole` (`idPermission`),
  ADD KEY `idRolePermission` (`idRole`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUserToken` (`idUser`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userType` (`userType`);

--
-- Indexes for table `usertypes`
--
ALTER TABLE `usertypes`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `basictrigger`
--
ALTER TABLE `basictrigger`
  ADD CONSTRAINT `idEventBasicTriggered` FOREIGN KEY (`idEvent`) REFERENCES `analytics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `idUserLog` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `idUser` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recovery`
--
ALTER TABLE `recovery`
  ADD CONSTRAINT `idUserRecovery` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rolespermissions`
--
ALTER TABLE `rolespermissions`
  ADD CONSTRAINT `idPermissionRole` FOREIGN KEY (`idPermission`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idRolePermission` FOREIGN KEY (`idRole`) REFERENCES `usertypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `idUserToken` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `userType` FOREIGN KEY (`userType`) REFERENCES `usertypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
