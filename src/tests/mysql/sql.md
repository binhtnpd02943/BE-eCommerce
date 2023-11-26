// CREATE
CREATE TABLE test_table (
id int NOT NULL,
name varchar(255) DEFAULT NULL,
age int DEFAULT NULL,
address varchar(255) DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// CREATE PROCEDURE
CREATE DEFINER=`dumpData`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i <= max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END

<!--  -->
CHANGE MASTER TO
     MASTER_HOST='172.22.0.3',
     MASTER_PORT=3306,
     MASTER_USER='root',
     MASTER_PASSWORD='admin',
     master_log_file='mysql-bin.000002',
     master_log_pos=2631,
     master_connect_retry=60,
     GET_MASTER_PUBLIC_KEY=1;