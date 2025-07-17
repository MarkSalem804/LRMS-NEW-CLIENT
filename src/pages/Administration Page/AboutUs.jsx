/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserTie, FaUsers } from "react-icons/fa";
import sdsHomer from "../../assets/SDS Homer N. Mendoza.jpg";
import marcianoValle from "../../assets/Marciano_V._Valles-removebg-preview.png";
import glendaCatadman from "../../assets/Glenda_DS._Catadman-removebg-preview.png";

// Import proponent images
import darlferhenImage from "../../assets/Darlferhen M. Dancel.jpg";
import floridelImage from "../../assets/FLORIDEL PESITO.png";
import redenImage from "../../assets/Reden_M._Cruzado-removebg-preview.png";
import felizImage from "../../assets/Feliz_A._Tayao-removebg-preview.png";

import markImage from "../../assets/Mark Joseph V. Salem.png";
import matthewImage from "../../assets/Matthew Lewis E. Romero.png";
import juneImage from "../../assets/June_Bence_L._Adelan_-_IT_Officer_I-removebg-preview (1).png";
import shainaImage from "../../assets/Shaina_Montaño-removebg-preview (2).png";

// Import the logo image
import depedLogo from "../../assets/deped_logo.png";

const educators = [
  {
    name: "HOMER N. MENDOZA",
    photo: sdsHomer,
    Position: "OIC - Schools Division Superintendent",
    // context:
    //   "Ipapakita natin na sa iisang direksyon lang tayo papunta, iba-iba lang ang pacing. Ang mahalaga doon ay alam natin ang prayoridad natin at ang ating patutunguhan.",
  },
  {
    name: "GLENDA DS. CATADMAN",
    photo: glendaCatadman,
    Position: "OIC - Assistant Schools Division Superintendent",
    // context:
    //   "Empowering educators and learners with digital tools and resources is a step towards a more inclusive and effective educational system.",
  },
  {
    name: "MARCIANO V. VALLES",
    photo: marcianoValle,
    Position: "OIC - Curriculum Implementation Division Chief",
    // context:
    //   "Empowering educators and learners with digital tools and resources is a step towards a more inclusive and effective educational system.",
  },
];

// Data for Proponents
const proponents = [
  {
    name: "DARLFERHEN M. DANCEL",
    photo: darlferhenImage,
    Position:
      "Senior Education Program Specialist / OIC - Principal (Toclong Elementary School)",
    //     context: `"We accept the education we think we deserve,"

    // a truth about self-worth and opportunity. Kapag naniniwala tayong kulang ang sarili natin, madali tayong mag-settle sa mababang standards ng pag-aaral o di kaya'y di natin pinipilit na umangat. In other words, our expectations about ourselves shape the doors we knock on, the scholarships na ina-applyan natin, at pati ang ating persistence sa pag-aaral. Kung maliit ang tingin natin sa sarili, maliit din ang ating hinahabol; kung mataas ang paniniwala natin sa sariling kakayahan, mas gagapang tayo para sa de-kalidad na edukasyon.

    // - "WE ACCEPT THE EDUCATION WE THINK WE DESERVE."
    // Adapted from Stephen Chbosky, The Perks of Being a Wallflower`,
  },
  {
    name: "FLORIDEL R. PESITO",
    photo: floridelImage,
    Position: "Administrative Assistant III",
    // context:
    //   "Providing essential administrative support for efficient project implementation.",
  },
  {
    name: "REDEN M. CRUZADO",
    photo: redenImage,
    Position: "Librarian II",
    // context:
    //   "Facilitating access to valuable learning resources and information for users.",
  },
];

const developerTeam = [
  {
    name: "JUNE BENCE L. ADELAN",
    photo: juneImage,
    position: "Information Technology Officer I",
    // context:
    //   "Learning is like playing slot machines - sometimes you take chances, not knowing the outcome, but every spin adds experience, and every loss teaches more than the win. Sensational!!!",
  },
  {
    name: "SHAINA MONTANO",
    photo: shainaImage,
    position: "ICTS Personnel",
    // context:
    //   "배움은 K-pop 훈련과 같아서 규율을 요구합니다. 모든 완벽한 성과 뒤에는 반복, 회복력, 그리고 끊임없는 노력의 루틴이 있습니다.",
  },
  {
    name: "MARK JOSEPH V. SALEM",
    photo: markImage,
    position: "Junior ICT - Programmer",
    context: "Expectations can lead to disappointment",
  },
  {
    name: "MATTHEW LEWIS E. ROMERO",
    photo: matthewImage,
    position: "Junior ICT - Programmer",
    context:
      "I think education is like roses, failed is red, violets are blue, sino nagtago ng susi ng tagumpay?",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("topManagement");
  const [expandedContexts, setExpandedContexts] = useState({});

  const tabs = [
    {
      id: "topManagement",
      name: "Top Management",
      icon: <FaUserTie className="mr-2" />,
    },
    {
      id: "proponents",
      name: "Proponents",
      icon: <FaUsers className="mr-2" />,
    },
    { id: "developers", name: "< Developers />" },
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 py-6 px-2 sm:py-10 sm:px-4 font-poppins">
      {/* Main Title with Logo and Home Button */}
      <div
        className="flex flex-row items-center mb-8 sm:mb-10"
        style={{ minHeight: "4rem" }}
      >
        <div className="hidden sm:flex flex-shrink-0 ml-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors mr-4"
            aria-label="Go to Login"
          >
            <FaHome size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center sm:gap-4 mx-auto w-full">
          <img
            src={depedLogo}
            alt="DepEd Logo"
            className="h-12 w-auto sm:h-16 mr-0 sm:mr-4 mb-0 cursor-pointer"
            onClick={() => navigate("/login")}
          />
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white text-center">
            IMUS LEARNING RESOURCE NAVIGATOR
          </h1>
        </div>
        <div className="hidden sm:flex flex-shrink-0 w-12"></div>
      </div>

      <div className="max-w-screen-xl mx-auto my-6 sm:my-10 bg-white/90 dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-8 md:p-12 lg:p-16">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 sm:mb-10 text-center text-blue-700 dark:text-blue-200">
          BEHIND THE SCENES
        </h1>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8 overflow-x-auto sm:overflow-visible min-w-max sm:min-w-0 hidden sm:block">
          <nav className="-mb-px flex justify-center space-x-6 sm:space-x-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap py-2 sm:py-4 px-2 sm:px-4 border-b-2 text-xs sm:text-sm md:text-base transition-colors duration-200 ease-in-out focus:outline-none flex items-center ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 font-medium"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content for sm: and up */}
        <div className="hidden sm:block">
          {activeTab === "topManagement" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
              {educators.map((educator) => (
                <div
                  key={educator.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 sm:p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={educator.photo}
                    alt={educator.name}
                    className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-blue-200 mb-4 sm:mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {educator.name}
                  </h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium mb-2 sm:mb-4">
                    {educator.Position}
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "proponents" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
              {proponents.map((proponent) => (
                <div
                  key={proponent.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 sm:p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={proponent.photo}
                    alt={proponent.name}
                    className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-blue-200 mb-4 sm:mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {proponent.name}
                  </h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium mb-2 sm:mb-4">
                    {proponent.Position}
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "developers" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12">
              {developerTeam.map((developer) => (
                <div
                  key={developer.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 sm:p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={developer.photo}
                    alt={developer.name}
                    className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-blue-200 mb-4 sm:mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {developer.name}
                  </h3>
                  <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium mb-2 sm:mb-4">
                    {developer.position}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Continuous Content for mobile (below sm) */}
        <div className="block sm:hidden space-y-8">
          {/* Top Management */}
          <div>
            <h2 className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center uppercase">
              <span className="mr-1 text-gray-800 dark:text-gray-100">
                {tabs[0].icon}
              </span>{" "}
              {tabs[0].name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {educators.map((educator) => (
                <div
                  key={educator.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={educator.photo}
                    alt={educator.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-blue-200 mb-4 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {educator.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {educator.Position}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Proponents */}
          <div>
            <h2 className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2 mt-6 flex items-center justify-center uppercase">
              <span className="mr-1 text-gray-800 dark:text-gray-100">
                {tabs[1].icon}
              </span>{" "}
              {tabs[1].name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {proponents.map((proponent) => (
                <div
                  key={proponent.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={proponent.photo}
                    alt={proponent.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-blue-200 mb-4 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {proponent.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {proponent.Position}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Developers */}
          <div>
            <h2 className="text-xs font-bold text-gray-800 dark:text-gray-100 mb-2 mt-6 flex items-center justify-center uppercase">
              <span className="mr-1 text-gray-800 dark:text-gray-100">
                {"< />"}
              </span>{" "}
              {tabs[2].name.toUpperCase()}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {developerTeam.map((developer) => (
                <div
                  key={developer.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={developer.photo}
                    alt={developer.name}
                    className="w-20 h-20 object-cover rounded-full border-4 border-blue-200 mb-4 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {developer.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {developer.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 md:hidden">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition-colors text-xs sm:text-sm md:text-base uppercase tracking-wider"
        >
          BACK TO LOGIN
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
