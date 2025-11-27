import { Form } from 'react-router';

const LoginForm = () => {
  return (
    <Form method="post" className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Witaj z powrotem!</h3>
      <p className="mb-4 text-center text-gray-500">
        Zaloguj się, aby kontynuować
      </p>

      <fieldset className="fieldset">
        <label className="label">Adres email</label>
        <input
          type="email"
          className="input validator w-full"
          placeholder="Wprowadź adres email"
          required
        />
        <p className="validator-hint hidden">Wymagane</p>
      </fieldset>
      <fieldset className="fieldset">
        <label className="label">Hasło</label>
        <input
          type="password"
          className="input validator w-full"
          placeholder="Wprowadź hasło"
          required
        />
        <p className="validator-hint hidden">Wymagane</p>
      </fieldset>

      <button type="submit" className="btn btn-primary mt-4">
        Zaloguj się
      </button>
    </Form>
  );
};

export default LoginForm;
