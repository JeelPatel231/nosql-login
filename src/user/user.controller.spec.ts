import { UserController } from './user.controller';
import { MockUserService } from './user.service';
import { MockEmailService } from 'src/common/services/email/EmailService.mock';
import { MockHashService } from 'src/common/services/hash/HashService.mock';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    controller =  new UserController(
      MockUserService.get(),
      MockHashService.get(),
      MockEmailService.get(), 
    )
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
