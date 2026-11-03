import { setRequestLocale } from "next-intl/server";
import TopBar from "@/components/pr/TopBar";
import PrHeader from "@/components/pr/PrHeader";
import PrTabs from "@/components/pr/PrTabs";
import Conversation from "@/components/pr/Conversation";
import Commits from "@/components/pr/Commits";
import FilesChanged from "@/components/pr/FilesChanged";
import MergeBox from "@/components/pr/MergeBox";
import Sidebar from "@/components/pr/Sidebar";
import Footer from "@/components/footer/Footer";
import Confetti from "@/features/debug-me/components/Confetti";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopBar />
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <PrHeader />
        <PrTabs />
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <main className="flex min-w-0 flex-col gap-12">
            <Conversation />
            <Commits />
            <FilesChanged />
            <MergeBox />
          </main>
          <Sidebar />
        </div>
      </div>
      <Footer />
      <Confetti />
    </>
  );
};

export default Home;
