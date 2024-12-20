import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CollectionModel } from './model/collection.model';
import { UserModule } from '../user/user.module';
import { BookModel } from '../book/model/book.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CollectionModel, BookModel]),
    UserModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
