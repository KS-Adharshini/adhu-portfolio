import React, { useState, useEffect } from 'react';
import { X, Mail, User, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../BrandIcons';
import { sounds } from '../SoundEffects';

export default function ArchitectModal({ onClose }) {
  const [viewMode, setViewMode] = useState('dossier'); // 'dossier' | 'dispatch'
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState('idle'); // 'idle' | 'dispatched'
  const [gmailLink, setGmailLink] = useState('');
  const [mailtoLink, setMailtoLink] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        if (viewMode === 'dispatch') {
          setViewMode('dossier');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, viewMode]);

  const handleOpenDispatch = (e) => {
    e.preventDefault();
    sounds.playClick();
    setViewMode('dispatch');
    setSendStatus('idle');
  };

  const handleSendDispatch = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    sounds.playUnlock();

    const recipientEmail = 'adharshiniks015@gmail.com';
    const subject = `Portfolio Transmission from ${senderName.trim() || 'Visitor'}`;
    const fullBody = `Name: ${senderName.trim() || 'Not specified'}\nEmail: ${senderEmail.trim() || 'Not specified'}\n\nMessage:\n${message.trim()}`;

    const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

    setMailtoLink(mailto);
    setGmailLink(gmail);
    setSendStatus('dispatched');

    // Automatically attempt opening Gmail web or native mailto
    try {
      const opened = window.open(gmail, '_blank');
      if (!opened) {
        window.location.href = mailto;
      }
    } catch (err) {
      window.location.href = mailto;
    }
  };

  const handleResetForm = () => {
    setSenderName('');
    setSenderEmail('');
    setMessage('');
    setSendStatus('idle');
    setGmailLink('');
    setMailtoLink('');
    setViewMode('dossier');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container architect-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-btn"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          aria-label="Close dossier"
        >
          <X size={20} />
        </button>

        {viewMode === 'dispatch' ? (
          sendStatus === 'dispatched' ? (
            <div className="dispatch-success-wrap">
              <div className="dispatch-success-box">
                <div className="dispatch-success-badge">
                  <CheckCircle2 size={42} className="dispatch-success-icon" />
                </div>
                <span className="dispatch-tag">TRANSMISSION ROUTED</span>
                <h3 className="dispatch-success-title">TRANSMISSION READY TO SEND</h3>
                <p className="dispatch-success-desc">
                  Your transmission to{' '}
                  <span className="dispatch-highlight-email">adharshiniks015@gmail.com</span> has been prepared.<br />
                  If your mail window didn&apos;t open automatically, choose an option below:
                </p>
                <div className="dispatch-success-actions-dual">
                  <a
                    href={gmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dossier-btn highlight-btn"
                    onClick={() => sounds.playClick()}
                  >
                    <Mail size={16} />
                    <span>Open in Gmail</span>
                  </a>
                  <a
                    href={mailtoLink}
                    className="dossier-btn"
                    onClick={() => sounds.playClick()}
                  >
                    <Send size={16} />
                    <span>Open Mail App</span>
                  </a>
                </div>
                <button
                  type="button"
                  className="dispatch-return-link"
                  onClick={() => {
                    sounds.playClick();
                    handleResetForm();
                  }}
                >
                  Return to Dossier
                </button>
              </div>
            </div>
          ) : (
            <div className="dispatch-form-wrap">
              <div className="dispatch-header">
                <button
                  type="button"
                  className="dispatch-back-btn"
                  onClick={() => {
                    sounds.playClick();
                    setViewMode('dossier');
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>BACK TO DOSSIER</span>
                </button>
                <div className="dispatch-title-box">
                  <h2 className="dispatch-title">DISPATCH SIGNAL</h2>
                  <span className="dispatch-subtitle">Direct routing to adharshiniks015@gmail.com</span>
                </div>
              </div>

              <form onSubmit={handleSendDispatch} className="dispatch-form">
                <div className="dispatch-fields-row">
                  <div className="dispatch-field-group">
                    <label className="dispatch-label">YOUR CALLSIGN / NAME</label>
                    <input
                      type="text"
                      className="dispatch-input"
                      placeholder="e.g. Alex Hunter"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="dispatch-field-group">
                    <label className="dispatch-label">YOUR FREQUENCY / EMAIL</label>
                    <input
                      type="email"
                      className="dispatch-input"
                      placeholder="e.g. alex@example.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="dispatch-field-group full-width">
                  <label className="dispatch-label">TRANSMISSION MESSAGE</label>
                  <textarea
                    className="dispatch-textarea"
                    placeholder="Enter your message, project query, or strategic collaboration quest..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={3}
                  />
                </div>

                <div className="dispatch-actions-row">
                  <button
                    type="button"
                    className="dossier-btn"
                    onClick={() => {
                      sounds.playClick();
                      setViewMode('dossier');
                    }}
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="dossier-btn highlight-btn dispatch-submit-btn"
                  >
                    <Send size={15} />
                    <span>SEND DISPATCH</span>
                  </button>
                </div>
              </form>
            </div>
          )
        ) : (
          <div className="architect-dossier-wrap">
            <div className="dossier-header">
              <div className="dossier-avatar-wrap">
                <img
                  src="/assets/warrior-avatar.png?v=sun"
                  alt="Adharshini KS - The Architect"
                  className="dossier-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div className="dossier-title-box">
                <span className="dossier-tag">ARCHITECT DOSSIER</span>
                <h2 className="dossier-name">ADHARSHINI KS</h2>
                <p className="dossier-class">Full-Stack Architect & AI/ML Specialist</p>
              </div>
            </div>

            <div className="dossier-bio">
              <p>
                Architecting modular, intelligent software solutions spanning deep learning
                thermal defect detection, agricultural predictive models, bioinformatics DNA
                analytics, and enterprise web engines. Driven to conquer complex computational
                quests.
              </p>
            </div>

            <div className="dossier-actions">
              <div className="dossier-social-group">
                <a
                  href="https://github.com/KS-Adharshini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dossier-btn"
                  onClick={() => sounds.playClick()}
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/adharshiniks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dossier-btn"
                  onClick={() => sounds.playClick()}
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </a>
              </div>

              <button
                type="button"
                className="dossier-btn highlight-btn"
                onClick={handleOpenDispatch}
              >
                <Mail size={16} />
                <span>Dispatch Signal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
