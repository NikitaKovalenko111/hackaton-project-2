import { ApiProperty } from "@nestjs/swagger"
import { Notification } from "./notification.entity"

export class applyNotificationBodyDto {
  @ApiProperty({
    example: 3,
    description: "ID уведомления, которое нужно применить"
  })
  notification_id: number
}

export class notificationDataDto {
  notification: Notification
  object: any
}