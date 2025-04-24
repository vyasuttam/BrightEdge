export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h2 className="text-xl font-bold text-white">About Us</h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Learn from the best and take your skills to the next level. Our platform offers world-class education tailored for you.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-xl font-bold text-white">Quick Links</h2>
          <ul className="mt-3 space-y-2">
            {['Courses', 'Pricing', 'FAQs', 'Contact'].map(link => (
              <li key={link}>
                <a href="#" className="hover:text-indigo-400 transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-xl font-bold text-white">Follow Us</h2>
          <div className="mt-3 flex space-x-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((icon) => (
              <a key={icon} href="#" className="text-gray-400 hover:text-white text-xl">
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} BrightEdge. All rights reserved.
      </div>
    </footer>
  )
}
