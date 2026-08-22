import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ItineraryGeneratorSkeleton() {
  return (
    <main
      className="bg-accent w-full min-h-[calc(100vh-60px)] py-20"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading travel itinerary planner"
    >
      <h1 className="sr-only">Generate Multi-Stop Travel Itinerary</h1>

      <div className="px-7 flex justify-center">
        <Card className="w-full max-w-sm border-none p-0 shadow-none">
          <div className="bg-card rounded-xl border border-border text-card-foreground shadow-xs">
            {/* Header Skeleton */}
            <CardHeader className="border-border border-b p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Input Stops Skeleton */}
              <div className="grid gap-3">
                <div className="flex items-center gap-2 bg-background/50 p-1 rounded-md border border-transparent">
                  <Skeleton className="h-4 w-4 rounded shrink-0" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="flex items-center gap-2 bg-background/50 p-1 rounded-md border border-transparent">
                  <Skeleton className="h-4 w-4 rounded shrink-0" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>

              {/* Separator */}
              <Skeleton className="h-px w-full my-4" />

              {/* Add Stop Button */}
              <Skeleton className="h-9 w-full rounded-md" />

              {/* Transport Modes */}
              <div className="flex gap-2 justify-between pt-1">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-border border-t p-4">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </div>
        </Card>
      </div>
    </main>
  );
}
