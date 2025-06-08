import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { AddonModule } from './addon/addon.module';
import { Enterprise } from './enterprise/enterprise.entity';
import { Addon } from './addon/addon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres.fupdthzksrvnplnnojvd:rootroot@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
      entities: [Enterprise, Addon],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false, // For Supabase connection
      },
    }),
    EnterpriseModule,
    AddonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
