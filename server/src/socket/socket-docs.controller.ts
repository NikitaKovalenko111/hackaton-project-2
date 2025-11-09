import { Controller, Post } from '@nestjs/common';
import { 
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExtraModels 
} from '@nestjs/swagger';
import { requestDto, cancelRequestDto, completeRequestDto } from './request-socket.dto';
import { Request } from './request.entity';
import { Socket } from './socket.entity';

@ApiTags('WebSocket - Requests')
@ApiExtraModels(requestDto, cancelRequestDto, completeRequestDto, Request)
@Controller('socket-docs')
export class SocketDocsController {
@Post('connect')
  @ApiOperation({
    summary: 'Подключение клиента к WebSocket',
    description: `Клиент подключается по адресу WebSocket сервера, передавая заголовки:
    - **client_type**: тип клиента (WEB или TELEGRAM)
    - **authorization**: JWT токен (только для WEB)
    - **telegram_id**: ID Telegram пользователя (для TELEGRAM)
    
    После подключения сервер сохраняет сокет в базе и присваивает комнату компании, если она есть.`,
  })
  @ApiResponse({
    status: 200,
    type: Socket,
    description: 'Информация о сохранённом сокете',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка: не указан client_type или неверные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Ошибка авторизации (WEB клиент без токена)',
  })
  connectExample() {}

  @Post('disconnect')
  @ApiOperation({
    summary: 'Отключение клиента от WebSocket',
    description: 'Выполняется автоматически при разрыве соединения. Сервер удаляет сокет из базы.',
  })
  @ApiResponse({
    status: 200,
    description: 'Результат отключения клиента',
    schema: { example: 'disconnected' },
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при удалении сокета',
  })
  disconnectExample() {}

  @Post('addRequest')
  @ApiOperation({
    summary: 'Событие addRequest - создание запроса через сокет',
    description: 'Отправляется событие "addRequest" с телом `requestDto`. Сервер возвращает объект `Request`.',
  })
  @ApiBody({ type: requestDto, description: 'Данные нового запроса' })
  @ApiResponse({ status: 200, type: Request, description: 'Созданный запрос' })
  addRequestExample() {}

  @Post('cancelRequest')
  @ApiOperation({
    summary: 'Событие cancelRequest - отмена запроса',
    description: 'Отправляется событие "cancelRequest" с телом `cancelRequestDto`. Возвращает обновлённый запрос.',
  })
  @ApiBody({ type: cancelRequestDto, description: 'Данные об отменяемом запросе' })
  @ApiResponse({ status: 200, type: Request, description: 'Обновлённый запрос (CANCELED)' })
  cancelRequestExample() {}

  @Post('completeRequest')
  @ApiOperation({
    summary: 'Событие completeRequest - завершение запроса',
    description: 'Отправляется событие "completeRequest" с телом `completeRequestDto`. Возвращает обновлённый запрос.',
  })
  @ApiBody({ type: completeRequestDto, description: 'Данные запроса для завершения' })
  @ApiResponse({ status: 200, type: Request, description: 'Обновлённый запрос (COMPLETED)' })
  completeRequestExample() {}

  @Post('server-events')
  @ApiOperation({
    summary: 'События, которые сервер отправляет клиенту',
    description: `
**Сервер отправляет клиенту следующие события (emit):**

1. **"newRequest"** - приходит получателю, когда кто-то создал запрос.  
   _Данные:_ объект \`Request\`

2. **"canceledRequest"** - отправляется обеим сторонам при отмене запроса.  
   _Данные:_ объект \`Request\` со статусом **CANCELED**

3. **"completedRequest"** - отправляется владельцу, когда запрос завершён.  
   _Данные:_ объект \`Request\` со статусом **COMPLETED**
`,
  })
  @ApiResponse({
    status: 200,
    description: 'Описание всех серверных событий',
    schema: {
      example: {
        newRequest: {
          event: 'newRequest',
          payload: { request_id: 12, request_status: 'PENDING' },
        },
        canceledRequest: {
          event: 'canceledRequest',
          payload: { request_id: 12, request_status: 'CANCELED' },
        },
        completedRequest: {
          event: 'completedRequest',
          payload: { request_id: 12, request_status: 'COMPLETED' },
        },
      },
    },
  })
  serverEventsExample() {}

}