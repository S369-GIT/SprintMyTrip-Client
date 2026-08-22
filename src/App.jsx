import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import ErrorElement from "./components/ErrorElement";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./components/Home";
// import ItineraryDisplay from "./components/ItineraryDisplay";
import { lazy, Suspense } from "react";
import ItineraryGeneratorSkeleton from "@/pages/ItineraryGeneratorSkeleton";

// import RecentItineraries from "./components/RecentItineraries";

// import ItineraryGenerator from "./components/ItineraryGenerator";

const ItineraryGenerator = lazy(() => import("./pages/ItineraryGenerator"));

// 2. Lazy imports

const ErrorElement = lazy(() => import("@/components/errorElement"));

const ItineraryDisplay = lazy(() => import("@/pages/ItineraryDisplay"));
const RecentItineraries = lazy(() => import("@/pages/RecentItineraries"));

function MainLayout() {
  return (
    <>
      <meta
        name="description"
        content="Plan multi-stop itineraries with transit, driving, or flight options in seconds. Free customizable travel checklists and day-by-day routes."
      />
      <meta name="robots" content="index, follow" />

      <Navbar />

      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/ItineraryGenerator", // Matches "/settings"
        element: (
          <Suspense fallback={<ItineraryGeneratorSkeleton />}>
            <ItineraryGenerator />
          </Suspense>
        ),
      },
      { path: "/ItineraryDisplay", element: <ItineraryDisplay /> },
      { path: "/RecentItineraries", element: <RecentItineraries /> },
    ],
  },
]);
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router}> </RouterProvider>
    </ThemeProvider>
  );
}
