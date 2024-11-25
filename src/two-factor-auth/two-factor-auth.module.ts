import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import GenerateQRCodeAuthUseCase from './usecases/generate-qrcode-auth.usecase';

@Module({
  imports: [],
  controllers: [TwoFactorAuthController],
  providers: [
        TwoFactorAuthService,
        GenerateQRCodeAuthUseCase
    ],
})
export class TwoFactorAuthModule {}
