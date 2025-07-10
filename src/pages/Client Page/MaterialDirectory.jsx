import Footer from "../../components/Footer";
import ClientHeader from "../../components/ClientHeader";
import {
  FaUniversity,
  FaUserGraduate,
  FaChild,
  FaPuzzlePiece,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import withPencilBg from "../../assets/withPencil.jpg";

const levels = [
  {
    name: "Elementary",
    color: "bg-gradient-to-br from-blue-200 to-blue-400",
    icon: <FaChild size={48} className="text-blue-600 mb-4" />,
    link: "/materials/elem",
  },
  {
    name: "Senior High School",
    color: "bg-gradient-to-br from-purple-200 to-purple-400",
    icon: <FaUniversity size={48} className="text-purple-600 mb-4" />,
    link: "/materials/shs",
  },
  {
    name: "Kindergarten",
    color: "bg-gradient-to-br from-pink-200 to-pink-400",
    icon: <FaPuzzlePiece size={48} className="text-pink-600 mb-4" />,
    link: "/materials/kinder",
  },
  {
    name: "Junior High School",
    color: "bg-gradient-to-br from-green-200 to-green-400",
    icon: <FaUserGraduate size={48} className="text-green-600 mb-4" />,
    link: "/materials/jhs",
  },
];

const MaterialDirectory = () => {
  return (
    <div
      className="flex flex-col min-h-screen font-poppins"
      style={{
        backgroundImage: `url(${withPencilBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ClientHeader />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-10 text-center">
          MATERIALS DIRECTORY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
          {levels.map((level) => (
            <Link
              to={level.link}
              key={level.name}
              className={`${level.color} rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
            >
              {level.icon}
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-900 text-center">
                {level.name}
              </h3>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MaterialDirectory;
