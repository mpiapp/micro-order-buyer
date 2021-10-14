import { sampleItem } from '../sample/Products/sample.item.mock';
import { SampleCreate } from '../sample/Purchase-Request/sample.data.create.mock';
import { SampleTemplateCreate } from '../sample/Template/Sample.mocks';

export const mockControllerPurchaseRequest = {
  findByIdAndUpdate: jest.fn().mockImplementation(() => {
    SampleCreate.items.push(sampleItem);
    return SampleCreate;
  }),
  updateOne: jest.fn().mockImplementation(() => {
    return {
      message: 'Update Success',
      status: true,
      id: expect.any(String),
    };
  }),
  create: jest.fn().mockImplementation((SampleCreate) => {
    return SampleCreate;
  }),
  findOne: jest.fn().mockImplementation(() => {
    return false;
  }),
  findById: jest.fn().mockReturnValue(SampleCreate),
  find: jest.fn().mockReturnValue([SampleCreate]),
};

export const mockControllerTemplate = {
  create: jest.fn().mockImplementation((dto) => {
    return dto;
  }),
  findByIdAndUpdate: jest.fn().mockImplementation(() => {
    return true;
  }),
  updateOne: jest.fn().mockImplementation(() => {
    return true;
  }),
  find: jest.fn().mockReturnValue([SampleTemplateCreate]),
  findById: jest.fn().mockReturnValue(SampleTemplateCreate),
};
