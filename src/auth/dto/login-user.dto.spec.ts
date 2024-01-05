import { LoginUserDto } from './login-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

async function getErrors<T>(dto: any, plain: Partial<T>): Promise<Partial<Record<keyof T, any>>> {
  const errors = await validate(plainToInstance(dto, plain))
  return Object.fromEntries(errors.map(
    (error) => [error.property, error.constraints])
    ) as any
}

describe('Login User Dto', () => {
  describe('Validations', () => {

    it(`Should not throw on correct objects`, async () => {
      const testCase = { email: "email@email.com", password: "testpassword" }
      const errors = await getErrors<LoginUserDto>(LoginUserDto, testCase)
      expect(errors.email).toBeUndefined()
      expect(errors.password).toBeUndefined()
    });


    it(`Should validate undefined Email`, async () => {
      const testCase = { password: "testpassword" }
      const errors = await getErrors<LoginUserDto>(LoginUserDto, testCase)
      expect(errors.email?.['isEmail']).toBe('email must be an email');
      expect(errors.password).toBeUndefined()
    });


    it(`Should validate Email Correctly`, async () => {
      const testCase = { email: "invalidemail", password: "testpassword" }
      const errors = await getErrors<LoginUserDto>(LoginUserDto, testCase)
      expect(errors.email?.['isEmail']).toBe('email must be an email');
      expect(errors.password).toBeUndefined()
    });

    it(`Should Validate password minlength`, async () => {
      const testCase = { email: "invalidemail@email.com", password: "j" }
      const errors = await getErrors<LoginUserDto>(LoginUserDto, testCase)
      expect(errors.password?.['minLength']).toBe('password must be longer than or equal to 8 characters');
      expect(errors.email).toBeUndefined()
    });
  });

  describe('Trasformation', () => {
    it(`Should Trim whitespaces`, async () => {
      const testCase = { 
        email: "invalidemail@email.com",
        password: "   testpassword    "
      }

      const final = plainToInstance(LoginUserDto, testCase)
      expect(final.password).toBe(testCase.password.trim())
    });
  });
});
