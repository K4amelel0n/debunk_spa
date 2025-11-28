import { useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';

const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const generalError = fetcher.data?.generalError;
  const status = fetcher.data?.status;
  const isFetching = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.state === 'idle' && status === 401 && formRef.current) {
      formRef.current.reset();
      const emailInput = formRef.current.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      emailInput.focus();
    }
  }, [fetcher.state, status]);

  return (
    <fetcher.Form method="post" className="flex flex-col gap-4" ref={formRef}>
      {generalError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <fieldset className="fieldset" disabled={isFetching}>
        <label className="label">Adres email</label>
        <input
          name="email"
          type="email"
          className="input validator w-full"
          placeholder="Wprowadź adres email"
          required
        />
        <p className="validator-hint hidden">Wymagane</p>
      </fieldset>
      <fieldset className="fieldset" disabled={isFetching}>
        <label className="label">Hasło</label>
        <input
          name="password"
          type="password"
          className="input validator w-full"
          placeholder="Wprowadź hasło"
          required
        />
        <p className="validator-hint hidden">Wymagane</p>
      </fieldset>

      <button
        type="submit"
        className="btn btn-primary mt-4"
        disabled={isFetching}
      >
        {isFetching ? 'Logowanie...' : 'Zaloguj się'}
      </button>
    </fetcher.Form>
  );
};

export default LoginForm;
