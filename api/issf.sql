-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 12, 2023 at 10:42 PM
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
-- Database: `issf`
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
('0c42e5f1-1dfa-431d-a0a5-cb91d51e9cb5', 'error listing elements of users, user: admin', 'admin', 1691701298157),
('1739931e-961f-4ff3-a6c0-1e27c93d556e', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691802701154),
('18dc108b-d576-4c18-a321-2d2d350cc498', 'error listing elements of users, user: admin', 'admin', 1691701201663),
('2c0529cb-ecc1-4990-9212-f88ba7eb0ff7', 'error updating element of users, user: admin item a6921a80-37be-11ee-9c19-6c02e0b9ae9e', 'admin', 1691701828688),
('32c8cc0a-534c-419b-aa06-d7405e5ab7ab', 'error listing elements of users, user: admin', 'admin', 1691780832410),
('35dbc647-3bab-4ff2-bb41-e2ade48b37a8', 'error listing elements of mipymes, user: admin', 'admin', 1691785385959),
('436ec838-9477-4ce5-9c96-6d6f6df72bf3', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691787917173),
('4437bc13-c5ca-4eae-a3a1-b8ade1cd764f', 'error updating element of mipymes, user: sito8943 item undefined', 'sito8943', 1691803519499),
('546fa731-5478-4e6a-8d31-a60134120e2e', 'error listing elements of users, user: admin', 'admin', 1691701358314),
('58301f86-1d71-4787-94e5-9897d2ec557c', 'error listing elements of users, user: admin', 'admin', 1691701413362),
('5b162dd9-41d3-4bac-8c31-51ad99241550', 'error updating element of users, user: admin item undefined', 'admin', 1691701916643),
('63679da6-3422-46e2-ae62-9c0876254461', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691870732928),
('670e2e0e-eec7-4a61-892e-89850f3e93e7', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691802804314),
('7501d06e-1c2b-42fb-a59e-cd67541aee76', 'error listing elements of users, user: admin', 'admin', 1691701299900),
('754afa9a-7d3b-400c-8f21-db904d5fdac0', 'error updating element of users, user: admin item a6921a80-37be-11ee-9c19-6c02e0b9ae9e', 'admin', 1691701867177),
('815dcbaf-592e-4891-b8ee-86bb508ec61b', 'error listing elements of users, user: admin', 'admin', 1691701176996),
('83cd575e-d751-4349-82d8-c171e3f531f9', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691802495452),
('8955027d-f1c9-4448-aab1-59ca5391bafd', 'error deleting elements of posts, user: sito8943, items: 37498f39-d60d-47dd-9b0e-1f14db764', 'sito8943', 1691870092945),
('94091f1a-351b-4dc3-8120-1f46a9bea1c0', 'error updating element of mipymes, user: sito8943 item undefined', 'sito8943', 1691803424941),
('98f05192-1ae1-49c1-b41f-e32a5571d9d3', 'error listing elements of users, user: admin', 'admin', 1691780182740),
('a4e8b530-9265-40fb-bba0-18361d26d5a3', 'error listing elements of users, user: admin', 'admin', 1691701453239),
('ad78a96d-f0d3-4194-a124-3f4a129a58b6', 'error listing elements of users, user: admin', 'admin', 1691780907295),
('ba86a7d9-9d49-4f31-baa1-90dde050f7ca', 'error updating element of mipymes, user: sito8943 item undefined', 'sito8943', 1691803493840),
('d42a40a9-22b4-4ae2-badc-3a9996d296b0', 'error listing elements of users, user: admin', 'admin', 1691780837865),
('d5cafb4a-790c-402b-8958-7a7c6a4e003c', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691802823979),
('d6086f45-a392-4386-9960-34c20c7567f1', 'error listing elements of users, user: admin', 'admin', 1691701455234),
('daac560e-dcdc-4a9a-a3dc-07eee9ebc249', 'error listing elements of users, user: admin', 'admin', 1691701475962),
('de27e922-7548-4f01-a0d6-18cfa6e0a8b8', 'error listing elements of mipymes, user: admin', 'admin', 1691785257962),
('df45d44b-d717-4d97-b902-e9e7e7247e42', 'error updating element of users, user: admin item a6921a80-37be-11ee-9c19-6c02e0b9ae9e', 'admin', 1691701882605),
('e2222d2f-a8f3-498f-81d4-9918a73da75e', 'error listing elements of mipymes, user: sito8943', 'sito8943', 1691787959825),
('e37b5da8-746a-4c15-8703-5fa77fc098be', 'error deleting elements of posts, user: sito8943, items: e 	37498f39-d60d-47dd-9b0e-1f14db764', 'sito8943', 1691870014041),
('e6998d69-be68-4938-b154-faf41622a122', 'error listing elements of users, user: admin', 'admin', 1691780933153),
('ee2c9bad-ac15-49bf-8665-825ce7f7758e', 'error updating element of mipymes, user: sito8943 item undefined', 'sito8943', 1691803479333),
('ef559b02-be24-4561-87c9-138d4a5d9362', 'error listing elements of users, user: admin', 'admin', 1691780850632),
('f5d05c98-0086-440e-8ce9-088257c643ee', 'error listing elements of users, user: admin', 'admin', 1691701358308),
('fb373da6-6379-4d72-b2ba-b56ef964adfe', 'error updating element of users, user: sito8943 item bb2be934-4203-4c94-bc9f-f89290858b01', 'sito8943', 1691855178793);

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
('0b53962f-7929-4e02-94b0-4b9dac7c861c', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801085183, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('0b652e8a-227b-4c51-8acf-2cc6e4275c43', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1691867348919, 'sign out'),
('132ad5eb-7a8c-45e6-9979-56509a4b05cb', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691803807829, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('1e1e6935-5143-4b13-ba84-fe67d60f43b6', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691855299907, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('21f97c24-f7ee-48bc-a5f4-a9922d178fa3', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802075772, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('250b767d-fcb7-4124-886b-4e519b30e587', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802490767, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('28d27701-f14e-457d-b9b2-a25876fa45c7', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801071594, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('2dceec39-90d2-4726-9b06-64f89ebcab5e', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801279814, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('3a3583b2-a61d-4d6a-a12f-54bdaa779dec', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691803729146, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('4826bc89-b485-426b-8efa-2348ebbd0167', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691855304705, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('4dce42e0-7c9b-4a5e-91b5-702403b512de', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802981422, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('51ef97e8-8907-4f3d-8143-713e024ee9b4', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801180540, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('5640281d-5e81-4695-9258-4f9b2dff96a0', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801169031, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('57d69917-5ca2-42f9-ae51-a7447ae10c15', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1691791360009, 'sign out'),
('67c74541-949c-4b4f-a108-28dcf23ae17e', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691791616807, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('6c870035-38cc-4dca-9b31-d6a807b31700', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691803569340, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('713ec34d-3d43-4d55-904d-c7a4cbce2566', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802327932, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('731971df-c16f-4707-be72-f65ffd5bd3bd', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1691867453679, 'sign out'),
('80120058-4617-4316-ac24-539af3acb384', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'delete posts', 1691870117193, '37498f39-d60d-47dd-9b0e-1f14db764'),
('80850908-1688-4273-996a-46c9181bfebd', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802947989, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('947c6475-ebfb-4526-8a21-923ad32733ad', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802912830, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('99c94fe1-8ec6-4c13-ac90-89f50e0019a3', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802089845, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('9e5e49e5-6190-4556-abf1-46c8c2cc06d3', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801224963, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('a3b5b30a-d18a-4092-b3c2-3a3ca0aabdc2', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802144768, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('a46ace94-4728-4d36-9882-4b32a4e2cb35', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691803696602, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('be77535e-c39e-4fcb-8008-b92ef89841f6', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801550297, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('c2358fda-1bdf-4b38-a7d3-5c60e1fa86f2', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801092996, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('cdaf299e-d570-4f38-85ef-3423b93c2e33', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691801403250, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('ce101dbc-f449-4b9b-b752-fcdcd82bba1f', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691855174433, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('d58f609f-eb02-4d03-bd3e-ebc1f97e08ed', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691791410493, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('dd9264ab-bd49-4fdf-a9e6-43a80f63a4eb', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1691870762364, 'sign out'),
('e061956b-f5d5-47fd-a857-817b40cf2ccb', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802251780, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('e0d00a1f-0bf0-4b59-9a04-fc09847a39a3', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691855125160, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('e8d3db63-dbbb-4642-83b4-3125b8298a92', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated users', 1691802166004, 'bb2be934-4203-4c94-bc9f-f89290858b01'),
('ed95a28f-7a75-4969-b669-1a8520e98a3c', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-in', 1691794968593, 'sign out'),
('ff45cc0d-b8dc-46dd-9ae8-460fba03bf1e', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'updated mipymes', 1691803672977, 'owner bb2be934-4203-4c94-bc9f-f89290858b01'),
('ffebacab-c9cb-41cf-a3a1-e7412b6763fa', 'bb2be934-4203-4c94-bc9f-f89290858b01', 'sign-out', 1691794934927, 'sign out');

-- --------------------------------------------------------

--
-- Table structure for table `mipymes`
--

CREATE TABLE `mipymes` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `email` text NOT NULL,
  `photo` text NOT NULL DEFAULT '',
  `banner` text NOT NULL DEFAULT '',
  `owner` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mipymes`
--

INSERT INTO `mipymes` (`id`, `name`, `description`, `email`, `photo`, `banner`, `owner`, `date`) VALUES
('8e9f1cf3-04be-4001-80a6-481d0effd294', 'ToolTodo', 'Somos ToolTodo, reparamos lo que sea', 'sito8943@gmail.com', '/images/mipymes/bb2be934-4203-4c94-bc9f-f89290858b01-photo.jpeg', '/images/mipymes/bb2be934-4203-4c94-bc9f-f89290858b01-banner.jpeg', 'bb2be934-4203-4c94-bc9f-f89290858b01', 1691855304702);

-- --------------------------------------------------------

--
-- Table structure for table `mipymetags`
--

CREATE TABLE `mipymetags` (
  `id` varchar(36) NOT NULL,
  `idMipyme` varchar(36) NOT NULL,
  `idTag` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mipymetags`
--

INSERT INTO `mipymetags` (`id`, `idMipyme`, `idTag`, `date`) VALUES
('b3d45964-390d-11ee-8081-6c02e0b9ae9e', '8e9f1cf3-04be-4001-80a6-481d0effd294', 'ab77fc34-390d-11ee-8081-6c02e0b9ae9e', 1691844104564);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` varchar(36) NOT NULL,
  `banner` text NOT NULL DEFAULT '',
  `title` text NOT NULL,
  `description` text NOT NULL,
  `content` longtext NOT NULL DEFAULT '',
  `type` varchar(36) NOT NULL,
  `owner` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `banner`, `title`, `description`, `content`, `type`, `owner`, `date`) VALUES
('37498f39-d60d-47dd-9b0e-1f14db7648a3', '/images/proyecto/37498f39-d60d-47dd-9b0e-1f14db7648a3-banner.jpeg', 'Escalada', 'Reparaciones después de una buena escalada', '<p>En un viaje a Trinidad...</p>\n<p>El equipo de ToolTodo tuvo que hacer unas reparaciones en un servicio de escalada</p>\n', '687a8ded-383d-11ee-9cc3-6c02e0b9ae9e', 'bb2be934-4203-4c94-bc9f-f89290858b01', 1691859826691),
('40597a65-55b7-499d-b232-5699ff9a4b1f', '/images/evento/40597a65-55b7-499d-b232-5699ff9a4b1f-banner.jpeg', 'Viajes turísticos', 'Tenemos un nuevo evento disponible. Viajes turísticos!!!', '<p>Tenemos un nuevo evento disponible. Viajes turísticos!!!</p>\n<p>Tenemos un nuevo evento disponible. Viajes turísticos!!!</p>\n<p>Tenemos un nuevo evento disponible. Viajes turísticos!!!</p>\n', '6c776477-383d-11ee-9cc3-6c02e0b9ae9e', 'bb2be934-4203-4c94-bc9f-f89290858b01', 1691864992858);

-- --------------------------------------------------------

--
-- Table structure for table `posttags`
--

CREATE TABLE `posttags` (
  `id` varchar(36) NOT NULL,
  `idPost` varchar(36) NOT NULL,
  `idTag` varchar(36) NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posttypes`
--

CREATE TABLE `posttypes` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posttypes`
--

INSERT INTO `posttypes` (`id`, `name`, `date`) VALUES
('687a8ded-383d-11ee-9cc3-6c02e0b9ae9e', 'Proyecto', 1691754671058),
('6c776477-383d-11ee-9cc3-6c02e0b9ae9e', 'Evento', 1691754671058);

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
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` varchar(36) NOT NULL,
  `name` text NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `date`) VALUES
('ab77fc34-390d-11ee-8081-6c02e0b9ae9e', 'tecnología', 1691844104564);

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
('eb868ff7-a55b-4756-a2e3-b650208c114d', 'bb2be934-4203-4c94-bc9f-f89290858b01', 1691957162367, 1691957162367, 'U2FsdGVkX19AqmqFA+8V8mct6w3Zcgo1h3Jmc4ZzqrnNlXSnlDjQfKo7EayjNDQaj1n++hZ4fRLqLADgoLb9noWfeNAHEuc8wPVqhARFCjTJ7x8+9V9grdU5hxY1Zk/h');

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
  `banner` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user`, `name`, `email`, `type`, `pw`, `status`, `state`, `lastOnline`, `date`, `photo`, `banner`) VALUES
('bb2be934-4203-4c94-bc9f-f89290858b01', 'sito8943', 'Carlos Andrés Mora González', 'sito8943@gmail.com', 1, '25d55ad283aa400af464c76d713c07ad', 1, 0, 1691872920387, 1691803729141, '/images/users/sito8943-photo.jpeg', '/images/users/sito8943-banner.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `usertypes`
--

CREATE TABLE `usertypes` (
  `id` tinyint(4) NOT NULL,
  `name` text NOT NULL,
  `date` bigint(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertypes`
--

INSERT INTO `usertypes` (`id`, `name`, `date`) VALUES
(0, 'Dueño de Mipyme', 1691872833059),
(1, 'Admin', 1691872833059),
(2, 'Inversionista', 1691872833059);

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
-- Indexes for table `mipymes`
--
ALTER TABLE `mipymes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mipymeOwner` (`owner`);

--
-- Indexes for table `mipymetags`
--
ALTER TABLE `mipymetags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idMipymeTag` (`idMipyme`),
  ADD KEY `idTagMipyme` (`idTag`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectType` (`type`),
  ADD KEY `projectOwner` (`owner`);

--
-- Indexes for table `posttags`
--
ALTER TABLE `posttags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPostTag` (`idPost`),
  ADD KEY `idTagPost` (`idTag`);

--
-- Indexes for table `posttypes`
--
ALTER TABLE `posttypes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recovery`
--
ALTER TABLE `recovery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idUserRecovery` (`idUser`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

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
-- Constraints for table `mipymes`
--
ALTER TABLE `mipymes`
  ADD CONSTRAINT `mipymeOwner` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mipymetags`
--
ALTER TABLE `mipymetags`
  ADD CONSTRAINT `idMipymeTag` FOREIGN KEY (`idMipyme`) REFERENCES `mipymes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idTagMipyme` FOREIGN KEY (`idTag`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `projectOwner` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projectType` FOREIGN KEY (`type`) REFERENCES `posttypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posttags`
--
ALTER TABLE `posttags`
  ADD CONSTRAINT `idPostTag` FOREIGN KEY (`idPost`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `idTagPost` FOREIGN KEY (`idTag`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recovery`
--
ALTER TABLE `recovery`
  ADD CONSTRAINT `idUserRecovery` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
