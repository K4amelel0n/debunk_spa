import type { AxiosError } from 'axios';
import { redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { toast } from 'react-toastify';
// import { createPost } from '@api/posts';

const addPostAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Odkomentować gdy backend będzie gotowy
    // await createPost({ title, content });
    console.log('Tworzenie posta:', { title, content });
    toast.success('Post został dodany');
    return redirect('/');
  } catch (error: AxiosError | any) {
    if (error.response && error.response.status === 400) {
      return {
        generalError: 'Nieprawidłowe dane posta.',
        status: 400,
      };
    }
  }
};

export default addPostAction;
