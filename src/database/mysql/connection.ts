import { AppDataSource } from './typeormConfig';

async function databaseConnection(): Promise<void> {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log({
      error: error,
      source: '#databaseConnection',
    });
  }
}

export default databaseConnection;
