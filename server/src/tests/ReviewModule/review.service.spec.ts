import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from 'src/ReviewModule/review.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CompanyService } from 'src/CompanyModule/company.service';
import { SocketService } from 'src/socket/socket.service';
import { EmployeeService } from 'src/EmployeeModule/employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from 'src/ReviewModule/review.entity';
import { Question } from 'src/ReviewModule/question.entity';
import { Answer } from 'src/ReviewModule/answer.entity';
import ApiError from 'src/apiError';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
});

const mockSocketGateway = { server: { emit: jest.fn(), to: jest.fn().mockReturnThis(), emit: jest.fn() } };
const mockCompanyService = { getEmployees: jest.fn() };
const mockSocketService = { getSocketByEmployeeId: jest.fn() };
const mockEmployeeService = { getCleanEmployee: jest.fn() };

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: getRepositoryToken(Review), useFactory: mockRepository },
        { provide: getRepositoryToken(Question), useFactory: mockRepository },
        { provide: getRepositoryToken(Answer), useFactory: mockRepository },
        { provide: SocketGateway, useValue: mockSocketGateway },
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: SocketService, useValue: mockSocketService },
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a question', async () => {
    const mockReview = { review_id: 1 };
    const mockQuestion = { question_id: 1, question_text: 'Test?' };
    service['reviewRepository'].findOne.mockResolvedValue(mockReview);
    service['questionRepository'].save.mockResolvedValue(mockQuestion);

    const result = await service.addQuestion('Test?', 1);
    expect(result).toEqual(mockQuestion);
    expect(service['questionRepository'].save).toHaveBeenCalled();
  });

  it('should throw error if review not found on addQuestion', async () => {
    service['reviewRepository'].findOne.mockResolvedValue(null);
    await expect(service.addQuestion('Test?', 1)).rejects.toBeInstanceOf(ApiError);
  });

  it('should remove question', async () => {
    const mockDeleteResult = { raw: { question_id: 1 } };
    service['questionRepository'].delete.mockResolvedValue(mockDeleteResult);

    const result = await service.removeQuestion(1);
    expect(result).toEqual(mockDeleteResult.raw);
  });

  it('should set review', async () => {
    const mockReview = { review_id: 1 };
    const updatedReview = { review_id: 1, review_interval: 7 };
    service['reviewRepository'].findOne.mockResolvedValue(mockReview);
    service['reviewRepository'].save.mockResolvedValue(updatedReview);

    const result = await service.setReview(1, 7);
    expect(result).toEqual(updatedReview);
  });

  it('should start review', async () => {
    const review = { review_id: 1, company: { company_id: 1 }, team: { employees: [] } };
    service['reviewRepository'].findOne.mockResolvedValue(review);
    service['reviewRepository'].save.mockResolvedValue(review);
    mockCompanyService.getEmployees.mockResolvedValue([]);

    const result = await service.startReview(1);
    expect(result).toEqual(review);
  });

  it('should send answers', async () => {
    const question = { question_id: 1 };
    const employee = { employee_id: 1 };
    const employeeSubject = { employee_id: 2 };
    const answers = [{ question_id: 1, answer_text: 'Answer' }];
    service.getQuestion = jest.fn().mockResolvedValue(question);
    service['answerRepository'].save.mockResolvedValue([{ answer_text: 'Answer' }]);

    const result = await service.sendAnswers(answers, employee, employeeSubject);
    expect(result).toEqual([{ answer_text: 'Answer' }]);
    expect(service.getQuestion).toHaveBeenCalledWith(1);
  });
});
