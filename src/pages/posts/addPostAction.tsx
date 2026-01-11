import { redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { toast } from 'react-toastify';
import { addPost } from '@store/mockStore';

const addPostAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const tytul = formData.get('tytul') as string;
  const trescFakeNewsa = formData.get('trescFakeNewsa') as string;
  const wyjasnienie = formData.get('wyjasnienie') as string;
  const kategoriaId = formData.get('kategoriaId') as string;
  const imageUrl = formData.get('imageUrl') as string;

  const zrodla: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('zrodlo_') && value) {
      zrodla.push(value as string);
    }
  }

  const userStr = localStorage.getItem('debunk_current_user');
  const autor = userStr
    ? JSON.parse(userStr)
    : { id: 1, email: 'redaktor@debunk.pl', name: 'Jan Kowalski' };

  if (!tytul || !trescFakeNewsa || !wyjasnienie) {
    return {
      generalError: 'Wypełnij wszystkie wymagane pola.',
      status: 400,
    };
  }

  try {
    addPost({
      tytul,
      trescFakeNewsa,
      wyjasnienie,
      zrodla,
      kategoriaId: kategoriaId ? parseInt(kategoriaId) : undefined,
      imageUrl: imageUrl || undefined,
      autor,
    });

    toast.success('Post został dodany!');
    return redirect('/');
  } catch (error) {
    return {
      generalError: 'Wystąpił błąd podczas dodawania posta.',
      status: 500,
    };
  }
};

export default addPostAction;
