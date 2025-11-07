const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Subscribe to my newsletter</h3>
          {/* <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"> */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-md">Subscribe</button>
          {/* </form> */}
        </div>
        <p>&copy; {new Date().getFullYear()} HassanWrites. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
