import { Template } from '../../schemas/template.schema';
import { TemplateCreateDto } from '../../dto/CreateTemplate.dto';

export interface ICreateTemplate {
  createTemplate(param: TemplateCreateDto): Promise<Template>;
}
