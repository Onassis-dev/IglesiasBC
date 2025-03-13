import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import sharp from 'sharp';
import { map } from 'rxjs/operators';

@Injectable()
export class ImageHandler implements NestInterceptor {
  constructor(
    private readonly imgSize: number,
    private readonly quality: number = 80,
    private readonly transparent: boolean = false,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest();
      const file = request.file;

      if (!file)
        return next.handle().pipe(
          map((data) => {
            return data;
          }),
        );

      let compressedBuffer;

      if (this.transparent && file.mimetype === 'image/png') {
        compressedBuffer = await sharp(file.buffer)
          .resize(this.imgSize)
          .png({ quality: this.quality })
          .toBuffer();
      } else {
        compressedBuffer = await sharp(file.buffer)
          .resize(this.imgSize)
          .jpeg({ quality: this.quality })
          .toBuffer();
      }

      file.buffer = compressedBuffer;
      file.size = compressedBuffer.length;

      return next.handle().pipe(
        map((data) => {
          return data;
        }),
      );
    } catch (err) {
      throw new HttpException('Error al procesar la imagen', 400);
    }
  }
}
