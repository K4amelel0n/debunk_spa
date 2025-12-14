import { useRouteLoaderData, Navigate } from 'react-router';
import AddPostForm from '@components/AddPostForm';

const AddPostPage = () => {
  const data = useRouteLoaderData('root');
  const isUser = data && data.role === 'user';

  if (!isUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex justify-center items-start py-8">
      <section className="card card-lg w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title justify-center text-3xl">
            Dodaj nowy post
          </h3>

          <p className="mb-4 text-base-content/60 text-center">
            Podziel się swoimi przemyśleniami
          </p>

          <AddPostForm />
        </div>
      </section>
    </div>
  );
};

export default AddPostPage;
