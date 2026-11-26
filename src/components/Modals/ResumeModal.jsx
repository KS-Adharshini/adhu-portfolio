import React, { useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { sounds } from '../SoundEffects';

export default function ResumeModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pdfUrl = '/Adharshini CV.pdf';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container resume-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Adharshini CV"
      >
        {/* Modal Header */}
        <div className="resume-modal-header">
          <div className="resume-header-left">
            <div className="resume-header-icon-wrap">
              <FileText size={22} color="#ff9d54" />
            </div>
            <div className="resume-title-group">
              <span className="resume-tag">CURRICULUM VITAE</span>
              <h2 className="resume-title">ADHARSHINI CV</h2>
            </div>
          </div>

          <div className="resume-header-actions">
            <a
              href={pdfUrl}
              download="Adharshini CV.pdf"
              className="dossier-btn highlight-btn"
              onClick={() => sounds.playClick()}
              title="Download Adharshini CV PDF"
            >
              <Download size={16} />
              <span>DOWNLOAD PDF</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dossier-btn"
              onClick={() => sounds.playClick()}
              title="Open PDF in Fullscreen"
            >
              <ExternalLink size={16} />
              <span>FULLSCREEN</span>
            </a>

            <button
              className="modal-close-btn resume-modal-close"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              aria-label="Close CV preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="resume-modal-body">
          <object
            data={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            type="application/pdf"
            className="resume-pdf-viewer"
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&view=FitH`}
              title="Adharshini CV"
              className="resume-pdf-viewer"
            >
              <div className="resume-fallback-wrap">
                <p>Your browser doesn&apos;t support direct PDF embedding.</p>
                <a
                  href={pdfUrl}
                  download="Adharshini CV.pdf"
                  className="dossier-btn highlight-btn"
                >
                  <Download size={16} />
                  <span>Download Adharshini CV</span>
                </a>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </div>
  );
}
