import databaseConnection from '@src/database/mysql/connection';
import { AppDataSource } from '@src/database/mysql/typeormConfig';
import processRoleSeeder from '@src/seeders/roleSeeder';

async function childProcessInit(): Promise<void> {
  try {
    await databaseConnection();
    await processRoleSeeder();
  } catch (error) {
    console.log({
      error: error,
      source: '#databaseInit',
    });
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

process.on('message', () => childProcessInit());
