import { Injectable } from '@nestjs/common';
import * as otpauth from 'otpauth';
import * as qrcode from 'qrcode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwoFactorAuthService {
  private APP_NAME: string;

  constructor(private configService: ConfigService) {
    this.APP_NAME = this.configService.get('APP_NAME');
  }
  
  // Generate a TOTP secret for the user
  async generateSecret(userEmail: string): Promise<any> {
    // Generate a cryptographically secure random secret.
    let secret = new otpauth.Secret({ size: 20 }).base32;
    // console.log('secret', secret);
    
    let totp = new otpauth.TOTP({
      // Provider or service the account is associated with.
      issuer: this.APP_NAME,
      // Account identifier.
      label: userEmail,
      // Algorithm used for the HMAC function, possible values are:
      //   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
      //   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
      algorithm: "SHA1",
      // Length of the generated tokens.
      digits: 6,
      // Interval of time for which a token is valid, in seconds.
      period: 30,
      // Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
      // (if omitted, a cryptographically secure random secret is generated).
      secret: otpauth.Secret.fromBase32(secret),
    });
    // console.log('totp', totp);

    let otpauthUrl = otpauth.URI.stringify(totp); //Alternative Implementation =>> totp.toString(); 
    // console.log('otpauthUrl', otpauthUrl);

    return {
      secret, // Save this in your database securely
      otpauthUrl, // URL to generate the QR code
    };
  }

  // Generate a QR code that can be scanned by Google Authenticator
  async generateQRCode(otpauthUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
        if (err) {
          reject(err);
        } else {
          resolve(dataUrl);  // Return QR code as a data URL
        }
      });
    });
  }

  // Verify the TOTP token entered by the user
  async verifyToken(secret: string, token: string): Promise<any> {
    let totp = new otpauth.TOTP({
      secret: otpauth.Secret.fromBase32(secret)
    });

    let returnValue = await totp.validate({
      token : token,
    });

    return returnValue == 0;
  }
}
