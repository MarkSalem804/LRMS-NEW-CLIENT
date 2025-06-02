/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserTie, FaUsers } from "react-icons/fa";
import sdsHomer from "../../assets/SDS Homer N. Mendoza.jpg";
import asdsBernadette from "../../assets/ASDS Bernadette T. Luna.jpg";
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
    context:
      "Ipapakita natin na sa iisang direksyon lang tayo papunta, iba-iba lang ang pacing. Ang mahalaga doon ay alam natin ang prayoridad natin at ang ating patutunguhan.",
  },
  {
    name: "BERNADETTE T. LUNA",
    photo: asdsBernadette,
    Position: "Assistant Schools Division Superintendent",
    context:
      "Digital transformation in education is essential for preparing our students for the future. We strive to make learning more interactive and accessible for all.",
  },
  {
    name: "GLENDA DS. CATADMAN",
    photo: glendaCatadman,
    Position: "Curriculum Implementation Division Chief",
    context:
      "Empowering educators and learners with digital tools and resources is a step towards a more inclusive and effective educational system.",
  },
];

// Data for Proponents
const proponents = [
  {
    name: "DARLFERHEN M. DANCEL",
    photo: darlferhenImage,
    Position:
      "Senior Education Program Specialist / OIC - Principal (Toclong Elementary School)",
    context: `"We accept the education we think we deserve,"

a truth about self-worth and opportunity. Kapag naniniwala tayong kulang ang sarili natin, madali tayong mag-settle sa mababang standards ng pag-aaral o di kaya'y di natin pinipilit na umangat. In other words, our expectations about ourselves shape the doors we knock on, the scholarships na ina-applyan natin, at pati ang ating persistence sa pag-aaral. Kung maliit ang tingin natin sa sarili, maliit din ang ating hinahabol; kung mataas ang paniniwala natin sa sariling kakayahan, mas gagapang tayo para sa de-kalidad na edukasyon.

- "WE ACCEPT THE EDUCATION WE THINK WE DESERVE."
Adapted from Stephen Chbosky, The Perks of Being a Wallflower`,
  },
  {
    name: "FLORIDEL R. PESITO",
    photo: floridelImage,
    Position: "Administrative Assistant III",
    context:
      "Providing essential administrative support for efficient project implementation.",
  },
  {
    name: "REDEN M. CRUZADO",
    photo: redenImage,
    Position: "Librarian II",
    context:
      "Facilitating access to valuable learning resources and information for users.",
  },
  {
    name: "FELIZ A. TAYAO",
    photo: felizImage,
    Position: "Education Program Specialist - Learning Resources",
    context:
      "Specializing in developing and curating relevant learning materials.",
  },
];

const developerTeam = [
  {
    name: "June Bence L. Adelan",
    photo: juneImage,
    position: "Information Technology Officer I",
    context:
      "Learning is like playing slot machines - sometimes you take chances, not knowing the outcome, but every spin adds experience, and every loss teaches more than the win. Sensational!!!",
  },
  {
    name: "Shaina Montaño",
    photo: shainaImage,
    position: "ICTS Personnel",
    context:
      "배움은 K-pop 훈련과 같아서 규율을 요구합니다. 모든 완벽한 성과 뒤에는 반복, 회복력, 그리고 끊임없는 노력의 루틴이 있습니다.",
  },
  {
    name: "Mark Joseph V. Salem",
    photo: markImage,
    position: "Junior ICT - Programmer",
    context: "Expectations can lead to disappointment",
  },
  {
    name: "Matthew Lewis E. Romero",
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 font-poppins">
      <button
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Go to Login"
      >
        <FaHome size={24} />
      </button>

      {/* Main Title with Logo */}
      <div className="flex justify-center items-center mb-10">
        <img src={depedLogo} alt="DepEd Logo" className="h-16 w-auto mr-4" />{" "}
        {/* Adjust size and margin as needed */}
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
          IMUS LEARNING RESOURCE NAVIGATOR
        </h1>
      </div>

      <div className="max-w-screen-xl mx-auto my-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-16">
        <h1 className="text-3xl font-bold mb-10 text-center text-blue-700 dark:text-blue-200">
          BEHIND THE SCENES
        </h1>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex justify-center space-x-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap py-4 px-4 border-b-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none flex items-center ${
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

        {/* Tab Content */}
        <div>
          {activeTab === "topManagement" && (
            // Content for Top Management tab
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {educators.map((educator) => (
                <div
                  key={educator.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={educator.photo}
                    alt={educator.name}
                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-200 mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {educator.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4">
                    {educator.Position}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-100 text-sm italic">
                    {educator.context}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "proponents" && (
            // Content for Proponents tab
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {proponents.map((proponent) => (
                <div
                  key={proponent.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={proponent.photo}
                    alt={proponent.name}
                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-200 mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {proponent.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4">
                    {proponent.Position}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-100 text-sm italic">
                    {proponent.context.length > 200 &&
                    !expandedContexts[proponent.name] ? (
                      <>
                        {`${proponent.context.substring(0, 200)}...`}
                        <button
                          onClick={() =>
                            setExpandedContexts((prevState) => ({
                              ...prevState,
                              [proponent.name]: true,
                            }))
                          }
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 text-sm ml-1 focus:outline-none"
                        >
                          See More
                        </button>
                      </>
                    ) : (
                      <>
                        {proponent.context}
                        {proponent.context.length > 200 &&
                          expandedContexts[proponent.name] && (
                            <button
                              onClick={() =>
                                setExpandedContexts((prevState) => ({
                                  ...prevState,
                                  [proponent.name]: false,
                                }))
                              }
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 text-sm ml-1 focus:outline-none"
                            >
                              See Less
                            </button>
                          )}
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "developers" && (
            // Content for Developers tab
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {developerTeam.map((developer) => (
                <div
                  key={developer.name}
                  className="bg-blue-50 dark:bg-gray-700 rounded-lg p-7 shadow-sm flex flex-col items-center text-center"
                >
                  <img
                    src={developer.photo}
                    alt={developer.name}
                    className="w-48 h-48 object-cover rounded-full border-4 border-blue-200 mb-6 shadow-md"
                    style={{ objectPosition: "top" }}
                  />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    {developer.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4">
                    {developer.position}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-100 text-sm italic">
                    {developer.context.length > 200 &&
                    !expandedContexts[developer.name] ? (
                      <>
                        {`${developer.context.substring(0, 200)}...`}
                        <button
                          onClick={() =>
                            setExpandedContexts((prevState) => ({
                              ...prevState,
                              [developer.name]: true,
                            }))
                          }
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 text-sm ml-1 focus:outline-none"
                        >
                          See More
                        </button>
                      </>
                    ) : (
                      <>
                        {developer.context}
                        {developer.context.length > 200 &&
                          expandedContexts[developer.name] && (
                            <button
                              onClick={() =>
                                setExpandedContexts((prevState) => ({
                                  ...prevState,
                                  [developer.name]: false,
                                }))
                              }
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 text-sm ml-1 focus:outline-none"
                            >
                              See Less
                            </button>
                          )}
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
