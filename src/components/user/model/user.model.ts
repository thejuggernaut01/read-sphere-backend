import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  Length,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Default,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { BookModel } from '../../book/model/book.model';

@Table({
  tableName: 'Users',
})
export class UserModel extends Model<UserModel> {
  @AutoIncrement
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Length({ min: 2, max: 50 })
  @Column(DataType.STRING)
  firstName: string;

  @AllowNull(false)
  @Length({ min: 2, max: 50 })
  @Column(DataType.STRING)
  lastName: string;

  @AllowNull(false)
  @Index({ unique: true })
  @Length({ min: 2, max: 50 })
  @Column(DataType.STRING)
  userName: string;

  @AllowNull(false)
  @Index({ unique: true })
  @Length({ max: 100 })
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @AllowNull(false)
  @Length({ min: 6, max: 100 })
  @Column(DataType.STRING)
  password: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  profilePictureUrl: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  coverImageUrl: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  termsAcceptedAt: Date;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  emailVerified: boolean;

  @AllowNull(true)
  @Column(DataType.STRING)
  refreshToken: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  resetPasswordToken: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  resetPasswordTokenExpiration: Date;

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

  @HasMany(() => BookModel)
  books: BookModel[];
}
