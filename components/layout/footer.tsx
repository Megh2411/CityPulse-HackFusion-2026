'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white py-8 sm:py-12 border-t border-muted">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4">CityPulse</h4>
              <p className="text-xs sm:text-sm text-orange-100">Real-time urban incident management platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-orange-100">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-orange-100">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-orange-100">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-orange-100">
            <p>&copy; {currentYear} CityPulse. All rights reserved.</p>
            <p>Transforming urban infrastructure management</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
