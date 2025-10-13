import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | PingPe</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div>
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-bold text-foreground mt-4">Page not found</h2>
            <p className="text-muted-foreground mt-2">
              Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/stays">
                <Search className="w-4 h-4 mr-2" />
                Browse Stays
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
