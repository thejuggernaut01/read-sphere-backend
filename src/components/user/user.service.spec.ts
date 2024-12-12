import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { faker } from '@faker-js/faker/.';
import { UserModel } from './model/user.model';
import { getModelToken } from '@nestjs/sequelize';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';
import { Op } from 'sequelize';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    userName: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
    termsAcceptedAt: faker.date.future(),
  };

  beforeEach(async () => {
    mockUserModel = {
      sequelize: {
        transaction: jest.fn().mockResolvedValue(mockTransaction),
      },
      build: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({
          id: faker.database.mongodbObjectId(),
          ...dto,
        }),
      })),
      findOne: jest.fn(),
      findByPk: jest.fn().mockImplementation((id) => ({
        id,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(UserModel), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    const user = await service.createUser(userData);

    expect(user).toBeDefined();
    expect(mockUserModel.build).toHaveBeenCalledWith(userData);
    expect(mockTransaction.commit).toHaveBeenCalled();
    expect(user).toEqual(expect.objectContaining(userData));
  });

  it('should not create user and rollback the transaction on error', async () => {
    mockUserModel.build.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    await expect(service.createUser(userData)).rejects.toThrow(
      new InternalServerErrorException(ERROR_CONSTANT.AUTH.REGISTER_FAILED),
    );

    expect(mockTransaction.rollback).toHaveBeenCalled();
  });

  it('should find a user by ID', async () => {
    const user = await service.createUser(userData);

    mockUserModel.findByPk.mockResolvedValue({
      id: user.id,
      ...userData,
    });

    const foundUser = await service.findUserById(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual({
      id: user.id,
      ...userData,
    });

    expect(mockUserModel.findByPk).toHaveBeenCalledWith(user.id);
  });

  it('should find a user by email', async () => {
    const email = faker.internet.email();
    const mockUser = {
      id: faker.database.mongodbObjectId(),
      ...userData,
    };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const foundUser = await service.findUserByEmail(email);

    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual(mockUser);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it('should return null if no user is found by email', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    const email = userData.email;
    const foundUser = await service.findUserByEmail(email);
    expect(foundUser).toBeNull();
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email } });
  });

  it('should throw an error if findOne fails', async () => {
    mockUserModel.findOne.mockRejectedValue(new Error('Database error'));
    const email = userData.email;
    await expect(service.findUserByEmail(email)).rejects.toThrow(
      'Database error',
    );
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email } });
  });

  it('should update user reset token and expiration', async () => {
    const token = faker.string.alphanumeric(20);
    const password = userData.password;
    const mockUser = {
      resetPasswordToken: token,
      resetPasswordTokenExpiration: new Date(Date.now() + 3600000),
      update: jest.fn(),
    };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const updatedUser = await service.findAndUpdateUserByResetToken(
      token,
      password,
    );

    expect(updatedUser).toBeDefined();
    expect(updatedUser).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiration: {
          [Op.gt]: expect.any(Date),
        },
      },
    });
    expect(mockUser.update).toHaveBeenCalledWith({
      resetPasswordToken: null,
      resetPasswordTokenExpiration: null,
      password: password,
    });
  });

  it('should throw NotFoundException if user is not found', async () => {
    const token = faker.string.alphanumeric(20);
    const password = userData.password;
    mockUserModel.findOne.mockResolvedValue(null);

    await expect(
      service.findAndUpdateUserByResetToken(token, password),
    ).rejects.toThrow(new NotFoundException(ERROR_CONSTANT.GENERAL.TOKEN));

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiration: {
          [Op.gt]: expect.any(Date),
        },
      },
    });
  });

  it('should update user refresh token', async () => {
    const email = userData.email;
    const token = faker.string.alphanumeric(20);

    const mockUser = {
      ...userData,
      email,
      update: jest.fn(),
    };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    const foundUser = await service.updateUserRefreshToken(email, token);

    expect(foundUser).toBeDefined();
    expect(foundUser).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: { email },
    });
    expect(mockUser.update).toHaveBeenCalledWith({
      refreshToken: token,
    });
  });

  it('should throw NotFoundException if user is not found', async () => {
    const email = userData.email;
    const token = faker.string.alphanumeric(20);
    mockUserModel.findOne.mockResolvedValue(null);

    await expect(service.updateUserRefreshToken(email, token)).rejects.toThrow(
      new NotFoundException(ERROR_CONSTANT.AUTH.USER_DOES_NOT_EXIST),
    );

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it('should delete user', async () => {
    const email = userData.email;

    const mockUser = {
      ...userData,
      email,
      destroy: jest.fn(),
    };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    await service.deleteUser(email);

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      where: { email },
    });

    expect(mockUser.destroy).toHaveBeenCalled();
  });
});
