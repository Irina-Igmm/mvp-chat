"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { nanoid } from "nanoid" // <-- Added import for nanoid
import { useChat } from "ai/react"
import { MessageCircle, X, Send, Trash2, ArrowLeft, RefreshCw } from "lucide-react" // Added RefreshCw icon
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CHAT_STEPS, CHAT_CONFIG } from "@/lib/chat-config"
import type { ChatState, HubSpotContact } from "@/lib/types"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFullPage, setIsFullPage] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: nanoid(),
        content: CHAT_STEPS[0].question,
        role: "assistant",
        timestamp: Date.now(),
      },
    ],
    collectedData: {},
    currentStep: CHAT_STEPS[0].id,
    isQualified: false,
    messageCount: 1,
    userEmail: undefined,
  })

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Bonjour ! Je suis votre assistant en audit énergétique. Pour mieux vous accompagner, j'aurais besoin de quelques informations. Pouvez-vous me communiquer votre adresse email ?",
      },
    ],
    onResponse: (response) => {
      if (!response.ok) {
        response.json().then((data) => {
          setErrorMessage(data.error || "Une erreur est survenue")
        })
      }
    },
    onFinish: () => {
      setErrorMessage(null)
    },
    onError: (error) => {
      console.error("Chat error:", error)
      setErrorMessage(error?.message || "Une erreur est survenue lors de la communication avec l'assistant")
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, scrollToBottom, messages])

  const getCurrentStep = () => {
    return CHAT_STEPS.find((step) => step.id === chatState.currentStep)
  }

  const validateAndProcessInput = (input: string) => {
    const currentStep = getCurrentStep()
    if (!currentStep) return false

    // Valider l'entrée si une fonction de validation existe
    if (currentStep.validation && !currentStep.validation(input)) {
      return false
    }

    // Mettre à jour les données collectées
    const updatedData = {
      ...chatState.collectedData,
      [currentStep.field]: input,
    }

    // Trouver le prochain step
    const currentIndex = CHAT_STEPS.findIndex((step) => step.id === currentStep.id)
    const nextStep = CHAT_STEPS[currentIndex + 1]

    // Mettre à jour l'état du chat
    setChatState((prev) => ({
      ...prev,
      collectedData: updatedData,
      currentStep: nextStep ? nextStep.id : prev.currentStep,
      isQualified: isContactQualified(updatedData),
    }))

    return true
  }

  const isContactQualified = (data: Partial<HubSpotContact>) => {
    return CHAT_CONFIG.minQualificationCriteria.every(field => 
      data[field as keyof HubSpotContact]
    )
  }

  const submitToHubSpot = async () => {
    try {
      const response = await fetch("/api/hubspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatState.collectedData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit to HubSpot")
      }

      // Ajouter un message de confirmation
      setMessages([
        ...messages,
        {
          id: "hubspot-success",
          role: "assistant",
          content:
            "Merci pour ces informations ! Un expert va vous recontacter très prochainement pour approfondir votre projet d'audit énergétique.",
        },
      ])
    } catch (error) {
      console.error("Error submitting to HubSpot:", error)
      setErrorMessage("Une erreur est survenue lors de l'enregistrement de vos informations.")
    }
  }

  // Helper function to add a new message to the chat
  const addMessage = (message: { role: "assistant" | "user" | "system" | "data"; content: string }) => {
    setMessages((prev) => [...prev, { ...message, id: nanoid(), timestamp: Date.now() }])
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!input.trim()) return

    try {
      // Valider et traiter l'entrée
      const isValid = validateAndProcessInput(input.trim())
      if (!isValid) {
        setErrorMessage("Cette entrée n'est pas valide. Veuillez réessayer.")
        return
      }

      // Ajouter le message de l'utilisateur
      await handleSubmit(e)

      // Si le contact est qualifié, soumettre à HubSpot
      if (chatState.isQualified) {
        await submitToHubSpot()
      }
    } catch (err: any) {
      console.error("Submit error:", err)
      setErrorMessage(err?.message || "Une erreur est survenue lors de l'envoi du message")
    }
  }

  const handleRetry = () => {
    setErrorMessage(null)
    reload()
  }

  const clearChat = () => {
    // Réinitialiser les messages du chat
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: CHAT_STEPS[0].question,
      },
    ])

    // Réinitialiser l'état du chat pour recommencer depuis le début
    setChatState({
      messages: [
        {
          id: nanoid(),
          content: CHAT_STEPS[0].question,
          role: "assistant",
          timestamp: Date.now(),
        },
      ],
      collectedData: {},
      currentStep: CHAT_STEPS[0].id,
      isQualified: false,
      messageCount: 1,
      userEmail: undefined,
    })

    // Effacer l'entrée utilisateur
    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    
    // Effacer les erreurs éventuelles
    setErrorMessage(null)
  }

  const openFullPageChat = () => {
    setIsFullPage(true)
    document.body.style.overflow = 'hidden'
  }

  const closeFullPageChat = () => {
    setIsFullPage(false)
    document.body.style.overflow = 'auto'
  }

  const handleUserMessage = async (input: string) => {
    // Vérifier si le nombre maximum de messages a été atteint pour cet email
    if (
      chatState.userEmail && 
      chatState.messageCount >= CHAT_CONFIG.maxMessagesPerEmail
    ) {
      addMessage({
        role: "assistant",
        content: "Merci pour notre échange ! Pour continuer cette discussion, notre équipe va vous contacter directement.",
      })
      
      if (chatState.isQualified) {
        await submitToHubSpot()
      }
      
      return false
    }

    // Ajouter le message de l'utilisateur
    addMessage({ role: "user", content: input })
    
    // Gérer l'étape email spécialement (blocage si pas d'email)
    const currentStep = CHAT_STEPS.find((step) => step.id === chatState.currentStep)
    if (!currentStep) return false
    
    // Vérifier si on est à l'étape email et si c'est le premier message
    if (currentStep.id === "email") {
      const isValidEmail = currentStep.validation ? currentStep.validation(input) : true
      
      if (!isValidEmail && currentStep.blockIfInvalid) {
        addMessage({
          role: "assistant",
          content: "L'adresse email semble invalide. Pourriez-vous vérifier et la saisir à nouveau ?",
        })
        return false
      }
      
      // Stocker l'email de l'utilisateur pour le suivi des messages
      setChatState(prev => ({ 
        ...prev, 
        userEmail: isValidEmail ? input : undefined 
      }))
    }
    
    // Vérifier si la question est hors sujet
    if (currentStep.id !== "email" && !isOnTopic(input)) {
      addMessage({
        role: "assistant",
        content: CHAT_CONFIG.offTopicResponse,
      })
      return false
    }

    // Validation du champ si nécessaire
    if (currentStep.validation) {
      const isValid = currentStep.validation(input)
      if (!isValid) {
        addMessage({
          role: "assistant",
          content: `La valeur fournie semble invalide. Pourriez-vous vérifier votre ${getFriendlyFieldName(currentStep.field)} ?`,
        })
        return false
      }
    }

    // Mettre à jour les données collectées
    const updatedData = {
      ...chatState.collectedData,
      [currentStep.field]: input,
    }

    // Trouver le prochain step
    const currentIndex = CHAT_STEPS.findIndex((step) => step.id === currentStep.id)
    const nextStep = CHAT_STEPS[currentIndex + 1]

    // Mettre à jour l'état du chat
    setChatState((prev) => ({
      ...prev,
      collectedData: updatedData,
      currentStep: nextStep ? nextStep.id : prev.currentStep,
      isQualified: isContactQualified(updatedData),
      messageCount: prev.messageCount + 1,
    }))

    // Répondre avec la question suivante
    if (currentStep.followUpQuestion) {
      addMessage({
        role: "assistant",
        content: currentStep.followUpQuestion,
      })
    }

    // Si toutes les étapes requises sont complétées, soumettre à HubSpot
    if (isContactQualified(updatedData) && currentIndex === CHAT_STEPS.length - 1) {
      submitToHubSpot()
    }

    return true
  }

  const isOnTopic = (message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    return CHAT_CONFIG.contextTopics.some(topic => 
      lowerMessage.includes(topic.toLowerCase())
    ) || lowerMessage.length < 20 // Messages courts sont probablement des réponses aux questions
  }
  
  const getFriendlyFieldName = (field: keyof HubSpotContact): string => {
    const fieldMap: Record<string, string> = {
      email: "adresse email",
      firstname: "prénom",
      lastname: "nom",
      phone: "numéro de téléphone",
      company: "entreprise",
      region: "région",
      address: "adresse",
      // Ajouter d'autres mappages au besoin
    }
    return fieldMap[field] || field
  }

  if (isFullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-gray-800 text-white">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeFullPageChat}
                className="text-white hover:bg-gray-700 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h3 className="font-semibold text-lg tracking-tight">MVP Bot</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="text-white hover:bg-gray-700"
                title="Nettoyer la conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {messages.length > 10 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="text-white hover:bg-gray-700"
                  title="Effacer la conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4 max-w-3xl mx-auto">
                <AlertDescription className="flex justify-between items-center">
                  <span>{errorMessage}</span>
                  <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
                    Réessayer
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-5 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-in fade-in-0 slide-in-from-bottom-3 duration-300`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <span className="text-xs font-medium text-white">Vous</span>
                    ) : (
                      <span className="text-xs font-medium text-gray-700">Bot</span>
                    )}
                  </div>
                  
                  <div
                    className={`max-w-[80%] shadow-sm ${
                      message.role === "user" 
                        ? "bg-gray-800 text-white rounded-2xl rounded-tr-none" 
                        : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none"
                    }`}
                  >
                    <div className="p-3.5 text-sm">
                      {message.content}
                    </div>
                    <div 
                      className={`text-[10px] px-3.5 pb-1.5 opacity-70 ${
                        message.role === "user" ? "text-gray-100" : "text-gray-500"
                      }`}
                    >
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 max-w-3xl mx-auto">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-700">Bot</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="border-t p-4 bg-white">
            <form onSubmit={onSubmit} className="flex w-full space-x-2 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Posez votre question..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-montserrat">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] shadow-xl transition-all duration-300 bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-800 text-white">
            <h3 className="font-semibold text-lg tracking-tight">MVP Bot</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="text-white hover:bg-gray-700"
                title="Nettoyer la conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openFullPageChat}
                className="text-white hover:bg-gray-700 text-xs"
              >
                Agrandir
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 overflow-y-auto bg-gray-50 font-montserrat h-[350px]">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="flex justify-between items-center">
                  <span>{errorMessage}</span>
                  <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2">
                    Réessayer
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-in fade-in-0 slide-in-from-bottom-3 duration-300`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <span className="text-xs font-medium text-white">Vous</span>
                    ) : (
                      <span className="text-xs font-medium text-gray-700">Bot</span>
                    )}
                  </div>
                  
                  <div
                    className={`max-w-[75%] shadow-sm ${
                      message.role === "user" 
                        ? "bg-gray-800 text-white rounded-2xl rounded-tr-none" 
                        : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none"
                    }`}
                  >
                    <div className="p-3.5 text-sm">
                      {message.content}
                    </div>
                    <div 
                      className={`text-[10px] px-3.5 pb-1.5 opacity-70 ${
                        message.role === "user" ? "text-gray-100" : "text-gray-500"
                      }`}
                    >
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-700">Bot</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-4">
            <form onSubmit={onSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Posez votre question..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-gray-800 hover:bg-gray-700 text-white"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
