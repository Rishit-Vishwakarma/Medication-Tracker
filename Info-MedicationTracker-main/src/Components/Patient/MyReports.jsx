import { useState, useEffect } from "react";
import api from "../../api";
import "./MyReports.css";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload Form State
  const [reportName, setReportName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports/my");
      setReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !reportName || !reportDate) {
        alert("Please fill all fields and select a file.");
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("reportName", reportName);
    formData.append("reportDate", reportDate);

    try {
      await api.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      fetchReports();
      setShowUploadModal(false);
      setReportName("");
      setReportDate("");
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to upload report.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="patient-page">
      <div className="page-header">
        <h2>My Lab Reports</h2>
        <p className="subtitle">Upload and manage your medical test reports</p>
      </div>

      <div className="upload-section">
        <button className="upload-btn-main" onClick={() => setShowUploadModal(true)}>
          📄 Upload New Report
        </button>
      </div>

      <div className="reports-grid">
        {loading ? <p>Loading...</p> : reports.length === 0 ? (
          <p className="empty-state">No reports uploaded yet.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-preview">
                {report.fileName.endsWith('.pdf') ? (
                    <span className="pdf-icon">PDF</span>
                ) : (
                    <img src={report.fileUrl} alt="Report" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/337/337946.png"} />
                )}
              </div>
              <div className="report-info">
                <h4>{report.reportName}</h4>
                <p className="report-date">Date: {report.reportDate}</p>
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="view-link">View Full Screen</a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-simple">
                <h3>Upload Lab Report</h3>
                <button className="close-icon-btn" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleUpload}>
                <div className="input-group">
                    <label>Report Name</label>
                    <input type="text" value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="e.g. Blood Test" required />
                </div>
                <div className="input-group">
                    <label>Report Date</label>
                    <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} required />
                </div>
                
                <div className="input-group">
                    <label>File Attachment</label>
                    <label className={`file-upload-box ${selectedFile ? 'selected' : ''}`}>
                        <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} hidden />
                        {selectedFile ? `✅ ${selectedFile.name}` : "📂 Click to Select File (Image or PDF)"}
                    </label>
                </div>

                <div className="modal-actions-center">
                    <button type="submit" className="primary-btn" disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload Report"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
