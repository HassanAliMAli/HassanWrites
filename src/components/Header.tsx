import Link from 'next/link';

import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          HassanWrites
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="space-x-4">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
          </nav>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
