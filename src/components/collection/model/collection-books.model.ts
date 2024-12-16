import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CollectionModel } from './collection.model';
import { BookModel } from '../../book/model/book.model';

@Table({
  tableName: 'Collection_Books',
})
export class CollectionBooksModel extends Model<CollectionBooksModel> {
  @ForeignKey(() => CollectionModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  collectionId: number;

  @ForeignKey(() => BookModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  bookId: number;
}
