import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { getTraduction } from 'src/utils/traduction';
import { ZodError } from 'zod';

@Catch(ZodError)
export class ValidationFilter<T extends ZodError> {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    let message = '';

    const getError = (err) => {
      if (err.code === 'too_big')
        return `Es muy grande, (máximo: ${err.maximum})`;

      if (err.code === 'too_small')
        return `Es muy corto, (mínimo: ${err.minimum})`;

      if (err.code === 'required') return 'Faltante';
      if (err.code === 'invalid_type' && err.received === 'null')
        return 'Faltante';
      if (err.code === 'invalid_type' && err.received === 'undefined')
        return 'Faltante';

      if (err.code === 'invalid_type')
        return `Dato incorrecto, se espera ${err.expected}`;
      if (err.message === 'Invalid email') return `invalido`;
      if (err.code === 'custom') return `No cumple con el formato adecuado`;
      console.log(err);
    };

    const bodyExists = !!exception.errors[0].path[0];
    message = `${getTraduction(exception.errors[0].path[0])} ${getError(exception.errors[0])}`;

    response.status(HttpStatus.BAD_REQUEST).send({
      errors: bodyExists ? exception.errors : 'No se ah mandado ningún dato',
      message: bodyExists ? message : 'No se ah mandado ningún dato',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
