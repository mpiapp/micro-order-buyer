import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { IStatus } from '../interfaces/type/IStatus.interface';

export class StatusDto implements IStatus {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsDate()
  timestamp: Date;
}
