import Layout from "@/components/layout/Layout";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";

const Index = () => {
  return (
    <Layout>
      <Navbar />
      <main>
        <Hero />
        {/* Outras seções serão adicionadas aqui */}
      </main>
    </Layout>
  );
};

export default Index;
