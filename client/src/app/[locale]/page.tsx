import { setRequestLocale } from "next-intl/server";
import PullRequestPage from "@/features/pull-request/components/PullRequestPage";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PullRequestPage />;
};

export default Home;
