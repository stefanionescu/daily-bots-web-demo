'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { defaultBotProfile, defaultServices } from '../../rtvi.config';

export function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsListening(false);
    },
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      const agentId = process.env.NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID;
      if (!agentId) throw new Error('Agent ID not found');

      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId,
        overrides: {
          tts: {
            voiceId: defaultBotProfile.voice_id,
            ...defaultServices.elevenlabs.settings,
          }
        }
      });
      
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setIsListening(false);
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={isListening}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={!isListening}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>
    </div>
  );
} 