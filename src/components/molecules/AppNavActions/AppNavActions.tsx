
import { NavLink } from 'react-router';
const navLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Profile', to: '/profile' },
  { label: 'Todos', to: '/todos' },
];
const AppNavActions = () => {
  return (
    <ul className="hidden items-center gap-1 sm:flex">
      {navLinks.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default AppNavActions;
