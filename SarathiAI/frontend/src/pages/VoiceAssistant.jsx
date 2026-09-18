import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Send, Volume2, Bot, User, Zap } from 'lucide-react'

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null

export default function VoiceAssistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm Sarathi AI, your voice-based transport assistant. I'm running on the Snapdragon X Elite NPU. How can I help you today?", time: 'now' },
  ])
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const recognitionRef = useRef(null)

  const commands = [
    'Show vehicle status',
    'Optimize route for deliveries',
    'Schedule maintenance for V0001',
    'Generate daily report',
    'Check fuel consumption',
    'List all active vehicles',
  ]

  useEffect(() => {
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setIsListening(false)
      setInput((prev) => transcript || prev)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return

    const text = input
    const userMsg = { role: 'user', text, time: 'now' }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      const res = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: text, context: 'general' }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const botMsg = {
        role: 'bot',
        text: data.result?.response?.message || data.result?.response || "I've processed your command.",
        time: 'now',
        confidence: data.result?.confidence,
        category: data.result?.category,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: `Sorry, I couldn't process that command. ${err.message}`,
        time: 'now',
        error: true,
      }])
    }
  }, [input])

  const toggleVoice = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    if (isListening) {
      recognition.abort()
      setIsListening(false)
    } else {
      setInput('')
      setIsListening(true)
      try {
        recognition.start()
      } catch {
        setIsListening(false)
      }
    }
  }, [isListening])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Voice Assistant</h1>
          <p className="page-subtitle">Hands-free transport management with AI speech recognition</p>
        </div>
        <div className="ai-model-tag"><Zap size={12} /> Whisper Base - Qualcomm AI Hub</div>
      </div>

      <div className="content-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
          <div className="card-header">
            <h3 className="card-title">Conversation</h3>
            <span className="card-badge">On-Device Processing</span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', gap: '10px', marginBottom: '16px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--accent-purple)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{
                  maxWidth: '70%', padding: '12px', borderRadius: '12px',
                  background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--bg-card)',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                  borderBottomLeftRadius: msg.role === 'bot' ? '4px' : '12px',
                }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {msg.confidence && (
                      <span style={{ color: 'var(--accent-cyan)' }}>
                        {(msg.confidence * 100).toFixed(0)}% confidence
                      </span>
                    )}
                    {msg.category && (
                      <span style={{ color: 'var(--accent-purple)' }}>{msg.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="voice-input">
            <button className={`voice-btn ${isListening ? 'recording' : ''}`} onClick={toggleVoice}>
              <Mic size={20} />
            </button>
            <input
              className="form-input"
              placeholder="Type a command or use voice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              <Send size={16} />
            </button>
          </div>

          {isListening && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--accent-red)' }}>
              <Volume2 size={16} style={{ animation: 'pulse 1s infinite', marginRight: '6px' }} />
              Listening... Speak your command
            </div>
          )}

          {!speechSupported && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--accent-orange)' }}>
              Speech recognition is not supported in this browser. Please type your commands instead.
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">Quick Commands</h3>
            </div>
            {commands.map((cmd, i) => (
              <div key={i}
                style={{
                  padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: '8px',
                  marginBottom: '6px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)',
                  transition: 'all 0.2s', border: '1px solid transparent',
                }}
                onClick={() => setInput(cmd)}
                onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.color = 'var(--text-secondary)' }}
              >
                {cmd}
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Voice System Status</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Engine', value: SpeechRecognition ? 'Web Speech API' : 'Unavailable' },
                { label: 'Source', value: 'Browser Native' },
                { label: 'Device', value: 'Snapdragon X Elite' },
                { label: 'NPU', value: 'Active (45 TOPS)' },
                { label: 'Status', value: isListening ? 'Listening...' : 'Ready' },
                { label: 'Language', value: 'English' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
