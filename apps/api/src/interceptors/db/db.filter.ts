import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { PostgresError } from 'postgres';
import { getTraduction } from 'src/utils/traduction';

@Catch(PostgresError)
export class DBFilter<T extends PostgresError> {
  catch(exception: T, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    let message = 'Error en la base de datos';

    if (exception.code === '22001') message = 'Dato muy largo';
    if (exception.code === '23502') message = 'Falta un dato';
    if (exception.code === '23503') message = 'Opción invalida';
    if (exception.code === '23505')
      message =
        getTraduction(
          exception.constraint_name.split('_')[
            exception.constraint_name.split('_').length - 1
          ],
        ) + ' Repetido';
    if (exception.code === '22001') message = 'Valor muy largo';

    console.log(exception.message);
    console.log(exception.detail);

    response.status(HttpStatus.BAD_REQUEST).send({
      errors: exception,
      message: message,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
