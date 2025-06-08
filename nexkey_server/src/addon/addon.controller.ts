import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddonService } from './addon.service';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';

@Controller('addons')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}

  @Post()
  create(@Body() createAddonDto: CreateAddonDto) {
    return this.addonService.create(createAddonDto);
  }

  @Get()
  findAll(@Query('enterpriseId') enterpriseId?: string) {
    if (enterpriseId) {
      return this.addonService.findByEnterprise(enterpriseId);
    }
    return this.addonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addonService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddonDto: UpdateAddonDto) {
    return this.addonService.update(id, updateAddonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addonService.remove(id);
  }
} 