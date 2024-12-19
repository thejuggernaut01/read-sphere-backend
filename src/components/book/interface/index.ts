interface ICreateBook {
  title: string;
  description: string;
  rating: number;
  author: string;
  fileUrl: string;
  imageUrl: string;
  pages: number;
  language: string;
  pg: number;
  isbn13: string;
  publicationDate: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IUpdateBook extends Partial<ICreateBook> {}

export { ICreateBook, IUpdateBook };
