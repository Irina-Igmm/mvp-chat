export interface HubSpotContact {
  email: string
  firstname: string
  lastname: string
  phone: string
  company: string
  building_type?: string
  building_size?: string
  energy_bill?: string
  current_heating_system?: string
  project_timeline?: string
  region?: string
  address?: string
  renovation_type?: string
  source?: string
  lead_source?: string
}

export interface ChatState {
  messages: ChatMessage[]
  collectedData: Partial<HubSpotContact>
  currentStep: string
  isQualified: boolean
  messageCount: number
  userEmail?: string
}

export type ChatStep = {
  id: string
  question: string
  field: keyof HubSpotContact
  required: boolean
  validation?: (value: string) => boolean
  followUpQuestion?: string
  blockIfInvalid?: boolean
}

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: number
}

