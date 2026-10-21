import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, LoaderCircle, Send, Sparkles, X } from 'lucide-react';

const welcomeMessage = {
  role: 'assistant',
  content: 'Halo! Saya asisten AI portfolio Fachriza. Mau bertanya tentang proyek, skill, atau ingin diskusi ide?'
};

const suggestions = ['Ceritakan proyek Fachriza', 'Saya punya ide website'];

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isOpen]);

  const sendMessage = async (text = draft) => {
    const content = text.trim();
    if (!content || isSending) return;

    const userMessage = { role: 'user', content };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setDraft('');
    setError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation
            .filter((message) => message.role === 'user' || message.role === 'assistant')
            .slice(-12)
            .map(({ role, content: messageContent }) => ({ role, content: messageContent }))
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Pesan belum dapat dikirim.');

      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch (sendError) {
      setError(sendError.message || 'Koneksi bermasalah. Silakan coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <motion.button
        type='button'
        className='floating-btn ai-chat-trigger'
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Tutup asisten AI' : 'Tanya asisten AI'}
        aria-expanded={isOpen}
        aria-controls='ai-chat-panel'
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.92 }}
      >
        {isOpen ? <X size={21} /> : <Sparkles size={21} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id='ai-chat-panel'
            className='ai-chat-panel'
            aria-label='Asisten AI portfolio'
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <header className='ai-chat-header'>
              <span className='ai-chat-avatar'><Bot size={19} /></span>
              <div className='ai-chat-heading'>
                <strong>Asisten Portfolio</strong>
                <span><i /> Siap membantu</span>
              </div>
              <button
                type='button'
                className='ai-chat-close'
                onClick={() => setIsOpen(false)}
                aria-label='Tutup chat'
              >
                <X size={18} />
              </button>
            </header>

            <div className='ai-chat-transcript' ref={transcriptRef} aria-live='polite'>
              {messages.map((message, index) => (
                <div className={`ai-chat-message is-${message.role}`} key={`${message.role}-${index}`}>
                  {message.content}
                </div>
              ))}

              {messages.length === 1 && (
                <div className='ai-chat-suggestions' aria-label='Contoh pertanyaan'>
                  {suggestions.map((suggestion) => (
                    <button
                      type='button'
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={isSending}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {isSending && (
                <div className='ai-chat-message is-assistant is-typing'>
                  <LoaderCircle size={15} />
                  Sedang mengetik...
                </div>
              )}
              {error && <p className='ai-chat-error' role='alert'>{error}</p>}
            </div>

            <form className='ai-chat-form' onSubmit={handleSubmit}>
              <label className='sr-only' htmlFor='ai-chat-input'>Tulis pertanyaan</label>
              <textarea
                id='ai-chat-input'
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Tulis pertanyaan...'
                maxLength={2000}
                rows={1}
                disabled={isSending}
              />
              <button type='submit' aria-label='Kirim pesan' disabled={!draft.trim() || isSending}>
                <Send size={17} />
              </button>
            </form>
            <p className='ai-chat-disclaimer'>Jawaban AI bisa keliru. Jangan kirim data sensitif.</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
