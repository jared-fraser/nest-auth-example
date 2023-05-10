import { NestFactory } from '@nestjs/core';
import { AppModule } from '@next-auth-example/app.module';
import { GraphQLErrorFilter } from '@next-auth-example/filters/graphql-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphQLErrorFilter());
  await app.listen(3005);
}
bootstrap();
