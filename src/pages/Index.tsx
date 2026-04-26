import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import FloorPreview from "@/components/sections/FloorPreview";
import Gallery from "@/components/sections/Gallery";
import VideoSection from "@/components/sections/VideoSection";
import SocialProof from "@/components/sections/SocialProof";
import CtaFinal from "@/components/sections/CtaFinal";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <Hero />
        <BrandStatement />
        <FloorPreview />
        <Gallery />
        <VideoSection />
        <SocialProof />
        <CtaFinal />
      </main>
      <Footer />
    </Layout>
  );
};

export default Index;
