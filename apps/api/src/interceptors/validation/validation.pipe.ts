import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ZodPiPe implements PipeTransform {
  constructor(private readonly schema: any) {}
  transform(values: any) {
    if (!values) throw new HttpException('No se recibió ningún dato', 400);
    Object.keys(values).forEach((key) => {
      if (values[key] === '') values[key] = null;
    });

    const filteredValue = this.schema.parse(values);
    return filteredValue;
  }
}
