import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { requestDto, cancelRequestDto, completeRequestDto } from './request-socket.dto';
import { Request } from './request.entity';

@ApiTags('WebSocket — Requests')
@ApiExtraModels(requestDto, cancelRequestDto, completeRequestDto, Request)
@Controller('socket-docs')
export class SocketDocsController {
  @Post('addRequest')
  @ApiOperation({
    summary: 'Событие addRequest — создание запроса через сокет',
    description: 'Отправляется событие "addRequest" с телом `requestDto`. Сервер возвращает объект `Request`.',
  })
  @ApiBody({ type: requestDto })
  @ApiResponse({ status: 200, type: Request, description: 'Созданный запрос' })
  addRequestExample() {}

  @Post('cancelRequest')
  @ApiOperation({
    summary: 'Событие cancelRequest — отмена запроса',
    description: 'Отправляется событие "cancelRequest" с телом `cancelRequestDto`. Возвращает обновлённый запрос.',
  })
  @ApiBody({ type: cancelRequestDto })
  @ApiResponse({ status: 200, type: Request, description: 'Обновлённый запрос (CANCELED)' })
  cancelRequestExample() {}

  @Post('completeRequest')
  @ApiOperation({
    summary: 'Событие completeRequest — завершение запроса',
    description: 'Отправляется событие "completeRequest" с телом `completeRequestDto`. Возвращает обновлённый запрос.',
  })
  @ApiBody({ type: completeRequestDto })
  @ApiResponse({ status: 200, type: Request, description: 'Обновлённый запрос (COMPLETED)' })
  completeRequestExample() {}
}
