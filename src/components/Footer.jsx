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
import BagongPilipinasLogo from "../assets/Bagong-Pilipinas-Logo.png";
import LogoDepEd1 from "../assets/Logo-DepEd-1.png";
import DepedLogo from "../assets/deped_logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black shadow-inner py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="text-base font-semibold text-white mb-2">
              About ILeaRN
            </h3>
            <p className="text-white mb-2">
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
            <h3 className="text-base font-semibold text-white mb-2">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <h4 className="text-xs font-medium text-white mb-1">Offices</h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="https://www.deped.gov.ph/"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      Central Office
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://depedcalabarzon.ph/"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      Region 4A - CALABARZON
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://depedimuscity.com/"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      Imus City
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-medium text-white mb-1">
                  Resources
                </h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="https://lrmds.deped.gov.ph/"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      LRMDS Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://lms.deped.gov.ph/"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      LMS Portal
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/c/depedetulay"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      ETulay
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://training.deped.gov.ph/course/index.php?categoryid=49"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      Commons
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white hover:text-primary-400 transition-colors block w-full"
                    >
                      ETUlay
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <FaPhone
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-white">Telephone</p>
                  <p className="text-white">(046) 471-4837</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-white">sdo.imus.city@deped.gov.ph</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt
                  className="text-primary-600 dark:text-primary-400 mt-1"
                  size={16}
                />
                <div>
                  <p className="text-sm font-medium text-white">Address</p>
                  <p className="text-white">
                    Schools Division Office of Imus City
                    <br />
                    Imus City, Cavite
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">
              Got Feedbacks or Suggestions?
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {/* <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-lg font-medium text-black">
                  Provide your ides here by clicking the button.
                </h4>
              </div> */}
              <p className="text-black mb-2">
                Provide your ides here by clicking the button.
              </p>
              <a
                href="https://ticketing.depedimuscity.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-xs"
              >
                Proceed
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4 mb-2 md:mb-0">
            <img
              src={BagongPilipinasLogo}
              alt="Bagong Pilipinas Logo"
              className="h-10 w-auto"
            />
            <img src={LogoDepEd1} alt="DepEd Logo 1" className="h-10 w-auto" />
            <img src={DepedLogo} alt="DepEd Logo" className="h-10 w-auto" />
          </div>
          <p className="text-center md:text-right w-full md:w-auto">
            © April {currentYear} SDOIC - Imus Learning Resource Management
            System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
