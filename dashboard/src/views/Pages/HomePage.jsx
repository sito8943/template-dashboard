import React, { useMemo } from "react";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// sections
import Hero from "./Home/Hero";
import About from "./Home/About";
import Features from "./Home/Features";
import Products from "./Home/Products";
import ClientSays from "./Home/ClientSays";
import ContactUs from "./Home/ContactUs";
import Footer from "./Home/Footer";

// styles
import "./styles.css";

function HomePage() {
  const { languageState } = useLanguage();

  const { home } = useMemo(() => languageState.texts.pages, [languageState]);

  return (
    <section className="flex flex-col gap-3">
      <h2>{home.title}</h2>
      <Hero />
      <About />
      <Features />
      <Products />
      <ClientSays />
      <ContactUs />
      <Footer />
    </section>
  );
}

export default HomePage;
