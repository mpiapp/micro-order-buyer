import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';
import { TemplateModule } from './template/template.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { PackageModule } from './package/package.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryNoteModule } from './delivery-note/delivery-note.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PurchaseRequestModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGOS_URI,
      }),
    }),
    TemplateModule,
    PurchaseOrderModule,
    PackageModule,
    OrdersModule,
    DeliveryNoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
