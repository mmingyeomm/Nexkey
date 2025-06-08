import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enterprise } from './enterprise.entity';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private enterpriseRepository: Repository<Enterprise>,
  ) {}

  async create(createEnterpriseDto: CreateEnterpriseDto): Promise<Enterprise> {
    const enterprise = this.enterpriseRepository.create(createEnterpriseDto);
    return await this.enterpriseRepository.save(enterprise);
  }

  async findAll(): Promise<Enterprise[]> {
    return await this.enterpriseRepository.find({
      relations: ['addons'],
    });
  }

  async findOne(id: string): Promise<Enterprise> {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id },
      relations: ['addons'],
    });

    if (!enterprise) {
      throw new NotFoundException(`Enterprise with ID ${id} not found`);
    }

    return enterprise;
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto): Promise<Enterprise> {
    const enterprise = await this.findOne(id);
    Object.assign(enterprise, updateEnterpriseDto);
    return await this.enterpriseRepository.save(enterprise);
  }

  async remove(id: string): Promise<void> {
    const enterprise = await this.findOne(id);
    await this.enterpriseRepository.remove(enterprise);
  }
} 