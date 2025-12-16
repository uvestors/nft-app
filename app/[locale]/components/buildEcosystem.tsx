import Card from "@/components/card";
import FadeInSection from "@/components/fadeInSection";
import { BookOpen, Building2, Globe, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

const BuildEcosystem = async () => {
  const t = await getTranslations("HomePage");
  const cards = t.raw("mission.cards") as Record<string, string>[];

  return (
    <React.Fragment>
      {" "}
      <section id="what-we-do" className="py-24 bg-slate-900/30 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <FadeInSection className="mb-16">
            <span className="text-blue-500 font-semibold tracking-wide uppercase text-sm">
              {t("mission.badge")}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-6">
              {t("mission.title")}
            </h2>
            <p className="text-slate-400 max-w-3xl text-lg">
              {t("mission.desc")}
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((item, index) => {
              const icons = [
                <BookOpen key="bookOpen" className="w-8 h-8" />,
                <Users key="users" className="w-8 h-8" />,
                <Globe key="globe" className="w-8 h-8" />,
                <Building2 key="building" className="w-8 h-8" />,
              ];
              const colors = [
                "text-blue-400",
                "text-purple-400",
                "text-indigo-400",
                "text-pink-400",
              ];

              return (
                <FadeInSection key={index} delay={index * 100}>
                  <Card className="p-6 border-slate-800 bg-slate-950 hover:-translate-y-1 transition-transform duration-300 h-full">
                    <div className={`mb-4 ${colors[index]}`}>
                      {icons[index]}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </Card>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-blue-900/10 to-transparent"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <FadeInSection>
            <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-slate-700">
                  <span className="text-2xl font-bold text-slate-600">HX</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {t("founder.title")}
                  </h2>
                  <p className="text-lg text-slate-300 italic mb-6 leading-relaxed">
                    {t("founder.quote")}
                  </p>
                  <div>
                    <div className="text-white font-semibold">
                      {t("founder.name")}
                    </div>
                    <div className="text-blue-400 text-sm">
                      {t("founder.role")}
                    </div>
                    <div className="text-slate-500 text-xs mt-1">
                      {t("founder.subrole")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </React.Fragment>
  );
};

export default BuildEcosystem;
