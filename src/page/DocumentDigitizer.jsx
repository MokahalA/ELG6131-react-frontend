"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material"
import LabForm from "./LabForm.jsx"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"

//Render Deployment API endpoints
const UPLOAD_PRESCRIPTION_API_URL = 'https://doc-digitization.onrender.com/upload-prescription/';
const UPLOAD_LAB_REQUISITION_API_URL = 'https://doc-digitization.onrender.com/upload-lab-requisition/';
const FETCH_PRESCRIPTIONS_API_URL = 'https://doc-digitization.onrender.com/fetch-prescriptions/';
const FETCH_LAB_REQUISITIONS_API_URL = 'https://doc-digitization.onrender.com/fetch-lab-requisitions/';
const ANALYZE_PRESCRIPTION_API_URL = 'https://doc-digitization.onrender.com/analyze-prescription/';
const ANALYZE_LAB_REQUISITION_API_URL = 'https://doc-digitization.onrender.com/analyze-lab-requisition/';


// //eHospital Deployment API endpoints
// const UPLOAD_PRESCRIPTION_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/upload-prescription/"
// const UPLOAD_LAB_REQUISITION_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/upload-lab-requisition/"
// const FETCH_PRESCRIPTIONS_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/fetch-prescriptions/"
// const FETCH_LAB_REQUISITIONS_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/fetch-lab-requisitions/"
// const ANALYZE_PRESCRIPTION_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/analyze-prescription/"
// const ANALYZE_LAB_REQUISITION_API_URL = "https://chatbot-2024-90539106da8b.herokuapp.com/analyze-lab-requisition/"

// Color scheme
const COLORS = {
  primary: "#1a4fba",
  secondary: "#2f3449",
  background: "#f2f7ff",
  white: "#ffffff",
}

const DocumentDigitizer = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [previewUrl, setPreviewUrl] = useState(null)
  const [documentType, setDocumentType] = useState("Prescription")
  const [isValidFile, setIsValidFile] = useState(false)
  const [imageList, setImageList] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [jsonData, setJsonData] = useState(null)
  const [isUploadLoading, setIsUploadLoading] = useState(false)
  const [isAnalyzeLoading, setIsAnalyzeLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPdfPreview, setIsPdfPreview] = useState(false)
  const [showAutofillModal, setShowAutofillModal] = useState(false)

  // Fetch images from API on component mount
  useEffect(() => {
    fetchImages()
  }, [documentType])

  // Toggle autofill modal and bind the JSON data to form
  const toggleAutofillModal = () => {
    setShowAutofillModal(!showAutofillModal)
  }

  // Fetch all images from the cloud based on document type
  const fetchImages = async () => {
    let fetchUrl
    if (documentType === "Prescription") {
      fetchUrl = FETCH_PRESCRIPTIONS_API_URL
    } else if (documentType === "Lab Requisition Form") {
      fetchUrl = FETCH_LAB_REQUISITIONS_API_URL
    } else {
      console.error("Invalid document type selected.")
      return
    }

    try {
      setIsUploadLoading(true)
      setIsAnalyzeLoading(true)
      const response = await fetch(fetchUrl)
      if (!response.ok) throw new Error("Failed to fetch images")
      const data = await response.json()

      // Handle the case where the API returns an object with images property
      if (data && data.images && Array.isArray(data.images)) {
        // Transform the URLs into objects with required properties
        const formattedImages = data.images.map((url, index) => ({
          id: `img-${index}`, // Generate a unique ID
          url: url,
          thumbnail_url: url, // Use same URL for thumbnail
          filename: url.split("/").pop(), // Extract filename from URL
          document_type: documentType, // Add current document type
          is_pdf: url.toLowerCase().endsWith(".pdf"), // Check if the file is a PDF
        }))
        setImageList(formattedImages)
      } else if (Array.isArray(data)) {
        // Add document type and check for PDF to each image object
        const updatedImages = data.map((image) => ({
          ...image,
          document_type: documentType,
          is_pdf:
            image.url.toLowerCase().endsWith(".pdf") ||
            (image.filename && image.filename.toLowerCase().endsWith(".pdf")),
        }))
        setImageList(updatedImages)
      } else {
        console.warn("Unexpected API response format:", data)
        setImageList([])
      }
    } catch (err) {
      setError(err.message)
      console.error("Error fetching images:", err)
      setImageList([])
    } finally {
      setIsUploadLoading(false)
      setIsAnalyzeLoading(false)
    }
  }

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    const isValid = validTypes.includes(file.type)
    setIsValidFile(isValid)

    if (isValid) {
      setSelectedFile(file)
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      // Set default file name from the selected file
      setFileName(file.name)
      setError(null)

      // Set PDF flag for preview handling
      setIsPdfPreview(file.type === "application/pdf")
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
      setFileName("")
      setIsPdfPreview(false)
      setError("Invalid file type. Please upload JPG, JPEG, PNG, or PDF files.")
    }
  }

  // Handle file name change
  const handleFileNameChange = (e) => {
    setFileName(e.target.value)
  }

  // Handle document type change
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value)
    // Reset selected image when document type changes
    setSelectedImage(null)
    setJsonData(null)
  }

  // Handle upload to cloud
  const handleUpload = async () => {
    if (!selectedFile || !isValidFile) return

    let uploadUrl
    if (documentType === "Prescription") {
      uploadUrl = UPLOAD_PRESCRIPTION_API_URL
    } else if (documentType === "Lab Requisition Form") {
      uploadUrl = UPLOAD_LAB_REQUISITION_API_URL
    } else {
      console.error("Invalid document type selected.")
      return
    }

    try {
      setIsUploadLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append("file", selectedFile)
      // Add the custom file name to the form data
      if (fileName.trim() !== "") {
        formData.append("file_name", fileName.trim())
      }

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload file")

      // Refresh the image list
      await fetchImages()

      // Reset the form
      setSelectedFile(null)
      setPreviewUrl(null)
      setFileName("")
      setIsPdfPreview(false)
    } catch (err) {
      setError(err.message)
      console.error("Error uploading file:", err)
    } finally {
      setIsUploadLoading(false)
    }
  }

  // Select an image from the list
  const handleImageSelect = (image) => {
    // Ensure the selected image has the current document type
    const updatedImage = {
      ...image,
      document_type: documentType, // Set the document type to current selection
    }
    setSelectedImage(updatedImage)
    setJsonData(null) // Clear previous JSON data
  }

  // Analyze selected image
  const handleAnalyze = async () => {
    if (!selectedImage) return

    let analyzeUrl
    if (documentType === "Prescription") {
      analyzeUrl = ANALYZE_PRESCRIPTION_API_URL
    } else if (documentType === "Lab Requisition Form") {
      analyzeUrl = ANALYZE_LAB_REQUISITION_API_URL
    } else {
      console.error("Invalid document type selected.")
      return
    }

    try {
      setIsAnalyzeLoading(true)
      setError(null)

      // Create request data with image_url
      const requestData = {
        image_url: selectedImage.url,
      }

      console.log("Sending analysis request for:", selectedImage.filename)
      console.log("Request data:", requestData)

      // Send POST request for analysis
      const response = await fetch(analyzeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) throw new Error("Failed to analyze document")

      const data = await response.json()

      // Log the JSON response
      console.log("Document digitization result:", data)

      setJsonData(data)
    } catch (err) {
      setError(err.message)
      console.error("Error analyzing document:", err)
    } finally {
      setIsAnalyzeLoading(false)
    }
  }

  // Format JSON for display
  const formatJsonOutput = (json) => {
    if (!json) return null

    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Extracted Data
        </Typography>
        <Paper
          sx={{
            p: 3,
            bgcolor: "background.paper",
            maxHeight: "500px",
            overflow: "auto",
          }}
        >
          {Object.entries(json).map(([key, value], index) => (
            <Box key={`json-${index}`} mb={2}>
              <Typography component="span" fontWeight="medium">
                {key}:
              </Typography>{" "}
              {typeof value === "object" ? (
                <Box component="pre" mt={1} p={2} bgcolor="white" borderRadius={1} sx={{ overflowX: "auto" }}>
                  {JSON.stringify(value, null, 2)}
                </Box>
              ) : (
                <Typography component="span">{value}</Typography>
              )}
            </Box>
          ))}
        </Paper>

        {/* Add Autofill Button specifically for Lab Requisition Forms */}
        {documentType === "Lab Requisition Form" && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: COLORS.secondary,
              "&:hover": {
                bgcolor: "#3a4057",
              },
            }}
            onClick={toggleAutofillModal}
          >
            Autofill Form
          </Button>
        )}
      </Box>
    )
  }

  // Render appropriate preview based on file type
  const renderPreview = () => {
    if (!previewUrl) return null

    if (isPdfPreview) {
      return (
        <Box mb={3}>
          <Typography variant="body1" component="label">
            Preview:
          </Typography>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: COLORS.background,
              borderRadius: 1,
            }}
          >
            <object data={previewUrl} type="application/pdf" width="100%" style={{ height: "250px" }}>
              <Typography>PDF preview not available. Your browser might not support PDF previews.</Typography>
            </object>
          </Paper>
        </Box>
      )
    } else {
      return (
        <Box mb={3}>
          <Typography variant="body1" component="label">
            Preview:
          </Typography>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: COLORS.background,
              borderRadius: 1,
            }}
          >
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              sx={{
                maxHeight: "250px",
                maxWidth: "100%",
              }}
            />
          </Paper>
        </Box>
      )
    }
  }

  // Render appropriate document display based on file type
  const renderDocumentPreview = (image) => {
    if (!image) return null

    const isPdf =
      image.is_pdf ||
      image.url.toLowerCase().endsWith(".pdf") ||
      (image.filename && image.filename.toLowerCase().endsWith(".pdf"))

    if (isPdf) {
      return (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            mb: 3,
            bgcolor: COLORS.background,
            borderRadius: 2,
          }}
        >
          <object data={image.url} type="application/pdf" width="100%" style={{ height: "400px", borderRadius: "8px" }}>
            <Typography>PDF preview not available. Your browser might not support PDF previews.</Typography>
          </object>
        </Paper>
      )
    } else {
      return (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            mb: 3,
            bgcolor: COLORS.background,
            borderRadius: 2,
          }}
        >
          <Box
            component="img"
            src={image.url}
            alt={image.filename || "Selected document"}
            sx={{
              maxHeight: "400px",
              maxWidth: "100%",
              borderRadius: "8px",
            }}
          />
        </Paper>
      )
    }
  }

  // Render thumbnail based on file type
  const renderThumbnail = (image) => {
    const isPdf =
      image.is_pdf ||
      image.url.toLowerCase().endsWith(".pdf") ||
      (image.filename && image.filename.toLowerCase().endsWith(".pdf"))

    if (isPdf) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" bgcolor="background.paper" height="100px">
          <PictureAsPdfIcon sx={{ fontSize: "2rem", color: "#dc3545" }} />
        </Box>
      )
    } else {
      return (
        <Box
          component="img"
          src={image.thumbnail_url || image.url}
          alt={image.filename || "Image"}
          sx={{
            height: "100px",
            width: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      )
    }
  }

  return (
    <Box sx={{ bgcolor: COLORS.background, minHeight: "100vh", py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center" mb={4} color={COLORS.secondary}>
        Document Digitization System
      </Typography>

      {error && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      )}

      <Container>
        <Grid container spacing={4} mb={4}>
          {/* Upload Section */}
          <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
            <Card
              sx={{
                height: "100%",
                bgcolor: COLORS.white,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardHeader
                title="Upload New Document"
                sx={{
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                  py: 1.5,
                }}
              />
              <CardContent>
                <Box component="form">
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="document-type-label">Document Type</InputLabel>
                    <Select
                      labelId="document-type-label"
                      id="documentType"
                      value={documentType}
                      label="Document Type"
                      onChange={handleDocumentTypeChange}
                    >
                      <MenuItem value="Prescription">Prescription</MenuItem>
                      <MenuItem value="Lab Requisition Form">Lab Requisition Form</MenuItem>
                    </Select>
                  </FormControl>

                  <Box mb={3}>
                    <Typography variant="body1" component="label" htmlFor="fileUpload" gutterBottom>
                      Upload Document (JPG, JPEG, PNG, PDF)
                    </Typography>
                    <TextField
                      type="file"
                      fullWidth
                      id="fileUpload"
                      inputProps={{
                        accept: ".jpg,.jpeg,.png,.pdf",
                      }}
                      onChange={handleFileChange}
                      variant="outlined"
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body1" component="label" htmlFor="fileName" gutterBottom>
                      File Name (optional)
                    </Typography>
                    <TextField
                      fullWidth
                      id="fileName"
                      placeholder="Enter custom file name"
                      value={fileName}
                      onChange={handleFileNameChange}
                      variant="outlined"
                      helperText="Leave blank to use original filename"
                    />
                  </Box>

                  {previewUrl && renderPreview()}

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: isValidFile ? COLORS.primary : "#6c757d",
                      "&:hover": {
                        bgcolor: isValidFile ? "#1543a0" : "#5a6268",
                      },
                    }}
                    disabled={!isValidFile || isUploadLoading}
                    onClick={handleUpload}
                  >
                    {isUploadLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                        Uploading...
                      </>
                    ) : (
                      "Upload to Cloud"
                    )}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stored Images Section */}
          <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
            <Card
              sx={{
                height: "100%",
                bgcolor: COLORS.white,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardHeader
                title="Stored Documents"
                sx={{
                  bgcolor: COLORS.primary,
                  color: COLORS.white,
                  py: 1.5,
                }}
              />
              <CardContent>
                {isUploadLoading && imageList.length === 0 ? (
                  <Box textAlign="center" p={4}>
                    <CircularProgress sx={{ color: COLORS.primary }} />
                    <Typography mt={2}>Loading documents...</Typography>
                  </Box>
                ) : imageList.length === 0 ? (
                  <Alert
                    severity="info"
                    sx={{
                      bgcolor: COLORS.background,
                      color: COLORS.secondary,
                    }}
                  >
                    No documents found in the cloud storage.
                  </Alert>
                ) : (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      maxHeight: "350px",
                      overflowY: "auto",
                      pr: 1,
                    }}
                  >
                    {imageList.map((image, index) => (
                      <Grid item xs={6} sm={4} key={image.id || `img-${index}`}>
                        <Card
                          sx={{
                            height: "100%",
                            border:
                              selectedImage && selectedImage.id === image.id ? `2px solid ${COLORS.primary}` : "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageSelect(image)}
                        >
                          {renderThumbnail(image)}
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="body2" noWrap title={image.filename || "Image"}>
                              {image.filename || "Image"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Selected Image and Analysis Section */}
      {selectedImage && (
        <Container>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={10} sx={{ mx: "auto" }}>
              <Card
                sx={{
                  bgcolor: COLORS.white,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardHeader
                  title="Document Analysis"
                  sx={{
                    bgcolor: COLORS.secondary,
                    color: COLORS.white,
                    py: 1.5,
                  }}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" fontWeight="bold" mb={3} color={COLORS.secondary}>
                        Selected Document
                      </Typography>
                      <Box mb={3}>
                        <Typography variant="body1">
                          <Box component="span" fontWeight="medium">
                            Filename:
                          </Box>{" "}
                          {selectedImage.filename || "Image"}
                        </Typography>
                        <Typography variant="body1">
                          <Box component="span" fontWeight="medium">
                            Type:
                          </Box>{" "}
                          {selectedImage.document_type || documentType}
                        </Typography>
                      </Box>

                      {renderDocumentPreview(selectedImage)}

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: COLORS.secondary,
                          "&:hover": {
                            bgcolor: "#3a4057",
                          },
                        }}
                        onClick={handleAnalyze}
                        disabled={isAnalyzeLoading}
                      >
                        {isAnalyzeLoading ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                            Processing...
                          </>
                        ) : (
                          "Digitize"
                        )}
                      </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {jsonData ? (
                        formatJsonOutput(jsonData)
                      ) : (
                        <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                          <Box textAlign="center" p={4} color={COLORS.secondary}>
                            <Box
                              component="svg"
                              sx={{
                                width: "3rem",
                                height: "3rem",
                                fill: "currentColor",
                              }}
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                              <path d="M4.5 12.5A.5.5 0 0 1 5 12h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm0-2A.5.5 0 0 1 5 10h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm1.639-3.708 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V7.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V7s1.54-1.274 1.639-1.208zM6.25 5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
                            </Box>
                            <Typography mt={3}>Click "Digitize" to extract data from the selected document</Typography>
                          </Box>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}

      {/* Autofill Modal */}
      <Modal
        open={showAutofillModal}
        onClose={toggleAutofillModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAutofillModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "900px",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 1,
              p: 0,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                bgcolor: COLORS.secondary,
                color: COLORS.white,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Autofill Lab Requisition Form</Typography>
              <IconButton onClick={toggleAutofillModal} sx={{ color: "white" }}>
                <Box component="span" sx={{ fontSize: "1.5rem" }}>
                  ×
                </Box>
              </IconButton>
            </Box>
            <Box sx={{ p: 3 }}>
              {/* Use your LabForm component here */}
              <LabForm labData={jsonData} />
            </Box>
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={toggleAutofillModal}>
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: COLORS.primary,
                  "&:hover": {
                    bgcolor: "#1543a0",
                  },
                }}
              >
                Submit Form
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

export default DocumentDigitizer

