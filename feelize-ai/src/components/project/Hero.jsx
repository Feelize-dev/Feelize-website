import { Button } from "../ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 pt-32 h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-8 max-w-6xl w-full"
      >
        <div className="mb-2 sm:mb-4">
          <svg
            width="100"
            height="35"
            viewBox="0 0 120 40"
            className="mx-auto sm:w-[120px] sm:h-[40px]"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-['Bricolage_Grotesque'] font-bold"
              style={{ fontSize: "28px", fill: "url(#gradient)" }}
            >
              Feelize
            </text>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#0580E8", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#7000FF", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight font-['Bricolage_Grotesque'] px-4">
          Developers Supercharged by AI
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-['Istok_Web'] max-w-4xl px-4">
          Speed of AI. The quality and creativity of our professional designers,
          engineers, and business strategists.
        </p>

        <Button
          size="lg"
          onClick={() => {
            const aiSection = document.getElementById("ai-analyzer");
            if (aiSection) {
              aiSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className="bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg rounded-full h-auto"
        >
          Start with AI Assistant
        </Button>
      </motion.div>
    </section>
  );
};

export default Hero;
