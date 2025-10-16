import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './CompanyModule/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './EmployeeModule/employee.module';
import { InterviewModule } from './InterviewModule/interview.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CompanyModule,
    EmployeeModule,
    InterviewModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
