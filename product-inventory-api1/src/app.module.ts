import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products/entity/product.entity.js';

@Module({
  imports: [ProductsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'myProducts1',
      autoLoadEntities: true,
      //entities: [Products],
      synchronize: true,
    }),


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
