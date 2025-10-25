import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { Review } from "./review.entity";
import { SocketGatewayModule } from "src/socket/socket.module";
import { CompanyModule } from "src/CompanyModule/company.module";
import { EmployeeModule } from "src/EmployeeModule/employee.module";
import { Question } from "./question.entity";
import { Employee } from "src/EmployeeModule/employee.entity";
import { Answer } from "./answer.entity";


@Module({
    imports: [
        SocketGatewayModule,
        CompanyModule,
        EmployeeModule,
        TypeOrmModule.forFeature([Review, Question, Employee, Answer]),
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService]
})

export class ReviewModule { }