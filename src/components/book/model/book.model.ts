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
  Max,
  Min,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserModel } from '../../user/model/user.model';
import { CollectionBooksModel } from '../../collection/model/collection-books.model';
import { CollectionModel } from '../../collection/model/collection.model';

@Table({
  tableName: 'Books',
})
export class BookModel extends Model<BookModel> {
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
  title: string;

  @AllowNull(false)
  @Length({ min: 2, max: 400 })
  @Column(DataType.STRING)
  description: string;

  @AllowNull(false)
  @Min(1.0)
  @Max(5.0)
  @Column(DataType.DECIMAL({ precision: 1, scale: 1 }))
  rating: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  author: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  fileUrl: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  imageUrl: string;

  @AllowNull(false)
  @Min(1)
  @Column(DataType.INTEGER)
  pages: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  language: string;

  @AllowNull(false)
  @Min(1)
  @Column(DataType.INTEGER)
  pg: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  isbn13: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  publicationDate: Date;

  @AllowNull(false)
  @CreatedAt
  @Column(DataType.DATE)
  uploadedAt: Date;

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

  @BelongsToMany(() => CollectionModel, () => CollectionBooksModel)
  collections: CollectionModel[];
}
