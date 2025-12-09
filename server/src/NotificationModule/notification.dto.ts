import { ApiProperty } from '@nestjs/swagger'
import { Notification } from './notification.entity'

export class applyNotificationBodyDto {
  @ApiProperty({
    example: 3,
    description: 'ID уведомления, которое нужно применить',
  })
  notification_id: number
}

export class notificationDataDto {
  @ApiProperty({
    type: () => Notification,
    description: 'Данные уведомления',
  })
  notification: Notification

  @ApiProperty({
    description: 'Дополнительные данные, связанные с уведомлением',
    additionalProperties: true,
    type: 'object',
    example: {
      interview_id: 12,
      interview_subject: 'test@example.com',
    },
  })
  object: any
}
