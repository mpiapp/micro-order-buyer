import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from './../config/interfaces/response.base.interface';
import { TemplateCreateDto } from './dto/CreateTemplate.dto';
import { ItemTemplateDto } from './dto/ItemTemplate.dto';
import { ITemplateCreateAndUpdateResponse } from './interfaces/response/CreateAndUpdate.interface';
import { ITemplateSearchAndListResponse } from './interfaces/response/SearchAndList.interface';
import { TemplateItemsService } from './services/template-items.service';
import { TemplateService } from './services/template.service';

@ApiTags('Template Purchase Request')
@Controller('template')
export class TemplateController {
  constructor(
    private readonly Items: TemplateItemsService,
    private readonly TemplateMaster: TemplateService,
    private readonly Config: ConfigService,
  ) {}

  @Post()
  @ApiBody({ type: TemplateCreateDto })
  @ApiOperation({ summary: 'Create Master Template' })
  @MessagePattern('Template-Create')
  async TemplateCreate(
    @Body() params: TemplateCreateDto,
  ): Promise<ITemplateCreateAndUpdateResponse> {
    try {
      const save = await this.TemplateMaster.createTemplate(params);
      return {
        status: HttpStatus.CREATED,
        message: this.Config.get<string>('messageBase.TemplateCreate.Success'),
        data: save,
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.TemplateCreate.Failed'),
        data: null,
        errors: error,
      };
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Delete Master Template' })
  @MessagePattern('Template-Update')
  async TemplateDelete(@Param('id') id: string): Promise<BaseResponse> {
    try {
      await this.TemplateMaster.deleteTemplate(id);
      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.TemplateDelete.Success'),
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.TemplateDelete.Failed'),
        errors: error,
      };
    }
  }

  @Put('addItem')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: ItemTemplateDto })
  @ApiOperation({ summary: 'Add Item Template' })
  @MessagePattern('Template-Add-Item')
  async TemplateAddItem(
    @Query('id') id: string,
    @Body() product: ItemTemplateDto,
  ): Promise<BaseResponse> {
    const addQty = await this.Items.addItem(
      {
        $and: [
          {
            _id: new mongoose.Types.ObjectId(id),
            'items.productId': product.productId,
          },
        ],
      },
      { $inc: { 'items.$.quantity': product.quantity } },
    );
    if (!addQty.matchedCount) {
      await this.Items.addItem({ _id: id }, { $push: { items: product } });
      return {
        status: HttpStatus.CREATED,
        message: this.Config.get<string>('messageBase.addItem.Success'),
        errors: null,
      };
    }

    return {
      status: HttpStatus.CREATED,
      message: this.Config.get<string>('messageBase.addItem.Success'),
      errors: null,
    };
  }

  @Put('updateItem')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: ItemTemplateDto })
  @ApiOperation({ summary: 'Update Item Template' })
  @MessagePattern('Template-Update-Item')
  async TemplateUpdateItem(
    @Query('id') id: string,
    @Body() product: ItemTemplateDto,
  ): Promise<BaseResponse> {
    try {
      await this.Items.addItem(
        {
          $and: [
            {
              _id: new mongoose.Types.ObjectId(id),
              'items.productId': product.productId,
            },
          ],
        },
        { $inc: { 'items.$.quantity': product.quantity } },
      );

      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.updateQty.Success'),
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.updateQty.Failed'),
        errors: error,
      };
    }
  }

  @Put('deleteItem')
  @ApiQuery({ name: 'id', type: String })
  @ApiBody({ type: ItemTemplateDto })
  @ApiOperation({ summary: 'Update Item Template' })
  @MessagePattern('Template-Remove-Item')
  async TemplateRemoveItem(
    @Query('id') id: string,
    @Body() product: ItemTemplateDto,
  ): Promise<BaseResponse> {
    try {
      await this.Items.removeItem(
        { _id: new mongoose.Types.ObjectId(id) },
        { $pull: { items: { productId: product.productId } } },
      );

      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.removeItem.Success'),
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.removeItem.Failed'),
        errors: error,
      };
    }
  }

  @Get('list')
  @ApiQuery({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'List Template PR' })
  @MessagePattern('Template-List-Data')
  async TemplateGetList(
    @Query('id') id: string,
  ): Promise<ITemplateSearchAndListResponse> {
    try {
      const getAll = await this.TemplateMaster.listTemplate(id);
      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.TemplateGetAll.Success'),
        data: getAll,
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.TemplateGetAll.Failed'),
        data: null,
        errors: error,
      };
    }
  }

  @Get('byId')
  @ApiQuery({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'Get Master Template By Id' })
  @MessagePattern('Template-Get-Data-By-Id')
  async TemplateGetById(
    @Query('id') id: string,
  ): Promise<ITemplateCreateAndUpdateResponse> {
    try {
      const getById = await this.TemplateMaster.getByIdTemplate(id);
      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.TemplateGetOne.Success'),
        data: getById,
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.TemplateGetOne.Failed'),
        data: null,
        errors: error,
      };
    }
  }

  @Get('search')
  @ApiQuery({ name: 'search', type: 'string' })
  @ApiOperation({ summary: 'Search Master Template PR By Date' })
  @MessagePattern('Template-Search-Data')
  async TemplateSearch(
    @Query('search') _search: string,
  ): Promise<ITemplateSearchAndListResponse> {
    try {
      const search = await this.TemplateMaster.searchTemplate(_search);
      return {
        status: HttpStatus.OK,
        message: this.Config.get<string>('messageBase.TemplateSearch.Success'),
        data: search,
        errors: null,
      };
    } catch (error) {
      return {
        status: HttpStatus.PRECONDITION_FAILED,
        message: this.Config.get<string>('messageBase.TemplateSearch.Failed'),
        data: null,
        errors: error,
      };
    }
  }
}
