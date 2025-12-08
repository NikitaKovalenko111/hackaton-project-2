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
import { AIModule } from './AIModule/ai.module'
import { SkillOrder } from './SkillModule/skillOrder.entity'
import { NotificationModule } from './NotificationModule/notification.module'
import { Notification } from './NotificationModule/notification.entity'
import { ServeStaticModule } from '@nestjs/serve-static'
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/..' + '/profilePhotos',
      serveRoot: '/profilePhotos/',
    }),
    CompanyModule,
    EmployeeModule,
    InterviewModule,
    TeamModule,
    SkillModule,
    NotificationModule,
    SocketGatewayModule,
    ReviewModule,
    StatisticsModule,
    AIModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [
        Company,
        Employee,
        Interview,
        Employee_token,
        Skill,
        SkillShape,
        SkillOrder,
        Team,
        Role,
        Notification,
        Request,
        Socket,
        Question,
        Answer,
        Review,
        Statistics,
      ],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/profilePhotos/*',
        '/employee/registration',
        '/employee/authorization',
        '/employee/authorization/telegram',
        '/employee/refresh',
      )
      .forRoutes('*')
  }
}
