import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import FloorPreview from "@/components/sections/FloorPreview";
import Gallery from "@/components/sections/Gallery";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <Hero />
        <BrandStatement />
        <FloorPreview />
        <Gallery />
        {/* WhyMult, Process, Social Proof, CTA + Footer — próximas seções */}
      </main>
    </Layout>
  );
};

export default Index;
