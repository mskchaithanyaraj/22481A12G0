import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
  Button,
} from "@mui/material";
import {
  ContentCopy,
  Check,
  ExpandMore,
  ExpandLess,
  Delete,
  Edit,
  Analytics,
} from "@mui/icons-material";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

interface UrlCardProps {
  url: ShortenedUrl;
  onCopy: (shortUrl: string, id: string) => void;
  onDelete: (id: string) => void;
  copiedId: string | null;
}

export const UrlCard: React.FC<UrlCardProps> = ({
  url,
  onCopy,
  onDelete,
  copiedId,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        mb: 2,
        "&:last-child": { mb: 0 },
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box flex={1} minWidth={200}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "300px",
              }}
            >
              {url.originalUrl}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Typography
                variant="h6"
                color="primary.main"
                sx={{
                  wordBreak: "break-all",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                component="a"
                href={`${window.location.protocol}//${url.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.protocol}//{url.shortUrl}
              </Typography>
              <Tooltip
                title={copiedId === url.id ? "Copied!" : "Copy to clipboard"}
              >
                <IconButton
                  size="small"
                  onClick={() => onCopy(url.shortUrl, url.id)}
                  color={copiedId === url.id ? "success" : "primary"}
                >
                  {copiedId === url.id ? <Check /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`${url.clicks} clicks`}
              size="small"
              color="secondary"
              icon={<Analytics />}
            />
            <Typography variant="caption" color="text.secondary">
              {url.createdAt.toLocaleDateString()}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              color="primary"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box mt={2} pt={2} borderTop={1} borderColor="divider">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Full URL: {url.originalUrl}
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              <Button size="small" startIcon={<Edit />} variant="outlined">
                Edit
              </Button>
              <Button
                size="small"
                startIcon={<Delete />}
                variant="outlined"
                color="error"
                onClick={() => onDelete(url.id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
