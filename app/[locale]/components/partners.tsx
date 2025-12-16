import ColorfulButton from "@/components/colorfulButton";
import FadeInSection from "@/components/fadeInSection";
import { getTranslations } from "next-intl/server";

const Partners = async () => {
  const t = await getTranslations("HomePage");
  const partnerTags = t.raw("partners.tags") as string[];

  return (
    <section
      id="partners"
      className="py-20 border-t border-slate-800 bg-slate-950"
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-white mb-12">
            {t("partners.title")}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 opacity-70">
            {partnerTags.map((partner) => (
              <span
                key={partner}
                className="px-6 py-3 rounded-full border border-slate-700 text-slate-300 text-sm md:text-base font-medium"
              >
                {partner}
              </span>
            ))}
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("partners.cta_title")}
            </h3>
            <p className="text-slate-400 mb-8">{t("partners.cta_desc")}</p>
            <ColorfulButton variant="primary" className="h-12 px-8 text-lg">
              {t("partners.btn_join")}
            </ColorfulButton>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default Partners;
