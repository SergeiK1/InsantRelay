import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Css/Terminal.css';

function Terminal() {
  const [scanningComplete, setScanningComplete] = useState(false);
  const [networkLinks, setNetworkLinks] = useState([]);
  const [displayedLinks, setDisplayedLinks] = useState([]);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const inputRef = useRef(null);

  // Generate random gibberish hyperlinks
  const generateRandomLinks = () => {
    const domains = ['xkr7', 'qwz9', 'mnt4', 'bvx2', 'hjk8', 'pqr5', 'xyz3', 'abc1', 'def6', 'ghi0'];
    const extensions = ['.net', '.org', '.io', '.dev', '.tech', '.sys', '.core', '.hub', '.node', '.link'];
    const protocols = ['https://', 'http://', 'ftp://', 'ssh://'];
    
    return Array(10).fill(null).map((_, index) => {
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const subdomain = Math.random().toString(36).substring(2, 8);
      const extension = extensions[Math.floor(Math.random() * extensions.length)];
      const port = Math.floor(Math.random() * 9000) + 1000;
      
      return {
        id: index,
        url: `${protocol}${subdomain}.${domain}${extension}:${port}`,
        status: Math.random() > 0.3 ? 'ACTIVE' : 'TIMEOUT'
      };
    });
  };

  const handleCommand = (command) => {
    let response;
    if (command.trim() === 'InsantRelay') {
      response = (
        <>
          <span style={{ color: '#00ff00' }}>ACCESS GRANTED</span>
          <br />
          <span>Redirecting to: </span>
          <a href="/rick2" style={{ color: '#00ccff', textDecoration: 'underline' }}>
            insantrelay.com
          </a>
        </>
      );
    } else {
      response = <span style={{ color: '#ff6b6b' }}>ERROR</span>;
    }
    
    const newHistory = [...commandHistory, { command, response }];
    setCommandHistory(newHistory);
    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(userInput);
    }
  };

  // Initial scan delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setNetworkLinks(generateRandomLinks());
      setScanningComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for links
  useEffect(() => {
    if (!scanningComplete || typingComplete) return;

    const timer = setTimeout(() => {
      if (currentLinkIndex < networkLinks.length) {
        const currentLink = networkLinks[currentLinkIndex];
        const fullText = `[${currentLink.status}] ${currentLink.url}`;
        
        if (currentCharIndex < fullText.length) {
          setDisplayedLinks(prev => {
            const newLinks = [...prev];
            if (!newLinks[currentLinkIndex]) {
              newLinks[currentLinkIndex] = { ...currentLink, displayText: '' };
            }
            newLinks[currentLinkIndex].displayText = fullText.substring(0, currentCharIndex + 1);
            return newLinks;
          });
          setCurrentCharIndex(prev => prev + 1);
        } else {
          setCurrentLinkIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }
      } else {
        setTypingComplete(true);
      }
    }, 20); // 20ms delay between characters

    return () => clearTimeout(timer);
  }, [scanningComplete, currentLinkIndex, currentCharIndex, networkLinks, typingComplete]);

  // Focus input when typing is complete
  useEffect(() => {
    if (typingComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [typingComplete]);

  return (
    <div className="terminal-page">
      <div className="terminal-header">
        <Link to="/shop" className="terminal-back-link">
          <h1 className="terminal-title">InsantRelay.exe</h1>
        </Link>
      </div>
      <div className="terminal-content">
        <div className="terminal-window">
          <div className="terminal-bar">
            <div className="terminal-buttons">
              <span className="terminal-button red"></span>
              <span className="terminal-button yellow"></span>
              <span className="terminal-button green"></span>
            </div>
            <div className="terminal-title-bar">Terminal</div>
          </div>
          <div className="terminal-body">
            {!scanningComplete ? (
              <div className="terminal-line">
                <span className="terminal-prompt">user@insantrelay:~$ </span>
                <span>Scanning network...</span>
                <span className="terminal-cursor"></span>
              </div>
            ) : (
              <>
                <div className="terminal-line">
                  <span className="terminal-prompt">user@insantrelay:~$ </span>
                  <span>Network scan complete. Found {networkLinks.length} nodes:</span>
                </div>
                <div className="network-results">
                  {displayedLinks.map((link, index) => (
                    <div key={link.id} className="terminal-line network-link">
                      <span className="typewriter-text">
                        {link.displayText}
                        {index === currentLinkIndex && !typingComplete && (
                          <span className="terminal-cursor"></span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Command History */}
                {commandHistory.map((cmd, index) => (
                  <div key={index}>
                    <div className="terminal-line">
                      <span className="terminal-prompt">user@insantrelay:~$ </span>
                      <span>{cmd.command}</span>
                    </div>
                    <div className="terminal-line">
                      <span className="command-response">{cmd.response}</span>
                    </div>
                  </div>
                ))}
                
                {/* Interactive Input */}
                {typingComplete && (
                  <div className="terminal-line input-line">
                    <span className="terminal-prompt">user@insantrelay:~$ </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="terminal-input"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <span className="terminal-cursor"></span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminal;