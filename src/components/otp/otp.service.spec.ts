import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { getModelToken } from '@nestjs/sequelize';
import { OTPModel } from './model/otp.model';
import { faker } from '@faker-js/faker/.';
import { BaseHelper } from '../../common/utils/helper.utils';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_CONSTANT } from '../../common/constants/error.constant';
import { Op } from 'sequelize';

describe('OtpService', () => {
  let service: OtpService;
  let mockOtpModel: any;

  const mockPayload = {
    userId: faker.number.int(),
    code: +faker.string.numeric({ length: { min: 6, max: 6 } }),
  };

  beforeEach(async () => {
    mockOtpModel = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: getModelToken(OTPModel), useValue: mockOtpModel },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create otp code', async () => {
    const mockData = {
      userId: faker.number.int(),
      code: +faker.string.numeric({ length: { min: 6, max: 6 } }),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isInvalid: faker.datatype.boolean,
    };

    jest.spyOn(BaseHelper, 'generateOTP').mockReturnValue(mockData.code);

    mockOtpModel.create.mockResolvedValue(mockData);

    const code = await service.createOtp(mockData.userId);

    expect(code).toEqual(mockData.code);
    expect(mockOtpModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockData.userId,
        code: mockData.code,
        isInvalid: false,
      }),
    );
  });

  it('should not create otp code if an error occurs', async () => {
    const mockUserId = faker.number.int();

    const mockError = new Error('Database connection error');
    mockOtpModel.create.mockRejectedValue(mockError);

    // Mock the console.error to suppress error logs during the test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(service.createOtp(mockUserId)).rejects.toThrow(
      new InternalServerErrorException(ERROR_CONSTANT.OTP.GENERATION_FAILED),
    );

    // Assert that console.error was called with the appropriate message
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error while generating OTP',
      mockError,
    );

    // Cleanup
    consoleSpy.mockRestore();
  });

  it('should successfully verify OTP', async () => {
    const mockOtpRecord = {
      userId: mockPayload.userId,
      code: mockPayload.code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isInvalid: false,
      save: jest.fn().mockResolvedValue(true),
    };

    mockOtpModel.findOne.mockResolvedValue(mockOtpRecord);

    await service.verifyOTP(mockPayload);

    expect(mockOtpModel.findOne).toHaveBeenCalledWith({
      where: {
        userId: mockPayload.userId,
        code: mockPayload.code,
        expiresAt: { [Op.gt]: expect.any(Date) },
        isInvalid: false,
      },
    });

    expect(mockOtpRecord.isInvalid).toBe(true);
    expect(mockOtpRecord.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if OTP is not found', async () => {
    mockOtpModel.findOne.mockResolvedValue(null);

    await expect(service.verifyOTP(mockPayload)).rejects.toThrow(
      new NotFoundException(ERROR_CONSTANT.OTP.INVALID),
    );

    expect(mockOtpModel.findOne).toHaveBeenCalledWith({
      where: {
        userId: mockPayload.userId,
        code: mockPayload.code,
        expiresAt: { [Op.gt]: expect.any(Date) },
        isInvalid: false,
      },
    });
  });
});
