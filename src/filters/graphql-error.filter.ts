import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(Error)
export class GraphQLErrorFilter implements GqlExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    // @todo add logging here
    return exception;
  }
}
