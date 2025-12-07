import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from 'src/socket/request.controller';
import { RequestService } from 'src/socket/request.service';
import { HttpException } from '@nestjs/common';

const mockRequestService = {
  getReceivedRequests: jest.fn(),
  getSendedRequests: jest.fn(),
};

describe('RequestController', () => {
  let controller: RequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [{ provide: RequestService, useValue: mockRequestService }],
    }).compile();

    controller = module.get<RequestController>(RequestController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all received requests', async () => {
    const mockRequests = [{ id: 1 }, { id: 2 }];
    mockRequestService.getReceivedRequests.mockResolvedValue(mockRequests);

    const req: any = { employee: { employee_id: 1 } };
    const result = await controller.getAllReceivedRequest(req);

    expect(result).toEqual(mockRequests);
    expect(mockRequestService.getReceivedRequests).toHaveBeenCalledWith(1);
  });

  it('should throw HttpException on error in received requests', async () => {
    mockRequestService.getReceivedRequests.mockRejectedValue(new Error('fail'));

    const req: any = { employee: { employee_id: 1 } };
    await expect(controller.getAllReceivedRequest(req)).rejects.toThrow(HttpException);
  });

  it('should get all sended requests', async () => {
    const mockRequests = [{ id: 3 }, { id: 4 }];
    mockRequestService.getSendedRequests.mockResolvedValue(mockRequests);

    const req: any = { employee: { employee_id: 2 } };
    const result = await controller.getAllSendedRequest(req);

    expect(result).toEqual(mockRequests);
    expect(mockRequestService.getSendedRequests).toHaveBeenCalledWith(2);
  });

  it('should throw HttpException on error in sended requests', async () => {
    mockRequestService.getSendedRequests.mockRejectedValue(new Error('fail'));

    const req: any = { employee: { employee_id: 2 } };
    await expect(controller.getAllSendedRequest(req)).rejects.toThrow(HttpException);
  });
});
