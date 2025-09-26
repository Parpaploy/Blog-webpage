export interface IStrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    thumbnail?: { url: string; width: number; height: number };
  };
  url: string;
}

export interface IUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  profile: IStrapiImage;
}

export interface IBlog {
  id: number;
  documentId: string;
  publishedAt: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
  author: IUser;
}

export interface ISubscribeBlog {
  id: number;
  documentId: string;
  publishedAt: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
  author: IUser;
}
