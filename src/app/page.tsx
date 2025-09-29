import Display from "@/components/Display";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <Hero />
      <Display />
    </div>
  );
}
  