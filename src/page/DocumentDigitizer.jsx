import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LabForm from './LabForm';


// // Local Testing API endpoints
// const UPLOAD_PRESCRIPTION_API_URL =
//   'http://127.0.0.1:8000/upload-prescription/';
// const UPLOAD_LAB_REQUISITION_API_URL =
//   'http://127.0.0.1:8000/upload-lab-requisition/';
// const FETCH_PRESCRIPTIONS_API_URL =
//   'http://127.0.0.1:8000/fetch-prescriptions/';
// const FETCH_LAB_REQUISITIONS_API_URL =
//   'http://127.0.0.1:8000/fetch-lab-requisitions/';
// const ANALYZE_PRESCRIPTION_API_URL =
//   'http://127.0.0.1:8000/analyze-prescription/';
// const ANALYZE_LAB_REQUISITION_API_URL =
//   'http://127.0.0.1:8000/analyze-lab-requisition/';

// Deployment API endpoints
const UPLOAD_PRESCRIPTION_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/upload-prescription/';
const UPLOAD_LAB_REQUISITION_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/upload-lab-requisition/';
const FETCH_PRESCRIPTIONS_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/fetch-prescriptions/';
const FETCH_LAB_REQUISITIONS_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/fetch-lab-requisitions/';
const ANALYZE_PRESCRIPTION_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/analyze-prescription/';
const ANALYZE_LAB_REQUISITION_API_URL =
  'https://chatbot-2024-90539106da8b.herokuapp.com/analyze-lab-requisition/';

// Color scheme
const COLORS = {
  primary: '#1a4fba',
  secondary: '#2f3449',
  background: '#f2f7ff',
  white: '#ffffff',
};

const DocumentDigitizer = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documentType, setDocumentType] = useState('Prescription');
  const [isValidFile, setIsValidFile] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isAnalyzeLoading, setIsAnalyzeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPdfPreview, setIsPdfPreview] = useState(false);
  const [showAutofillModal, setShowAutofillModal] = useState(false);

  // Fetch images from API on component mount
  useEffect(() => {
    fetchImages();
  }, [documentType]);

  // Toggle autofill modal and bind the JSON data to form 
  const toggleAutofillModal = () => {
    setShowAutofillModal(!showAutofillModal);
  };

  // Fetch all images from the cloud based on document type
  const fetchImages = async () => {
    let fetchUrl;
    if (documentType === 'Prescription') {
      fetchUrl = FETCH_PRESCRIPTIONS_API_URL;
    } else if (documentType === 'Lab Requisition Form') {
      fetchUrl = FETCH_LAB_REQUISITIONS_API_URL;
    } else {
      console.error('Invalid document type selected.');
      return;
    }

    try {
      setIsUploadLoading(true);
      setIsAnalyzeLoading(true);
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();

      // Handle the case where the API returns an object with images property
      if (data && data.images && Array.isArray(data.images)) {
        // Transform the URLs into objects with required properties
        const formattedImages = data.images.map((url, index) => ({
          id: `img-${index}`, // Generate a unique ID
          url: url,
          thumbnail_url: url, // Use same URL for thumbnail
          filename: url.split('/').pop(), // Extract filename from URL
          document_type: documentType, // Add current document type
          is_pdf: url.toLowerCase().endsWith('.pdf'), // Check if the file is a PDF
        }));
        setImageList(formattedImages);
      } else if (Array.isArray(data)) {
        // Add document type and check for PDF to each image object
        const updatedImages = data.map(image => ({
          ...image,
          document_type: documentType,
          is_pdf: image.url.toLowerCase().endsWith('.pdf') || 
                 (image.filename && image.filename.toLowerCase().endsWith('.pdf'))
        }));
        setImageList(updatedImages);
      } else {
        console.warn('Unexpected API response format:', data);
        setImageList([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching images:', err);
      setImageList([]);
    } finally {
      setIsUploadLoading(false);
      setIsAnalyzeLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const isValid = validTypes.includes(file.type);
    setIsValidFile(isValid);

    if (isValid) {
      setSelectedFile(file);
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      // Set default file name from the selected file
      setFileName(file.name);
      setError(null);
      
      // Set PDF flag for preview handling
      setIsPdfPreview(file.type === 'application/pdf');
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileName('');
      setIsPdfPreview(false);
      setError('Invalid file type. Please upload JPG, JPEG, PNG, or PDF files.');
    }
  };

  // Handle file name change
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  // Handle document type change
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    // Reset selected image when document type changes
    setSelectedImage(null);
    setJsonData(null);
  };

  // Handle upload to cloud
  const handleUpload = async () => {
    if (!selectedFile || !isValidFile) return;

    let uploadUrl;
    if (documentType === 'Prescription') {
      uploadUrl = UPLOAD_PRESCRIPTION_API_URL;
    } else if (documentType === 'Lab Requisition Form') {
      uploadUrl = UPLOAD_LAB_REQUISITION_API_URL;
    } else {
      console.error('Invalid document type selected.');
      return;
    }

    try {
      setIsUploadLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      // Add the custom file name to the form data
      if (fileName.trim() !== '') {
        formData.append('file_name', fileName.trim());
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');

      // Refresh the image list
      await fetchImages();

      // Reset the form
      setSelectedFile(null);
      setPreviewUrl(null);
      setFileName('');
      setIsPdfPreview(false);
    } catch (err) {
      setError(err.message);
      console.error('Error uploading file:', err);
    } finally {
      setIsUploadLoading(false);
    }
  };

  // Select an image from the list
  const handleImageSelect = (image) => {
    // Ensure the selected image has the current document type
    const updatedImage = {
      ...image,
      document_type: documentType // Set the document type to current selection
    };
    setSelectedImage(updatedImage);
    setJsonData(null); // Clear previous JSON data
  };

  // Analyze selected image
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    let analyzeUrl;
    if (documentType === 'Prescription') {
      analyzeUrl = ANALYZE_PRESCRIPTION_API_URL;
    } else if (documentType === 'Lab Requisition Form') {
      analyzeUrl = ANALYZE_LAB_REQUISITION_API_URL;
    } else {
      console.error('Invalid document type selected.');
      return;
    }

    try {
      setIsAnalyzeLoading(true);
      setError(null);

      // Create request data with image_url
      const requestData = {
        image_url: selectedImage.url,
      };

      console.log('Sending analysis request for:', selectedImage.filename);
      console.log('Request data:', requestData);

      // Send POST request for analysis
      const response = await fetch(analyzeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error('Failed to analyze document');

      const data = await response.json();
      
      // Log the JSON response
      console.log('Document digitization result:', data);
      
      setJsonData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing document:', err);
    } finally {
      setIsAnalyzeLoading(false);
    }
  };
  // Format JSON for display
  const formatJsonOutput = (json) => {
    if (!json) return null;
  
    return (
      <div className="json-output">
        <h3 className="mb-3 fw-bold">Extracted Data</h3>
        <div
          className="bg-light p-3 rounded overflow-auto"
          style={{ maxHeight: '500px' }}
        >
          {Object.entries(json).map(([key, value], index) => (
            <div key={`json-${index}`} className="mb-2">
              <span className="fw-semibold">{key}: </span>
              {typeof value === 'object' ? (
                <pre className="mt-1 bg-white p-2 rounded">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <span>{value}</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Autofill Button specifically for Lab Requisition Forms */}
        {documentType === 'Lab Requisition Form' && (
          <button
            className="btn mt-3 w-100"
            style={styles.analyzeButton}
            onClick={toggleAutofillModal}
          >
            Autofill Form
          </button>
        )}
      </div>
    );
  };

  // Render appropriate preview based on file type
  const renderPreview = () => {
    if (!previewUrl) return null;

    if (isPdfPreview) {
      return (
        <div className="mb-3">
          <label className="form-label">Preview:</label>
          <div
            className="text-center p-2 border rounded"
            style={{ backgroundColor: COLORS.background }}
          >
            <object
              data={previewUrl}
              type="application/pdf"
              className="w-100"
              style={{ height: '250px' }}
            >
              <p>
                PDF preview not available. Your browser might not support PDF previews.
              </p>
            </object>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <label className="form-label">Preview:</label>
          <div
            className="text-center p-2 border rounded"
            style={{ backgroundColor: COLORS.background }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="img-fluid"
              style={{ maxHeight: '250px' }}
            />
          </div>
        </div>
      );
    }
  };

  // Render appropriate document display based on file type
  const renderDocumentPreview = (image) => {
    if (!image) return null;

    const isPdf = image.is_pdf || 
                  image.url.toLowerCase().endsWith('.pdf') || 
                  (image.filename && image.filename.toLowerCase().endsWith('.pdf'));

    if (isPdf) {
      return (
        <div
          className="text-center p-3 rounded mb-3"
          style={{ backgroundColor: COLORS.background }}
        >
          <object
            data={image.url}
            type="application/pdf"
            className="w-100 rounded"
            style={{ height: '400px' }}
          >
            <p>
              PDF preview not available. Your browser might not support PDF previews.
            </p>
          </object>
        </div>
      );
    } else {
      return (
        <div
          className="text-center p-3 rounded mb-3"
          style={{ backgroundColor: COLORS.background }}
        >
          <img
            src={image.url}
            alt={image.filename || 'Selected document'}
            className="img-fluid rounded"
            style={{ maxHeight: '400px' }}
          />
        </div>
      );
    }
  };

  // Render thumbnail based on file type
  const renderThumbnail = (image) => {
    const isPdf = image.is_pdf || 
                  image.url.toLowerCase().endsWith('.pdf') || 
                  (image.filename && image.filename.toLowerCase().endsWith('.pdf'));

    if (isPdf) {
      return (
        <div 
          className="d-flex align-items-center justify-content-center bg-light h-100"
          style={{ height: '100px' }}
        >
          <i className="bi bi-file-earmark-pdf" style={{ fontSize: '2rem', color: '#dc3545' }}></i>
        </div>
      );
    } else {
      return (
        <img
          src={image.thumbnail_url || image.url}
          className="card-img-top"
          alt={image.filename || 'Image'}
          style={{
            height: '100px',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        />
      );
    }
  };

  // Custom styles based on color scheme
  const styles = {
    container: {
      backgroundColor: COLORS.background,
      minHeight: '100vh',
      padding: '1rem',
    },
    card: {
      backgroundColor: COLORS.white,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      padding: '0.75rem 1rem',
    },
    analyzeHeader: {
      backgroundColor: COLORS.secondary,
      color: COLORS.white,
      padding: '0.75rem 1rem',
    },
    button: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
      color: COLORS.white,
    },
    analyzeButton: {
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.secondary,
      color: COLORS.white,
    },
    selectedCard: {
      borderColor: COLORS.primary,
      borderWidth: '2px',
    },
  };

  return (
    <div style={styles.container} className="py-4">
      <h1
        className="display-5 fw-bold text-center mb-4"
        style={{ color: COLORS.secondary }}
      >
        Document Digitization System
      </h1>
      <div className="row mb-4">
        <div className="col">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="row g-4 mb-4">
          {/* Upload Section */}
          <div className="col-md-5 mx-auto">
            <div className="card h-100" style={styles.card}>
              <div className="card-header" style={styles.header}>
                <h4 className="my-1">Upload New Document</h4>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="documentType" className="form-label">
                      Document Type
                    </label>
                    <select
                      id="documentType"
                      className="form-select"
                      value={documentType}
                      onChange={handleDocumentTypeChange}
                    >
                      <option value="Prescription">Prescription</option>
                      <option value="Lab Requisition Form">
                        Lab Requisition Form
                      </option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fileUpload" className="form-label">
                      Upload Document (JPG, JPEG, PNG, PDF)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="fileUpload"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* New File Name Input Field */}
                  <div className="mb-3">
                    <label htmlFor="fileName" className="form-label">
                      File Name (optional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fileName"
                      placeholder="Enter custom file name"
                      value={fileName}
                      onChange={handleFileNameChange}
                    />
                    <div className="form-text">
                      Leave blank to use original filename
                    </div>
                  </div>

                  {previewUrl && renderPreview()}

                  <button
                    type="button"
                    className="btn w-100"
                    style={
                      isValidFile
                        ? styles.button
                        : { backgroundColor: '#6c757d', color: COLORS.white }
                    }
                    disabled={!isValidFile || isUploadLoading}
                    onClick={handleUpload}
                  >
                    {isUploadLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Uploading...
                      </>
                    ) : (
                      'Upload to Cloud'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Stored Images Section */}
          <div className="col-md-5 mx-auto">
            <div className="card h-100" style={styles.card}>
              <div className="card-header" style={styles.header}>
                <h4 className="my-1">Stored Documents</h4>
              </div>
              <div className="card-body">
                {isUploadLoading && imageList.length === 0 ? (
                  <div className="text-center p-4">
                    <div
                      className="spinner-border"
                      role="status"
                      style={{ color: COLORS.primary }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading documents...</p>
                  </div>
                ) : imageList.length === 0 ? (
                  <div
                    className="alert"
                    style={{
                      backgroundColor: COLORS.background,
                      color: COLORS.secondary,
                    }}
                  >
                    No documents found in the cloud storage.
                  </div>
                ) : (
                  <div
                    className="row row-cols-2 row-cols-sm-3 g-2"
                    style={{ maxHeight: '350px', overflowY: 'auto' }}
                  >
                    {imageList.map((image, index) => (
                      <div key={image.id || `img-${index}`} className="col">
                        <div
                          className="card h-100"
                          style={
                            selectedImage && selectedImage.id === image.id
                              ? styles.selectedCard
                              : {}
                          }
                          onClick={() => handleImageSelect(image)}
                        >
                          {renderThumbnail(image)}
                          <div className="card-body p-2">
                            <p className="card-text small text-truncate">
                              {image.filename || 'Image'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Image and Analysis Section */}
      {selectedImage && (
        <div className="container">
          <div className="row g-4 mt-2">
            <div className="col-10 mx-auto">
              <div className="card" style={styles.card}>
                <div className="card-header" style={styles.analyzeHeader}>
                  <h4 className="my-1">Document Analysis</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5
                        className="fw-bold mb-3"
                        style={{ color: COLORS.secondary }}
                      >
                        Selected Document
                      </h5>
                      <div className="mb-3">
                        <p>
                          <span className="fw-semibold">Filename:</span>{' '}
                          {selectedImage.filename || 'Image'}
                        </p>
                        <p>
                          <span className="fw-semibold">Type:</span>{' '}
                          {selectedImage.document_type || documentType}
                        </p>
                      </div>
                      
                      {renderDocumentPreview(selectedImage)}
                      
                      <button
                        className="btn w-100"
                        style={styles.analyzeButton}
                        onClick={handleAnalyze}
                        disabled={isAnalyzeLoading}
                      >
                        {isAnalyzeLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Processing...
                          </>
                        ) : (
                          'Digitize'
                        )}
                      </button>
                    </div>

                    <div className="col-md-6">
                      {jsonData ? (
                        formatJsonOutput(jsonData)
                      ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center">
                          <div
                            className="text-center p-4"
                            style={{ color: COLORS.secondary }}
                          >
                            <i
                              className="bi bi-file-earmark-text"
                              style={{ fontSize: '3rem' }}
                            ></i>
                            <p className="mt-3">
                              Click "Digitize" to extract data from the selected
                              document
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Autofill Modal */}
      {showAutofillModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={styles.analyzeHeader}>
                <h5 className="modal-title">Autofill Lab Requisition Form</h5>
                <button type="button" className="btn-close bg-light" onClick={toggleAutofillModal}></button>
              </div>
              <div className="modal-body">
                {/* Use your LabForm component here */}
                <LabForm labData={jsonData} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={toggleAutofillModal}>
                  Close
                </button>
                <button type="button" className="btn" style={styles.button}>
                  Submit Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showAutofillModal && <div className="modal-backdrop fade show"></div>}

    </div>
  );
};

export default DocumentDigitizer;