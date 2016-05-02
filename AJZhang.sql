-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2016-05-02 21:16:51
-- 服务器版本: 5.5.49-0ubuntu0.14.04.1
-- PHP 版本: 5.5.9-1ubuntu4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `AJZhang`
--

-- --------------------------------------------------------

--
-- 表的结构 `cost_configuration`
--

CREATE TABLE IF NOT EXISTS `cost_configuration` (
  `cost_configuration_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cost_name` varchar(100) NOT NULL DEFAULT '' COMMENT '费用名称',
  `is_system` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0非系统1系统',
  `operator_employee_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '操作人',
  `create_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '新增时间',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
  `delete_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '删除时间',
  PRIMARY KEY (`cost_configuration_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='费用类型表' AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `cost_configuration`
--

INSERT INTO `cost_configuration` (`cost_configuration_id`, `cost_name`, `is_system`, `operator_employee_id`, `create_time`, `update_time`, `is_delete`, `delete_time`) VALUES
(1, '交通出行', 0, 0, 0, 0, 0, 0),
(2, '营养早餐', 0, 0, 0, 0, 0, 0),
(3, '丰盛午餐', 0, 0, 0, 0, 0, 0),
(4, '健康晚餐', 0, 0, 0, 0, 0, 0),
(5, '滋润夜宵', 0, 0, 0, 0, 0, 0),
(6, '垃圾零食', 0, 0, 0, 0, 0, 0),
(7, '养生水果', 0, 0, 0, 0, 0, 0),
(8, '植物牛奶', 0, 0, 0, 0, 0, 0),
(9, '蛋糕面包', 0, 0, 0, 0, 0, 0),
(10, '物业水电', 0, 0, 0, 0, 0, 0),
(11, '房屋租金', 0, 0, 0, 0, 0, 0),
(12, '话费网费', 0, 0, 0, 0, 0, 0),
(13, '生活用品', 0, 0, 0, 0, 0, 0),
(14, '美容美发', 0, 0, 0, 0, 0, 0),
(15, '人际往来', 0, 0, 0, 0, 0, 0),
(16, '扑克娱乐', 0, 0, 0, 0, 0, 0),
(17, '柴米油盐', 0, 0, 0, 0, 0, 0),
(18, '医疗保健', 0, 0, 0, 0, 0, 0),
(19, '旅行娱乐', 0, 0, 0, 0, 0, 0),
(20, '服饰装扮', 0, 0, 0, 0, 0, 0),
(21, '小屁孩儿', 0, 0, 0, 0, 0, 0),
(22, '欠债还钱', 0, 0, 0, 0, 0, 0),
(23, '电器家具', 0, 0, 0, 0, 0, 0),
(24, '孝敬长辈', 0, 0, 0, 0, 0, 0),
(25, '数码产品', 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- 表的结构 `cost_relationship`
--

CREATE TABLE IF NOT EXISTS `cost_relationship` (
  `cost_configuration_id` int(10) unsigned NOT NULL COMMENT '费用ID',
  `cost_name` varchar(100) NOT NULL DEFAULT '' COMMENT '费用名称',
  `cost_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '消费时间',
  `cost_money` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '费用金额',
  `cost_type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '费用类型(0:收入,1:支出)',
  `operator_employee_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '操作人',
  `remarks` text COMMENT '备注',
  `create_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '新增时间',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '修改时间',
  `is_delete` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除',
  `delete_time` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='财务流水表';

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
