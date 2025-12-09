import { ConfigService } from '@nestjs/config'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { initialSchema1765128806097 } from './migrations/1765128806097-initial-schema'

dotenv.config()

const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [initialSchema1765128806097],
})
