import { Sequelize } from 'sequelize';

const PG_HOST = process.env.DB_HOST || 'localhost';
const PG_PORT = Number(process.env.DB_PORT) || 5432;
const PG_USERNAME = process.env.DB_USER || 'admin';
const PG_PASSWORD = process.env.DB_PASSWORD || 'password';
const PG_DATABASE = process.env.DB_NAME || 'user';


const sequelize = new Sequelize(
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD,
  {
    host: PG_HOST,
    port: PG_PORT,
    dialect: 'postgres',
  }
);

export default sequelize;
