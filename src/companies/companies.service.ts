import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { Company } from './company.model';
import { CreateCompanyDto } from './createCompanyDto';
import { UpdateCompanyDto } from './updateCompanyDto';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getAllCompanies(): Promise<Company[]> {
    const companies = await this.knex.table('Companies');
    if (companies.length === 0) {
      throw new NotFoundException(`Not found`);
    }
    return companies;
  }

  async getCompanyById(company_id: number): Promise<Company> {
    const company = await this.knex
      .table('Companies')
      .where('company_id', company_id)
      .first();

    if (!company) {
      throw new NotFoundException(`Not found company with ${company_id} id`);
    }
    return company;
  }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company[]> {
    return await this.knex
      .table('Companies')
      .insert(createCompanyDto)
      .returning('*');
  }

  async updateCompanyById(
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company[]> {
    const {
      company_id,
      name,
      hidden,
      created_at,
      updated_at,
      short_name,
      is_partner_company,
      sort,
    } = updateCompanyDto;
    const company = await this.getCompanyById(company_id);
    return await this.knex
      .table('Companies')
      .where('company_id', company.company_id)
      .update({
        name,
        hidden,
        created_at,
        updated_at,
        short_name,
        is_partner_company,
        sort,
      })
      .returning('*');
  }
}
