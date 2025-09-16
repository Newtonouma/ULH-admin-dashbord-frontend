import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEvent = {
    id: 'uuid-string',
    title: 'Test Event',
    description: 'Test Description',
    date: '2024-03-20',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Test Location',
    imageUrls: ['test.jpg'],
    createdAt: new Date(),
    updatedAt: new Date(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      mockEventsService.findAll.mockResolvedValue([mockEvent]);
      const result = await controller.findAll();
      expect(result).toEqual([mockEvent]);
      expect(mockEventsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      mockEventsService.findOne.mockResolvedValue(mockEvent);
      const result = await controller.findOne('uuid-string');
      expect(result).toEqual(mockEvent);
      expect(mockEventsService.findOne).toHaveBeenCalledWith('uuid-string');
    });
  });

  describe('create', () => {
    it('should create and return a new event', async () => {
      const createDto: CreateEventDto = {
        title: 'New Event',
        description: 'Full New Description',
        date: '2024-03-21',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Test Location',
      };

      const mockFiles = [];

      mockEventsService.create.mockResolvedValue({ id: '1', ...createDto });
      const result = await controller.create(createDto, mockFiles);
      expect(result).toEqual({ id: '1', ...createDto });
      expect(mockEventsService.create).toHaveBeenCalledWith(
        createDto,
        mockFiles,
      );
    });
  });

  describe('update', () => {
    it('should update and return the event', async () => {
      const updateDto: UpdateEventDto = { title: 'Updated Title' };
      const updatedEvent = { ...mockEvent, ...updateDto };
      const mockFiles = [];

      mockEventsService.update.mockResolvedValue(updatedEvent);
      const result = await controller.update('1', updateDto, mockFiles);
      expect(result).toEqual(updatedEvent);
      expect(mockEventsService.update).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockFiles,
      );
    });
  });

  describe('remove', () => {
    it('should remove the event', async () => {
      mockEventsService.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(mockEventsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
