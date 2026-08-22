import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";

export default function ErrorElement() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { theme } = useTheme();

  let title = "Something went wrong";
  let message = "An unexpected error occurred while loading this page.";
  let status = null;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Page Not Found";
      message = "The page you are looking for doesn't exist or has been moved.";
    } else {
      title = `${error.status} - ${error.statusText || "Error"}`;
      message = error.data?.message || "An error occurred while processing your request.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <>
      <title>{`${title} | SprintMyTrip`}</title>
      <meta name="robots" content="noindex, nofollow" />
      <main className="bg-accent w-full min-h-[calc(100vh-60px)] flex items-center justify-center p-5">
        <Card className="w-full max-w-md border-none p-0 shadow-none">
          <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-0">
            <CardHeader className="border-border border-b p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              {status && (
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {status} Error
                </span>
              )}
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
            </CardContent>

            <CardFooter className="border-border border-t p-4 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>

              <Button
                size="sm"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </CardFooter>
          </MagicCard>
        </Card>
      </main>
    </>
  );
}
