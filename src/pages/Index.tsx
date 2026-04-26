import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import BrandStatement from "@/components/sections/BrandStatement";
import Showroom from "@/components/sections/Showroom";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <Hero />
        <BrandStatement />
        <Showroom />
        {/* Outras seções serão adicionadas aqui */}
      </main>
    </Layout>
  );
};

export default Index;
