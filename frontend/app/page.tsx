import Hero from "@/modules/Home/Hero";
import Navbar from "@/modules/Home/Navbar";

export default function Home() {
  return (
    <main className="w-full p-3">
      <Navbar/>
      <Hero />
    </main>
  );
}
