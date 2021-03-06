import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PO, PODocument } from '../schemas/purchase-order.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class PurchaseOrderItemsService {
  constructor(@InjectModel(PO.name) readonly POmodel: Model<PODocument>) {}

  async changeQty(id: string, quantity: number): Promise<any> {
    return this.POmodel.findOneAndUpdate(
      {
        'vendors.packages.items._id': new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          'vendors.packages.items.$.quantity': quantity,
        },
      },
    );
  }
  async changePrice(id: string, price: number): Promise<any> {
    return this.POmodel.findOneAndUpdate(
      {
        'vendors.packages.items._id': new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          'vendors.packages.items.$.price': price,
        },
      },
    );
  }
  // async changeProduct(id: string, product: string): Promise<any>{
  //   return this.POmodel.findOneAndUpdate(
  //     {
  //       'vendors.packages.items._id': new mongoose.Types.ObjectId(id),
  //     },
  //     {
  //       $push: {
  //         'vendors.packages.items.$.statuses': {
  //           name: 'Rejected',
  //           timestamp: new Date(),
  //         },
  //       },
  //     },
  //   );
  // }
  async changeRejected(id: string): Promise<any> {
    console.log(
      await this.POmodel.findOneAndUpdate(
        {
          'vendors.packages.items._id': new mongoose.Types.ObjectId(id),
        },
        {
          $push: {
            'vendors.packages.items.$.statuses': {
              name: 'Rejected',
              timestamp: new Date(Date.now()),
            },
          },
        },
      ),
    );
    return this.POmodel.findOneAndUpdate(
      {
        'vendors.packages.items._id': new mongoose.Types.ObjectId(id),
      },
      {
        $push: {
          'vendors.packages.items.$.statuses': {
            name: 'Rejected',
            timestamp: new Date(Date.now()),
          },
        },
      },
    );
  }
}
