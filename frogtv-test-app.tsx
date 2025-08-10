import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Frog {
  id: string;
  mood: 'stoned' | 'excited' | 'sleepy' | 'hungry' | 'philosophical';
  action: 'idle' | 'croak' | 'throw' | 'catch' | 'summonToadfather' | 'walkOff';
  x: number;
  y: number;
  thought?: string;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: number;
}

// Frog Component
const FrogComponent: React.FC<{ frog: Frog }> = ({ frog }) => {
  const getMoodFilter = () => {
    switch (frog.mood) {
      case 'stoned': return 'hue-rotate(90deg) saturate(0.7) brightness(0.9)';
      case 'excited': return 'hue-rotate(45deg) saturate(1.5) brightness(1.2)';
      case 'sleepy': return 'hue-rotate(240deg) saturate(0.5) brightness(0.7)';
      case 'hungry': return 'hue-rotate(0deg) saturate(1.2) brightness(1.1)';
      case 'philosophical': return 'hue-rotate(270deg) saturate(0.8) brightness(0.8)';
      default: return 'none';
    }
  };

  const getActionAnimation = () => {
    switch (frog.action) {
      case 'croak':
        return {
          scale: [1, 1.3, 1],
          rotate: [0, -8, 8, 0],
          transition: { duration: 0.6, repeat: 1 }
        };
      case 'catch':
        return {
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 0.4 }
        };
      case 'summonToadfather':
        return {
          scale: [1, 0.8, 1.8, 1],
          rotate: [0, 180, 360],
          transition: { duration: 3, ease: 'easeInOut' }
        };
      case 'walkOff':
        return {
          x: 800,
          opacity: 0,
          transition: { duration: 4, ease: 'easeInOut' }
        };
      default:
        return {
          y: [0, -5, 0],
          transition: { 
            duration: 3, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'easeInOut'
          }
        };
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{ left: frog.x, top: frog.y }}
      animate={getActionAnimation()}
    >
      {/* Frog SVG */}
      <div style={{ filter: getMoodFilter() }}>
        <svg width="80" height="60" viewBox="0 0 80 60" className="drop-shadow-lg">
          {/* Body */}
          <ellipse cx="40" cy="45" rx="35" ry="20" fill="#4CAF50" />
          {/* Eyes */}
          <circle cx="25" cy="25" r="12" fill="#66BB6A" />
          <circle cx="55" cy="25" r="12" fill="#66BB6A" />
          {/* Pupils */}
          <circle cx="27" cy="22" r="4" fill="#000" />
          <circle cx="53" cy="22" r="4" fill="#000" />
          {/* Mouth */}
          <ellipse cx="40" cy="38" rx="8" ry="4" fill="#2E7D32" />
          {/* Legs */}
          <ellipse cx="15" cy="55" rx="8" ry="6" fill="#4CAF50" />
          <ellipse cx="65" cy="55" rx="8" ry="6" fill="#4CAF50" />
        </svg>
      </div>

      {/* Thought bubble */}
      <AnimatePresence>
        {frog.thought && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-3 py-2 text-sm text-black shadow-xl max-w-32 text-center"
            initial={{ opacity: 0, scale: 0.3, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {frog.thought}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Chat Component
const ChatBox: React.FC<{
  messages: ChatMessage[];
  onSendMessage: (user: string, text: string) => void;
}> = ({ messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e?: any) => {
    if (inputText.trim() && username.trim()) {
      onSendMessage(username, inputText);
      setInputText('');
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-95 rounded-lg p-4 w-full max-w-sm">
      <h3 className="text-green-400 font-bold mb-3">Live Chat</h3>
      <div className="h-48 overflow-y-auto mb-4 space-y-1 bg-gray-800 rounded p-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <span className="text-green-400 font-semibold">{msg.user}:</span>
            <span className="text-white ml-1">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="space-y-2">
        {!username && (
          <input
            type="text"
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-green-400 focus:outline-none"
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-green-400 focus:outline-none"
            disabled={!username}
          />
          <button
            onClick={handleSubmit}
            disabled={!username || !inputText.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App
const FrogTVTest: React.FC = () => {
  const [frogs, setFrogs] = useState<Frog[]>([
    {
      id: 'frog1',
      mood: 'stoned',
      action: 'idle',
      x: 180,
      y: 280,
      thought: null
    },
    {
      id: 'frog2', 
      mood: 'philosophical',
      action: 'idle',
      x: 280,
      y: 290,
      thought: null
    },
    {
      id: 'frog3',
      mood: 'hungry',
      action: 'idle',
      x: 380,
      y: 275,
      thought: null
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Welcome to FrogTV! Type "ribbit" to interact!', timestamp: Date.now() }
  ]);

  const [ribbitCount, setRibbitCount] = useState(0);
  const [toadfatherSummoned, setToadfatherSummoned] = useState(false);

  // Reset ribbit counter every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRibbitCount(0);
      setToadfatherSummoned(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateFrog = (frogId: string, updates: Partial<Frog>) => {
    setFrogs(prev => prev.map(frog => 
      frog.id === frogId ? { ...frog, ...updates } : frog
    ));
  };

  const resetFrogAction = (frogId: string, delay: number = 2000) => {
    setTimeout(() => {
      updateFrog(frogId, { action: 'idle', thought: null });
    }, delay);
  };

  const handleSendMessage = (user: string, text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user,
      text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    const lowerText = text.toLowerCase();
    
    // Ribbit detection for Toadfather
    if (lowerText.includes('ribbit')) {
      const newCount = ribbitCount + 1;
      setRibbitCount(newCount);
      
      if (newCount >= 5 && !toadfatherSummoned) { // Lowered from 30 for demo
        setToadfatherSummoned(true);
        // All frogs summon Toadfather
        frogs.forEach(frog => {
          updateFrog(frog.id, {
            action: 'summonToadfather',
            thought: frog.id === 'frog1' ? 'The Don arrives...' :
                    frog.id === 'frog2' ? 'He who croaks loudest' :
                    'I offer tribute'
          });
        });
        
        setTimeout(() => {
          frogs.forEach(frog => {
            updateFrog(frog.id, { action: 'idle', thought: null });
          });
        }, 3000);
        
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_toad',
          user: 'System',
          text: '🐸👑 THE TOADFATHER HAS BEEN SUMMONED! 👑🐸',
          timestamp: Date.now()
        }]);
      } else {
        // Random frog croaks
        const randomFrog = frogs[Math.floor(Math.random() * frogs.length)];
        updateFrog(randomFrog.id, { 
          action: 'croak', 
          thought: 'Ribbit!' 
        });
        resetFrogAction(randomFrog.id);
      }
    }
    
    // Philosophy trigger
    if (lowerText.includes('reality') || lowerText.includes('consciousness')) {
      updateFrog('frog2', {
        mood: 'philosophical',
        action: 'croak',
        thought: 'But what if we are the dream?'
      });
      resetFrogAction('frog2', 3000);
    }
    
    // Food trigger
    if (lowerText.includes('food') || lowerText.includes('hungry')) {
      updateFrog('frog3', {
        mood: 'excited',
        action: 'croak',
        thought: 'FLIES!'
      });
      resetFrogAction('frog3');
    }
    
    // Sleep trigger
    if (lowerText.includes('sleep') || lowerText.includes('tired')) {
      const sleepyFrog = frogs[Math.floor(Math.random() * frogs.length)];
      updateFrog(sleepyFrog.id, {
        mood: 'sleepy',
        thought: 'Zzz...'
      });
      resetFrogAction(sleepyFrog.id, 4000);
    }
  };

  const throwFly = () => {
    const hungryFrogs = frogs.filter(f => f.mood === 'hungry' || f.id === 'frog3');
    const targetFrog = hungryFrogs[Math.floor(Math.random() * hungryFrogs.length)] || frogs[0];
    
    updateFrog(targetFrog.id, {
      action: 'catch',
      mood: 'excited',
      thought: 'Nom nom!'
    });
    resetFrogAction(targetFrog.id, 1500);
  };

  const makeThemCroak = () => {
    frogs.forEach((frog, index) => {
      setTimeout(() => {
        updateFrog(frog.id, {
          action: 'croak',
          thought: index === 0 ? 'Ribbit!' : index === 1 ? 'Ribbit ribbit!' : 'RIBBIT!!'
        });
        resetFrogAction(frog.id, 2000);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 bg-opacity-80 p-4 text-center border-b border-green-400">
        <h1 className="text-3xl font-bold text-green-400 mb-2">🐸 FrogTV Live Test 🐸</h1>
        <p className="text-sm text-gray-300">They're watching... why aren't you?</p>
        <div className="mt-2 text-xs text-yellow-300">
          Ribbits: {ribbitCount}/5 {toadfatherSummoned && '👑 TOADFATHER SUMMONED! 👑'}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Main Stage */}
        <div className="flex-1 relative bg-gradient-to-b from-indigo-900 to-purple-900 min-h-96">
          {/* Couch */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <svg width="400" height="120" viewBox="0 0 400 120">
              <rect x="30" y="60" width="340" height="50" fill="#8B4513" rx="25" />
              <rect x="0" y="45" width="50" height="65" fill="#8B4513" rx="25" />
              <rect x="350" y="45" width="50" height="65" fill="#8B4513" rx="25" />
              <rect x="30" y="50" width="340" height="40" fill="#A0522D" rx="20" />
            </svg>
          </div>

          {/* TV in background */}
          <div className="absolute top-20 right-20 bg-gray-800 p-2 rounded transform rotate-3 shadow-2xl">
            <div className="w-32 h-24 bg-blue-400 rounded animate-pulse"></div>
            <div className="text-xs text-center mt-1 text-gray-400">📺 Tiny TV</div>
          </div>

          {/* Frogs */}
          {frogs.map(frog => (
            <FrogComponent key={frog.id} frog={frog} />
          ))}

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 flex gap-3">
            <button
              onClick={throwFly}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              🪰 Throw Fly
            </button>
            <button
              onClick={makeThemCroak}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              🐸 Make Them Croak
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:w-80 p-4 bg-black bg-opacity-50">
          <ChatBox messages={messages} onSendMessage={handleSendMessage} />
          
          {/* Instructions */}
          <div className="mt-4 bg-gray-800 rounded-lg p-3 text-xs">
            <h4 className="text-green-400 font-semibold mb-2">Try these commands:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Type "ribbit" (5x = Toadfather!)</li>
              <li>• Say "reality" or "consciousness"</li>
              <li>• Mention "food" or "hungry"</li>
              <li>• Say "sleep" or "tired"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrogTVTest;

// Utility functions for testing
export function updateFrogHelper(frogs: Frog[], frogId: string, updates: Partial<Frog>): Frog[] {
  return frogs.map(frog => frog.id === frogId ? { ...frog, ...updates } : frog);
}

export function resetFrogActionHelper(frogs: Frog[], frogId: string): Frog[] {
  return updateFrogHelper(frogs, frogId, { action: 'idle', thought: null });
}

export function handleSendMessageHelper(
  frogs: Frog[],
  messages: ChatMessage[],
  ribbitCount: number,
  toadfatherSummoned: boolean,
  user: string,
  text: string
): {
  frogs: Frog[],
  messages: ChatMessage[],
  ribbitCount: number,
  toadfatherSummoned: boolean
} {
  let newMessages = [...messages, {
    id: Date.now().toString(),
    user,
    text,
    timestamp: Date.now()
  }];
  let newFrogs = [...frogs];
  let newRibbitCount = ribbitCount;
  let newToadfatherSummoned = toadfatherSummoned;
  const lowerText = text.toLowerCase();
  if (lowerText.includes('ribbit')) {
    newRibbitCount++;
    if (newRibbitCount >= 5 && !newToadfatherSummoned) {
      newToadfatherSummoned = true;
      newFrogs = newFrogs.map(frog => updateFrogHelper([frog], frog.id, {
        action: 'summonToadfather',
        thought: frog.id === 'frog1' ? 'The Don arrives...' : frog.id === 'frog2' ? 'He who croaks loudest' : 'I offer tribute'
      })[0]);
      newMessages = [...newMessages, {
        id: Date.now().toString() + '_toad',
        user: 'System',
        text: '🐸👑 THE TOADFATHER HAS BEEN SUMMONED! 👑🐸',
        timestamp: Date.now()
      }];
    } else {
      const randomFrog = newFrogs[Math.floor(Math.random() * newFrogs.length)];
      newFrogs = updateFrogHelper(newFrogs, randomFrog.id, { action: 'croak', thought: 'Ribbit!' });
    }
  }
  if (lowerText.includes('reality') || lowerText.includes('consciousness')) {
    newFrogs = updateFrogHelper(newFrogs, 'frog2', {
      mood: 'philosophical',
      action: 'croak',
      thought: 'But what if we are the dream?'
    });
  }
  if (lowerText.includes('food') || lowerText.includes('hungry')) {
    newFrogs = updateFrogHelper(newFrogs, 'frog3', {
      mood: 'excited',
      action: 'croak',
      thought: 'FLIES!'
    });
  }
  if (lowerText.includes('sleep') || lowerText.includes('tired')) {
    const sleepyFrog = newFrogs[Math.floor(Math.random() * newFrogs.length)];
    newFrogs = updateFrogHelper(newFrogs, sleepyFrog.id, {
      mood: 'sleepy',
      thought: 'Zzz...'
    });
  }
  return {
    frogs: newFrogs,
    messages: newMessages,
    ribbitCount: newRibbitCount,
    toadfatherSummoned: newToadfatherSummoned
  };
}

export function throwFlyHelper(frogs: Frog[]): Frog[] {
  const hungryFrogs = frogs.filter(f => f.mood === 'hungry' || f.id === 'frog3');
  const targetFrog = hungryFrogs[Math.floor(Math.random() * hungryFrogs.length)] || frogs[0];
  return updateFrogHelper(frogs, targetFrog.id, {
    action: 'catch',
    mood: 'excited',
    thought: 'Nom nom!'
  });
}

export function makeThemCroakHelper(frogs: Frog[]): Frog[] {
  return frogs.map((frog, index) => updateFrogHelper([frog], frog.id, {
    action: 'croak',
    thought: index === 0 ? 'Ribbit!' : index === 1 ? 'Ribbit ribbit!' : 'RIBBIT!!'
  })[0]);
}