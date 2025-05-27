/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import sdsHomer from "../../assets/SDS Homer N. Mendoza.jpg";
import asdsBernadette from "../../assets/ASDS Bernadette T. Luna.jpg";
import glendaCatadman from "../../assets/Glenda_DS._Catadman-removebg-preview.png";

const educators = [
  {
    name: "HOMER N. MENDOZA",
    photo: sdsHomer,
    Position: "OIC - Schools Division Superintendent",
    context:
      "As Schools Division Superintendent, I am committed to advancing education through the digitalization of learning materials, ensuring every learner has access to quality resources.",
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

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <button
        onClick={() => navigate("/login")}
        className="fixed top-8 left-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Go to Login"
      >
        <FaHome size={24} />
      </button>
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-16">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-200">
          About Us
        </h1>
        <p className="mb-10 text-center text-gray-600 dark:text-gray-300">
          Meet our passionate educators and learn about their vision for
          education and the digitalization of learning materials.
        </p>
        <div className="space-y-8">
          {educators.map((educator, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row${
                idx % 2 === 0 ? "-reverse" : ""
              } items-center bg-blue-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm`}
            >
              <img
                src={educator.photo}
                alt={educator.name}
                className={`w-64 h-96 object-cover rounded-lg border-4 border-blue-200 mb-4 md:mb-0 shadow-md ${
                  idx % 2 === 0 ? "ml-0 md:ml-8" : "mr-0 md:mr-8"
                }`}
                style={{ objectPosition: "top" }}
              />
              <div className="flex-1 px-6 md:px-12 py-4">
                <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                  {educator.name}
                </h2>
                <p className="text-md text-gray-600 dark:text-gray-300 font-medium mb-2">
                  {educator.Position}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-100">
                  {educator.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
