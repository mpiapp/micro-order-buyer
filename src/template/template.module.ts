import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './../config/configuration';
import { Template, TemplateSchema } from './schemas/template.schema';
import { TemplateItemsService } from './services/template-items.service';
import { TemplateService } from './services/template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [TemplateService, TemplateItemsService],
  controllers: [TemplateController],
})
export class TemplateModule {}
