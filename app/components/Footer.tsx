import { Phone, Mail, MapPin, Shield, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const branches = [
    { name: 'Main Hospital', address: '123 Medical Center Drive' },
    { name: 'Downtown Clinic', address: '456 Health Street' },
    { name: 'Northside Center', address: '789 Wellness Avenue' },
    { name: 'Westend Facility', address: '101 Care Boulevard' },
  ];

  const quickLinks = [
    { label: 'Find a Doctor', href: '#' },
    { label: 'Services & Pricing', href: '#' },
    { label: 'Health Insurance', href: '#' },
    { label: 'Patient Resources', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'News & Blog', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">MediCare</div>
                <div className="text-sm font-medium text-emerald-600 -mt-1">Wellness Network</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Providing comprehensive healthcare services with compassion and excellence across multiple branches.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Emergency & Support</div>
                  <div className="text-gray-600">(123) 456-7890</div>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">General Inquiries</div>
                  <div className="text-gray-600">contact@medicare-wn.com</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Headquarters</div>
                  <div className="text-gray-600">123 Medical Plaza, Suite 500</div>
                </div>
              </div>
            </div>
          </div>

          {/* Branch Locations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Our Branches</h3>
            <div className="space-y-3">
              {branches.map((branch, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">{branch.name}</div>
                    <div className="text-sm text-gray-600">{branch.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm">
                Your medical data is protected with HIPAA-compliant security
              </span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} MediCare Wellness Network. All rights reserved.</p>
              <div className="flex space-x-6 mt-2">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;