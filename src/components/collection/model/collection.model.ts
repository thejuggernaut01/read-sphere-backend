import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Index,
  Length,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserModel } from '../../user/model/user.model';
import { VISIBILITY } from '../../../common/enum/collection';
import { BookModel } from '../../book/model/book.model';
import { CollectionBooksModel } from './collection-books.model';

@Table({
  tableName: 'Collections',
})
export class CollectionModel extends Model<CollectionModel> {
  @AutoIncrement
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Index({ unique: true })
  @Length({ min: 2, max: 100 })
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Length({ min: 2, max: 200 })
  @Column(DataType.STRING)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('public', 'private'),
    defaultValue: VISIBILITY.PRIVATE,
  })
  visibility: VISIBILITY;

  @AllowNull(false)
  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;

  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;

  @BelongsToMany(() => BookModel, () => CollectionBooksModel)
  books: BookModel[];
}
