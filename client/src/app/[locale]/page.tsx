import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

// Temporary placeholder while the planet portfolio is rebuilt (replaced in U1).
const Placeholder = () => {
  const t = useTranslations("metadata");
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-3 opacity-70">{t("description")}</p>
    </main>
  );
};

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Placeholder />;
};

export default Home;
