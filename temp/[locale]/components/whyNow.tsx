import Card from "@/components/card";
import FadeInSection from "@/components/fadeInSection";
import { ArrowRight, Landmark, TrendingUp, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";

const WhyNow = async () => {
  const t = await getTranslations("HomePage");
  const rwaPoints = t.raw("why.cards.rwa.points") as string[];
  const auPoints = t.raw("why.cards.au.points") as string[];
  const asiaPoints = t.raw("why.cards.asia.points") as string[];

  return (
    <section id="why-rwa" className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <FadeInSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("why.section_title")}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t("why.section_desc")}
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-8">
          <FadeInSection delay={0}>
            <Card className="p-6 hover:border-blue-500/50 transition-colors group h-full">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("why.cards.rwa.title")}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {t("why.cards.rwa.desc")}
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                {rwaPoints.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-blue-500 shrink-0" />{" "}
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </FadeInSection>
          <FadeInSection delay={150}>
            <Card className="p-6 hover:border-green-500/50 transition-colors group h-full">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <Landmark size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("why.cards.au.title")}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {t("why.cards.au.desc")}
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                {auPoints.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-green-500 shrink-0" />{" "}
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </FadeInSection>
          <FadeInSection delay={300}>
            <Card className="p-6 hover:border-purple-500/50 transition-colors group h-full">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t("why.cards.asia.title")}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {t("why.cards.asia.desc")}
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                {asiaPoints.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ArrowRight
                      size={14}
                      className="text-purple-500 shrink-0"
                    />{" "}
                    {p}
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

export default WhyNow;
