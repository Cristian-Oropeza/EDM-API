/* 
import { Client } from 'pg';

export const pgProvider = {
  provide: 'PG_CONNECTION',
  useFactory: async () => {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: '',
      password: '',
      database: '',
    });
    await client.connect();
    return client;
  },
}; */