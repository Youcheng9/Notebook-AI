import { useState, useEffect } from 'react';

// Main App Component
export default function RAGSystemPrototype() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);

  // Sample documents
  const documents = [
    { id: 1, title: 'Introduction to Machine Learning', pages: 45, date: '2 days ago', icon: '📄', color: '#4F46E5' },
    { id: 2, title: 'Data Structures & Algorithms', pages: 128, date: '5 days ago', icon: '📊', color: '#0891B2' },
    { id: 3, title: 'Molecular Biology Textbook', pages: 312, date: '1 week ago', icon: '🧬', color: '#10B981' },
    { id: 4, title: 'Linear Algebra Notes', pages: 67, date: '2 weeks ago', icon: '📐', color: '#F59E0B' },
    { id: 5, title: 'World History - Renaissance', pages: 89, date: '3 weeks ago', icon: '🌍', color: '#EF4444' },
    { id: 6, title: 'Quantum Physics Introduction', pages: 156, date: '1 month ago', icon: '⚛️', color: '#8B5CF6' },
  ];

  // Initialize chat with welcome message
  useEffect(() => {
    if (currentScreen === 'chat' && messages.length === 0) {
      setMessages([
        {
          type: 'ai',
          content: `Hello! I've analyzed your document "${selectedDocument?.title}". I'm ready to answer questions, explain concepts, or help you study. What would you like to know?`,
          suggestions: [
            'What are the main types of machine learning?',
            'Explain supervised learning',
            'What is overfitting?'
          ]
        }
      ]);
    }
  }, [currentScreen, selectedDocument]);

  const navigateTo = (screen, doc = null) => {
    setCurrentScreen(screen);
    if (doc) setSelectedDocument(doc);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user', content: text },
      {
        type: 'ai',
        content: 'Based on the document, there are three main types of machine learning:\n\n**1. Supervised Learning** - The algorithm learns from labeled training data, making predictions or decisions based on examples with known outcomes. Common applications include classification and regression tasks.\n\n**2. Unsupervised Learning** - The algorithm finds patterns in unlabeled data without predefined outcomes. This includes clustering, dimensionality reduction, and anomaly detection.\n\n**3. Reinforcement Learning** - The algorithm learns through trial and error by interacting with an environment, receiving rewards or penalties based on its actions.',
        citations: [
          { text: 'Page 12, Section 2.1', page: 12 },
          { text: 'Page 15, Figure 2.3', page: 15 },
          { text: 'Page 18-19', page: 18 }
        ]
      }
    ];

    setMessages(newMessages);
    setInputValue('');
  };

  const openCitation = (citation) => {
    setSelectedCitation({
      ...citation,
      fullText: '"Machine learning can be broadly categorized into three paradigms: supervised learning, where the model learns from labeled examples; unsupervised learning, where patterns are discovered in unlabeled data; and reinforcement learning, where an agent learns optimal actions through environmental feedback and reward signals."'
    });
    setShowCitationModal(true);
  };

  return (
    <div style={styles.app}>
      {/* Prototype Indicator */}
      <div style={styles.prototypeIndicator}>
        📱 Interactive React Prototype
      </div>

      {/* Landing Screen */}
      {currentScreen === 'landing' && (
        <LandingScreen onGetStarted={() => navigateTo('upload')} />
      )}

      {/* Upload Screen */}
      {currentScreen === 'upload' && (
        <UploadScreen 
          onNavigate={navigateTo}
        />
      )}

      {/* Library Screen */}
      {currentScreen === 'library' && (
        <LibraryScreen 
          documents={documents}
          onNavigate={navigateTo}
          onSelectDocument={(doc) => navigateTo('chat', doc)}
        />
      )}

      {/* Chat Screen */}
      {currentScreen === 'chat' && (
        <ChatScreen 
          document={selectedDocument}
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={sendMessage}
          onNavigate={navigateTo}
          onCitationClick={openCitation}
        />
      )}

      {/* Citation Modal */}
      {showCitationModal && (
        <CitationModal 
          citation={selectedCitation}
          document={selectedDocument}
          onClose={() => setShowCitationModal(false)}
        />
      )}
    </div>
  );
}

// Landing Screen Component
function LandingScreen({ onGetStarted }) {
  return (
    <div style={styles.landing}>
      <div style={styles.landingBg}></div>
      <div style={styles.landingContent}>
        <h1 style={styles.landingTitle}>
          Notebook-style<br />RAG System
        </h1>
        <p style={styles.landingSubtitle}>
          AI-Powered Document Intelligence for Learning & Research
        </p>
        <button style={styles.btnPrimary} onClick={onGetStarted}>
          Get Started →
        </button>

        <div style={styles.featureGrid}>
          <FeatureCard 
            icon="📚"
            title="Smart Upload"
            description="Support for PDFs and various learning materials"
          />
          <FeatureCard 
            icon="🔍"
            title="Semantic Search"
            description="Vector embeddings for intelligent retrieval"
          />
          <FeatureCard 
            icon="💬"
            title="Conversational AI"
            description="Natural language Q&A with source citations"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{description}</p>
    </div>
  );
}

// Upload Screen Component
function UploadScreen({ onNavigate }) {
  return (
    <div style={styles.screen}>
      <Header onNavigate={onNavigate} activeTab="upload" />
      <div style={styles.mainContent}>
        <div style={styles.uploadArea} onClick={() => onNavigate('library')}>
          <div style={styles.uploadIcon}>📤</div>
          <h2 style={styles.uploadTitle}>Upload Your Documents</h2>
          <p style={styles.uploadDesc}>Drag and drop files here or click to browse</p>
          <div style={styles.fileTypes}>
            <span style={styles.fileType}>PDF</span>
            <span style={styles.fileType}>DOCX</span>
            <span style={styles.fileType}>TXT</span>
            <span style={styles.fileType}>MD</span>
          </div>
        </div>
        <p style={styles.securityNote}>
          Your documents are processed securely with end-to-end encryption
        </p>
      </div>
    </div>
  );
}

// Library Screen Component
function LibraryScreen({ documents, onNavigate, onSelectDocument }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.screen}>
      <Header onNavigate={onNavigate} activeTab="library" />
      <div style={styles.mainContent}>
        <div style={styles.libraryHeader}>
          <h1 style={styles.libraryTitle}>Document Library</h1>
          <input
            type="text"
            style={styles.searchBox}
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={styles.documentGrid}>
          {filteredDocs.map((doc) => (
            <DocumentCard 
              key={doc.id}
              doc={doc}
              onClick={() => onSelectDocument(doc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ doc, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.documentCard,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{...styles.docIcon, background: doc.color}}>
        {doc.icon}
      </div>
      <div style={styles.docTitle}>{doc.title}</div>
      <div style={styles.docMeta}>
        <span>{doc.pages} pages</span>
        <span>•</span>
        <span>{doc.date}</span>
      </div>
    </div>
  );
}

// Chat Screen Component
function ChatScreen({ document, messages, inputValue, setInputValue, onSend, onNavigate, onCitationClick }) {
  const messagesEndRef = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.screen}>
      <Header onNavigate={onNavigate} activeTab="chat" />
      <div style={styles.chatContainer}>
        <Sidebar document={document} onSend={onSend} />
        
        <div style={styles.chatMain}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatHeaderTitle}>Ask me anything about your document</h2>
          </div>

          <div style={styles.messages}>
            {messages.map((message, index) => (
              <Message 
                key={index}
                message={message}
                onSuggestionClick={onSend}
                onCitationClick={onCitationClick}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              style={styles.chatInput}
              placeholder="Ask a question about your document..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSend(inputValue)}
            />
            <button 
              style={styles.sendBtn}
              onClick={() => onSend(inputValue)}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ document, onSend }) {
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>CURRENT DOCUMENT</h3>
      <div style={styles.currentDoc}>
        <div style={styles.currentDocTitle}>{document?.title}</div>
        <div style={styles.currentDocMeta}>{document?.pages} pages • PDF</div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={styles.sidebarTitle}>QUICK ACTIONS</h3>
        <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button 
            style={styles.quickAction}
            onClick={() => onSend('Summarize this document')}
          >
            📋 Summarize document
          </button>
          <button 
            style={styles.quickAction}
            onClick={() => onSend('Extract key concepts')}
          >
            🔑 Extract key concepts
          </button>
          <button 
            style={styles.quickAction}
            onClick={() => onSend('Generate quiz questions')}
          >
            ❓ Generate quiz questions
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ message, onSuggestionClick, onCitationClick }) {
  if (message.type === 'user') {
    return (
      <div style={styles.messageUser}>
        <div style={styles.messageUserContent}>{message.content}</div>
      </div>
    );
  }

  return (
    <div style={styles.messageAI}>
      <div style={styles.avatar}>AI</div>
      <div style={styles.messageAIContent}>
        <div style={styles.messageText}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} style={{ margin: line.startsWith('**') ? '12px 0 8px 0' : '0 0 8px 0' }}>
              {line}
            </p>
          ))}
        </div>

        {message.suggestions && (
          <div style={styles.suggestions}>
            {message.suggestions.map((suggestion, i) => (
              <button
                key={i}
                style={styles.suggestionChip}
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {message.citations && (
          <div style={styles.citations}>
            <div style={styles.citationLabel}>SOURCES</div>
            <div style={styles.citationItems}>
              {message.citations.map((citation, i) => (
                <span
                  key={i}
                  style={styles.citationBadge}
                  onClick={() => onCitationClick(citation)}
                >
                  {citation.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Citation Modal Component
function CitationModal({ citation, document, onClose }) {
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Source Citation</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.citationText}>{citation.fullText}</div>

        <div style={styles.citationMeta}>
          <span>📄 {citation.text}</span>
          <span>📖 {document?.title}</span>
        </div>

        <button style={{...styles.btnPrimary, width: '100%', marginTop: 30}} onClick={onClose}>
          Jump to Page in Document
        </button>
      </div>
    </div>
  );
}

// Header Component
function Header({ onNavigate, activeTab }) {
  return (
    <div style={styles.header}>
      <div style={styles.logo}>📖 RAG Notebook</div>
      <div style={styles.navTabs}>
        <div
          style={activeTab === 'upload' ? styles.navTabActive : styles.navTab}
          onClick={() => onNavigate('upload')}
        >
          Upload
        </div>
        <div
          style={activeTab === 'library' ? styles.navTabActive : styles.navTab}
          onClick={() => onNavigate('library')}
        >
          My Documents
        </div>
        <div style={styles.navTab}>Settings</div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  app: {
    fontFamily: "'Merriweather Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    background: '#FAFAF9',
    minHeight: '100vh',
    color: '#1A1A1A',
  },

  prototypeIndicator: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: '#1A1A1A',
    color: 'white',
    padding: '12px 20px',
    borderRadius: 30,
    fontSize: 12,
    zIndex: 1000,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },

  // Landing Styles
  landing: {
    background: 'linear-gradient(135deg, #1E3A8A 0%, #0C1E47 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  landingBg: {
    position: 'absolute',
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    top: -200,
    right: -200,
  },

  landingContent: {
    textAlign: 'center',
    color: 'white',
    zIndex: 1,
    maxWidth: 700,
    padding: 40,
  },

  landingTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 56,
    fontWeight: 800,
    marginBottom: 20,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },

  landingSubtitle: {
    fontSize: 20,
    color: '#DBEAFE',
    marginBottom: 40,
    lineHeight: 1.6,
    fontWeight: 300,
  },

  btnPrimary: {
    background: 'white',
    color: '#1E3A8A',
    padding: '16px 48px',
    border: 'none',
    borderRadius: 50,
    fontSize: 18,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 30,
    marginTop: 80,
  },

  featureCard: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: 30,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
  },

  featureIcon: {
    fontSize: 40,
    marginBottom: 15,
  },

  featureTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 600,
  },

  featureDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.5,
  },

  // Header Styles
  header: {
    background: 'white',
    padding: '20px 40px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontFamily: "'Merriweather', serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#1E3A8A',
  },

  navTabs: {
    display: 'flex',
    gap: 30,
  },

  navTab: {
    padding: '10px 0',
    color: '#6B7280',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
    fontWeight: 500,
  },

  navTabActive: {
    padding: '10px 0',
    color: '#1E3A8A',
    cursor: 'pointer',
    borderBottom: '2px solid #1E3A8A',
    fontWeight: 600,
  },

  screen: {
    minHeight: '100vh',
    background: '#FAFAF9',
  },

  mainContent: {
    maxWidth: 1200,
    margin: '60px auto',
    padding: '0 40px',
  },

  // Upload Styles
  uploadArea: {
    background: 'white',
    border: '3px dashed #60A5FA',
    borderRadius: 20,
    padding: '80px 40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  uploadIcon: {
    fontSize: 64,
    color: '#60A5FA',
    marginBottom: 20,
  },

  uploadTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 28,
    marginBottom: 10,
    color: '#1E3A8A',
  },

  uploadDesc: {
    color: '#6B7280',
    fontSize: 16,
  },

  fileTypes: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: 30,
  },

  fileType: {
    background: '#DBEAFE',
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    color: '#1E3A8A',
    fontWeight: 600,
  },

  securityNote: {
    marginTop: 60,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },

  // Library Styles
  libraryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },

  libraryTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 36,
    color: '#1E3A8A',
  },

  searchBox: {
    padding: '12px 20px',
    border: '2px solid #E5E7EB',
    borderRadius: 30,
    width: 300,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },

  documentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 30,
  },

  documentCard: {
    background: 'white',
    borderRadius: 16,
    padding: 25,
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  docIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
  },

  docTitle: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 8,
    color: '#1A1A1A',
  },

  docMeta: {
    fontSize: 13,
    color: '#6B7280',
    display: 'flex',
    gap: 8,
  },

  // Chat Styles
  chatContainer: {
    display: 'flex',
    height: 'calc(100vh - 80px)',
  },

  sidebar: {
    width: 300,
    background: 'white',
    borderRight: '1px solid #E5E7EB',
    padding: '30px 20px',
  },

  sidebarTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 15,
    letterSpacing: 1,
    fontWeight: 600,
  },

  currentDoc: {
    background: 'rgba(30, 58, 138, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderLeft: '4px solid #1E3A8A',
  },

  currentDocTitle: {
    fontWeight: 600,
    color: '#1E3A8A',
    marginBottom: 5,
    fontSize: 14,
  },

  currentDocMeta: {
    fontSize: 12,
    color: '#6B7280',
  },

  quickAction: {
    textAlign: 'left',
    border: '1px solid #E5E7EB',
    padding: '12px 16px',
    background: 'white',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s ease',
  },

  chatMain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#FAFAF9',
  },

  chatHeader: {
    background: 'white',
    padding: '25px 40px',
    borderBottom: '1px solid #E5E7EB',
  },

  chatHeaderTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 24,
    color: '#1E3A8A',
  },

  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 40,
  },

  messageUser: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },

  messageUserContent: {
    maxWidth: '70%',
    background: '#1E3A8A',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '20px 20px 4px 20px',
    boxShadow: '0 2px 10px rgba(30, 58, 138, 0.2)',
  },

  messageAI: {
    display: 'flex',
    gap: 15,
    marginBottom: 30,
  },

  avatar: {
    width: 40,
    height: 40,
    background: 'linear-gradient(135deg, #60A5FA 0%, #1E3A8A 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600,
    flexShrink: 0,
  },

  messageAIContent: {
    maxWidth: '70%',
    background: 'white',
    padding: '20px 24px',
    borderRadius: '4px 20px 20px 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },

  messageText: {
    lineHeight: 1.6,
  },

  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },

  suggestionChip: {
    background: 'white',
    border: '2px solid #60A5FA',
    color: '#1E3A8A',
    padding: '10px 20px',
    borderRadius: 25,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  citations: {
    marginTop: 15,
    paddingTop: 15,
    borderTop: '1px solid #E5E7EB',
  },

  citationLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontWeight: 600,
  },

  citationItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  citationBadge: {
    background: '#DBEAFE',
    color: '#1E3A8A',
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
  },

  inputArea: {
    background: 'white',
    padding: '25px 40px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    gap: 15,
  },

  chatInput: {
    flex: 1,
    padding: '16px 24px',
    border: '2px solid #E5E7EB',
    borderRadius: 30,
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },

  sendBtn: {
    background: '#1E3A8A',
    color: 'white',
    padding: '16px 32px',
    border: 'none',
    borderRadius: 30,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Modal Styles
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContent: {
    background: 'white',
    borderRadius: 20,
    padding: 40,
    maxWidth: 700,
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },

  modalTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 24,
    color: '#1E3A8A',
  },

  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 28,
    color: '#6B7280',
    cursor: 'pointer',
    lineHeight: 1,
    padding: 0,
    width: 30,
    height: 30,
  },

  citationText: {
    background: '#FAFAF9',
    padding: 20,
    borderRadius: 12,
    borderLeft: '4px solid #1E3A8A',
    fontSize: 15,
    lineHeight: 1.7,
    color: '#1A1A1A',
    marginBottom: 20,
    fontStyle: 'italic',
  },

  citationMeta: {
    display: 'flex',
    gap: 20,
    color: '#6B7280',
    fontSize: 14,
  },
};