"use client";

import { useEffect, useRef, useState } from "react";
import { useConversation } from "@11labs/react";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsListening(false);
    },
    onMessage: ({ message, source }) => console.log('Message:', message, 'from:', source),
    onError: (message: string) => console.error('Error:', message),
  });

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_AGENT_ID!,
        authorization: process.env.ELEVEN_LABS_API_KEY,
      });
      
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const stopConversation = async () => {
    await conversation.endSession();
    setIsListening(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ElevenLabs Chat
        </h1>
        
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
      </div>
    </main>
  );
}
