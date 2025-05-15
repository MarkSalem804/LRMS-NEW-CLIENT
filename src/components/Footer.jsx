/* eslint-disable no-unused-vars */
import {
  FaHeart,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              About ILeaRN
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Schools Division Office of Imus City Learning Resource Management
              System (LRMS) Portal named I LeaRN (Imus Learning Resources
              Navigator) supports effective implementation of the Learning
              Resource Management and Development System (LRMDS) to improve
              access to learning, teaching, and professional development
              resources by schools. It is a web-based repository of available
              learning materials in electronic copies, developed and quality
              assured in the National level, Regional level, and Division level.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Offices
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      Central Office
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      Region 4A - CALABARZON
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      Imus City
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      LRMDS Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      LMS Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      Commons
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block w-full"
                    >
                      ETUlay
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaPhone
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Telephone
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    (046) 471-4837
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    sdo.imus.city@deped.gov.ph
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Address
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Schools Division Office of Imus City
                    <br />
                    Imus City, Cavite
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Need Help?
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <FaTicketAlt
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
                <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                  Submit a Ticket
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Having issues or need assistance? Submit a ticket and our
                support team will help you.
              </p>
              <a
                href="https://ticketing.depedimuscity.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
              >
                Submit Ticket Now
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">
          <p>
            © April {currentYear} SDOIC - Imus Learning Resource Management
            System. All rights reserved. Made with{" "}
            <FaHeart className="inline text-error-500" /> by ICTS - Unit and
            proposed by LR Unit.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
