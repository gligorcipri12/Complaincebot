import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (userMessage: string) => {
    // Add user message immediately
    const newUserMessage: Message = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      // Call Edge Function with streaming
      const { data, error } = await supabase.functions.invoke('compliance-chat', {
        body: { message: userMessage },
      })

      if (error) throw error

      // Handle streaming response
      if (data && typeof data === 'object' && 'content' in data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: Array.isArray(data.content) 
            ? data.content.find((c: any) => c.type === 'text')?.text || '' 
            : data.content
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}

// Alternative: Streaming with Server-Sent Events
export function useChatStreaming() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')

  const sendMessage = async (userMessage: string) => {
    const newUserMessage: Message = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    setStreamingMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Get function URL from Supabase project
      const functionUrl = `https://ucxbqxzuaykbqmaguebc.supabase.co/functions/v1/super-task`

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'content_block_delta') {
                  const text = data.delta?.text || ''
                  fullResponse += text
                  setStreamingMessage(fullResponse)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Add final message
      const assistantMessage: Message = {
        role: 'assistant',
        content: fullResponse || 'Eroare la procesarea răspunsului.',
      }
      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage('')
    } catch (error) {
      console.error('Streaming error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.',
      }
      setMessages(prev => [...prev, errorMessage])
      setStreamingMessage('')
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    setStreamingMessage('')
  }

  return {
    messages,
    isLoading,
    streamingMessage,
    sendMessage,
    clearMessages,
  }
}