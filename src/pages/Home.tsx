import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: "01", title: "Project 1", url: "https://qli14-dev.github.io/project1/" },
  { id: "02", title: "Project 2", url: "https://qli14-dev.github.io/css-2/" },
  { id: "03", title: "Project 3", url: "https://qli14-dev.github.io/ixp2project3/" },
  { id: "04", title: "Project 4", url: "https://qli14-dev.github.io/0331/" },
  { id: "05", title: "Final Project", url: "https://qli14-dev.github.io/ixp-final-project/" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#EAEAEA] flex flex-col justify-between px-6 py-12 md:px-16 md:py-20 lg:px-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full mx-auto"
      >
        {/* Header Section */}
        <header className="mb-24 md:mb-32 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-8">
          <motion.div variants={itemVariants}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none">
              Quanyi Li
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-row md:flex-col gap-8 md:gap-2 text-sm md:text-base font-sans text-[#888888] tracking-widest uppercase">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#555555] mb-1">Course</span>
              <span className="text-[#EAEAEA]">IXP2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#555555] mb-1">Semester</span>
              <span className="text-[#EAEAEA]">Spring 2026</span>
            </div>
          </motion.div>
        </header>

        {/* Projects Section */}
        <main>
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="font-sans text-xs uppercase tracking-[0.3em] text-[#555555]">
              Selected Works
            </h2>
          </motion.div>

          <ul className="flex flex-col w-full group">
            {projects.map((project, index) => (
              <motion.li
                key={project.id}
                variants={itemVariants}
                className="border-b border-white/5 last:border-b-0 relative hover-trigger"
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-8 md:py-12 w-full flex items-center justify-between group-hover:opacity-30 hover:!opacity-100 transition-opacity duration-500 relative overflow-hidden"
                >
                  <div className="flex items-baseline gap-6 md:gap-12 relative z-10">
                    <span className="font-sans text-sm md:text-base text-[#555555] font-light">
                      {project.id}
                    </span>
                    <span className="font-serif text-3xl md:text-5xl lg:text-6xl group-hover:italic transition-all duration-500 ease-out transform group-hover:translate-x-2">
                      {project.title}
                    </span>
                  </div>
                  
                  <div className="relative z-10 overflow-hidden w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/10 group-hover:bg-white group-hover:border-white transition-colors duration-500">
                    <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-[#EAEAEA] group-hover:text-[#050505] transform translate-y-full -translate-x-full group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 ease-out absolute" />
                    <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-[#EAEAEA] transform group-hover:-translate-y-full group-hover:translate-x-full transition-transform duration-500 ease-out absolute" />
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </main>
      </motion.div>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-24 max-w-6xl w-full mx-auto flex justify-between items-center text-xs font-sans text-[#555555] uppercase tracking-widest"
      >
        <span>© 2026</span>
        <span>Portfolio Index</span>
      </motion.footer>
    </div>
  );
}
