const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
        <p>&copy; {new Date().getFullYear()} HassanWrites. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
