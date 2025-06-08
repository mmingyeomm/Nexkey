import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addon } from './addon.entity';
import { AddonService } from './addon.service';
import { AddonController } from './addon.controller';
import { EnterpriseModule } from '../enterprise/enterprise.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Addon]),
    EnterpriseModule,
  ],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
