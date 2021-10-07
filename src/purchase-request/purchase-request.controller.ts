import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PRCreateDto } from './dto/CreatePR.dto';
import { PR } from './schemas/purchase-request.schema';
import { GenerateService } from './services/generate.service';
import { PurchaseRequestService } from './services/purchase-request.service';

@Controller('PurchaseRequest')
export class PurchaseRequestController {
  constructor(
    private readonly PRcreate: PurchaseRequestService,
    private readonly Generate: GenerateService,
  ) {}

  @MessagePattern('Purchase-Request-Create')
  async PRCreate(@Body() param: PRCreateDto): Promise<PR> {
    const generateCodePR = await this.Generate.generateCode({
      code: param.code,
    });
    param.code = generateCodePR.code;

    const initialValue = 0;
    const sum: number = param.items.reduce(function (total, currentValue) {
      // eslint-disable-next-line prettier/prettier
      return (currentValue.price * currentValue.quantity) + total;
    }, initialValue);

    if (sum !== param.total) {
      throw new Error('Sorry Total Price Wrong');
    }

    return this.PRcreate.createPurchaseRequest(param);
  }
}
