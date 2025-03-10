import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { CHAT_STEPS } from "@/lib/chat-config"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  // Trouver l'étape actuelle basée sur le dernier message de l'assistant
  const currentStep =
    CHAT_STEPS.find((step, index) => {
      const prevAssistantMessage: { role: string; content: string } = messages
        .slice(0, -1)
        .reverse()
        .find((m: { role: string; content: string }) => m.role === "assistant")
      return prevAssistantMessage?.content.includes(step.question)
    }) || CHAT_STEPS[0]

  // Construire le message système avec le contexte actuel
  const systemMessage = `
    Vous êtes un assistant spécialisé en audit énergétique qui collecte des informations importantes.
    Étape actuelle : ${currentStep.id}
    Question à poser : ${currentStep.question}
    
    Directives :
    1. Validez la réponse de l'utilisateur selon les critères de l'étape
    2. Si la réponse est valide, passez à la question suivante
    3. Si la réponse n'est pas valide, demandez poliment de reformuler
    4. Gardez un ton professionnel et courtois
    
    Réponse attendue pour l'étape ${currentStep.id} :
    - Type : ${currentStep.field}
    ${currentStep.validation ? "- Doit respecter le format spécifié" : ""}
    ${currentStep.required ? "- Réponse obligatoire" : "- Réponse optionnelle"}
  `

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    messages,
  })

  return result.toDataStreamResponse()
}

