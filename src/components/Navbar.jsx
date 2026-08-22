import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { WifiOff, RotateCcwClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const isOnline = useOnlineStatus();

  // Lazy state initialization prevents synchronous setState on mount inside useEffect
  const [hasRecent, setHasRecent] = useState(() => {
    const recent = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
    return recent.length > 0;
  });

  useEffect(() => {
    const checkRecent = () => {
      const recent = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
      setHasRecent(recent.length > 0);
    };

    window.addEventListener("recent_itineraries_updated", checkRecent);
    window.addEventListener("storage", checkRecent);

    return () => {
      window.removeEventListener("recent_itineraries_updated", checkRecent);
      window.removeEventListener("storage", checkRecent);
    };
  }, []);

  return (
    <nav
      aria-label="Main Navigation"
      className="bg-background px-7 h-14 flex justify-between items-center border-b sticky top-0 z-50"
    >
      <Link to="/" aria-label="SprintMyTrip Homepage" className="font-heading text-2xl font-extrabold tracking-tight">
        <span className="text-green-700 ">Sprint</span>
        <span className="text-foreground italic ">My</span>
        <span className="text-green-700 ">Trip</span>
      </Link>

      <div className="flex items-center gap-4">
        {!isOnline && (
          <Badge
            variant="destructive"
            className="gap-1.5 px-2.5 py-0.5 text-xs font-medium animate-in fade-in duration-300"
          >
            <WifiOff className="h-3 w-3" aria-hidden="true" />
            No Internet
          </Badge>
        )}

        {hasRecent && (
          <Button
            variant="outline"
            size="icon"
            title="Recent Itineraries"
            aria-label="View recent itineraries"
            nativeButton={false}
            render={
              <Link to="/RecentItineraries" aria-label="View recent itineraries">
                <RotateCcwClock className="h-4 w-4" />
              </Link>
            }
          ></Button>
        )}

        <AnimatedThemeToggler />
      </div>
    </nav>
  );
};

export default Navbar;
