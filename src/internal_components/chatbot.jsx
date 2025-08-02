import React, { useState, useRef, useEffect, useCallback } from 'react';
import { treatments } from '../data/treatments';
import ChatbotImage from '../images/Chatbot.jpeg';
import './chatbot.css';

// Constants defined outside the component
const predefinedResponses = {
  'hello': 'Hello, I\'m Dr. Medagg. How may I assist with your medical inquiries today?',
  'hi': 'Greetings. I\'m Dr. Medagg, a clinical consultant. How can I help with your health concerns?',
  'appointment': 'I can schedule a consultation for you. Would you prefer an in-person visit or telemedicine? We have specialists available in various fields.',
  'services': 'Our clinical services include: Surgical referrals to board-certified specialists, Non-invasive treatment alternatives, and Expert second opinions for complex diagnoses.',
  'non-surgical': 'Our non-invasive treatment modalities include innovative physical therapy protocols, cutting-edge interventional procedures, and evidence-based alternative medicine approaches. May I inquire about your specific condition?',
  'locations': 'We maintain clinical partnerships with over 50 Joint Commission accredited medical centers across 20+ metropolitan areas nationwide.',
  'cost': 'Treatment costs are contingent on your specific procedure and insurance coverage. Our financial counselors can provide a detailed cost breakdown for your specific case.',
  'insurance': 'We accept most major insurance networks including Blue Cross, UnitedHealthcare, Cigna, and Medicare. Our billing department can verify your specific coverage and benefits.',
  'doctors': 'Our medical network comprises over 200 board-certified specialists across numerous subspecialties, each with fellowship training and peer-reviewed publications in their respective fields.',
  'contact': 'For clinical inquiries, please contact our medical affairs office at clinical@medagg.com or call our physician hotline at (555) 123-4567.',
  'hours': 'Our telehealth platform operates 24/7, while our clinical staff is available Monday-Friday (8:00-20:00) and Saturday (9:00-17:00).',
  'emergency': 'If you are experiencing acute symptoms such as chest pain, difficulty breathing, or severe bleeding, please call emergency services (911) or proceed to the nearest emergency department immediately.',
  'thank you': 'You\'re welcome. Is there anything else regarding your health that I can address today?',
  'thanks': 'You\'re welcome. Is there anything else regarding your health that I can address today?',
  'bye': 'Thank you for consulting with me. Take care and maintain good health.',
  'goodbye': 'Thank you for consulting with me. Take care and maintain good health.',
};

const fallbackResponses = [
  'I need more clinical information to properly assess your question. Could you provide additional details?',
  'That\'s beyond my current medical knowledge base. Would you like me to refer you to one of our specialists?',
  'I\'m not able to provide a specific diagnosis without more information. Would you prefer to speak with one of our attending physicians?',
  'Your question requires a more personalized medical assessment. May I connect you with our clinical care team?',
  'I\'d need to review more of your medical history to adequately address that question.',
];

const initialMessages = [
  {
    text: 'Greetings, I\'m Dr. Medagg, your virtual clinical consultant. How may I assist with your healthcare needs today?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

// Quick response buttons for common questions
const quickResponses = [
  'Book a consultation',
  'Clinical services',
  'Treatment options',
  'Insurance & billing',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCondition, setActiveCondition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Memoized function to find the best matching response
  const findBestResponse = useCallback((userInput) => {
    const lowercaseInput = userInput.toLowerCase();

    // Direct match
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowercaseInput.includes(key)) {
        return response;
      }
    }

    // No match found, return a random fallback response
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
  }, []);

  // Memoized function to speak the response
  const speakResponse = useCallback((text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      synthRef.current.speak(utterance);
    }
  }, []);

  // Memoized function to generate response
  const generateResponse = useCallback((userInput) => {
    setIsTyping(true);

    setTimeout(() => {
      const response = findBestResponse(userInput);

      const botMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      speakResponse(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [findBestResponse, speakResponse]);

  const handleVoiceInput = useCallback((transcript) => {
    const userMessage = {
      text: transcript,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    generateResponse(transcript);
  }, [generateResponse]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          handleVoiceInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;
    }
  }, [handleVoiceInput]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // handleVoiceInput is now defined above with useCallback

  const handleQuickResponse = (response) => {
    const userMessage = {
      text: response,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    generateResponse(response);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage = {
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    generateResponse(userMessage.text);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000
    }}>
      <button
        onClick={toggleChat}
        style={{
          width: '5.5rem',
          height: '5.5rem',
          borderRadius: '50%',
          border: '2px solid #ec4899',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          background: 'white',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
          opacity: isOpen ? 0 : 1,
          padding: '0.25rem'
        }}
        aria-label='Open chat'
      >
        <img
          src={ChatbotImage}
          alt='Chat with us'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '450px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            color: 'white',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem'
              }}>
                <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Dr. MedAgg</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Virtual Health Assistant</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.25rem'
              }}
              aria-label='Close chat'
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderBottomLeftRadius: '1rem',
              borderBottomRightRadius: '1rem'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: message.sender === 'bot' ? 'row' : 'row-reverse'
                }}
              >
                {message.sender === 'bot' && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: '#ec4899',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div style={{
                      backgroundColor: '#f1f5f9',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      fontSize: '0.9rem',
                      maxWidth: '280px'
                    }}>
                      {message.text}
                    </div>
                  </div>
                )}

                {message.sender === 'user' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{
                      backgroundColor: '#ec4899',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      fontSize: '0.9rem',
                      maxWidth: '280px'
                    }}>
                      {message.text}
                    </div>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: '#64748b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '0.75rem'
                    }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: '#ec4899',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ec4899',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite'
                  }}></div>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ec4899',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite',
                    animationDelay: '0.2s'
                  }}></div>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    backgroundColor: '#ec4899',
                    borderRadius: '50%',
                    animation: 'bounce 1s infinite',
                    animationDelay: '0.4s'
                  }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: '1rem' }}></div>
          </div>

          {/* Quick responses */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleQuickResponse(response)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {response}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              placeholder='Type your medical query or schedule an appointment...'
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.9rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }}
              aria-label='Type your message'
            />
            <button
              type='button'
              onClick={isListening ? stopListening : startListening}
              style={{
                background: 'none',
                border: 'none',
                color: '#ec4899',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' />
              </svg>
            </button>
            <button
              type='submit'
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim() ? '#ec4899' : '#e2e8f0',
                border: 'none',
                color: 'white',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem'
              }}
              aria-label='Send message'
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
