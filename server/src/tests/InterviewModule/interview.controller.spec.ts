import { Test, TestingModule } from '@nestjs/testing';
import { InterviewController } from 'src/InterviewModule/interview.controller';
import { InterviewService } from 'src/InterviewModule/interview.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { SocketService } from 'src/socket/socket.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { HttpException } from '@nestjs/common';
import { clientType } from 'src/types';

describe('InterviewController', () => {
  let controller: InterviewController;

  const mockInterviewService = {
    addInterview: jest.fn(),
    getPlannedInterviews: jest.fn(),
    cancelInterview: jest.fn(),
    finishInterview: jest.fn(),
  };

  const mockEmployeeService = {
    getCleanEmployee: jest.fn(),
  };

  const mockSocketService = {
    getSocketByEmployeeId: jest.fn(),
  };

  const mockSocketGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewController],
      providers: [
        { provide: InterviewService, useValue: mockInterviewService },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: SocketService, useValue: mockSocketService },
        { provide: SocketGateway, useValue: mockSocketGateway },
      ],
    }).compile();

    controller = module.get<InterviewController>(InterviewController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add interview and emit via socket', async () => {
    const req: any = { employee: { employee_id: 1 } };
    const addBody = {
      interview_subject: 2,
      interview_date: new Date(),
      interview_type: 'online',
      interview_desc: 'Test interview',
    };
    const mockSubject = { employee_id: 2 };
    const mockInterview = { id: 1, interview_type: 'online' };
    const mockSocket = { client_id: 'socket123' };

    mockEmployeeService.getCleanEmployee.mockResolvedValue(mockSubject);
    mockInterviewService.addInterview.mockResolvedValue(mockInterview);
    mockSocketService.getSocketByEmployeeId.mockResolvedValueOnce(mockSocket);
    mockSocketService.getSocketByEmployeeId.mockResolvedValueOnce(null);

    const result = await controller.addInterview(addBody, req);

    expect(result).toEqual(mockInterview);
    expect(mockEmployeeService.getCleanEmployee).toHaveBeenCalledWith(2);
    expect(mockInterviewService.addInterview).toHaveBeenCalledWith(
      mockSubject,
      addBody.interview_date,
      addBody.interview_type,
      addBody.interview_desc,
      1,
    );
    expect(mockSocketGateway.server.to).toHaveBeenCalledWith('socket123');
    expect(mockSocketGateway.server.emit).toHaveBeenCalledWith('newInterview', mockInterview);
  });

  it('should get planned interviews', async () => {
    const req: any = { employee: { employee_id: 1 } };
    const mockInterviews = [{ id: 1 }, { id: 2 }];
    mockInterviewService.getPlannedInterviews.mockResolvedValue(mockInterviews);

    const result = await controller.getPlannedInterviews(req);
    expect(result).toEqual(mockInterviews);
    expect(mockInterviewService.getPlannedInterviews).toHaveBeenCalledWith(1);
  });

  it('should cancel interview', async () => {
    const cancelBody = { interview_id: 1 };
    const mockInterview = { id: 1, status: 'cancelled' };
    mockInterviewService.cancelInterview.mockResolvedValue(mockInterview);

    const result = await controller.cancelInterview(cancelBody);
    expect(result).toEqual(mockInterview);
    expect(mockInterviewService.cancelInterview).toHaveBeenCalledWith(1);
  });

  it('should finish interview', async () => {
    const finishBody = { interview_id: 1, interview_duration: 30, interview_comment: 'Good' };
    const mockInterview = { id: 1, status: 'finished' };
    mockInterviewService.finishInterview.mockResolvedValue(mockInterview);

    const result = await controller.finishInterview(finishBody);
    expect(result).toEqual(mockInterview);
    expect(mockInterviewService.finishInterview).toHaveBeenCalledWith(
      1,
      30,
      'Good',
    );
  });

  it('should throw HttpException if addInterview fails', async () => {
    const req: any = { employee: { employee_id: 1 } };
    mockEmployeeService.getCleanEmployee.mockRejectedValue({ message: 'Error', status: 500 });

    await expect(controller.addInterview({ interview_subject: 2 } as any, req)).rejects.toThrow(HttpException);
  });
});
