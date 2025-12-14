import { api } from '@api';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/api/posts');
  return response.data;
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await api.post('/api/posts', data);
  return response.data;
};
