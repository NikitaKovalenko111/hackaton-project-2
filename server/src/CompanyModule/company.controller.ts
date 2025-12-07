import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CompanyService } from './company.service'
import { Company } from './company.entity'
import { employeePayloadDto } from 'src/EmployeeModule/employee.dto'
import { SkillShape } from 'src/SkillModule/skillShape.entity'
import { Skill } from 'src/SkillModule/skill.entity'
import { SkillService } from 'src/SkillModule/skill.service'
import { EmployeeService } from 'src/EmployeeModule/employee.service'
import { employeeDto } from 'src/types'
import { Team } from 'src/TeamModule/team.entity'
import {
  addCompanyEmployeeBodyDto,
  addEmployeeByEmailBodyDto,
  createCompanyBodyDto,
  createSkillBodyDto,
  giveSkillBodyDto,
  giveSkillToManyBodyDto,
} from './company.dto'
import { Employee } from 'src/EmployeeModule/employee.entity'
import { CompanyEmployeeDto } from './company.dto';

@ApiBearerAuth()
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly employeeService: EmployeeService,
    private readonly skillService: SkillService,
  ) {}

  @Get('/info')
  @ApiOperation({ summary: 'Получить информацию о компании текущего пользователя' })
  @ApiResponse({ status: 200, type: Company, description: 'Информация о компании' })
  @ApiResponse({ status: 400, description: 'Сотрудник не привязан к компании' })
  async getCompanyInfo(@Req() req: Request): Promise<Company> {
    try {
      const employee = (req as any).employee

      const company = await this.companyService.getCompanyInfo(
        employee.company_id,
      )

      return company
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Delete('/skillShape/remove/:id')
  @ApiOperation({ summary: 'Удалить форму навыка по ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID формы навыка' })
  @ApiResponse({ status: 200, type: SkillShape, description: 'Удалённая форма навыка' })
  @ApiResponse({ status: 404, description: 'Форма навыка не найдена' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async removeSkillShape(@Param('id') skillShapeId: number): Promise<SkillShape> {
    try {
      const skillShape = await this.skillService.deleteSkillShape(skillShapeId)
  
      return skillShape
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/employees')
  @ApiQuery({ name: 'name', required: false, description: 'Фильтр по имени/фамилии' })
  @ApiQuery({ name: 'surname', required: false, description: 'Фильтр по фамилии' })
  @ApiQuery({ name: 'email', required: false, description: 'Фильтр по email' })
  @ApiOkResponse({
    description: 'Список сотрудников компании',
    type: [CompanyEmployeeDto],
  })
  async getEmployees(
    @Req() req: Request,
    @Query() query: Record<string, any>,
  ): Promise<employeePayloadDto[]> {
    try {
      const employee = (req as any).employee
      const { name, surname, email } = query

      const employeeData = await this.employeeService.getEmployee(
        employee.employee_id,
      )

      if (employeeData.company == null) {
        throw new HttpException('Сотрудник не в компании!', HttpStatus.NOT_ACCEPTABLE)
      }

      const employees = await this.companyService.getEmployees(
        employeeData.company.company_id,
        name,
        surname,
        email
      )

      return employees
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/skills')
  @ApiOperation({ summary: 'Получить список форм навыков компании' })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Фильтр по названию навыка'
  })
  @ApiResponse({
    status: 200,
    type: [SkillShape],
    description: 'Список навыков компании'
  })
  async getCompanySkills(@Req() req: Request, @Query('name') skillName: string): Promise<SkillShape[]> {
    try {
      const employee = (req as any).employee

      const employeeData = await this.employeeService.getEmployee(
        employee.employee_id,
      )

      if (employeeData.company == null) {
        throw new HttpException('Сотрудник не в компании!', HttpStatus.NOT_ACCEPTABLE)
      }

      const skills = await this.companyService.getSkillShapesByCompany(
        employeeData.company.company_id,
        skillName
      )

      return skills
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/create')
  @ApiOperation({ summary: 'Создание новой компании' })
  @ApiBody({ type: createCompanyBodyDto })
  @ApiResponse({ status: 201, description: 'Компания успешно создана' })
  @ApiResponse({ status: 403, description: 'Нет прав для создания компании' })
  async createCompany(
    @Body() createCompanyBody: createCompanyBodyDto,
    @Req() req: Request,
  ): Promise<Company> {
    try {
      const employeeId = (req as any).employee.employee_id
      const company = await this.companyService.createCompany(
        createCompanyBody.company_name,
        employeeId,
      )

      return company
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/employee/add')
  @ApiOperation({ summary: 'Добавить сотрудника в компанию' })
  @ApiBody({ type: addCompanyEmployeeBodyDto })
  @ApiResponse({ status: 200, type: employeeDto, description: 'Добавленный сотрудник' })
  async addEmployee(
    @Body() addEmployeeBody: addCompanyEmployeeBodyDto,
    @Req() req: Request,
  ): Promise<employeeDto> {
    try {
      const employeeId = (req as any).employee.employee_id

      const { company_id, employee_to_add_id, employee_role } = addEmployeeBody

      const addedEmployee = await this.companyService.addEmployee(
        company_id,
        employee_to_add_id,
        employee_role,
      )

      const employeeData = new employeeDto(addedEmployee)

      return employeeData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Delete('/employee/remove/:id')
  @ApiOperation({ summary: 'Удалить сотрудника из компании' })
  @ApiParam({ name: 'id', type: Number, description: 'ID сотрудника' })
  @ApiResponse({ status: 200, type: Employee, description: 'Удалённый сотрудник' })
  async removeEmployee(@Param('id') employeeId: number, @Req() req: Request): Promise<Employee> {
    const employee = await this.companyService.removeEmployee(employeeId)

    return employee
  }

  @Post('/employee/addByEmail')
  @ApiOperation({ summary: 'Добавить сотрудника по email' })
  @ApiBody({ type: addEmployeeByEmailBodyDto })
  @ApiResponse({ status: 200, type: employeeDto, description: 'Добавленный сотрудник' })
  async addEmployeeByEmail(
    @Body() addEmployeeByEmailBody: addEmployeeByEmailBodyDto,
    @Req() req: Request,
  ): Promise<employeeDto> {
    try {
      const { company_id, employee_to_add_email, employee_role } =
        addEmployeeByEmailBody

      const addedEmployee = await this.companyService.addEmployeeByEmail(
        company_id,
        employee_to_add_email,
        employee_role,
      )

      const employeeData = new employeeDto(addedEmployee)

      return employeeData
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/skill/create')
  @ApiOperation({ summary: 'Создать новую форму навыка для компании' })
  @ApiBody({ type: createSkillBodyDto })
  @ApiResponse({ status: 201, type: SkillShape, description: 'Созданная форма навыка' })
  async createSkill(
    @Body() createSkillBody: createSkillBodyDto,
    @Req() req: Request,
  ): Promise<SkillShape> {
    try {
      const { skill_name, skill_desc, company_id } = createSkillBody

      const skill = await this.skillService.createSkill(
        skill_name,
        skill_desc,
        company_id,
      )

      return skill
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/skill/give')
  @ApiOperation({ summary: 'Выдать навык сотруднику' })
  @ApiBody({ type: giveSkillBodyDto })
  @ApiResponse({ status: 200, type: Skill, description: 'Навык, выданный сотруднику' })
  async giveSkillToEmployee(
    @Body() giveSkillBody: giveSkillBodyDto,
    @Req() req: Request,
  ): Promise<Skill> {
    try {
      const { skill_shape_id, employee_to_give_id, skill_level } =
        giveSkillBody
      const employeeToGive =
        await this.employeeService.getEmployee(employee_to_give_id)

      const skill = await this.skillService.giveSkill(
        employeeToGive,
        skill_shape_id,
        skill_level,
      )

      return skill
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/skill/giveToMany')
  @ApiOperation({ summary: 'Выдать навык нескольким сотрудникам' })
  @ApiBody({ type: giveSkillToManyBodyDto })
  @ApiResponse({ status: 200, type: [Skill], description: 'Список выданных навыков' })
  async giveSkillToEmployees(
    @Body() giveSkillBody: giveSkillToManyBodyDto,
    @Req() req: Request,
  ): Promise<Skill[]> {
    try {
      const { skill_shape_id, company_id, employees_to_give_id, skill_level } =
        giveSkillBody
      const employeesInCompany =
        await this.companyService.getEmployees(company_id)
      const needEmployees = employeesInCompany.filter((el) =>
        employees_to_give_id.includes(el.employee_id),
      )

      const skill = await this.skillService.giveSkillToMany(
        needEmployees,
        skill_shape_id,
        skill_level,
      )

      return skill
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/:companyId/teams')
  @ApiOperation({ summary: 'Получить все команды компании' })

  @ApiQuery({ name: 'name', required: false, description: 'Название команды' })

  @ApiQuery({ name: 'teamleadName', required: false, description: 'Имя тимлида' })
  @ApiQuery({ name: 'teamleadSurname', required: false, description: 'Фамилия тимлида' })
  @ApiParam({ name: 'companyId', type: Number, description: 'ID компании' })
  @ApiResponse({ status: 200, type: [Team], description: 'Список команд' })

  @ApiBadRequestResponse({ description: 'Некорректные параметры запроса' })
  @ApiNotFoundResponse({ description: 'Компания не найдена' })
  async getAllCompanyTeams(
    @Param('companyId') companyId: number,
    @Query('name') teamName: string,
    @Query('teamleadSurname') teamleadSurname: string,
    @Query('teamleadName') teamleadName: string,
    @Req() req: Request,
  ): Promise<Team[]> {
    try {
      const teams = await this.companyService.getAllTeams(companyId, teamName, teamleadName, teamleadSurname)

      return teams
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
