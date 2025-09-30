import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  LineChart,
  Line,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import {
  Analytics as AnalyticsIcon,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Map as MapIcon,
  Speed as GaugeIcon,
  Timeline,
  Help as HelpIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Speed as GaugeIcon2,
  Assessment as AssessmentIcon,
  Insights as InsightsIcon,
} from "@mui/icons-material";

// Color palette for charts
const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#38f9d7",
  "#ffecd2",
  "#fcb69f",
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    heatMap: [],
    barChart: [],
    pieChart: [],
    trendLine: [],
    gauge: {},
    overview: {},
  });
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [heatMapHelpOpen, setHeatMapHelpOpen] = useState(false);
  const [barChartHelpOpen, setBarChartHelpOpen] = useState(false);
  const [pieChartHelpOpen, setPieChartHelpOpen] = useState(false);
  const [trendLineHelpOpen, setTrendLineHelpOpen] = useState(false);
  const [gaugeHelpOpen, setGaugeHelpOpen] = useState(false);

  const tabs = [
    { label: "Overview", icon: <AnalyticsIcon />, value: 0 },
    { label: "Heat Map", icon: <MapIcon />, value: 1 },
    { label: "Bar Charts", icon: <BarChartIcon />, value: 2 },
    { label: "Pie Charts", icon: <PieChartIcon />, value: 3 },
    { label: "Trend Lines", icon: <Timeline />, value: 4 },
    { label: "Gauges", icon: <GaugeIcon />, value: 5 },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/analytics/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch analytics data");
      }
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Help Dialog Component
  const HelpDialog = () => (
    <Dialog
      open={helpDialogOpen}
      onClose={() => setHelpDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <InfoIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Overview Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This overview provides key metrics and insights about your campaign's
          performance. Here's what each section means:
        </Typography>

        {/* Key Metrics Cards */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Key Metrics Cards
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Total Voters"
              secondary="The total number of voters currently registered in your system"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Total Supporters"
              secondary="The total number of campaign supporters across all polling stations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Polling Stations"
              secondary="The total number of polling stations in your campaign area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Supporter Ratio"
              secondary="Percentage of supporters relative to total voters (Supporters ÷ Voters × 100)"
            />
          </ListItem>
        </List>

        {/* Performance Metrics */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Performance Metrics
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Average Voter Density"
              secondary="Percentage of registered voters who have actually been registered in the system"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Average Supporter Density"
              secondary="Percentage of supporters relative to actual voters in the system"
            />
          </ListItem>
        </List>

        {/* Capacity Analysis */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🏢 Capacity Analysis
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Capacity Utilization"
              secondary="How effectively polling stations are being used (Actual Voters ÷ Registered Voters × 100)"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary="Total Capacity"
              secondary="Total number of registered voters across all polling stations"
            />
          </ListItem>
        </List>

        {/* Performance Insights */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          💡 Performance Insights
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Best Performing Area"
              secondary="The ward or area with the highest voter registration and supporter engagement"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Utilized Capacity"
              secondary="Total number of voters actually registered in the system (not just registered at polling stations)"
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> These metrics help you understand campaign
            performance, identify areas needing attention, and track progress
            over time. Higher percentages generally indicate better engagement
            and coverage.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHelpDialogOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Heat Map Help Dialog Component
  const HeatMapHelpDialog = () => (
    <Dialog
      open={heatMapHelpOpen}
      onClose={() => setHeatMapHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <MapIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Heat Map Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Heat Map shows the geographic distribution of voter and supporter
          density across all polling stations. Here's how to understand what
          you're seeing:
        </Typography>

        {/* Chart Elements */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🗺️ Chart Elements
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Data Points (Blue Circles)"
              secondary="Each circle represents a polling station. Larger circles indicate higher voter/supporter density."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="X-Axis (Longitude)"
              secondary="Horizontal position showing the east-west location of polling stations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Y-Axis (Latitude)"
              secondary="Vertical position showing the north-south location of polling stations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Circle Size (Z-Axis)"
              secondary="The size of each circle represents the heat intensity or density at that location"
            />
          </ListItem>
        </List>

        {/* Tooltip Information */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          💡 Hover Information
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Station Name"
              secondary="The name of the polling station (e.g., 'Wangapala Primary School')"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Location Details"
              secondary="Ward and constituency information for geographic context"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Density Percentage"
              secondary="Heat intensity as a percentage (0-100%) showing voter/supporter concentration"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Voter Statistics"
              secondary="Registered voters, actual voters, and supporter counts for each station"
            />
          </ListItem>
        </List>

        {/* Density Legend */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🎨 Density Legend
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Chip label="High" color="error" size="small" />
            </ListItemIcon>
            <ListItemText
              primary="High Density (80-100%)"
              secondary="Areas with very high voter/supporter concentration - excellent coverage"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Chip label="Medium" color="warning" size="small" />
            </ListItemIcon>
            <ListItemText
              primary="Medium Density (50-80%)"
              secondary="Areas with moderate concentration - good coverage, may need attention"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Chip label="Low" color="success" size="small" />
            </ListItemIcon>
            <ListItemText
              primary="Low Density (0-50%)"
              secondary="Areas with low concentration - may need more campaign focus"
            />
          </ListItem>
        </List>

        {/* How to Use */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🔍 How to Use This Map
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Identify Hotspots"
              secondary="Look for clusters of large circles to find areas with high voter/supporter density"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Find Gaps"
              secondary="Small or missing circles indicate areas that may need more campaign attention"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Plan Resources"
              secondary="Use density patterns to allocate campaign resources and supporters effectively"
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Hover over any data point to see detailed
            information about that polling station. Use this map to identify
            patterns and make data-driven campaign decisions.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHeatMapHelpOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Bar Chart Help Dialog Component
  const BarChartHelpDialog = () => (
    <Dialog
      open={barChartHelpOpen}
      onClose={() => setBarChartHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <BarChartIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Bar Charts Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Bar Charts show performance comparisons across different wards and
          areas. Here's how to understand what you're seeing:
        </Typography>

        {/* Chart Elements */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Chart Elements
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <BarChartIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Bar Heights"
              secondary="The height of each bar represents the performance metric value for that ward/area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="X-Axis (Ward Names)"
              secondary="Horizontal axis shows the names of different wards or areas being compared"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Y-Axis (Values)"
              secondary="Vertical axis shows the scale of values for the performance metrics"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Color Coding"
              secondary="Different colors represent different performance levels or categories"
            />
          </ListItem>
        </List>

        {/* Data Metrics */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Performance Metrics
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Total Stations"
              secondary="Number of polling stations in each ward/area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Registered Voters"
              secondary="Total number of voters registered in each area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Actual Voters"
              secondary="Number of voters actually registered in the system for each area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Supporter Density"
              secondary="Concentration of campaign supporters in each ward/area"
            />
          </ListItem>
        </List>

        {/* How to Read */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🔍 How to Read the Charts
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Compare Heights"
              secondary="Taller bars indicate better performance or higher values in that area"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Identify Patterns"
              secondary="Look for consistent high or low performers across different metrics"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Spot Gaps"
              secondary="Areas with consistently low bars may need more attention or resources"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Track Progress"
              secondary="Use these charts to monitor improvements over time and allocate resources"
            />
          </ListItem>
        </List>

        {/* Chart Types */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Chart Types
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <BarChartIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Performance Comparison"
              secondary="Shows voter registration rates and supporter density across different areas"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Capacity Analysis"
              secondary="Compares total capacity vs actual utilization across wards"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Resource Allocation"
              secondary="Helps identify where to focus campaign efforts and resources"
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Use these bar charts to compare performance
            across different areas and make data-driven decisions about where to
            focus your campaign efforts. Higher bars generally indicate better
            performance or higher engagement.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBarChartHelpOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Pie Chart Help Dialog Component
  const PieChartHelpDialog = () => (
    <Dialog
      open={pieChartHelpOpen}
      onClose={() => setPieChartHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PieChartIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Pie Charts Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Pie Charts show distribution patterns and performance breakdowns.
          Here's how to understand what you're seeing:
        </Typography>

        {/* Chart Elements */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🥧 Chart Elements
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PieChartIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Pie Slices"
              secondary="Each slice represents a category or group. Larger slices indicate higher values or percentages."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Colors"
              secondary="Different colors distinguish between categories. Hover over slices to see detailed information."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Percentages"
              secondary="Each slice shows the percentage of the total that category represents."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Center Text"
              secondary="The center displays the name of the largest or selected category."
            />
          </ListItem>
        </List>

        {/* Chart Types */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Chart Types
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Voter Distribution by Polling Station"
              secondary="Shows how voters are distributed across different polling stations. Each slice represents one station's voter count."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Station Performance Overview"
              secondary="Shows performance distribution across stations (Excellent, Good, Fair, Poor). Helps identify overall performance patterns."
            />
          </ListItem>
        </List>

        {/* How to Read */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🔍 How to Read the Charts
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Compare Sizes"
              secondary="Larger slices represent higher values. Compare slice sizes to identify the most significant categories."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Hover for Details"
              secondary="Hover over any slice to see exact values and percentages. Click to highlight specific categories."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Identify Patterns"
              secondary="Look for dominant categories (very large slices) or balanced distributions (similar slice sizes)."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Track Changes"
              secondary="Use these charts to monitor how distributions change over time and identify trends."
            />
          </ListItem>
        </List>

        {/* Data Interpretation */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Data Interpretation
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Voter Distribution"
              secondary="Shows which polling stations have the most voters. Large slices indicate high voter concentration."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Performance Levels"
              secondary="Shows the breakdown of station performance. More 'Excellent' slices indicate better overall performance."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Resource Allocation"
              secondary="Use these insights to allocate resources where they're needed most or where performance is lacking."
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> These pie charts help you understand
            distribution patterns at a glance. Use them to identify dominant
            categories, spot imbalances, and make data-driven decisions about
            resource allocation and focus areas.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPieChartHelpOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Trend Line Help Dialog Component
  const TrendLineHelpDialog = () => (
    <Dialog
      open={trendLineHelpOpen}
      onClose={() => setTrendLineHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingUp color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Trend Lines Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Trend Lines show voter registration progress over time with both
          daily and cumulative data. Here's how to understand what you're
          seeing:
        </Typography>

        {/* Chart Elements */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Chart Elements
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Area Chart"
              secondary="Two overlapping areas show daily registrations and cumulative totals. The filled areas make it easy to see patterns over time."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="X-Axis (Time)"
              secondary="Shows dates from the last 30 days. Each point represents one day's data."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Y-Axis (Count)"
              secondary="Shows the number of registrations. The scale adjusts automatically based on your data range."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InfoIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Legend"
              secondary="Two data series: 'Daily Registrations' (blue) and 'Cumulative Total' (pink). Click legend items to toggle visibility."
            />
          </ListItem>
        </List>

        {/* Data Series */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Data Series Explained
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Daily Registrations (Blue Area)"
              secondary="Shows how many voters registered each day. Peaks indicate high registration days, valleys show low activity."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Cumulative Total (Pink Area)"
              secondary="Shows the running total of all registrations from the start of the period. Always increases or stays flat."
            />
          </ListItem>
        </List>

        {/* How to Read */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🔍 How to Read the Chart
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Track Daily Patterns"
              secondary="Look for patterns in daily registrations - are there certain days with higher activity? Weekends vs weekdays?"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Monitor Growth Rate"
              secondary="The steepness of the cumulative line shows registration speed. Steeper = faster growth, flatter = slower growth."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Identify Trends"
              secondary="Is registration increasing, decreasing, or stable? Look for upward trends (good) or downward trends (concerning)."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Hover for Details"
              secondary="Hover over any point to see exact daily and cumulative numbers for that specific date."
            />
          </ListItem>
        </List>

        {/* Data Interpretation */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Data Interpretation
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Registration Momentum"
              secondary="Consistent daily registrations indicate steady momentum. Sporadic patterns may suggest campaign timing issues."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Campaign Effectiveness"
              secondary="Sudden spikes in daily registrations often correlate with campaign events, outreach efforts, or media coverage."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Progress Tracking"
              secondary="Use cumulative totals to track progress toward registration goals and identify if you're on track."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Resource Planning"
              secondary="Identify peak registration days to allocate more resources and staff during high-activity periods."
            />
          </ListItem>
        </List>

        {/* Key Metrics */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🎯 Key Metrics to Watch
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Peak Days"
              secondary="Days with the highest daily registrations - indicates successful campaign activities or events."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Growth Rate"
              secondary="How quickly the cumulative total is increasing - faster growth means better campaign performance."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Consistency"
              secondary="Regular daily registrations indicate sustained campaign effectiveness and voter engagement."
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Use this trend analysis to optimize your
            campaign strategy. Identify what drives peak registration days and
            replicate those successful approaches. Monitor the cumulative line
            to ensure you're meeting your registration targets.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTrendLineHelpOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Gauge Help Dialog Component
  const GaugeHelpDialog = () => (
    <Dialog
      open={gaugeHelpOpen}
      onClose={() => setGaugeHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GaugeIcon2 color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Gauges Tab - Data Explanation
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The Gauges show key performance metrics and capacity utilization
          across your polling stations. Here's how to understand what you're
          seeing:
        </Typography>

        {/* Chart Elements */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📊 Gauge Elements
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Overall Capacity Utilization"
              secondary="Shows the percentage of registered voters who have actually registered. Higher percentages indicate better voter engagement."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Supporter Density"
              secondary="Shows the ratio of supporters to actual voters. Higher density indicates better campaign coverage and support."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Performance Distribution"
              secondary="Breaks down polling stations by performance levels: Excellent (90%+), Good (70-90%), Fair (50-70%), Poor (<50%)."
            />
          </ListItem>
        </List>

        {/* Key Metrics */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🎯 Key Metrics Explained
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Voter Registration Rate"
              secondary="Percentage of registered voters who have actually registered. Target: 80%+ for good performance."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Supporter Coverage"
              secondary="Number of supporters per voter. Higher ratios indicate better campaign coverage and grassroots support."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Station Performance Levels"
              secondary="Distribution of stations across performance categories. More 'Excellent' stations indicate better overall performance."
            />
          </ListItem>
        </List>

        {/* Performance Categories */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          📈 Performance Categories
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Box sx={{ color: "success.main", fontSize: 20 }}>●</Box>
            </ListItemIcon>
            <ListItemText
              primary="Excellent (90%+)"
              secondary="Stations with very high voter registration rates. These are your best-performing locations."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Box sx={{ color: "info.main", fontSize: 20 }}>●</Box>
            </ListItemIcon>
            <ListItemText
              primary="Good (70-90%)"
              secondary="Stations with good performance. Above average but with room for improvement."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Box sx={{ color: "warning.main", fontSize: 20 }}>●</Box>
            </ListItemIcon>
            <ListItemText
              primary="Fair (50-70%)"
              secondary="Stations with average performance. Need focused attention and improvement strategies."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Box sx={{ color: "error.main", fontSize: 20 }}>●</Box>
            </ListItemIcon>
            <ListItemText
              primary="Poor (<50%)"
              secondary="Stations requiring immediate attention. Low performance indicates significant issues to address."
            />
          </ListItem>
        </List>

        {/* How to Use */}
        <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 3 }}>
          🔍 How to Use This Data
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <InsightsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Identify Focus Areas"
              secondary="Look for stations in 'Fair' or 'Poor' categories that need immediate attention and resource allocation."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUp color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Track Progress"
              secondary="Monitor how the distribution changes over time. More stations moving to 'Excellent' indicates improvement."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssessmentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Resource Planning"
              secondary="Allocate more resources to underperforming stations and replicate successful strategies from excellent stations."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GaugeIcon2 color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="Set Targets"
              secondary="Use these metrics to set realistic targets for improving station performance and overall voter engagement."
            />
          </ListItem>
        </List>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>💡 Tip:</strong> Focus on moving stations from 'Poor' to
            'Fair' and 'Fair' to 'Good' categories. This will have the biggest
            impact on your overall performance. Use the excellent stations as
            models for what works well in your area.
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setGaugeHelpOpen(false)} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Modern Card Component (from Home.jsx)
  const ModernCard = ({ title, subtitle, icon, children }) => (
    <Card
      sx={{
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        border: "1px solid rgba(102, 126, 234, 0.1)",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
          transform: "translateY(-2px)",
          borderColor: "rgba(102, 126, 234, 0.2)",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent
        sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {icon && (
                <Avatar
                  sx={{
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    color: "#667eea",
                    mr: 2,
                    width: 40,
                    height: 40,
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  {icon}
                </Avatar>
              )}
              <Typography variant="h6" fontWeight="600" color="#2c3e50">
                {title}
              </Typography>
            </Box>
            {subtitle && (
              <Typography variant="body2" color="#7f8c8d">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );

  // CardItem component similar to Home.jsx
  const CardItem = (props) => {
    const getCardStyle = (title) => {
      switch (title) {
        case "Total Voters":
          return {
            icon: <AnalyticsIcon sx={{ fontSize: 45, color: "#1976d2" }} />,
            bgColor: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            borderColor: "#1976d2",
            textColor: "#1976d2",
          };
        case "Total Supporters":
          return {
            icon: <TrendingUp sx={{ fontSize: 45, color: "#7b1fa2" }} />,
            bgColor: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
            borderColor: "#7b1fa2",
            textColor: "#7b1fa2",
          };
        case "Polling Stations":
          return {
            icon: <MapIcon sx={{ fontSize: 45, color: "#388e3c" }} />,
            bgColor: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
            borderColor: "#388e3c",
            textColor: "#388e3c",
          };
        case "Supporter Ratio":
          return {
            icon: <GaugeIcon sx={{ fontSize: 45, color: "#f57c00" }} />,
            bgColor: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
            borderColor: "#f57c00",
            textColor: "#f57c00",
          };
        default:
          return {
            icon: <AnalyticsIcon sx={{ fontSize: 45, color: "#666" }} />,
            bgColor: "linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)",
            borderColor: "#666",
            textColor: "#666",
          };
      }
    };

    const { title, value } = props;
    const style = getCardStyle(title);

    return (
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0px 10px 30px #60606040",
            background: style.bgColor,
            border: `2px solid ${style.borderColor}`,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 15px 40px #60606060",
            },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {style.icon}
            </Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: style.textColor, mb: 1 }}
            >
              {value?.toLocaleString() || 0}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: style.textColor }}
            >
              {title}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderOverview = () => (
    <Box>
      {/* Overview Header with Help Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Campaign Overview
        </Typography>
        <IconButton
          onClick={() => setHelpDialogOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the data shown here"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* Key Metrics Cards - Same as Home.jsx */}
      <Grid container spacing={3}>
        <CardItem
          title="Total Voters"
          value={analyticsData.overview?.totalVoters || 0}
        />
        <CardItem
          title="Total Supporters"
          value={analyticsData.overview?.totalSupporters || 0}
        />
        <CardItem
          title="Polling Stations"
          value={analyticsData.overview?.totalPollingStations || 0}
        />
        <CardItem
          title="Supporter Ratio"
          value={`${analyticsData.overview?.voterSupporterRatio || 0}%`}
        />
      </Grid>

      {/* Quick Stats - 3 columns with 2 stacked vertically each */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Performance Metrics
              </Typography>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">
                    Average Voter Density
                  </Typography>
                  <Chip
                    label={`${
                      analyticsData.gauge?.overall?.voterRegistrationRate?.toFixed(
                        1
                      ) || 0
                    }%`}
                    color="primary"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(156, 39, 176, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(156, 39, 176, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">
                    Average Supporter Density
                  </Typography>
                  <Chip
                    label={`${
                      analyticsData.gauge?.overall?.supporterDensity?.toFixed(
                        1
                      ) || 0
                    }%`}
                    color="secondary"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Capacity Analysis
              </Typography>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(76, 175, 80, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(76, 175, 80, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">Capacity Utilization</Typography>
                  <Chip
                    label={`${
                      analyticsData.gauge?.overall?.voterRegistrationRate?.toFixed(
                        1
                      ) || 0
                    }%`}
                    color="success"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(0, 188, 212, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(0, 188, 212, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">Total Capacity</Typography>
                  <Chip
                    label={`${
                      analyticsData.gauge?.overall?.totalRegisteredVoters?.toLocaleString() ||
                      0
                    }`}
                    color="info"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom fontWeight="600">
                Performance Insights
              </Typography>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(25, 118, 210, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">Best Performing Area</Typography>
                  <Chip
                    label={analyticsData.barChart?.[0]?.name || "N/A"}
                    color="primary"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    backgroundColor: "rgba(255, 152, 0, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 152, 0, 0.1)",
                  }}
                >
                  <Typography fontWeight="500">Utilized Capacity</Typography>
                  <Chip
                    label={`${
                      analyticsData.gauge?.overall?.totalActualVoters?.toLocaleString() ||
                      0
                    }`}
                    color="warning"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderHeatMap = () => (
    <Box>
      {/* Header with Help Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Voter/Supporter Density Heat Map
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Geographic distribution of voter and supporter density across
            polling stations
          </Typography>
        </Box>
        <IconButton
          onClick={() => setHeatMapHelpOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the heat map data"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* Heat Map Visualization - Full Width */}
      <Box
        sx={{
          height: 500,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
          width: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            data={analyticsData.heatMap}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              type="number"
              dataKey="coordinates[0]"
              name="Longitude"
              scale="linear"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis
              type="number"
              dataKey="coordinates[1]"
              name="Latitude"
              scale="linear"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <ZAxis type="number" dataKey="heatIntensity" range={[50, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                padding: "12px",
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div>
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        {data.name || "Unknown Station"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {data.ward || "Unknown Ward"},{" "}
                        {data.constituency || "Unknown Constituency"}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Density:</strong>{" "}
                        {((data.heatIntensity || 0) * 100).toFixed(1)}%
                      </div>
                      <div>
                        <strong>Registered Voters:</strong>{" "}
                        {data.registeredVoters?.toLocaleString() || 0}
                      </div>
                      <div>
                        <strong>Actual Voters:</strong>{" "}
                        {data.actualVoters?.toLocaleString() || 0}
                      </div>
                      <div>
                        <strong>Supporters:</strong>{" "}
                        {data.supporters?.toLocaleString() || 0}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              dataKey="heatIntensity"
              fill="#667eea"
              fillOpacity={0.7}
              stroke="#667eea"
              strokeWidth={2}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>

      {/* Heat Map Legend */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="600">
          Density Legend
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip
            label="High Density (80-100%)"
            color="error"
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label="Medium Density (50-80%)"
            color="warning"
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Chip
            label="Low Density (0-50%)"
            color="success"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>
    </Box>
  );

  // Custom Bar Chart Component (similar to Home component)
  const CustomBarChart = ({ data, title, height = 400 }) => {
    return (
      <Box height={height} width="100%">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="voterRegistrationRate"
                fill="#667eea"
                name="Registration Rate (%)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="supporterDensity"
                fill="#f093fb"
                name="Supporter Density (%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography variant="body2" color="text.secondary">
              No performance data available
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderBarCharts = () => (
    <Box>
      {/* Header with Help Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Performance Comparison by Ward
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Voter registration rates and supporter density across different
            areas
          </Typography>
        </Box>
        <IconButton
          onClick={() => setBarChartHelpOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the bar chart data"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* Bar Chart Visualization - Full Width */}
      <Box
        sx={{
          height: 500,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
          width: "100%",
        }}
      >
        <CustomBarChart data={analyticsData.barChart} height={450} />
      </Box>
    </Box>
  );

  // Custom Pie Chart Component (similar to Home component)
  const CustomPieChart = ({ data, title, height = 300 }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => {
      setActiveIndex(index);
    };

    const renderActiveShape = (props) => {
      const RADIAN = Math.PI / 180;
      const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
      } = props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 2) * cos;
      const sy = cy + (outerRadius + 2) * sin;
      const mx = cx + (outerRadius + 2) * cos;
      const my = cy + (outerRadius + 2) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? "start" : "end";

      return (
        <g>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload.name}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 2}
            outerRadius={outerRadius + 6}
            fill={fill}
          />
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
          />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 4}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
            fontSize="small"
          >{`${value}`}</text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 4}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
            fontSize="small"
          >
            {`(${(percent * 100).toFixed(0)}%)`}
          </text>
        </g>
      );
    };

    return (
      <Box height={height} width="100%">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="90%"
                innerRadius="50%"
                fill="#8884d8"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="body2">No data available</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderPieCharts = () => (
    <Box>
      {/* Header with Help Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Distribution Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Voter distribution and performance breakdown across polling stations
          </Typography>
        </Box>
        <IconButton
          onClick={() => setPieChartHelpOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the pie chart data"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <ModernCard
            title="Voter Distribution by Polling Station"
            subtitle="Distribution of voters across polling stations"
            icon={<PieChartIcon />}
          >
            <CustomPieChart data={analyticsData.pieChart} height={250} />
          </ModernCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <ModernCard
            title="Station Performance Overview"
            subtitle="Performance distribution across stations"
            icon={<PieChartIcon />}
          >
            <CustomPieChart
              data={[
                {
                  name: "Excellent",
                  value: analyticsData.gauge?.performance?.excellent || 0,
                },
                {
                  name: "Good",
                  value: analyticsData.gauge?.performance?.good || 0,
                },
                {
                  name: "Fair",
                  value: analyticsData.gauge?.performance?.fair || 0,
                },
                {
                  name: "Poor",
                  value: analyticsData.gauge?.performance?.poor || 0,
                },
              ].filter((item) => item.value > 0)}
              height={250}
            />
          </ModernCard>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTrendLines = () => (
    <Box>
      {/* Header with Help Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Voter Registration Trends (Last 30 Days)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Daily voter registration progress and cumulative totals
          </Typography>
        </Box>
        <IconButton
          onClick={() => setTrendLineHelpOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the trend line data"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* Trend Line Visualization - Full Width */}
      <Box
        sx={{
          height: 500,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
          width: "100%",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={analyticsData.trendLine}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Area
              type="monotone"
              dataKey="value"
              stackId="1"
              stroke="#667eea"
              fill="#667eea"
              fillOpacity={0.6}
              name="Daily Registrations"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stackId="2"
              stroke="#f093fb"
              fill="#f093fb"
              fillOpacity={0.3}
              name="Cumulative Total"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );

  const renderGauges = () => (
    <Box>
      {/* Header with Help Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            Performance Gauges & Metrics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Key performance indicators and capacity utilization across polling
            stations
          </Typography>
        </Box>
        <IconButton
          onClick={() => setGaugeHelpOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
            },
          }}
          title="Click to understand the gauge data"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      {/* First Row - Two Main Gauges */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
                transform: "translateY(-2px)",
                borderColor: "rgba(102, 126, 234, 0.2)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="600" color="#2c3e50">
                    Overall Capacity Utilization
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d">
                    Current voter registration rate
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h2" color="primary" fontWeight="bold">
                    {analyticsData.gauge?.overall?.voterRegistrationRate || 0}%
                  </Typography>
                  <Typography variant="h6" color="#7f8c8d">
                    Voter Registration Rate
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d" sx={{ mt: 1 }}>
                    {analyticsData.gauge?.overall?.totalActualVoters || 0} of{" "}
                    {analyticsData.gauge?.overall?.totalRegisteredVoters || 0}{" "}
                    registered
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
                transform: "translateY(-2px)",
                borderColor: "rgba(102, 126, 234, 0.2)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="600" color="#2c3e50">
                    Supporter Density
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d">
                    Supporter coverage ratio
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h2" color="secondary" fontWeight="bold">
                    {analyticsData.gauge?.overall?.supporterDensity || 0}%
                  </Typography>
                  <Typography variant="h6" color="#7f8c8d">
                    Supporter Coverage
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d" sx={{ mt: 1 }}>
                    {analyticsData.gauge?.overall?.totalSupporters || 0}{" "}
                    supporters for{" "}
                    {analyticsData.gauge?.overall?.totalActualVoters || 0}{" "}
                    voters
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row - Performance Distribution */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(102, 126, 234, 0.15)",
                transform: "translateY(-2px)",
                borderColor: "rgba(102, 126, 234, 0.2)",
              },
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="600" color="#2c3e50">
                    Station Performance Distribution
                  </Typography>
                  <Typography variant="body2" color="#7f8c8d">
                    Performance breakdown across all polling stations
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    textAlign="center"
                    p={3}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(76, 175, 80, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="bold"
                    >
                      {analyticsData.gauge?.performance?.excellent || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#7f8c8d"
                      fontWeight="500"
                    >
                      Excellent (90%+)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    textAlign="center"
                    p={3}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(33, 150, 243, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="info.main"
                      fontWeight="bold"
                    >
                      {analyticsData.gauge?.performance?.good || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#7f8c8d"
                      fontWeight="500"
                    >
                      Good (70-90%)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    textAlign="center"
                    p={3}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(255, 152, 0, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="bold"
                    >
                      {analyticsData.gauge?.performance?.fair || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#7f8c8d"
                      fontWeight="500"
                    >
                      Fair (50-70%)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    textAlign="center"
                    p={3}
                    sx={{
                      background:
                        "linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)",
                      borderRadius: 3,
                      border: "1px solid rgba(244, 67, 54, 0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="error.main"
                      fontWeight="bold"
                    >
                      {analyticsData.gauge?.performance?.poor || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#7f8c8d"
                      fontWeight="500"
                    >
                      Poor (&lt;50%)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderOverview();
      case 1:
        return renderHeatMap();
      case 2:
        return renderBarCharts();
      case 3:
        return renderPieCharts();
      case 4:
        return renderTrendLines();
      case 5:
        return renderGauges();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 1.5,
          color: "#2c3e50",
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Campaign Analytics Dashboard
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(102, 126, 234, 0.1)",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "rgba(102, 126, 234, 0.1)",
            backgroundColor: "rgba(102, 126, 234, 0.02)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: "#667eea",
                fontWeight: 600,
                minHeight: 60,
                "&.Mui-selected": {
                  color: "#667eea",
                  backgroundColor: "rgba(102, 126, 234, 0.08)",
                },
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#667eea",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 1.5 }}>{renderTabContent()}</Box>
      </Card>

      {/* Help Dialogs */}
      <HelpDialog />
      <HeatMapHelpDialog />
      <BarChartHelpDialog />
      <PieChartHelpDialog />
      <TrendLineHelpDialog />
      <GaugeHelpDialog />
    </Box>
  );
};

export default Analytics;
