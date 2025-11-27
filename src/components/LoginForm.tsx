// src/components/auth/LoginForm.jsx (Lub src/pages/auth/LoginPage.jsx, jeśli chcesz zachować logikę w pages/)

import { Form } from 'react-router';

const LoginForm = () => {
  return (
    <Form method="post" className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Witaj z powrotem!</h3>
      <p className="mb-4 text-center text-gray-500">
        Zaloguj się, aby kontynuować
      </p>

      <label className="label">
        <span className="label-text">Adres email</span>
      </label>
      <input
        type="email"
        name="email"
        className="input input-bordered w-full"
        required
        placeholder="Wprowadź adres email"
      />

      <label className="label">
        <span className="label-text">Hasło</span>
      </label>
      <input
        type="password"
        name="password"
        className="input input-bordered w-full"
        required
        placeholder="Wprowadź hasło"
      />

      <button type="submit" className="btn btn-primary mt-4">
        Zaloguj się
      </button>
    </Form>
  );
};

export default LoginForm;
