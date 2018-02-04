import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './nestjs_module';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	await app.listen(8080);
}
bootstrap();