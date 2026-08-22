// import { Globe } from "./ui/globe";
import Text3DFlip from "@/components/ui/text-3d-flip";
import ButtonWithIcon from "./ui/button-01";
// import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const Globe = lazy(() => import("./ui/globe").then((module) => ({ default: module.Globe })));

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://sprintmytrip.com/#website",
        url: "https://sprintmytrip.com/",
        name: "SprintMyTrip",
        alternateName: ["Sprint My Trip", "SprintMyTrip Itinerary Planner"],
        description: "Plan multi-stop itineraries with transit, driving, or flight options in seconds.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://sprintmytrip.com/#app",
        name: "SprintMyTrip",
        applicationCategory: "TravelApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <>
      <title>SprintMyTrip | Multi-Stop Travel Itinerary & Route Planner</title>
      <meta
        name="description"
        content="Plan multi-stop itineraries for up to 5 locations with driving, transit, or flight options in seconds. Get curated day-by-day plans and travel checklists."
      />
      <link rel="canonical" href="https://sprint-my-trip.vercel.app/" />
      <meta name="robots" content="index, follow" />

      {/*  Structured Data (JSON-LD) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/*  PAGE UI */}
      <main className="relative lg:h-[calc(100vh-60px)] w-full overflow-hidden bg-background flex flex-col justify-center py-6 sm:py-10 lg:py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <h1 className="order-1 lg:col-start-1 lg:row-start-1 flex flex-col gap-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground relative z-10">
              <Text3DFlip
                className="bg-transparent"
                textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary"
                flipTextClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
                rotateDirection="top"
              >
                Your Multi-Stop
              </Text3DFlip>
              <Text3DFlip
                className="bg-transparent"
                textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary"
                flipTextClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
                rotateDirection="top"
              >
                Journey,
              </Text3DFlip>

              <Text3DFlip
                className="bg-transparent"
                textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
                flipTextClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary"
                rotateDirection="top"
              >
                Planned in Seconds
              </Text3DFlip>
            </h1>
            <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-3 relative flex items-center justify-center w-full h-[330px] sm:h-[380px] lg:h-[540px] overflow-hidden my-4 lg:my-0 lg:-translate-y-12">
              <div className="absolute w-52 h-52 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
              <Suspense fallback={<div className=" inset-0 mx-auto aspect-square w-full max-w-150"></div>}>
                <Globe />
              </Suspense>
            </div>
            <p className="order-3 lg:col-start-1 lg:row-start-2 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed relative z-10 mt-2 sm:mt-4 lg:mt-0">
              Plan itineraries for up to 5 locations with Driving, Transit, or Flight modes. Get day-by-day plans with
              Unsplash imagery and custom travel checklists.
            </p>
            <div className="order-4 lg:col-start-1 lg:row-start-3 pt-2 relative z-10">
              <ButtonWithIcon to="/ItineraryGenerator" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
