import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './CompanyModule/company.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './EmployeeModule/employee.module';
import { InterviewModule } from './InterviewModule/interview.module';
import { ConfigModule } from '@nestjs/config';
import { Company } from './CompanyModule/company.entity';
import { Employee } from './EmployeeModule/employee.entity';
import { Interview } from './InterviewModule/interview.entity';
import { Employee_token } from './EmployeeModule/token.entity';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { Skill } from './SkillModule/skill.entity';
import { SkillShape } from './SkillModule/skillShape.entity';

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
      entities: [Company, Employee, Interview, Employee_token, Skill, SkillShape],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('employee/photo', 'employee/status', 'company/:id/employees', 'company/create', 'company/skill/create')
  }
}
