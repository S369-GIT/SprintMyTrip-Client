// src/components/ItineraryGenerator.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { AlertCircle, GripVertical, Plus, X, MapPin, Van, ArrowLeftRight, Plane } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_STOPS = [
  { id: "start", value: "", placeholder: "Starting Location (e.g., Chicago, IL)" },
  { id: "dest", value: "", placeholder: "Destination (e.g., Los Angeles, CA)" },
];
const DEFAULT_MODE = "Driving";

const ItineraryGenerator = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [stops, setStops] = useState(() => {
    const savedStops = localStorage.getItem("itinerary_stops");
    return savedStops ? JSON.parse(savedStops) : DEFAULT_STOPS;
  });

  const [activeMode, setActiveMode] = useState(() => {
    const savedMode = localStorage.getItem("itinerary_active_mode");
    return savedMode ? JSON.parse(savedMode) : DEFAULT_MODE;
  });

  const TRANSPORT_MODES = [
    { id: "Driving", icon: <Van /> },
    { id: "Transit", icon: <ArrowLeftRight /> },
    { id: "Flight", icon: <Plane /> },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating Route...");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("itinerary_stops", JSON.stringify(stops));
  }, [stops]);

  useEffect(() => {
    localStorage.setItem("itinerary_active_mode", JSON.stringify(activeMode));
  }, [activeMode]);

  const handleActiveState = (mode) => {
    if (activeMode === mode.id) return;
    setActiveMode(mode.id);
  };

  const handleInputChange = (id, text) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, value: text } : stop)));
  };

  const addStop = () => {
    const newStop = {
      id: `stop-${Date.now()}`,
      value: "",
      placeholder: `Stop ${stops.length - 1} `,
    };
    const updated = [...stops];
    updated.splice(updated.length - 1, 0, newStop);
    setStops(updated);
  };

  const removeStop = (id) => {
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedStops = Array.from(stops);
    const [removed] = reorderedStops.splice(result.source.index, 1);
    reorderedStops.splice(result.destination.index, 0, removed);

    setStops(reorderedStops);
  };

  const handleSubmit = async () => {
    const locations = stops.map((stop) => stop.value.trim()).filter((val) => val !== "");
    if (locations.length < 2) {
      setErrorMessage("Please enter at least a starting location and a destination.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const payload = {
      locations: locations,
      mode: activeMode.toLowerCase(),
    };

    try {
      setIsLoading(true);
      setLoadingText("Generating Itinerary...");
      setErrorMessage("");

      const response = await axios.post(`${BASE_URL}/generateItinerary`, payload);

      if (response.data && response.data?.data?.errorMessage) {
        setErrorMessage(response.data?.data.errorMessage);
        return;
      }

      // Save itinerary to recent_itineraries in localStorage
      const newEntry = {
        id: `itinerary-${Date.now()}`,
        timestamp: new Date().toISOString(),
        itineraryData: response.data,
      };

      const existingItineraries = JSON.parse(localStorage.getItem("recent_itineraries") || "[]");
      const updatedItineraries = [newEntry, ...existingItineraries];
      localStorage.setItem("recent_itineraries", JSON.stringify(updatedItineraries));
      window.dispatchEvent(new Event("recent_itineraries_updated"));

      localStorage.removeItem("itinerary_stops");
      localStorage.removeItem("itinerary_active_mode");
      setStops(DEFAULT_STOPS);
      setActiveMode(DEFAULT_MODE);

      // Pass the generated entry ID along with the data
      navigate("/ItineraryDisplay", {
        state: {
          itineraryData: response.data,
          itineraryId: newEntry.id,
        },
      });
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      let finalError = "Network error: Unable to contact the server.";

      if (error.response) {
        const responseData = error.response.data;
        if (typeof responseData === "object" && responseData.errorMessage) {
          finalError = responseData.errorMessage;
        } else {
          finalError = responseData;
        }
      }

      setErrorMessage(finalError);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SprintMyTrip Route Generator",
    url: "https://sprint-my-trip.vercel.app/ItineraryGenerator",
    applicationCategory: "TravelApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  return (
    <>
      <title>Generate Multi-Stop Travel Itinerary | SprintMyTrip</title>
      <meta
        name="description"
        content="Build custom multi-stop travel routes for up to 5 destinations. Choose driving, transit, or flight options to get instant day-by-day travel plans."
      />
      <link rel="canonical" href="https://sprint-my-trip.vercel.app/ItineraryGenerator" />
      <meta name="robots" content="index, follow" />

      {/* Tool Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <main className="bg-accent w-full min-h-[calc(100vh-60px)] py-20">
        <div className="px-7 flex justify-center">
          <Card className="w-full max-w-sm border-none p-0 shadow-none">
            <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-0">
              <CardHeader className="border-border border-b p-4">
                <CardTitle className="flex gap-2">
                  <MapPin />
                  Plan Your Route for {activeMode}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4">
                {errorMessage && (
                  <div className="mb-4 flex justify-center " role="alert" aria-live="assertive">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  </div>
                )}

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="itinerary-stops">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-3">
                        {stops.map((stop, index) => (
                          <Draggable key={stop.id} draggableId={stop.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-2 bg-background/50 p-1 rounded-md border border-transparent hover:border-border"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  tabIndex={-1}
                                  aria-label={`Drag to reorder stop ${index + 1}`}
                                  className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
                                >
                                  <GripVertical className="h-4 w-4" aria-hidden="true" />
                                </div>

                                <Input
                                  type="text"
                                  value={stop.value}
                                  aria-label={stop.placeholder}
                                  placeholder={stop.placeholder}
                                  onChange={(e) => handleInputChange(stop.id, e.target.value)}
                                  className="flex-1"
                                />

                                {stops.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`Remove ${stop.placeholder}`}
                                    onClick={() => removeStop(stop.id)}
                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Separator className="mt-4" />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={stops.length >= 5}
                  onClick={addStop}
                  className="mt-4 w-full gap-1 border-dashed text-muted-foreground disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Add Stop
                </Button>

                <div className="mt-4 flex gap-2 justify-around">
                  {TRANSPORT_MODES.map((mode) => (
                    <Button
                      aria-pressed={activeMode === mode.id}
                      key={mode.id}
                      role="button"
                      variant={activeMode === mode.id ? "default" : "outline"}
                      onClick={() => handleActiveState(mode)}
                    >
                      {mode.icon}
                      <span>{mode.id}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-border border-t p-4">
                <Button className="min-w-full" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      <span>{loadingText}</span>
                    </span>
                  ) : (
                    "Generate Route"
                  )}
                </Button>
              </CardFooter>
            </MagicCard>
          </Card>
        </div>
      </main>
    </>
  );
};

export default ItineraryGenerator;
