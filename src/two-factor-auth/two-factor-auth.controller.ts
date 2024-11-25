import { Controller, Post, Body } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import GenerateQRCodeAuthUseCase from './usecases/generate-qrcode-auth.usecase';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(private twoFactorAuthService: TwoFactorAuthService,
                private generateQRCodeAuthUseCase: GenerateQRCodeAuthUseCase
  ) {}

  // Endpoint to generate the 2FA secret and QR code
  @Post('generate')
  async generate(@Body('email') email: string) {
    return this.generateQRCodeAuthUseCase.generate(email);
  }

  // Endpoint to verify the TOTP token entered by the user
  @Post('verify')
  async verify(@Body('secret') secret: string, @Body('token') token: string) {
    const isValid =  await this.twoFactorAuthService.verifyToken(secret, token);

    if (isValid) {
      return { message: '2FA token is valid' };
    } else {
      return { message: 'Invalid token' };
    }
  }
}
