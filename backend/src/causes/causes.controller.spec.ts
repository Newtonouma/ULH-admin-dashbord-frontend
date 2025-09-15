import { Test, TestingModule } from '@nestjs/testing';
import { CausesController } from './causes.controller';
import { CausesService } from './causes.service';

describe('CausesController', () => {
  let controller: CausesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CausesController],
      providers: [
        {
          provide: CausesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CausesController>(CausesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
