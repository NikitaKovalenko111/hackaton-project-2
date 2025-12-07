import { Module } from '@nestjs/common'
import { EmployeeController } from './employee.controller'
import { EmployeeService } from './employee.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Employee } from './employee.entity'
import { Employee_token } from './token.entity'
import { TokenService } from './token.service'
import { MulterModule } from '@nestjs/platform-express'
import { Request } from 'express'
import { diskStorage } from 'multer'
import path from 'path'
import { Skill } from 'src/SkillModule/skill.entity'
import { Role } from './role.entity'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination(req: Request, file: Express.Multer.File, cb) {
          cb(null, path.join(__dirname, '../../../profilePhotos'))
        },
        filename(req: Request, file: Express.Multer.File, cb) {
          cb(
            null,
            String(
              (req as any).employee.employee_id +
                '.' +
                file.mimetype.split('/')[1],
            ),
          )
        },
      }),
    }),
    TypeOrmModule.forFeature([
      Employee, 
      Employee_token, 
      Skill,
      Role
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, TokenService],
  exports: [TokenService, EmployeeService],
})
export class EmployeeModule {}
