import { Link } from 'react-router';

const AppLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="text-xl font-extrabold tracking-tight text-base-content">
        Debunk
      </span>
    </Link>
  );
};
export default AppLogo;
