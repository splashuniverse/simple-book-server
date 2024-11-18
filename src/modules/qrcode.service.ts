import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class QrCodeService {
  // AES-128-ECB 암호화 방식을 사용하여 더 간단히 구현합니다.
  async generateQrCode(userId: number, reservationId: number): Promise<string> {
    // 1. 암호화할 데이터 생성
    const data = `${userId}:${reservationId}`;

    // 2. 암호화
    const cipher = crypto.createCipher(
      'aes-128-ecb',
      process.env.ENCRYPTION_KEY,
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // 3. 클라이언트가 사용할 URL 생성
    const qrCodeUrl = `https://6707-211-207-25-41.ngrok-free.app/static/qr.html?value=${encodeURIComponent(
      encrypted,
    )}`;

    return qrCodeUrl;
  }

  decryptQrCode(encryptedValue: string): {
    userId: number;
    reservationId: number;
  } {
    // 1. 복호화
    const decipher = crypto.createDecipher(
      'aes-128-ecb',
      process.env.ENCRYPTION_KEY,
    );
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // 2. 복호화된 데이터 파싱
    const [userId, reservationId] = decrypted.split(':').map(Number);
    return { userId, reservationId };
  }
}
