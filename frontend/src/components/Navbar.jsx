import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const anchors = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState('home');

  const handleAnchorClick = (id) => () => setActiveId(id);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Advestore
        </Link>

        {/* Left‑side anchors */}
        <ul className="flex space-x-4">
          {anchors.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={handleAnchorClick(id)}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                  activeId === id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right‑side Sign In */}
        <NavLink
          to="/signin"
          className="rounded px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Sign In
        </NavLink>
      </div>
    </nav>
  );
}
