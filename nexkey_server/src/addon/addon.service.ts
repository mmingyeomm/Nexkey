import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addon } from './addon.entity';
import { Enterprise } from '../enterprise/enterprise.entity';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';

@Injectable()
export class AddonService {
  constructor(
    @InjectRepository(Addon)
    private addonRepository: Repository<Addon>,
    @InjectRepository(Enterprise)
    private enterpriseRepository: Repository<Enterprise>,
  ) {}

  async create(createAddonDto: CreateAddonDto): Promise<Addon> {
    // Verify that the enterprise exists
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: createAddonDto.enterpriseId },
    });

    if (!enterprise) {
      throw new NotFoundException(`Enterprise with ID ${createAddonDto.enterpriseId} not found`);
    }

    const addon = this.addonRepository.create({
      ...createAddonDto,
      startingTime: new Date(createAddonDto.startingTime),
    });
    return await this.addonRepository.save(addon);
  }

  async findAll(): Promise<Addon[]> {
    return await this.addonRepository.find({
      relations: ['enterprise'],
    });
  }

  async findOne(id: string): Promise<Addon> {
    const addon = await this.addonRepository.findOne({
      where: { id },
      relations: ['enterprise'],
    });

    if (!addon) {
      throw new NotFoundException(`Addon with ID ${id} not found`);
    }

    return addon;
  }

  async findByEnterprise(enterpriseId: string): Promise<Addon[]> {
    return await this.addonRepository.find({
      where: { enterpriseId },
      relations: ['enterprise'],
    });
  }

  async update(id: string, updateAddonDto: UpdateAddonDto): Promise<Addon> {
    const addon = await this.findOne(id);

    // If updating enterpriseId, verify the new enterprise exists
    if (updateAddonDto.enterpriseId) {
      const enterprise = await this.enterpriseRepository.findOne({
        where: { id: updateAddonDto.enterpriseId },
      });

      if (!enterprise) {
        throw new NotFoundException(`Enterprise with ID ${updateAddonDto.enterpriseId} not found`);
      }
    }

    const updateData = {
      ...updateAddonDto,
      ...(updateAddonDto.startingTime && { startingTime: new Date(updateAddonDto.startingTime) }),
    };

    Object.assign(addon, updateData);
    return await this.addonRepository.save(addon);
  }

  async remove(id: string): Promise<void> {
    const addon = await this.findOne(id);
    await this.addonRepository.remove(addon);
  }
} 