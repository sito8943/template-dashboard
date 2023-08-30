-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2023 at 09:28 PM
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
-- Table structure for table `errors`
--

CREATE TABLE `errors` (
  `id` varchar(36) NOT NULL,
  `error` text NOT NULL,
  `user` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `errors`
--

INSERT INTO `errors` (`id`, `error`, `user`, `date`) VALUES
('061b4a45-01e8-4f65-8141-889212c0853d', 'error updating element of users, user: cubatur-gestion item d7d64962-17b7-4cb4-a7ec-8c1e0a6c63c0', 'cubatur-gestion', 1693410313945),
('637613a5-a642-4539-b9fb-a99190dd2bc3', 'error saving element of users, user: sito8943', 'sito8943', 1693405681389),
('88db2d85-c6b3-4b7a-9527-ab6d0b5ae4bf', 'error saving element of users, user: sito8943', 'sito8943', 1693405572361),
('97e32f86-5e26-4e78-be03-47b14695b6ac', 'error deleting elements of users, user: bb2be934-4203-4c94-bc9f-f89290858b01, items: d7d64962-17b7-4cb4-a7ec-8c1e0a6c63c0', 'bb2be934-4203-4c94-bc9f-f89290858b01', 1693411127997),
('b0ec1e6b-d2ea-4ef8-899b-2f056a0cc26c', 'error saving element of users, user: sito8943', 'sito8943', 1693405600110),
('dfdf59d6-0f6c-44f1-bd6e-ecc5b292df52', 'error saving element of users, user: sito8943', 'sito8943', 1693405988849),
('faf88bb9-8091-4c40-a5d2-d93788dd7960', 'error updating element of users, user: cubatur-gestion item d7d64962-17b7-4cb4-a7ec-8c1e0a6c63c0', 'cubatur-gestion', 1693409342245);

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
('', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'created users', 1693411378749, '60cf833f-61ef-4619-bf17-1d55596bbf17'),
('061dd086-d5b7-4e82-a089-e797191933ab', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1693411735335, '60cf833f-61ef-4619-bf17-1d55596bbf17'),
('1363cc46-f29e-4c67-bd57-f2bc3b6941cf', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693423298659, 'sign out'),
('1c7722f6-f19d-4541-b6b3-0fc1b446d5cd', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693411124650, 'sign out'),
('299c6913-f9ea-4a25-85ae-184838cdb500', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693401356165, 'sign out'),
('555f4ed9-ea31-4c97-86bc-5ec79efb1caa', '60cf833f-61ef-4619-bf17-1d55596bbf17', 'sign-in', 1693411393172, 'sign out'),
('56c3dc83-0d28-4eab-9aec-666439e49630', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693423368082, 'sign out'),
('5bd411b1-cd88-433d-80aa-785491ac1250', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693420284461, 'sign out'),
('66d2884f-68f9-49c8-80c0-50424043a9ce', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'delete users', 1693411281984, 'd7d64962-17b7-4cb4-a7ec-8c1e0a6c63c0'),
('684f8454-5b1f-4304-8aa5-32a93da462ca', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693411381383, 'sign out'),
('702a3e5b-bce5-41c5-9f5d-e9b63c1ef8d0', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693423363910, 'sign out'),
('8de9c919-059e-44fd-aff3-9b5596267662', '60cf833f-61ef-4619-bf17-1d55596bbf17', 'sign-out', 1693411406207, 'sign out'),
('966219bb-5df5-4470-9234-6509a6809308', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693420293102, 'sign out'),
('b11695d8-1271-49a4-91c1-22ee92fade78', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693423294274, 'sign out'),
('b36fa7be-fae4-4499-aa91-b415c35affe9', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693408582678, 'sign out'),
('b519f87d-405b-4e99-913e-098718504f0d', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693411412412, 'sign out'),
('c1077c21-cee8-42ac-a65b-10a90b087bdf', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1693401599304, 'sign out'),
('db6dd115-0eef-46d9-a608-9bcc200e88ad', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693423565906, 'sign out'),
('ead77e0b-70b1-45f2-a4a2-b8baed757f6c', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1693407061561, 'sign out'),
('ecff7a79-87df-415a-be9a-1e0a404db3c7', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1693411518297, '60cf833f-61ef-4619-bf17-1d55596bbf17');

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
('2085af4c-4745-11ee-aa57-6c02e0b9ae9e', 'users', 1693407267899);

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
('a1a66d79-4745-11ee-aa57-6c02e0b9ae9e', 1, '2085af4c-4745-11ee-aa57-6c02e0b9ae9e', 1693407267899);

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `user` text NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0,
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

INSERT INTO `users` (`id`, `user`, `name`, `email`, `type`, `pw`, `status`, `state`, `lastOnline`, `date`, `photo`, `slugName`) VALUES
('60cf833f-61ef-4619-bf17-1d55596bbf17', 'developer', 'Developer Comunicador', 'developer@gmail.com', 2, '25d55ad283aa400af464c76d713c07ad', 0, 0, 0, 1693411735331, '/images/users/60cf833f-61ef-4619-bf17-1d55596bbf17-photo.png', 'developer-comunicador'),
('bb2be934-4203-4c94-bc9f-f89290858b01', 'sito8943', 'Carlos Andrés Mora González', 'sito8943@gmail.com', 1, '25d55ad283aa400af464c76d713c07ad', 0, 0, 1693423560182, 1691803729141, '/images/users/sito8943-photo.jpeg', 'sito8943');

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
  ADD KEY `userType` (`type`);

--
-- Indexes for table `usertypes`
--
ALTER TABLE `usertypes`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

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
  ADD CONSTRAINT `userType` FOREIGN KEY (`type`) REFERENCES `usertypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
