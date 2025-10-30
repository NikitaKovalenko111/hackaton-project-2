import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CompanyModule } from './CompanyModule/company.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeeModule } from './EmployeeModule/employee.module'
import { InterviewModule } from './InterviewModule/interview.module'
import { ConfigModule } from '@nestjs/config'
import { Company } from './CompanyModule/company.entity'
import { Employee } from './EmployeeModule/employee.entity'
import { Interview } from './InterviewModule/interview.entity'
import { Employee_token } from './EmployeeModule/token.entity'
import { AuthMiddleware } from './middlewares/auth.middleware'
import { Skill } from './SkillModule/skill.entity'
import { SkillShape } from './SkillModule/skillShape.entity'
import { Role } from './EmployeeModule/role.entity'
import { Team } from './TeamModule/team.entity'
import { TeamModule } from './TeamModule/team.module'
import { SkillModule } from './SkillModule/skill.module'
import { SocketGatewayModule } from './socket/socket.module'
import { Request } from './socket/request.entity'
import { Socket } from './socket/socket.entity'
import { Question } from './ReviewModule/question.entity'
import { Answer } from './ReviewModule/answer.entity'
import { Review } from './ReviewModule/review.entity'
import { ReviewModule } from './ReviewModule/review.module'
import { Statistics } from './StatisticsModule/statistics.entity'
import { StatisticsModule } from './StatisticsModule/statistics.module'

@Module({
  imports: [
    CompanyModule,
    EmployeeModule,
    InterviewModule,
    TeamModule,
    SkillModule,
    SocketGatewayModule,
    ReviewModule,
    StatisticsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Company,
        Employee,
        Interview,
        Employee_token,
        Skill,
        SkillShape,
        Team,
        Role,
        Request,
        Socket,
        Question,
        Answer,
        Review,
        Statistics,
      ],
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
      .forRoutes(
        'employee/photo',
        'employee/status',
        'employee/profile',
        'employee/profile/:id',
        'company/employees',
        'company/create',
        'company/:companyId/teams',
        'company/skill/create',
        'company/skills',
        'company/skill/give',
        'company/info',
        'company/employee/add',
        'team/add',
        'team/add/employee',
        'team/info',
        'interview/add',
        'interview/finish',
        'skill/level/update',
        'skill/:id/delete',
        'interview/get/planned',
        'interview/get/created',
        'interview/cancel',
        'interview/finish',
        'review/add/question',
        'review/set',
        'review/remove/question/:id',
        'review/send/answers',
        'review/start',
        'company/skill/giveToMany',
        'company/employee/addByEmail',
        'statistics/generate',
        'request/received/getAll',
        'request/sended/getAll',
      )
  }
}
