
import { Injectable, Logger } from '@nestjs/common';
import { TwoFactorAuthService }  from '../two-factor-auth.service';

@Injectable()
export default class GenerateQRCodeAuthUseCase {
constructor(
    private twoFactorAuthService: TwoFactorAuthService,
) {}
  async generate(email: string): Promise<any> {
    let returnValue : any = {
        secret : '',
        qrCodeUrl : '',
    };

    let generateSecretResult = await this.twoFactorAuthService.generateSecret(email);
    console.log('generateSecretResult', generateSecretResult);

    // Save "generateSecretResult.secret" to DB.
    // Temporary return

    let qrCodeDataUrl = await this.twoFactorAuthService.generateQRCode(generateSecretResult.otpauthUrl);

    // Save "qrCodeDataUrl" to DB paired with "generateSecretResult.secret".

    returnValue.secret = generateSecretResult.secret;
    returnValue.qrCodeUrl = qrCodeDataUrl;

    return returnValue;
  }
}
