import { useState, useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Card, CardTitle, CardHeader, CardContent } from "./card";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Dot, Camera, Loader2, Bus, Train, CarTaxiFront, Clock, Navigation } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TravelCard = ({ dayData }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [images, setImages] = useState(dayData?.images || []);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const [distance, setDistance] = useState(null);
  const [isLoadingDistance, setIsLoadingDistance] = useState(false);

  const dayNumber = dayData?.day ?? 1;
  const theme = dayData?.theme || "Journey Overview";
  const places = dayData?.NamesOfPlacesToVisit || [];
  const activities = dayData?.activities || [];
  const transitDetails = dayData?.transitDetails;

  // Fetch driving distance via OSRM when in viewport
  useEffect(() => {
    const fetchDistance = async () => {
      const coords = dayData?.distanceCoordinates;
      if (!inView || !coords || coords.length < 2 || distance !== null) return;

      const start = coords[0];
      const end = coords[1];

      if (
        start?.longitude === undefined ||
        start?.latitude === undefined ||
        end?.longitude === undefined ||
        end?.latitude === undefined
      ) {
        return;
      }

      setIsLoadingDistance(true);
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=false`;
        const res = await axios.get(url);

        if (res.data?.routes?.[0]?.distance !== undefined) {
          const distanceInKm = Math.round(res.data.routes[0].distance / 1000);
          setDistance(distanceInKm);
        }
      } catch (err) {
        console.error("Error fetching distance from OSRM:", err);
      } finally {
        setIsLoadingDistance(false);
      }
    };

    fetchDistance();
  }, [inView, dayData, distance]);

  // Fetch destination images when in viewport
  useEffect(() => {
    const fetchImages = async () => {
      if (!inView || places.length === 0 || images.length > 0) return;

      setIsLoadingImages(true);
      try {
        const imagePromises = places.map(async (place) => {
          try {
            const imgRes = await axios.get(`${BASE_URL}/getImages?location=${encodeURIComponent(place)}`);
            if (imgRes.data?.success && imgRes.data?.images) {
              return imgRes.data.images;
            }
          } catch (err) {
            console.error(`Failed to fetch images for: ${place}`, err);
          }
          return [];
        });

        const placeImagesResults = await Promise.all(imagePromises);
        const rawImages = placeImagesResults.flat();

        const uniqueImages = Array.from(new Map(rawImages.map((img) => [img.id, img])).values());
        setImages(uniqueImages);
      } catch (error) {
        console.error("Error fetching location images:", error);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [inView, places, images.length]);

  return (
    <Card ref={ref} className="px-0 py-8 lg:p-8 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Day {dayNumber}</CardTitle>
            <Badge variant="outline" className="h-6">
              {transitDetails ? <Navigation className="h-3.5 w-3.5 mr-1" /> : <Car className="h-3.5 w-3.5 mr-1" />}
              <span>{isLoadingDistance ? "..." : distance !== null ? `${distance} km` : "N/A"}</span>
            </Badge>
          </div>
          <Badge>{theme}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Places tags */}
        <div className="places-pin-container p-1 flex flex-wrap gap-2">
          {places.length > 0 ? (
            places.map((place, index) => (
              <Badge key={index} variant="ghost">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {place}
              </Badge>
            ))
          ) : (
            <Badge variant="ghost">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Local Exploration
            </Badge>
          )}
        </div>

        {/* Dynamic Image Carousel / Loading state */}
        {isLoadingImages ? (
          <div className="h-44 bg-muted flex flex-col gap-2 items-center justify-center rounded-xl text-muted-foreground border border-dashed">
            <Loader2 className="w-8 h-8 animate-spin opacity-50" />
            <p className="text-sm">Fetching destination photos...</p>
          </div>
        ) : images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={`${img.id}-${index}`}>
                  <div className="p-1">
                    <Card className="p-0 h-64 overflow-hidden border-none relative">
                      <CardContent className="relative flex aspect-square items-center justify-center p-0 h-full w-full overflow-hidden rounded-xl">
                        <img
                          src={img.urls.regular || img.urls.small}
                          alt={img.description || "Destination Image"}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Image Caption & Unsplash Attribution */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 space-y-1">
                          {img.description && (
                            <p className="text-sm font-medium line-clamp-1 capitalize">{img.description}</p>
                          )}

                          {img.attribution && (
                            <p className="text-xs text-gray-300">
                              Photo by{" "}
                              <a
                                href={img.attribution.photographerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-white transition-colors"
                              >
                                {img.attribution.photographer}
                              </a>{" "}
                              on{" "}
                              <a
                                href={img.attribution.unsplashUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-white transition-colors"
                              >
                                Unsplash
                              </a>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="h-44 bg-muted flex flex-col gap-2 items-center justify-center rounded-xl text-muted-foreground border border-dashed">
            <Camera className="w-8 h-8 opacity-50" />
            <p className="text-sm">No destination photos available for this day.</p>
          </div>
        )}

        {/* Transit Details Section */}
        {transitDetails && (
          <div className="bg-muted/40 border border-border/80 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <Bus className="h-4 w-4 text-primary" />
              <span>Transit & Logistics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {/* Bus Details */}
              {(transitDetails.nearestBusStation || transitDetails.busTimings?.length > 0) && (
                <div className="bg-background p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                    <Bus className="h-3.5 w-3.5" />
                    <span>Bus Details</span>
                  </div>
                  {transitDetails.nearestBusStation && (
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">Station: </span>
                      {transitDetails.nearestBusStation}
                    </p>
                  )}
                  {transitDetails.busTimings?.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      {transitDetails.busTimings.map((timing, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 text-xs text-foreground bg-secondary/60 rounded-md px-2.5 py-1.5 leading-snug break-words whitespace-normal max-w-full"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="flex-1">{timing}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Train / Metro Details */}
              {(transitDetails.nearestTrainStation || transitDetails.trainDetails) && (
                <div className="bg-background p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                    <Train className="h-3.5 w-3.5" />
                    <span>Train / Metro</span>
                  </div>
                  {transitDetails.nearestTrainStation && (
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">Station: </span>
                      {transitDetails.nearestTrainStation}
                    </p>
                  )}
                  {transitDetails.trainDetails && (
                    <p className="text-xs text-muted-foreground leading-relaxed break-words whitespace-normal">
                      {transitDetails.trainDetails}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Taxi & App Ride Details */}
            {transitDetails.taxis && (
              <div className="bg-background p-3 rounded-lg border border-border/60 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                  <CarTaxiFront className="h-3.5 w-3.5" />
                  <span>Taxi & Local Transport</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed break-words whitespace-normal">
                  {transitDetails.taxis}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Activities List */}
        <ul className="day-details-list flex flex-col gap-3 pt-2">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <li key={index} className="flex gap-2 text-muted-foreground text-[1rem]">
                <Dot className="shrink-0" />
                <span>{activity}</span>
              </li>
            ))
          ) : (
            <li className="flex gap-2 text-muted-foreground text-[1rem]">
              <Dot className="shrink-0" />
              No specific activities listed for this day.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TravelCard;
