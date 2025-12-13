import { Link } from 'react-router';
import RegisterForm from '@components/RegisterForm';

const RegisterPage = () => {
  return (
    <section className="card card-lg w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-3xl">Utwórz konto</h3>

        <p className="mb-4 text-base-content/60">
          Zarejestruj się, aby rozpocząć
        </p>

        <RegisterForm />

        <p className="mt-4 text-sm text-base-content/60">
          Masz już konto?{' '}
          <Link to="/login" className="link link-primary">
            Zaloguj się
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
