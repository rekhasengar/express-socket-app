import { MigrationInterface, QueryRunner } from "typeorm";

export class Refactor1737278278385 implements MigrationInterface {
    name = 'Refactor1737278278385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`socket\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`socketId\` varchar(255) NOT NULL, \`userKey\` int NOT NULL, UNIQUE INDEX \`IDX_54469a3174932555576d81bd65\` (\`id\`), UNIQUE INDEX \`IDX_ba8d4b68466d82027f42cb695a\` (\`socketId\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messageStatuses\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`messageKey\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`timestamp\` bigint NOT NULL, \`timezone\` varchar(255) NOT NULL, \`userKey\` int NOT NULL, UNIQUE INDEX \`IDX_4603b276e58b803936175333b4\` (\`id\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, \`resetPasswordToken\` text NULL, \`emailVerificationToken\` text NULL, \`isUserLoggedIn\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, UNIQUE INDEX \`IDX_c1433d71a4838793a49dcad46a\` (\`id\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversationMembers\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`userKey\` int NOT NULL, \`conversationKey\` int NOT NULL, \`roleKey\` int NOT NULL, UNIQUE INDEX \`IDX_f60ce471068d1996d5413d2506\` (\`id\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversations\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`isGroupChat\` tinyint NOT NULL, \`createdByKey\` int NOT NULL, UNIQUE INDEX \`IDX_ee34f4f7ced4ec8681f26bf04e\` (\`id\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`key\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted\` tinyint NOT NULL DEFAULT 0, \`senderKey\` int NOT NULL, \`message\` text NULL, \`conversationKey\` int NOT NULL, UNIQUE INDEX \`IDX_18325f38ae6de43878487eff98\` (\`id\`), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`socket\` ADD CONSTRAINT \`FK_78df0073f4afedb6c8f5871bd0c\` FOREIGN KEY (\`userKey\`) REFERENCES \`users\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messageStatuses\` ADD CONSTRAINT \`FK_ba2f4cb3aa4046a05a01129040c\` FOREIGN KEY (\`messageKey\`) REFERENCES \`messages\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messageStatuses\` ADD CONSTRAINT \`FK_1b73de01772f50076bcbdbf9d71\` FOREIGN KEY (\`userKey\`) REFERENCES \`users\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` ADD CONSTRAINT \`FK_009fd69d83bb58affa899e7858a\` FOREIGN KEY (\`userKey\`) REFERENCES \`users\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` ADD CONSTRAINT \`FK_d191b06e5c87ddd516f4e9a25fb\` FOREIGN KEY (\`conversationKey\`) REFERENCES \`conversations\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` ADD CONSTRAINT \`FK_ed76ade811b52288c9063c5ad17\` FOREIGN KEY (\`roleKey\`) REFERENCES \`roles\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversations\` ADD CONSTRAINT \`FK_27f7953ef926aca77198161c5a5\` FOREIGN KEY (\`createdByKey\`) REFERENCES \`users\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_21de9e48c6e40d8e3e342ec471b\` FOREIGN KEY (\`senderKey\`) REFERENCES \`users\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_dca53a2adcf9567ac21c665e522\` FOREIGN KEY (\`conversationKey\`) REFERENCES \`conversations\`(\`key\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_dca53a2adcf9567ac21c665e522\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_21de9e48c6e40d8e3e342ec471b\``);
        await queryRunner.query(`ALTER TABLE \`conversations\` DROP FOREIGN KEY \`FK_27f7953ef926aca77198161c5a5\``);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` DROP FOREIGN KEY \`FK_ed76ade811b52288c9063c5ad17\``);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` DROP FOREIGN KEY \`FK_d191b06e5c87ddd516f4e9a25fb\``);
        await queryRunner.query(`ALTER TABLE \`conversationMembers\` DROP FOREIGN KEY \`FK_009fd69d83bb58affa899e7858a\``);
        await queryRunner.query(`ALTER TABLE \`messageStatuses\` DROP FOREIGN KEY \`FK_1b73de01772f50076bcbdbf9d71\``);
        await queryRunner.query(`ALTER TABLE \`messageStatuses\` DROP FOREIGN KEY \`FK_ba2f4cb3aa4046a05a01129040c\``);
        await queryRunner.query(`ALTER TABLE \`socket\` DROP FOREIGN KEY \`FK_78df0073f4afedb6c8f5871bd0c\``);
        await queryRunner.query(`DROP INDEX \`IDX_18325f38ae6de43878487eff98\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP INDEX \`IDX_ee34f4f7ced4ec8681f26bf04e\` ON \`conversations\``);
        await queryRunner.query(`DROP TABLE \`conversations\``);
        await queryRunner.query(`DROP INDEX \`IDX_f60ce471068d1996d5413d2506\` ON \`conversationMembers\``);
        await queryRunner.query(`DROP TABLE \`conversationMembers\``);
        await queryRunner.query(`DROP INDEX \`IDX_c1433d71a4838793a49dcad46a\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_4603b276e58b803936175333b4\` ON \`messageStatuses\``);
        await queryRunner.query(`DROP TABLE \`messageStatuses\``);
        await queryRunner.query(`DROP INDEX \`IDX_ba8d4b68466d82027f42cb695a\` ON \`socket\``);
        await queryRunner.query(`DROP INDEX \`IDX_54469a3174932555576d81bd65\` ON \`socket\``);
        await queryRunner.query(`DROP TABLE \`socket\``);
    }

}
