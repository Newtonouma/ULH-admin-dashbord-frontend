import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    shortDescription: 'Test Description',
    category: 'Test Category',
    description: 'Full Test Description',
    imageUrl: 'test.jpg',
    time: '10:00',
    date: '2024-03-20',
  };

  const mockEventsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of events', async () => {
      mockEventsService.findAll.mockResolvedValue([mockEvent]);
      const result = await controller.getAll();
      expect(result).toEqual([mockEvent]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a single event', async () => {
      mockEventsService.findOne.mockResolvedValue(mockEvent);
      const result = await controller.getOne(1);
      expect(result).toEqual(mockEvent);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new event', async () => {
      const createDto: CreateEventDto = {
        title: 'New Event',
        shortDescription: 'New Description',
        category: 'New Category',
        description: 'Full New Description',
        imageUrl: 'new.jpg',
        time: '11:00',
        date: '2024-03-21',
      };

      mockEventsService.create.mockResolvedValue({ id: 1, ...createDto });
      const result = await controller.create(createDto);
      expect(result).toEqual({ id: 1, ...createDto });
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the event', async () => {
      const updateDto: UpdateEventDto = { title: 'Updated Title' };
      const updatedEvent = { ...mockEvent, ...updateDto };

      mockEventsService.update.mockResolvedValue(updatedEvent);
      const result = await controller.update(1, updateDto);
      expect(result).toEqual(updatedEvent);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the event', async () => {
      mockEventsService.remove.mockResolvedValue(undefined);
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
