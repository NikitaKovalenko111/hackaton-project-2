import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from 'src/ReviewModule/review.controller';
import { ReviewService } from 'src/ReviewModule/review.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { CompanyService } from 'src/CompanyModule/company.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { HttpException } from '@nestjs/common';

const mockReviewService = {
  addQuestion: jest.fn(),
  setReview: jest.fn(),
  removeQuestion: jest.fn(),
  sendAnswers: jest.fn(),
  getAnswersEmployeesId: jest.fn(),
  endReview: jest.fn(),
  startReview: jest.fn(),
};

const mockEmployeeService = {
  getCleanEmployee: jest.fn(),
};

const mockCompanyService = {
  getEmployees: jest.fn(),
};

const mockSocketGateway = {
  server: { emit: jest.fn() },
};

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: SocketGateway, useValue: mockSocketGateway },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add question', async () => {
    const mockQuestion = { id: 1, question_text: 'Test?' };
    mockReviewService.addQuestion.mockResolvedValue(mockQuestion);

    const body = { question_text: 'Test?', review_id: 1 };
    const result = await controller.addQuestion(body, {} as any);

    expect(result).toEqual(mockQuestion);
    expect(mockReviewService.addQuestion).toHaveBeenCalledWith('Test?', 1);
  });

  it('should set review', async () => {
    const mockReview = { id: 1, review_interval: 7 };
    mockReviewService.setReview.mockResolvedValue(mockReview);

    const body = { review_id: 1, review_interval: 7 };
    const result = await controller.setReview(body, {} as any);

    expect(result).toEqual(mockReview);
    expect(mockReviewService.setReview).toHaveBeenCalledWith(1, 7);
  });

  it('should remove question', async () => {
    const mockQuestion = { id: 2, question_text: 'Remove?' };
    mockReviewService.removeQuestion.mockResolvedValue(mockQuestion);

    const result = await controller.removeQuestion(2);
    expect(result).toEqual(mockQuestion);
    expect(mockReviewService.removeQuestion).toHaveBeenCalledWith(2);
  });

  it('should start review', async () => {
    const mockReview = { id: 1 };
    mockReviewService.startReview.mockResolvedValue(mockReview);

    const body = { review_id: 1 };
    const result = await controller.startReview(body);
    expect(result).toEqual(mockReview);
    expect(mockReviewService.startReview).toHaveBeenCalledWith(1);
  });

  it('should send answers and emit event if all answered', async () => {
    const answersData = [{ id: 1 }];
    mockEmployeeService.getCleanEmployee.mockResolvedValueOnce({ employee_id: 1 });
    mockEmployeeService.getCleanEmployee.mockResolvedValueOnce({ employee_id: 2 });
    mockReviewService.sendAnswers.mockResolvedValue(answersData);
    mockReviewService.getAnswersEmployeesId.mockResolvedValue([1]);
    mockCompanyService.getEmployees.mockResolvedValue([{}, {}]);

    const body = {
      answers: [],
      employee_id: 1,
      employee_answers_to_id: 2,
      company_id: 1,
      review_id: 1,
    };

    const result = await controller.sendAnswers(body);

    expect(result).toEqual(answersData);
    expect(mockSocketGateway.server.emit).not.toHaveBeenCalled(); // ids != employeesCount
  });
});
