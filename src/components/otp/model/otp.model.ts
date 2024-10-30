import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  Index,
} from 'sequelize-typescript';
import { UserModel } from '../../../components/user/model/user.model';

@Table({
  tableName: 'UsersOtp',
})
export class OTPModel extends Model<OTPModel> {
  @ForeignKey(() => UserModel)
  @Column(DataType.STRING)
  userId: string;

  @Index
  @Column(DataType.INTEGER)
  code: number;

  @Column(DataType.DATE)
  expiresAt: Date;

  @Column(DataType.BOOLEAN)
  isInvalid: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
