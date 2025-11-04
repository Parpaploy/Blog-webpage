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
  jwt?: string;
}

export interface INavbar {
  user: IUser | null;
}

export interface ICategory {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface IBlog {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
  author: IUser;
  categories: ICategory[];
}

export interface ISubscribeBlog {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  thumbnail: IStrapiImage;
  description: string;
  detail: any;
  author: IUser;
  categories: ICategory[];
  price: string;
}

export interface ICreateBlogParams {
  title: string;
  description: string;
  detail: any;
  authorId: number;
  categories: number[];
  thumbnail: File;
  token: string;
  endpoint?: string;
  price?: number;
}

export interface IUpdateBlogParams {
  title: string;
  description: string;
  detail: any;
  authorId: number;
  categories: number[];
  thumbnail?: File;
  token: string;
  endpoint?: string;
  price?: number;
}

export interface ICreateBlogResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface IUpdateBlogResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface IHighlight {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blogs: IBlog[];
  subscribe_blogs: ISubscribeBlog[];
}

export interface IBlogSetting {
  descriptionMaxLength: number;
}

export interface IMessage {
  id: string | number;
  text: string;
  author: IUser;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  recipient: IUser | null;
}
