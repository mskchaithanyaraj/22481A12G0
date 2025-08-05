import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  useMediaQuery,
  Fab,
  Zoom,
} from "@mui/material";
import {
  Link as LinkIcon,
  Speed,
  Security,
  Analytics,
  TrendingUp,
  Public,
  Add,
  DarkMode,
  LightMode,
  GitHub,
} from "@mui/icons-material";
import { UrlCard } from "./components/UrlCard";
import { StatsCard } from "./components/StatsCard";
import { RecentActivity } from "./components/RecentActivity";
import { logger } from "./utils/logger";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

interface Activity {
  id: string;
  type: "created" | "clicked" | "shared";
  url: string;
  timestamp: Date;
}

function App() {
  const [url, setUrl] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load URLs from localStorage on app start
  useEffect(() => {
    const savedUrls = localStorage.getItem("shortenedUrls");
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls).map(
          (url: ShortenedUrl & { createdAt: string }) => ({
            ...url,
            createdAt: new Date(url.createdAt),
          })
        );
        setShortenedUrls(parsedUrls);
      } catch (error) {
        console.error("Error loading saved URLs:", error);
      }
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    if (shortenedUrls.length > 0) {
      localStorage.setItem("shortenedUrls", JSON.stringify(shortenedUrls));
    }
  }, [shortenedUrls]);

  // Log app initialization
  useEffect(() => {
    logger.info("component", "URL Shortener app initialized");
  }, []);

  // Handle URL redirection for shortened URLs
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== "/" && path.length > 1) {
      const shortCode = path.substring(1); // Remove leading slash

      // Only proceed if we have URLs to check against
      if (shortenedUrls.length > 0) {
        const foundUrl = shortenedUrls.find((url) =>
          url.shortUrl.endsWith(shortCode)
        );

        if (foundUrl) {
          // Increment click count
          setShortenedUrls((prev) =>
            prev.map((url) =>
              url.id === foundUrl.id ? { ...url, clicks: url.clicks + 1 } : url
            )
          );

          // Log the click
          logger.info("component", `Redirecting to: ${foundUrl.originalUrl}`);

          // Add activity
          addActivity("clicked", foundUrl.shortUrl);

          // Redirect to original URL
          window.location.href = foundUrl.originalUrl;
        } else {
          // URL not found, redirect to home
          logger.warn("component", `Short URL not found: ${shortCode}`);
          window.history.replaceState({}, "", "/");
        }
      }
    }
  }, [shortenedUrls]);

  const isMobile = useMediaQuery("(max-width:600px)");

  // Create a dynamic theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
      },
      secondary: {
        main: "#ec4899",
        light: "#f472b6",
        dark: "#db2777",
      },
      background: {
        default: darkMode ? "#0f172a" : "#f8fafc",
        paper: darkMode ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#f8fafc" : "#1e293b",
        secondary: darkMode ? "#cbd5e1" : "#475569",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 700,
        background: "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortUrl = () => {
    const baseUrl = window.location.host; // Gets current host (localhost:5173 or production domain)
    return `${baseUrl}/${Math.random().toString(36).substr(2, 8)}`;
  };

  const addActivity = (type: "created" | "clicked" | "shared", url: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      url,
      timestamp: new Date(),
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      logger.warn("component", "URL shortening attempted with empty URL");
      setSnackbar({
        open: true,
        message: "Please enter a URL",
        severity: "error",
      });
      return;
    }

    if (!isValidUrl(url)) {
      logger.error("component", `Invalid URL format attempted: ${url}`);
      setSnackbar({
        open: true,
        message: "Please enter a valid URL",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    logger.info("component", `URL shortening initiated for: ${url}`);

    // Simulate API call
    setTimeout(() => {
      const newShortenedUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: url,
        shortUrl: generateShortUrl(),
        clicks: Math.floor(Math.random() * 100), // Simulate some initial clicks
        createdAt: new Date(),
      };

      setShortenedUrls((prev) => [newShortenedUrl, ...prev]);
      addActivity("created", newShortenedUrl.shortUrl);
      setUrl("");
      logger.info(
        "component",
        `URL shortened successfully: ${newShortenedUrl.shortUrl}`
      );
      setSnackbar({
        open: true,
        message: "URL shortened successfully!",
        severity: "success",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleCopy = async (shortUrl: string, id: string) => {
    try {
      const fullUrl = `${window.location.protocol}//${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      addActivity("shared", shortUrl);
      logger.info("component", `URL copied to clipboard: ${shortUrl}`);
      setSnackbar({
        open: true,
        message: "Copied to clipboard!",
        severity: "success",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      logger.error("component", `Failed to copy URL to clipboard: ${shortUrl}`);
      setSnackbar({ open: true, message: "Failed to copy", severity: "error" });
    }
  };

  const handleDelete = (id: string) => {
    const urlToDelete = shortenedUrls.find((url) => url.id === id);
    setShortenedUrls((prev) => prev.filter((url) => url.id !== id));
    logger.info("component", `URL deleted: ${urlToDelete?.shortUrl || id}`);
    setSnackbar({
      open: true,
      message: "URL deleted successfully!",
      severity: "success",
    });
  };

  const handleClearAll = () => {
    setShortenedUrls([]);
    setActivities([]);
    localStorage.removeItem("shortenedUrls");
    logger.info("component", "All URLs cleared");
    setSnackbar({
      open: true,
      message: "All URLs cleared!",
      severity: "success",
    });
  };

  const totalClicks = shortenedUrls.reduce((sum, url) => sum + url.clicks, 0);
  const averageClicks =
    shortenedUrls.length > 0
      ? Math.round(totalClicks / shortenedUrls.length)
      : 0;

  // Add some sample activities for demo
  useEffect(() => {
    if (activities.length === 0 && shortenedUrls.length > 0) {
      const sampleActivities: Activity[] = [
        {
          id: "1",
          type: "clicked",
          url: shortenedUrls[0]?.shortUrl || "localhost:5173/demo1",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        },
        {
          id: "2",
          type: "shared",
          url: shortenedUrls[0]?.shortUrl || "localhost:5173/demo2",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        },
      ];
      setActivities(sampleActivities);
    }
  }, [shortenedUrls, activities.length]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: darkMode
            ? "rgba(15, 23, 42, 0.8)"
            : "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <LinkIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: darkMode ? "primary.main" : "text.primary",
              fontWeight: 600,
            }}
          >
            Short.ly
          </Typography>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: darkMode ? "grey.300" : "grey.700",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
          {shortenedUrls.length > 0 && (
            <Button
              onClick={handleClearAll}
              size="small"
              sx={{
                mr: 1,
                color: darkMode ? "grey.300" : "grey.700",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                },
              }}
            >
              Clear All
            </Button>
          )}
          <IconButton
            href="https://github.com/mskchaithanyaraj/22481A12G0.git"
            target="_blank"
            sx={{
              color: darkMode ? "grey.300" : "grey.700",
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            }}
          >
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom>
              URL Shortener
            </Typography>
            <Typography
              variant="h6"
              color={darkMode ? "grey.300" : "grey.800"}
              sx={{
                opacity: 0.9,
                textShadow: darkMode ? "none" : "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Transform your long URLs into short, shareable links
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={3}
          >
            {/* Main Content */}
            <Box flex={1}>
              {/* Main Form */}
              <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                <Box
                  display="flex"
                  gap={2}
                  alignItems="flex-start"
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <TextField
                    fullWidth
                    label="Enter your long URL"
                    variant="outlined"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    onKeyPress={(e) => e.key === "Enter" && handleShorten()}
                    error={Boolean(url && !isValidUrl(url))}
                    helperText={
                      url && !isValidUrl(url) ? "Please enter a valid URL" : ""
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={handleShorten}
                    disabled={isLoading}
                    sx={{
                      minWidth: 120,
                      height: 56,
                      background:
                        "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #4f46e5 30%, #db2777 90%)",
                      },
                    }}
                    startIcon={<LinkIcon />}
                    fullWidth={isMobile}
                  >
                    {isLoading ? "Shortening..." : "Shorten"}
                  </Button>
                </Box>
              </Paper>

              {/* Shortened URLs */}
              {shortenedUrls.length > 0 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Shortened URLs
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {shortenedUrls.map((item) => (
                    <UrlCard
                      key={item.id}
                      url={item}
                      onCopy={handleCopy}
                      onDelete={handleDelete}
                      copiedId={copiedId}
                    />
                  ))}
                </Paper>
              )}
            </Box>

            {/* Sidebar */}
            <Box sx={{ width: isMobile ? "100%" : "300px" }}>
              {/* Stats */}
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={2}
                mb={3}
              >
                <StatsCard
                  title="Total URLs"
                  value={shortenedUrls.length}
                  icon={<LinkIcon sx={{ fontSize: 24 }} />}
                  color="primary"
                />
                <StatsCard
                  title="Total Clicks"
                  value={totalClicks}
                  icon={<TrendingUp sx={{ fontSize: 24 }} />}
                  color="success"
                />
                <StatsCard
                  title="Avg. Clicks"
                  value={averageClicks}
                  icon={<Analytics sx={{ fontSize: 24 }} />}
                  color="secondary"
                />
                <StatsCard
                  title="Active Links"
                  value={shortenedUrls.length}
                  icon={<Public sx={{ fontSize: 24 }} />}
                  color="warning"
                />
              </Box>

              {/* Recent Activity */}
              <RecentActivity activities={activities} />
            </Box>
          </Box>

          {/* Features */}
          <Box
            display="grid"
            gridTemplateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"}
            gap={3}
            mt={4}
          >
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Speed sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Fast & Reliable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lightning-fast URL shortening with 99.9% uptime
              </Typography>
            </Card>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Security sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Secure
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced security measures to protect your links
              </Typography>
            </Card>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Analytics sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track clicks and monitor link performance
              </Typography>
            </Card>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={6}>
            <Typography
              variant="body2"
              color={darkMode ? "grey.400" : "grey.700"}
              sx={{
                opacity: 0.8,
                textShadow: darkMode ? "none" : "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Made with ❤️ using Material-UI
            </Typography>
          </Box>
        </Container>

        {/* Floating Action Button */}
        <Zoom in={shortenedUrls.length > 3}>
          <Fab
            color="primary"
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              background: "linear-gradient(45deg, #6366f1 30%, #ec4899 90%)",
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Add />
          </Fab>
        </Zoom>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
