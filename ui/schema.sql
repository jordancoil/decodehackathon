PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `intersection` (
	`id`	INTEGER,
	`lat`	REAL,
	`long`	REAL,
	`name`	TEXT NOT NULL UNIQUE,
	PRIMARY KEY(`id`)
);
CREATE TABLE `changeset` (
	`id`	INTEGER,
	`parent`	INTEGER,
	PRIMARY KEY(`id`)
);
CREATE TABLE `statvalue` (
	`id`	INTEGER,
	`parent`	INTEGER NOT NULL,
	`type`	INTEGER NOT NULL,
	`value`	BLOB NOT NULL,
	`date`	DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS "change" (
	`id`	INTEGER,
	`changeset`	INTEGER NOT NULL,
	`intersection`	INTEGER NOT NULL,
	`policy`	INTEGER NOT NULL,
	FOREIGN KEY(`changeset`) REFERENCES `changeset`(`id`),
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS "intstats" (
	`id`	INTEGER,
	`intersection`	INTEGER NOT NULL,
	`changeset`	INTEGER NOT NULL,
	`simulated`	BOOLEAN,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`intersection`) REFERENCES `intersection`(`id`)
);
CREATE TABLE `deployment` (
	`id`	INTEGER,
	`changset`	INTEGER,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS "genstats" (
	`id`	INTEGER,
	`changset`	INTEGER,
	PRIMARY KEY(`id`)
);
COMMIT;
