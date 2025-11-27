import { Form } from 'react-router';

const LoginForm = () => {
  return (
    <Form method="post">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="legend">Logowanie</legend>

        <label className="label">Adres email</label>

        <input
          type="email"
          name="email"
          className="input"
          required
          placeholder="Wprowadź adres email"
        />

        <label className="label">Hasło</label>
        <input
          type="password"
          name="password"
          className="input"
          required
          placeholder="Wprowadź hasło"
        />

        <button type="submit" className="btn btn-neutral mt-4">
          Zaloguj się
        </button>
      </fieldset>
    </Form>
  );
};

export default LoginForm;
