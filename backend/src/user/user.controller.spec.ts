import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../src/model/user.model';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        // Mock UserModel
        {
          provide: 'UserModel',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user when given a valid id', async () => {
      const userId = '663420d9f7d6891f6d8e309b';
      // Mock user object
      const user: User = {
        _id: '663420d9f7d6891f6d8e309b', // Sample id
        name: 'Dupont Jean',
        email: 'jean.dupont@example.com',
        phone: '1234567890',
        role: 'admin',
        password: 'hashedPassword',
        resetPasswordToken: 'resetToken',
        resetPasswordExpires: new Date(),
      } as User;

      // Mock the service method to return the user
      jest.spyOn(service, 'getUserById').mockResolvedValue(user);

      const result = await controller.getUserById(userId);
      expect(result).toBeDefined();
      expect(result.id).toEqual(user.id); // Assert specific properties if needed
    });
  });

  describe('getAllUsersPageSearch', () => {
    it('should return an array of users based on search criteria', async () => {
      const page = 1;
      const pageSize = 10;
      const searchQuery = '';
      const searchCategory = 'all';
      const users: User[] = [
        /* Mock array of users */
      ];
      jest.spyOn(service, 'getAllUsersPageSearch').mockResolvedValue(users);

      const result = await controller.getAllUsersPageSearch(
        page,
        pageSize,
        searchQuery,
        searchCategory,
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBeTruthy(); // Ensure it's an array
    });
  });

  describe('getTotalUsersCount', () => {
    it('should return the total count of users based on search criteria', async () => {
      const searchQuery = '';
      const searchCategory = 'all';
      const totalCount = 10;
      jest.spyOn(service, 'getTotalUsersCount').mockResolvedValue(totalCount);

      const result = await controller.getTotalUsersCount(
        searchQuery,
        searchCategory,
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('number'); // Ensure it's a number
      expect(result).toBeGreaterThanOrEqual(0); // Ensure it's not negative
    });
  });
});
