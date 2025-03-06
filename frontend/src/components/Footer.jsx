export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold text-white">About Us</h2>
            <p className="mt-2 text-sm">
              Learn from the best courses and take your skills to the next level. 
              Our platform provides top-quality education for learners worldwide.
            </p>
          </div>
  
          {/* Quick Links */}
          <div className="">
            <h2 className="text-xl font-semibold text-white">Quick Links</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="hover:text-indigo-400">Courses</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">Contact Us</a>
              </li>
            </ul>
          </div>
  
          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold text-white">Follow Us</h2>
            <div className="mt-2 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="mt-6 text-center text-sm border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} YourCompany. All Rights Reserved.
        </div>
      </footer>
    );
  }
  