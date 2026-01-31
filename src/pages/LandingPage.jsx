import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllMaterials, getAllSchools } from "@/services/lrms-endpoints";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/shadcn-components/ui/navigation-menu";
import { Button } from "@/components/shadcn-components/ui/button";
import { Card, CardContent } from "@/components/shadcn-components/ui/card";
import { 
  BookOpen,
  Layers,
  Sparkles,
  ClipboardList,
  Scroll,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn-components/ui/sheet";
import HeroImage from "@/assets/HeroImageLandingPage.svg";
import BagongPilipinasLogo from "@/assets/Bagong-Pilipinas-Logo.png";
import LogoDepEd1 from "@/assets/Logo-DepEd-1.png";
import DepedLogo from "@/assets/deped_logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [stats, setStats] = useState({
    resources: 0,
    schools: 0,
    downloads: 0
  });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [materialsRes, schoolsRes] = await Promise.all([
          getAllMaterials(),
          getAllSchools().catch(() => ({ data: [] }))
        ]);

        const materialsList = materialsRes?.data || [];
        const schoolsList = schoolsRes?.data || [];

        // Map backend typeName (case-sensitive as per response) to UI Labels
        const labelMap = {
          "Lesson Exemplar": "Lesson Exemplars",
          "Modules": "Modules",
          "Module": "Modules",
          "Storybook": "Storybooks",
          "Worksheets": "Worksheets",
          "Worksheet": "Worksheets",
          "Manuscript": "Manuscripts"
        };

        // Calculate Type Counts
        const typeCounts = materialsList.reduce((acc, curr) => {
          const typeName = curr.typeName; // Directly from the material object
          const label = labelMap[typeName] || typeName;
          if (label) {
            acc[label] = (acc[label] || 0) + 1;
          }
          return acc;
        }, {});
        setCounts(typeCounts);

        // Calculate General Stats
        const totalDownloads = materialsList.reduce((sum, m) => sum + (m.downloads || 0), 0);
        setStats({
          resources: materialsList.length,
          schools: schoolsList.length,
          downloads: totalDownloads
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
  }, []);

  const formatCount = (num) => new Intl.NumberFormat().format(num || 0);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="absolute top-0 z-50 w-full border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold text-white leading-none">I<span className="text-blue-400">LeaRN</span></span>
          </div>

          <div className="flex-1 flex justify-end px-4 md:px-8">
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex gap-2">
                <NavigationMenuItem>
                  <Link to="#about">
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-white/10 hover:text-white transition-colors`}>
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-slate-800 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-white font-bold text-2xl text-left">
                      I<span className="text-blue-400">LeaRN</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-12">
                    <Link 
                      to="#about" 
                      className="text-lg font-medium hover:text-blue-400 transition-colors"
                    >
                      About Us
                    </Link>
                    <Button 
                      onClick={() => navigate("/login")}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full py-6 text-lg"
                    >
                      LR portal
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Button 
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
            >
              LR portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center pt-32 pb-16 overflow-hidden"
      >
        {/* Navy Background Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900 z-0"
        />

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 max-w-2xl text-white text-center md:text-left"
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Elevate Your <span className="text-blue-400">Learning Journey</span> With SDOIC Learning Resources
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 max-w-lg leading-relaxed font-medium mx-auto md:mx-0">
                Access high-quality educational resources, manage your curriculum, and foster a collaborative environment.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <Button 
                onClick={() => navigate("/login")}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 h-14 text-lg border-none shadow-lg w-full sm:w-auto"
              >
                Explore Materials
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative hidden md:block"
          >
            <img 
              src={HeroImage} 
              alt="Education dashboard" 
              className="w-full max-w-[900px] md:scale-135 mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] animate-float relative z-10 origin-center"
            />
          </motion.div>

          {/* Mobile Hero Image (Smaller Scale) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative md:hidden mt-12"
          >
            <img 
              src={HeroImage} 
              alt="Education dashboard" 
              className="w-full max-w-[400px] mx-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] animate-float relative z-10"
            />
          </motion.div>
        </div>
      </section>

      <section className="pt-12 pb-8 relative z-20">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center items-center gap-8 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0 pb-4 md:pb-0">
            {[
              { icon: <BookOpen className="w-10 h-10" />, label: "Lesson Exemplars" },
              { icon: <Layers className="w-10 h-10" />, label: "Modules" },
              { icon: <Sparkles className="w-10 h-10" />, label: "Storybooks" },
              { icon: <ClipboardList className="w-10 h-10" />, label: "Worksheets" },
              { icon: <Scroll className="w-10 h-10" />, label: "Manuscripts" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex flex-col items-center gap-3 group transition-all duration-300 cursor-default min-w-[120px]"
              >
                <div className="text-slate-600 group-hover:text-blue-600 transition-colors relative h-10 w-10 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {hoveredIdx === idx ? (
                      <motion.span
                        key="count"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-xl font-black text-blue-600"
                      >
                        {counts[item.label] ?? "N/A"}
                      </motion.span>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-sm md:text-base font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors text-center">
                  {item.label}
                </span>
                <div className="w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="pt-16 pb-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="relative order-2 md:order-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg mt-8" alt="Team" />
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg" alt="Meeting" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-1 md:order-2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Empowering Teachers and Learners with Digital Excellence</h2>
            <p className="text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
              ILeaRN (Interactive Learning Resources and Network) is dedicated to providing teachers with the best tools to inspire their students. Our platform centralizes high-quality, verified educational content for all grade levels.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-blue-600"
                >
                  {formatCount(stats.resources)}
                </motion.div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Resources</div>
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-blue-600"
                >
                  {formatCount(stats.schools)}
                </motion.div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Schools</div>
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-blue-600"
                >
                  {formatCount(stats.downloads)}
                </motion.div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mt-1">Downloads</div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 h-auto w-full sm:w-auto"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Featured Learning Materials</h2>
            <p className="text-gray-500">Explore our most popular and highly-rated educational resources curated for your needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Kindergarten", count: "1,200+ Resources", color: "bg-pink-50 text-pink-600" },
              { title: "Elementary", count: "4,500+ Resources", color: "bg-blue-50 text-blue-600" },
              { title: "Junior High School", count: "3,800+ Resources", color: "bg-orange-50 text-orange-600" },
              { title: "Senior High School", count: "2,900+ Resources", color: "bg-purple-50 text-purple-600" },
            ].map((level, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="group hover:scale-105 transition-all duration-300 border-none shadow-sm hover:shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-8 space-y-6 text-center">
                    <div className={`w-20 h-20 ${level.color} rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform`}>
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-2xl tracking-tight">{level.title}</h4>
                      <p className="text-gray-500 font-medium">{level.count}</p>
                    </div>
                    
                    <Button 
                      onClick={() => navigate("/login")}
                      className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-2xl h-14 font-bold transition-colors"
                    >
                      View Materials
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center sm:text-left">
            {/* About ILeaRN */}
            <div className="space-y-6">
              <h5 className="font-bold text-lg">About ILeaRN</h5>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
                Schools Division Office of Imus City Learning Resource Management System (LRMS) Portal named I LeaRN (Imus Learning Resources Navigator) supports effective implementation of the Learning Resource Management and Development System (LRMDS) to improve access to learning, teaching, and professional development resources by schools. It is a web-based repository of available learning materials in electronic copies, developed and quality assured in the National level, Regional level, and Division level.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-bold text-lg mb-8">Quick Links</h5>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="font-bold text-white uppercase text-xs tracking-wider">Offices</li>
                <li><Link to="#" className="hover:text-blue-400">Central Office</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Region 4A - CALABARZON</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Imus City</Link></li>
                <li className="font-bold text-white uppercase text-xs tracking-wider pt-4">Resources</li>
                <li><Link to="#" className="hover:text-blue-400">LRMDS Portal</Link></li>
                <li><Link to="#" className="hover:text-blue-400">LMS Portal</Link></li>
                <li><Link to="#" className="hover:text-blue-400">ETulay</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Commons</Link></li>
                <li><Link to="#" className="hover:text-blue-400">ETulay</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h5 className="font-bold text-lg mb-8">Contact Us</h5>
              <ul className="space-y-6 text-sm text-gray-400">
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white">Telephone</div>
                    <div>(046) 471-4837</div>
                  </div>
                </li>
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white">Email</div>
                    <div>sdo.imus.city@deped.gov.ph</div>
                  </div>
                </li>
                <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white">Address</div>
                    <div>Schools Division Office of Imus City<br />Imus City, Cavite</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Organization Info */}
            <div className="space-y-8 lg:col-span-1">
              <div className="flex flex-row items-center justify-center sm:justify-start gap-6">
                <img src={BagongPilipinasLogo} className="h-10 sm:h-12 object-contain" alt="Bagong Pilipinas" />
                <img src={LogoDepEd1} className="h-10 sm:h-12 object-contain" alt="Matatag Logo" />
                <img src={DepedLogo} className="h-10 sm:h-12 object-contain" alt="DepEd Logo" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium mx-auto sm:mx-0 max-w-xs">
                © April 2026 SDOIC - Imus Learning Resource Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
