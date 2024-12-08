import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { faker } from '@faker-js/faker/.';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UserService>;
  let mockMailService: Partial<MailService>;
  let mockOtpService: Partial<OtpService>;

  const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
    termsAcceptedAt: faker.date.future(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should successfully signup user', async () => {
    const createdUser = {
      id: faker.number.int(),
      ...userData,
      password: faker.internet.jwt({
        header: { alg: 'HS256' },
        payload: { iss: userData.password },
      }),
    };

    const otpCode = +faker.string.numeric({ length: { min: 6, max: 6 } });

    // jest.spyOn(mockUsersService, 'findUserByEmail').mockResolvedValue(null);
    // jest.spyOn(mockOtpService, 'createOtp').mockResolvedValue(otpCode);
    // jest.spyOn(BaseHelper, 'hashData').mockResolvedValue(
    //   faker.internet.jwt({
    //     header: { alg: 'HS256' },
    //     payload: { iss: userData.password },
    //   }),
    // );
    // jest.spyOn(mockMailService, 'sendVerificationEmail').mockResolvedValue({
    //   message: 'Email sent successfully',
    //   statusCode: 200,
    //   data: {
    //     ref: 'swsw',
    //   },
    // });

    await authService.signup(userData);

    expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
      userData.email,
    );
    expect(mockOtpService.createOtp).toHaveBeenCalledWith(createdUser.id);
    expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
      'Verify your email',
      otpCode,
      {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    );
  });
});
