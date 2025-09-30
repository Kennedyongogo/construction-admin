import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Construction as ProjectIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Engineering as EngineerIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as TaskIcon,
  Build as MaterialIcon,
  Construction as EquipmentIcon,
  TrendingUp as ProgressIcon,
  Warning as IssueIcon,
  Notes as NotesIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to build absolute URL for uploaded assets (same as Users component)
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const getBackendBaseUrl = () => {
    if (!VITE_API_URL) return window.location.origin;
    return VITE_API_URL.endsWith("/api")
      ? VITE_API_URL.slice(0, -4)
      : VITE_API_URL;
  };
  const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("uploads/"))
      return `${getBackendBaseUrl()}/${imageUrl}`;
    if (imageUrl.startsWith("/uploads/"))
      return `${getBackendBaseUrl()}${imageUrl}`;
    return imageUrl;
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await fetch(`/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProject(result.data);
      } else {
        setError(result.message || "Failed to fetch project details");
      }
    } catch (err) {
      setError("Failed to fetch project details");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "info";
      case "in_progress":
        return "warning";
      case "completed":
        return "success";
      case "on_hold":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount, currency = "KES") => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/projects")}
        >
          Back to Projects
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Project not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/projects")}
        >
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="lg" sx={{ px: 0 }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 3,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="relative"
            zIndex={1}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/projects")}
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Back
              </Button>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {project.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Project Details
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/projects/${id}/edit`)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Edit Project
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ProjectIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Project Status
                        </Typography>
                        <Chip
                          label={project.status?.toUpperCase()}
                          color={getStatusColor(project.status)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {project.location_name || "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Start Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(project.start_date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          End Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(project.end_date)}
                        </Typography>
                      </Box>
                    </Box>
                    {project.notes && (
                      <Box display="flex" alignItems="flex-start" gap={1}>
                        <NotesIcon />
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Notes
                          </Typography>
                          <Typography variant="body1">
                            {project.notes}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Financial & Progress */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Financial & Progress
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MoneyIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Budget Estimate
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            project.budget_estimate,
                            project.currency
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MoneyIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Actual Cost
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(
                            project.actual_cost,
                            project.currency
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ProjectIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Progress
                        </Typography>
                        <Typography variant="body1">
                          {project.progress_percent || 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccountBalanceIcon />
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Funding Source
                        </Typography>
                        <Typography variant="body1">
                          {project.funding_source || "Not specified"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Description */}
            {project.description && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <DescriptionIcon />
                      <Typography variant="h6">Description</Typography>
                    </Box>
                    <Typography variant="body1">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Stakeholders */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Project Stakeholders
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <BusinessIcon />
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Contractor
                          </Typography>
                          <Typography variant="body1">
                            {project.contractor_name || "Not specified"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <BusinessIcon />
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Client
                          </Typography>
                          <Typography variant="body1">
                            {project.client_name || "Not specified"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <AccountBalanceIcon />
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Funding Source
                          </Typography>
                          <Typography variant="body1">
                            {project.funding_source || "Not specified"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Project Blueprints */}
            {project.blueprint_url && project.blueprint_url.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Project Blueprints ({project.blueprint_url.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {project.blueprint_url.map((url, index) => {
                        const fileName =
                          url.split("/").pop() || `Blueprint ${index + 1}`;
                        const isImage = fileName.match(
                          /\.(jpg|jpeg|png|gif|bmp|webp)$/i
                        );

                        // Construct full URL for the image (same as Users component)
                        const fullImageUrl = buildImageUrl(url);

                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                p: 2,
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 2,
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                              onClick={() => {
                                window.open(fullImageUrl, "_blank");
                              }}
                            >
                              {isImage ? (
                                <Box>
                                  <img
                                    src={fullImageUrl}
                                    alt={fileName}
                                    style={{
                                      width: "100%",
                                      height: "150px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      marginBottom: "8px",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "block";
                                    }}
                                  />
                                  <Box
                                    textAlign="center"
                                    sx={{ display: "none" }}
                                  >
                                    <ImageIcon
                                      sx={{
                                        fontSize: 48,
                                        color: "white",
                                        mb: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "white",
                                        display: "block",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {fileName}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "white",
                                      textAlign: "center",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.8,
                                      color: "white",
                                      display: "block",
                                      textAlign: "center",
                                    }}
                                  >
                                    Click to view full size
                                  </Typography>
                                </Box>
                              ) : (
                                <Box textAlign="center">
                                  <ImageIcon
                                    sx={{ fontSize: 48, color: "white", mb: 1 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "white",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.8,
                                      color: "white",
                                      display: "block",
                                    }}
                                  >
                                    Click to download
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Documents */}
            {project.documents && project.documents.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Project Documents ({project.documents.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {project.documents.map((document, index) => {
                        const fileName =
                          document.file_name ||
                          document.name ||
                          `Document ${index + 1}`;
                        const fileUrl = document.file_url || document.url;
                        const isImage = fileName.match(
                          /\.(jpg|jpeg|png|gif|bmp|webp)$/i
                        );

                        // Construct full URL for the document (same as Users component)
                        const fullDocumentUrl = buildImageUrl(fileUrl);

                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                p: 2,
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderRadius: 2,
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.02)",
                                },
                              }}
                              onClick={() => {
                                if (fullDocumentUrl) {
                                  window.open(fullDocumentUrl, "_blank");
                                }
                              }}
                            >
                              {isImage && fullDocumentUrl ? (
                                <Box>
                                  <img
                                    src={fullDocumentUrl}
                                    alt={fileName}
                                    style={{
                                      width: "100%",
                                      height: "150px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      marginBottom: "8px",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "block";
                                    }}
                                  />
                                  <Box
                                    textAlign="center"
                                    sx={{ display: "none" }}
                                  >
                                    <ImageIcon
                                      sx={{
                                        fontSize: 48,
                                        color: "white",
                                        mb: 1,
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "white",
                                        display: "block",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {fileName}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "white",
                                      textAlign: "center",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.8,
                                      color: "white",
                                      display: "block",
                                      textAlign: "center",
                                    }}
                                  >
                                    Click to view full size
                                  </Typography>
                                </Box>
                              ) : (
                                <Box textAlign="center">
                                  <ImageIcon
                                    sx={{ fontSize: 48, color: "white", mb: 1 }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "white",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.8,
                                      color: "white",
                                      display: "block",
                                    }}
                                  >
                                    {document.file_type || "Document"}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Engineer Info */}
            {project.engineer && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Engineer in Charge
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                        {project.engineer.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {project.engineer.name}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mb={0.5}
                        >
                          <EmailIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {project.engineer.email}
                          </Typography>
                        </Box>
                        {project.engineer.phone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon sx={{ fontSize: 16 }} />
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {project.engineer.phone}
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.6, mt: 0.5 }}
                        >
                          Role:{" "}
                          {project.engineer.role
                            ?.replace("_", " ")
                            .toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Tasks */}
            {project.tasks && project.tasks.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <TaskIcon />
                      <Typography variant="h6">
                        Project Tasks ({project.tasks.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.tasks.map((task, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {task.title || task.name || `Task ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {task.description ||
                                task.status ||
                                "No description"}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Materials */}
            {project.materials && project.materials.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <MaterialIcon />
                      <Typography variant="h6">
                        Materials ({project.materials.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.materials.map((material, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {material.name ||
                                material.title ||
                                `Material ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {material.description ||
                                material.type ||
                                "No description"}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Equipment */}
            {project.equipment && project.equipment.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <EquipmentIcon />
                      <Typography variant="h6">
                        Equipment ({project.equipment.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.equipment.map((equipment, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {equipment.name ||
                                equipment.title ||
                                `Equipment ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {equipment.description ||
                                equipment.type ||
                                "No description"}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Budgets */}
            {project.budgets && project.budgets.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <MoneyIcon />
                      <Typography variant="h6">
                        Budget Details ({project.budgets.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.budgets.map((budget, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {budget.category ||
                                budget.name ||
                                `Budget ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Amount:{" "}
                              {formatCurrency(budget.amount, project.currency)}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Progress Updates */}
            {project.progressUpdates && project.progressUpdates.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <ProgressIcon />
                      <Typography variant="h6">
                        Progress Updates ({project.progressUpdates.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.progressUpdates.map((update, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {update.title ||
                                update.description ||
                                `Update ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {update.date
                                ? formatDate(update.date)
                                : "No date"}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Project Issues */}
            {project.issues && project.issues.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <IssueIcon />
                      <Typography variant="h6">
                        Project Issues ({project.issues.length})
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {project.issues.map((issue, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 2,
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {issue.title ||
                                issue.description ||
                                `Issue ${index + 1}`}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {issue.status || issue.priority || "No status"}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectView;
