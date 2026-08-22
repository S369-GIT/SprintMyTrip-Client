// src/components/ItineraryDisplay.jsx
import { useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useTheme } from "next-themes";
import { ChevronRight, Clock, Car, Bus, Dot, Calendar, ListTodo, Download, Compass, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { Button } from "@/components/ui/button";
import TravelCard from "@/components/ui/travelCard";
import useThemeStatus from "../hooks/useThemeStatus";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";

const ItineraryDisplay = () => {
  const { theme } = useTheme();
  const isDark = useThemeStatus();
  const location = useLocation();

  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Itinerary",
  });

  // Try getting data from location state, or fallback to the latest item in localStorage on page refresh
  const activeItinerary = (() => {
    if (location.state?.itineraryData) {
      return {
        id: location.state.itineraryId,
        data: location.state.itineraryData.data,
      };
    }
    const saved = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
    if (saved.length > 0) {
      return {
        id: saved[0].id,
        data: saved[0].itineraryData?.data,
      };
    }
    return null;
  })();

  const responseData = activeItinerary?.data;
  const itineraryId = activeItinerary?.id;

  // Initialize checked items from localStorage
  const [checkedState, setCheckedState] = useState(() => {
    if (!itineraryId) return {};
    const recent = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
    const current = recent.find((item) => item.id === itineraryId);
    return current?.checkedState || {};
  });

  // Sync state changes with localStorage
  const handleCheckboxChange = (key, isChecked) => {
    const updatedState = { ...checkedState, [key]: isChecked };
    setCheckedState(updatedState);

    if (itineraryId) {
      const recent = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
      const updatedList = recent.map((item) => {
        if (item.id === itineraryId) {
          return { ...item, checkedState: updatedState };
        }
        return item;
      });
      localStorage.setItem("recent_itineraries", JSON.stringify(updatedList));
    }
  };

  if (!responseData) {
    return (
      <>
        <title>No Itinerary Found | SprintMyTrip</title>
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

  const { tripDetails, checklist, itinerary } = responseData;
  const isTransitMode = itinerary?.some((day) => day?.transitDetails != null);
  const pageTitle = tripDetails?.destination
    ? `Trip to ${tripDetails.destination} | SprintMyTrip`
    : "Your Trip Itinerary | SprintMyTrip";
  return (
    <>
      <title>{pageTitle}</title>
      <meta name="robots" content="noindex, nofollow" />
      <main ref={contentRef} className="bg-accent w-full min-h-[calc(100vh-60px)]">
        {/* Route Summary Header */}
        <div className="flex items-center justify-center w-full p-3 lg:p-7 max-w-5xl mx-auto print:hidden">
          <Card className="w-full border-none p-0 shadow-none rounded-2xl">
            <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl">Trip to {tripDetails?.destination}</CardTitle>
                <Button onClick={() => handlePrint()} size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download as PDF
                </Button>
              </CardHeader>
              <CardContent className="px-5 py-3">
                <div className="route-summary flex flex-wrap items-center gap-1">
                  {tripDetails?.route?.map((place, idx) => (
                    <div key={idx} className="flex items-center badge-chevron-group">
                      <Badge variant={isDark ? "secondary" : "default"}>{place}</Badge>
                      {idx < tripDetails.route.length - 1 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
                <div className="duration-mode-group flex items-center py-2 gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{tripDetails?.duration}</span>
                  <Dot />
                  {isTransitMode ? (
                    <>
                      <Bus className="h-4 w-4 text-foreground" />
                      <span className="text-foreground font-medium">Public Transit</span>
                    </>
                  ) : (
                    <>
                      <Car className="h-4 w-4 text-foreground" />
                      <span className="text-foreground font-medium">Driving</span>
                    </>
                  )}
                </div>
              </CardContent>
            </MagicCard>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-3 lg:p-7 max-w-5xl mx-auto">
          {/* Itinerary Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="icon-heading-group flex gap-2 items-center">
              <Calendar className="w-6 h-6" aria-hidden="true" />
              <h2 className="text-xl font-bold">Day-by-Day Schedule</h2>
            </div>
            <div className="travel-card-container gap-7 flex flex-col">
              {itinerary?.map((dayData) => (
                <TravelCard key={dayData.day} dayData={dayData} />
              ))}
            </div>
          </div>

          {/* Dynamic Checklist Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 self-start w-full max-w-sm">
            <div className="icon-heading-group flex gap-2 items-center">
              <ListTodo className="w-6 h-6" />
              <h3 className="text-xl font-bold">Trip Checklist</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              <Card className="p-8 rounded-2xl space-y-6 mr-1">
                {/* Essentials */}
                {checklist?.essentials?.length > 0 && (
                  <div className="checklist-group flex flex-col gap-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-sm">ESSENTIALS</h4>
                    <FieldGroup className="max-w-sm">
                      {checklist.essentials.map((item, idx) => {
                        const key = `essentials-${idx}`;
                        return (
                          <Field key={idx} orientation="horizontal">
                            <Checkbox
                              id={key}
                              name={key}
                              checked={!!checkedState[key]}
                              onCheckedChange={(checked) => handleCheckboxChange(key, !!checked)}
                            />
                            <Label htmlFor={key}>{item}</Label>
                          </Field>
                        );
                      })}
                    </FieldGroup>
                  </div>
                )}

                {/* Clothing */}
                {checklist?.clothing?.length > 0 && (
                  <div className="checklist-group flex flex-col gap-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-sm">CLOTHING</h4>
                    <FieldGroup className="max-w-sm">
                      {checklist.clothing.map((item, idx) => {
                        const key = `clothing-${idx}`;
                        return (
                          <Field key={idx} orientation="horizontal">
                            <Checkbox
                              id={key}
                              name={key}
                              checked={!!checkedState[key]}
                              onCheckedChange={(checked) => handleCheckboxChange(key, !!checked)}
                            />
                            <Label htmlFor={key}>{item}</Label>
                          </Field>
                        );
                      })}
                    </FieldGroup>
                  </div>
                )}

                {/* Documents */}
                {checklist?.documents?.length > 0 && (
                  <div className="checklist-group flex flex-col gap-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-sm">DOCUMENTS</h4>
                    <FieldGroup className="max-w-sm">
                      {checklist.documents.map((item, idx) => {
                        const key = `doc-${idx}`;
                        return (
                          <Field key={idx} orientation="horizontal">
                            <Checkbox
                              id={key}
                              name={key}
                              checked={!!checkedState[key]}
                              onCheckedChange={(checked) => handleCheckboxChange(key, !!checked)}
                            />
                            <Label htmlFor={key}>{item}</Label>
                          </Field>
                        );
                      })}
                    </FieldGroup>
                  </div>
                )}
              </Card>
            </ScrollArea>
          </div>
        </div>
      </main>
    </>
  );
};

export default ItineraryDisplay;
