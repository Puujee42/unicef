import Image from "next/image";
import HeroSlider from "./components/HeroSlider";
import Hero from "./components/Hero";
import EventsSection from "./components/Events";
import Expectations from "./components/Expectations";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Hero />
      <EventsSection />
      <Expectations />
    </>
  );
}
