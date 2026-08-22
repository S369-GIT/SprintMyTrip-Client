import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight, Trash2, MapPin, Compass, Plus } from "lucide-react";
import useThemeStatus from "@/hooks/useThemeStatus";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RecentItineraries = () => {
  const { theme } = useTheme();
  const isDark = useThemeStatus();
  const navigate = useNavigate();

  const [recentList, setRecentList] = useState(() => {
    return JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
  });

  // States to track open confirmation dialogs
  const [deleteId, setDeleteId] = useState(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const handleSelect = (item) => {
    navigate("/ItineraryDisplay", {
      state: {
        itineraryData: item.itineraryData,
        itineraryId: item.id,
      },
    });
  };

  const confirmRemove = () => {
    if (!deleteId) return;
    const updated = recentList.filter((item) => item.id !== deleteId);
    setRecentList(updated);
    localStorage.setItem("recent_itineraries", JSON.stringify(updated));
    window.dispatchEvent(new Event("recent_itineraries_updated"));
    setDeleteId(null);
  };

  const confirmClearAll = () => {
    setRecentList([]);
    localStorage.removeItem("recent_itineraries");
    window.dispatchEvent(new Event("recent_itineraries_updated"));
    setIsClearAllOpen(false);
  };

  if (recentList.length === 0) {
    return (
      <>
        <title>Recent Trips | SprintMyTrip</title>
        <meta name="robots" content="noindex, nofollow" />
        <main className="flex min-h-[calc(100vh-60px)] w-full items-center justify-center bg-accent p-5">
          <Card className="w-full max-w-sm border-none p-0 shadow-none">
            <MagicCard
              gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-2xl  p-8 text-center shadow-lg"
            >
              <div className="space-y-4">
                {/* Compass and heading are now side-by-side */}
                <div className="flex items-center justify-center gap-2">
                  <Compass className="h-8 w-8 animate-pulse text-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">No Saved Itineraries</h2>
                </div>

                <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                  You haven't generated any trip plans yet. Create your first customized route to view it here anytime.
                </p>
              </div>

              <Button
                className="mt-2 inline-flex items-center justify-center gap-2"
                nativeButton={false}
                render={
                  <Link to="/ItineraryGenerator">
                    <Plus className="h-4 w-4" />
                    <span>Plan a New Trip</span>
                  </Link>
                }
              />
            </MagicCard>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <title>Recent Trips | SprintMyTrip</title>
      <meta name="robots" content="noindex, nofollow" />{" "}
      <main className="bg-accent w-full min-h-[calc(100vh-60px)] p-5 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Recent Itineraries</h1>
            <Button variant="outline" size="sm" onClick={() => setIsClearAllOpen(true)} className="gap-2">
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          </div>

          <div className="grid gap-4">
            {recentList.map((item) => {
              const details = item.itineraryData?.data?.tripDetails;
              const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "";

              return (
                <Card
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer border-none shadow-none rounded-xl overflow-hidden hover:opacity-95 transition-opacity p-0"
                >
                  <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-5">
                    <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Trip to {details?.destination || "Unknown Destination"}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {details?.route?.map((place, idx) => (
                          <div key={idx} className="flex items-center">
                            <Badge variant={isDark ? "secondary" : "default"}>{place}</Badge>
                            {idx < details.route.length - 1 && <ChevronRight className="h-4 w-4" />}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 mt-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{details?.duration}</span>
                      </div>
                      {dateStr && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Generated: {dateStr}</span>
                        </div>
                      )}
                    </CardFooter>
                  </MagicCard>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Delete Single Item Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this itinerary from your saved list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Clear All Items Confirmation Dialog */}
        <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Recent Itineraries?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your saved itineraries.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
};

export default RecentItineraries;
