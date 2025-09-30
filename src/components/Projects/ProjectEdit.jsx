import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Container,
  Paper,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  AttachMoney as MoneyIcon,
  Engineering as EngineerIcon,
  Construction as ProjectIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    location_name: "",
    latitude: "",
    longitude: "",
    status: "planning",
    start_date: "",
    end_date: "",
    budget_estimate: "",
    actual_cost: "",
    currency: "KES",
    contractor_name: "",
    client_name: "",
    funding_source: "",
    engineer_in_charge: "",
    progress_percent: 0,
    notes: "",
  });
  const [blueprintUrls, setBlueprintUrls] = useState([]);
  const [blueprintFiles, setBlueprintFiles] = useState([]);
  const [blueprintPreviews, setBlueprintPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [projectFiles, setProjectFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

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
        setProjectForm({
          name: result.data.name || "",
          description: result.data.description || "",
          location_name: result.data.location_name || "",
          latitude: result.data.latitude || "",
          longitude: result.data.longitude || "",
          status: result.data.status || "planning",
          start_date: result.data.start_date
            ? result.data.start_date.split("T")[0]
            : "",
          end_date: result.data.end_date
            ? result.data.end_date.split("T")[0]
            : "",
          budget_estimate: result.data.budget_estimate || "",
          actual_cost: result.data.actual_cost || "",
          currency: result.data.currency || "KES",
          contractor_name: result.data.contractor_name || "",
          client_name: result.data.client_name || "",
          funding_source: result.data.funding_source || "",
          engineer_in_charge: result.data.engineer_in_charge || "",
          progress_percent: result.data.progress_percent || 0,
          notes: result.data.notes || "",
        });
        setProjectFiles(result.data.documents || []);
        setBlueprintUrls(
          Array.isArray(result.data.blueprint_url)
            ? result.data.blueprint_url
            : result.data.blueprint_url
            ? [result.data.blueprint_url]
            : []
        );
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

  const handleInputChange = (field, value) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create previews for image files
    const newPreviews = [];
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file: file,
            preview: e.target.result,
            name: file.name,
          });
          setFilePreviews((prev) => [...prev, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBlueprintFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [...blueprintFiles, ...files];
    setBlueprintFiles(newFiles);

    // Generate previews for image files
    const newPreviews = [...blueprintPreviews];
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setBlueprintPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews.push(null);
        setBlueprintPreviews([...newPreviews]);
      }
    });
  };

  const removeBlueprintFile = (index) => {
    const newFiles = blueprintFiles.filter((_, i) => i !== index);
    const newPreviews = blueprintPreviews.filter((_, i) => i !== index);
    setBlueprintFiles(newFiles);
    setBlueprintPreviews(newPreviews);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return [];

    setUploadingFiles(true);
    const uploadedFiles = [];

    try {
      // Upload all files in a single request
      const formData = new FormData();

      // Add all files to the form data
      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      formData.append("project_id", id);

      // Get the current user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      formData.append("uploaded_by_admin_id", user.id);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Upload response:", result);

      if (result.success) {
        // result.data is an array of documents
        uploadedFiles.push(...result.data);
      } else {
        console.error("Upload failed:", result.message);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingFiles(false);
    }

    return uploadedFiles;
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Upload new files first
      const uploadedFiles = await uploadFiles();
      console.log("Uploaded files:", uploadedFiles);

      // Update project with new file URLs
      const allDocumentUrls = [
        ...projectFiles.map((doc) => doc.file_url || doc.url).filter(Boolean),
        ...uploadedFiles
          .map((file) => file.file_url || file.url)
          .filter(Boolean),
      ];

      console.log("All document URLs:", allDocumentUrls);

      // Prepare form data for project update with blueprint files
      const formData = new FormData();

      // Add all project form fields
      Object.keys(projectForm).forEach((key) => {
        if (projectForm[key] !== null && projectForm[key] !== undefined) {
          formData.append(key, projectForm[key]);
        }
      });

      // Add document URLs
      allDocumentUrls.forEach((url) => {
        formData.append("document_urls", url);
      });

      // Add existing blueprint URLs
      blueprintUrls.forEach((url) => {
        formData.append("blueprint_url", url);
      });

      // Add new blueprint files
      blueprintFiles.forEach((file) => {
        formData.append("blueprints", file);
      });

      console.log("Updated project data with files");

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Clear selected files and previews after successful save
        setSelectedFiles([]);
        setFilePreviews([]);

        await Swal.fire({
          title: "Success!",
          text: "Project updated successfully!",
          icon: "success",
          confirmButtonColor: "#667eea",
        });
        navigate(`/projects/${id}`);
      } else {
        throw new Error(result.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      await Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update project",
        icon: "error",
        confirmButtonColor: "#667eea",
      });
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = () => {
    return (
      projectForm.name.trim() !== "" &&
      projectForm.location_name.trim() !== "" &&
      projectForm.start_date !== ""
    );
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
                onClick={() => navigate(`/projects/${id}`)}
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
                  Edit Project
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {project.name}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!isFormValid() || saving}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <ProjectIcon />
                    <Typography variant="h6">Basic Information</Typography>
                  </Box>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={projectForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      value={projectForm.location_name}
                      onChange={(e) =>
                        handleInputChange("location_name", e.target.value)
                      }
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={projectForm.start_date}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={projectForm.end_date}
                      onChange={(e) =>
                        handleInputChange("end_date", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiSelect-select": {
                          color: "white",
                        },
                      }}
                    >
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={projectForm.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        label="Status"
                      >
                        <MenuItem value="planning">Planning</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="on_hold">On Hold</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Progress (%)"
                      type="number"
                      value={projectForm.progress_percent}
                      onChange={(e) =>
                        handleInputChange(
                          "progress_percent",
                          parseInt(e.target.value) || 0
                        )
                      }
                      inputProps={{ min: 0, max: 100 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={projectForm.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notes"
                      value={projectForm.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Financial Information */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <MoneyIcon />
                    <Typography variant="h6">Financial Information</Typography>
                  </Box>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Budget Estimate"
                      type="number"
                      value={projectForm.budget_estimate}
                      onChange={(e) =>
                        handleInputChange("budget_estimate", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Actual Cost"
                      type="number"
                      value={projectForm.actual_cost}
                      onChange={(e) =>
                        handleInputChange("actual_cost", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <FormControl
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiSelect-select": {
                          color: "white",
                        },
                      }}
                    >
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={projectForm.currency}
                        onChange={(e) =>
                          handleInputChange("currency", e.target.value)
                        }
                        label="Currency"
                      >
                        <MenuItem value="KES">KES (Kenyan Shilling)</MenuItem>
                        <MenuItem value="USD">USD (US Dollar)</MenuItem>
                        <MenuItem value="EUR">EUR (Euro)</MenuItem>
                        <MenuItem value="GBP">GBP (British Pound)</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Stakeholders */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <ProjectIcon />
                    <Typography variant="h6">Project Stakeholders</Typography>
                  </Box>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Contractor Name"
                      value={projectForm.contractor_name}
                      onChange={(e) =>
                        handleInputChange("contractor_name", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Client Name"
                      value={projectForm.client_name}
                      onChange={(e) =>
                        handleInputChange("client_name", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Funding Source"
                      value={projectForm.funding_source}
                      onChange={(e) =>
                        handleInputChange("funding_source", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "white",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <UploadIcon />
                    <Typography variant="h6">Project Documents</Typography>
                  </Box>

                  {/* File Upload */}
                  <Box mb={3}>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        sx={{
                          color: "white",
                          borderColor: "rgba(255, 255, 255, 0.5)",
                          "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        Upload Documents
                      </Button>
                    </label>
                  </Box>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="subtitle2" mb={2}>
                        Selected Files:
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedFiles.map((file, index) => {
                          const isImage = file.type.startsWith("image/");
                          const preview = filePreviews.find(
                            (p) => p.file === file
                          );

                          return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box
                                sx={{
                                  p: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 2,
                                  border: "2px solid rgba(255, 255, 255, 0.3)",
                                  position: "relative",
                                }}
                              >
                                <IconButton
                                  onClick={() => removeSelectedFile(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    },
                                    zIndex: 1,
                                  }}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>

                                {isImage && preview ? (
                                  <Box>
                                    <img
                                      src={preview.preview}
                                      alt={file.name}
                                      style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "white",
                                        display: "block",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {file.name}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box textAlign="center">
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
                                      {file.name}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}

                  {/* Upload Progress */}
                  {uploadingFiles && (
                    <Box mb={2}>
                      <Typography variant="body2" mb={1}>
                        Uploading files...
                      </Typography>
                      <LinearProgress
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "white",
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Existing Files */}
                  {projectFiles.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" mb={2}>
                        Current Documents:
                      </Typography>
                      <Grid container spacing={2}>
                        {projectFiles.map((file, index) => {
                          const fileName =
                            file.file_name ||
                            file.name ||
                            `Document ${index + 1}`;
                          const fileUrl = file.file_url || file.url;
                          const isImage = fileName.match(
                            /\.(jpg|jpeg|png|gif|bmp|webp)$/i
                          );

                          // Construct full URL for the document
                          const fullDocumentUrl =
                            fileUrl && fileUrl.startsWith("http")
                              ? fileUrl
                              : fileUrl && fileUrl.startsWith("/uploads")
                              ? `http://84.247.176.143:1133${fileUrl}`
                              : `${window.location.origin}${fileUrl}`;

                          return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box
                                sx={{
                                  p: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 2,
                                  border: "2px solid rgba(255, 255, 255, 0.3)",
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
                                      variant="caption"
                                      sx={{
                                        color: "white",
                                        display: "block",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {fileName}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box textAlign="center">
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
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Blueprint Management */}
            <Grid item xs={12}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={3}>
                    <ProjectIcon />
                    <Typography variant="h6">Project Blueprints</Typography>
                  </Box>

                  {/* Current Blueprints */}
                  {blueprintUrls.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="subtitle2" mb={2}>
                        Current Blueprints:
                      </Typography>
                      <Grid container spacing={2}>
                        {blueprintUrls.map((url, index) => {
                          const fileName =
                            url.split("/").pop() || `Blueprint ${index + 1}`;
                          const isImage = fileName.match(
                            /\.(jpg|jpeg|png|gif|bmp|webp)$/i
                          );

                          // Construct full URL for the image
                          const fullImageUrl = url.startsWith("http")
                            ? url
                            : url.startsWith("/uploads")
                            ? `http://84.247.176.143:1133${url}`
                            : `${window.location.origin}${url}`;

                          return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box
                                sx={{
                                  p: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 2,
                                  border: "2px solid rgba(255, 255, 255, 0.3)",
                                  position: "relative",
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    const newUrls = blueprintUrls.filter(
                                      (_, i) => i !== index
                                    );
                                    setBlueprintUrls(newUrls);
                                  }}
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    },
                                    zIndex: 1,
                                  }}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>

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
                                      variant="caption"
                                      sx={{
                                        color: "white",
                                        display: "block",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {fileName}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box textAlign="center">
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
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}

                  {/* Add Blueprint Files */}
                  <Box>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                      onChange={handleBlueprintFileSelect}
                      style={{ display: "none" }}
                      id="blueprint-upload-edit"
                    />
                    <label htmlFor="blueprint-upload-edit">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        fullWidth
                        sx={{
                          color: "white",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                          mb: 2,
                        }}
                      >
                        Select Blueprint Files
                      </Button>
                    </label>

                    {/* Selected Blueprint Files */}
                    {blueprintFiles.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" mb={1}>
                          New Blueprint Files:
                        </Typography>
                        <Grid container spacing={1}>
                          {blueprintFiles.map((file, index) => (
                            <Grid item xs={12} key={index}>
                              <Box
                                sx={{
                                  p: 1,
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 1,
                                  border: "1px solid rgba(255, 255, 255, 0.3)",
                                  position: "relative",
                                }}
                              >
                                <IconButton
                                  onClick={() => removeBlueprintFile(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    color: "white",
                                    p: 0.5,
                                  }}
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                                {blueprintPreviews[index] ? (
                                  <img
                                    src={blueprintPreviews[index]}
                                    alt={file.name}
                                    style={{
                                      width: "100%",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                      marginBottom: "4px",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <ImageIcon />
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "white" }}
                                    >
                                      {file.name}
                                    </Typography>
                                  </Box>
                                )}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "white",
                                    display: "block",
                                    textAlign: "center",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {file.name}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectEdit;
