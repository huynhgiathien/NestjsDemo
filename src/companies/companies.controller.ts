import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './company.model';
import { CreateCompanyDto } from './createCompanyDto';
import { UpdateCompanyDto } from './updateCompanyDto';

@Controller('companies')
export class CompaniesController {
  companiesService: CompaniesService;
  constructor(companiesService: CompaniesService) {
    this.companiesService = companiesService;
  }

  @Get()
  async getAllCompanies(): Promise<Company[]> {
    return await this.companiesService.getAllCompanies();
  }

  @Get('/:id')
  async getCompanyById(@Param('id') id: number): Promise<Company> {
    return await this.companiesService.getCompanyById(id);
  }

  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<Company[]> {
    return await this.companiesService.createCompany(createCompanyDto);
  }

  @Put()
  async updateCompany(
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company[]> {
    return await this.companiesService.updateCompanyById(updateCompanyDto);
  }
}
