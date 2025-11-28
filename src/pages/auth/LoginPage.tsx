import LoginForm from '@components/LoginForm';

const LoginPage = () => {
  return (
    <section className="card card-lg w-full max-w-sm bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-3xl">
          Witaj z powrotem!
        </h3>

        <p className="mb-4 text-base-content/60">
          Zaloguj się, aby kontynuować
        </p>

        <LoginForm />
      </div>
    </section>
  );
};

export default LoginPage;
