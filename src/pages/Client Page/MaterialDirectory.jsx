import ClientHeader from "../../components/ClientHeader";
import { Link } from "react-router-dom";

const levels = [
  {
    name: "Kindergarten",
    description: "Pre-school learning materials and resources",
    color: "from-purple-200 to-violet-200",
    icon: "🎨",
    link: "/materials/kinder",
    count: "View Materials",
  },
  {
    name: "Elementary",
    description: "Grades 1-6 learning materials",
    color: "from-pink-200 to-rose-200",
    icon: "📚",
    link: "/materials/elem",
    count: "View Materials",
  },
  {
    name: "Junior High School",
    description: "Grades 7-10 learning materials",
    color: "from-blue-200 to-cyan-200",
    icon: "🎓",
    link: "/materials/jhs",
    count: "View Materials",
  },
  {
    name: "Senior High School",
    description: "Grades 11-12 learning materials",
    color: "from-green-200 to-emerald-200",
    icon: "🎯",
    link: "/materials/shs",
    count: "View Materials",
  },
];

const MaterialDirectory = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-poppins">
      <ClientHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Learning Materials Directory
          </h1>
          <p className="text-gray-600 text-lg">
            Browse and access educational resources by level
          </p>
        </div>

        {/* Education Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {levels.map((level) => (
            <Link
              to={level.link}
              key={level.name}
              className={`bg-gradient-to-r ${level.color} rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 group relative overflow-hidden`}
            >
              {/* Icon Badge */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">{level.icon}</span>
              </div>

              {/* Card Content */}
              <div className="relative z-10 pt-2 pr-20">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {level.name}
                </h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[48px] leading-relaxed">
                  {level.description}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold text-gray-700 text-sm group-hover:bg-white transition-colors">
                  <span>{level.count}</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to ILeaRN Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Access a comprehensive collection of learning resources designed
                to support quality education. Browse materials by education
                level and find the resources you need for effective teaching and
                learning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Browse Materials
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explore curated resources by grade level
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Download Resources
                  </h3>
                  <p className="text-sm text-gray-600">
                    Save materials for offline access
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Search & Filter
                  </h3>
                  <p className="text-sm text-gray-600">
                    Find specific materials quickly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MaterialDirectory;
