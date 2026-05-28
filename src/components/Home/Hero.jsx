import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.header 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
    >
      <div className="lg:col-span-5 space-y-6">
        <motion.div variants={itemVariants}>
          <span className="px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 rounded-full">
            Seasonal Drop 01
          </span>
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-4xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-tight"
        >
          Essential <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Discovery.
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-on-surface-variant max-w-sm leading-relaxed"
        >
          A thoughtfully curated selection of modern essentials designed for those who appreciate the intersection of form and utility.
        </motion.p>

        <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4">
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all text-sm"
            onClick={() => navigate("/signup")}
          >
            Explore All <ArrowRight size={18} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-transparent border-2 border-surface-container-highest text-on-surface px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
          >
            Our Story <Play size={18} fill="currentColor" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="lg:col-span-7 relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group"
      >
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt="minimalist white product"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSbUAXlKPmSZ4Hdom9fxkS2xYT2Dm_sHD-gKhRMxnHPytEOIDN04Dsc4B-maeAdYqdT_28gdQ2XG2nWUvH_Qct5AYvPDOOGXX7RLyFlVQWpGfqcorIILGvYzuDPguWWB4NL4K7-GB9IELwCjA_pkZaawWzYoeF5LoZ1O2DsLTtqGSD4WnnAllvpWgTxXtFPKruG3wzOobtSZP1uJd--UK9WrW9N17XpE-xiKpkPuLdX-kKf4c5iGJpmBh99xOO1PfN2i0rkl0wu7I"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-8 p-6 glass rounded-2xl max-w-xs"
        >
          <p className="text-sm font-medium text-on-surface">"Design is not just what it looks like, it's how it works."</p>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Hero;

