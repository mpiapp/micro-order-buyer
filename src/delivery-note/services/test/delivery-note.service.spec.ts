import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DN } from './../../schemas/delivery-note.schema';
import { DeliveryNoteService } from '../delivery-note.service';
import { mockDeliveryNoteService } from './../../../../test/mocks/services/DN.mocks';
import { sampleDeliveryNote } from './../../../../test/mocks/sample/Delivery-Note/sample.mock';

describe('DeliveryNoteService', () => {
  let service: DeliveryNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNoteService,
        {
          provide: getModelToken(DN.name),
          useValue: mockDeliveryNoteService,
        },
      ],
    }).compile();

    service = module.get<DeliveryNoteService>(DeliveryNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create', async () => {
    expect(await service.create(sampleDeliveryNote)).toEqual(
      sampleDeliveryNote,
    );
  });

  it('should be get one delivery note ', async () => {
    expect(await service.getOne(expect.any(String))).toEqual(
      sampleDeliveryNote,
    );
  });

  it('should be get all delivery note ', async () => {
    expect(await service.getAll(expect.any(String))).toEqual([
      sampleDeliveryNote,
    ]);
  });

  it('should be get paginate delivery note ', async () => {
    expect(
      await service.getPaginate({
        vendorId: expect.any(String),
        skip: 0,
        limit: 10,
      }),
    ).toEqual([sampleDeliveryNote]);
  });

  it('should be count document', async () => {
    expect(await service.getCount('DN-001')).toEqual(1);
  });

  it('should be count document if = 0', async () => {
    mockDeliveryNoteService.find.mockReturnValue(0);
    expect(await service.getCount('DN-001')).toEqual(0);
  });

  it('should be update delivery note', async () => {
    expect(
      await service.update(expect.any(String), { awb: 'XXXXXXXXX' }),
    ).toEqual(sampleDeliveryNote);
  });

  it('should be delete delivery note', async () => {
    expect(await service.delete(expect.any(String))).toEqual(
      sampleDeliveryNote,
    );
  });
});
