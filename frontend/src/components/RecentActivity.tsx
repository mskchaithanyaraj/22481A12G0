import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { TrendingUp, Schedule, Public } from "@mui/icons-material";

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: "created" | "clicked" | "shared";
    url: string;
    timestamp: Date;
  }>;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <TrendingUp sx={{ fontSize: 16 }} />;
      case "clicked":
        return <Schedule sx={{ fontSize: 16 }} />;
      case "shared":
        return <Public sx={{ fontSize: 16 }} />;
      default:
        return <TrendingUp sx={{ fontSize: 16 }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "created":
        return "success";
      case "clicked":
        return "primary";
      case "shared":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>

        {activities.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={2}
          >
            No recent activity
          </Typography>
        ) : (
          <Box>
            {activities.slice(0, 5).map((activity) => (
              <Box
                key={activity.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py={1}
                borderBottom={1}
                borderColor="divider"
                sx={{ "&:last-child": { borderBottom: 0 } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    icon={getActivityIcon(activity.type)}
                    label={activity.type}
                    size="small"
                    color={
                      getActivityColor(activity.type) as
                        | "default"
                        | "primary"
                        | "secondary"
                        | "success"
                    }
                    variant="outlined"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {activity.url}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {formatTime(activity.timestamp)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
