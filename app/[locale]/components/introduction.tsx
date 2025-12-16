import Card from "@/components/card";
import FadeInSection from "@/components/fadeInSection";
import { BookOpen, Globe, Scale, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Introduction = async () => {
  const t = await getTranslations("HomePage");
  const cardPoints = t.raw("about.card_points") as string[];

  return (
    <section
      id="about"
      className="py-20 bg-slate-900/50 border-y border-slate-800/50 relative z-10"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeInSection className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t("about.title")}
            </h2>
            <div className="space-y-4 text-slate-400">
              <p>
                {t("about.p1_segment1")}
                <span className="text-blue-400 font-semibold">
                  {t("about.p1_highlight")}
                </span>
                {t("about.p1_segment2")}
              </p>
              <p>{t("about.p2")}</p>
              <blockquote className="border-l-4 border-purple-500 pl-4 py-1 italic text-slate-300 bg-slate-800/30 rounded-r">
                {t("about.quote")}
              </blockquote>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-sm">{t("about.badges.standard")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t("about.badges.ecosystem")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                <span className="text-sm">{t("about.badges.compliance")}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-sm">{t("about.badges.research")}</span>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={200} className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
            <Card className="p-8 relative bg-slate-950 border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4">
                {t("about.card_title")}
              </h3>
              <ul className="space-y-3">
                {cardPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 shrink-0"></div>
                    <span className="text-slate-400">{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
