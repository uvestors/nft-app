import Badge from "@/components/badge";
import ColorfulButton from "@/components/colorfulButton";
import FadeInSection from "@/components/fadeInSection";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const HeroFeature = async () => {
  const t = await getTranslations("HomePage");

  return (
    <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <FadeInSection>
          <Badge>{t("hero.badge")}</Badge>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            {t("hero.title_line1")}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
              {t("hero.title_line2")}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ColorfulButton
              variant="primary"
              className="h-12 px-8 text-base w-full sm:w-auto"
              //   onClick={(e) => handleNavClick(e, "#about")}
            >
              {t("hero.btn_learn")}
            </ColorfulButton>
            <ColorfulButton
              variant="secondary"
              className="h-12 px-8 text-base w-full sm:w-auto"
              //   onClick={(e) => handleNavClick(e, "#partners")}
            >
              {t("hero.btn_partner")} <ChevronRight className="ml-2 w-4 h-4" />
            </ColorfulButton>
          </div>
        </FadeInSection>
        {/* <FadeInSection
            delay={300}
            className="mt-16 relative mx-auto max-w-4xl h-64 md:h-96 opacity-80"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
            <div
              className="w-full h-full border border-slate-800/50 rounded-full flex items-center justify-center relative animate-spin-slow"
              style={{ animationDuration: "60s" }}
            >
              <div className="absolute w-[80%] h-[80%] border border-blue-500/20 rounded-full rotate-45"></div>
              <div className="absolute w-[60%] h-[60%] border border-purple-500/20 rounded-full -rotate-12"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rotate-45"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent -rotate-12"></div>
            </div>
            <p className="text-xs text-slate-500 mt-4 tracking-widest uppercase">
              {t.hero.globe_caption}
            </p>
          </FadeInSection> */}
      </div>
    </section>
  );
};

export default HeroFeature;
