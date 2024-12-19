import { VISIBILITY } from '../../../common/enum/collection';

interface ICreateCollection {
  userId: number;
  name: string;
  description: string;
  visibility: VISIBILITY;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IUpdateCollection
  extends Partial<Omit<ICreateCollection, 'userId'>> {}

export { ICreateCollection, IUpdateCollection };
