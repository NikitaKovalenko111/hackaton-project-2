import { ApiProperty } from "@nestjs/swagger"

export class applyNotificationBodyDto {
  @ApiProperty({
    example: 3,
    description: "ID уведомления, которое нужно применить"
  })
  notification_id: number
}