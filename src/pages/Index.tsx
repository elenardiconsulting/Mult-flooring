import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import Showroom from "@/components/sections/Showroom";
import RoomVisualizer from "@/components/sections/RoomVisualizer";
import Gallery from "@/components/sections/Gallery";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <Hero />
        <BrandStatement />
        <Showroom />
        <RoomVisualizer />
        <Gallery />
        {/* Outras seções serão adicionadas aqui */}
      </main>
    </Layout>
  );
};

export default Index;
