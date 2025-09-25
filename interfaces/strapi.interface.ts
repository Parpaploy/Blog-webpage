export interface IUser {
  email: string;
}

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
export interface IBlogs {
  id: number;
  documentId: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
}

export interface ISubscribeBlogs {
  id: number;
  documentId: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
}
