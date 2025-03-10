import type { ChatStep } from "./types"

export const CHAT_STEPS: ChatStep[] = [
  {
    id: "email",
    question: "Bonjour ! Pour commencer notre échange sur l'audit énergétique, pourriez-vous me communiquer votre adresse email ?",
    field: "email",
    required: true,
    validation: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    followUpQuestion: "Merci pour votre email. Quel est votre nom de famille ?",
    blockIfInvalid: true, // Bloque la conversation si pas d'email valide
  },
  {
    id: "lastname",
    question: "Quel est votre nom de famille ?",
    field: "lastname",
    required: true,
    followUpQuestion: "Et votre prénom ?",
  },
  {
    id: "firstname",
    question: "Quel est votre prénom ?",
    field: "firstname",
    required: true,
    followUpQuestion: "Dans quelle entreprise travaillez-vous ?",
  },
  {
    id: "company",
    question: "Quelle est le nom de votre entreprise ?",
    field: "company",
    required: true,
    followUpQuestion: "Pour pouvoir vous recontacter, quel est votre numéro de téléphone ?",
  },
  {
    id: "phone",
    question: "Quel est votre numéro de téléphone ?",
    field: "phone",
    required: true,
    validation: (value: string) => {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
      return phoneRegex.test(value)
    },
    followUpQuestion: "Pour mieux vous accompagner, dans quelle région êtes-vous situé ?",
  },
  {
    id: "region",
    question: "Dans quelle région se trouve votre bâtiment ?",
    field: "region",
    required: true,
    followUpQuestion: "Merci. Et quelle est l'adresse du bâtiment à auditer ?",
  },
  {
    id: "address",
    question: "Quelle est l'adresse complète du bâtiment ?",
    field: "address",
    required: true,
    followUpQuestion: "Merci. Pour mieux comprendre votre projet, quel type de bâtiment souhaitez-vous auditer ?",
  },
  {
    id: "building_type",
    question: "Quel est le type de bâtiment concerné ? (ex: bureau, commerce, industrie, etc.)",
    field: "building_type",
    required: true,
    followUpQuestion: "Quelle est la surface approximative du bâtiment ?",
  },
  {
    id: "building_size",
    question: "Quelle est la surface approximative en m² ?",
    field: "building_size",
    required: true,
    followUpQuestion: "Quels types de rénovations énergétiques envisagez-vous ?",
  },
  {
    id: "renovation_type",
    question: "Quels types de rénovations énergétiques envisagez-vous ?",
    field: "renovation_type",
    required: false,
    followUpQuestion: "Pour évaluer le potentiel d'économies, quel est le montant approximatif de vos factures énergétiques annuelles ?",
  },
  {
    id: "energy_bill",
    question: "Quel est le montant approximatif de vos factures énergétiques annuelles ?",
    field: "energy_bill",
    required: false,
    followUpQuestion: "Quel système de chauffage utilisez-vous actuellement ?",
  },
  {
    id: "current_heating_system",
    question: "Quel système de chauffage utilisez-vous actuellement ?",
    field: "current_heating_system",
    required: false,
    followUpQuestion: "Dans quel délai souhaitez-vous réaliser cet audit énergétique ?",
  },
  {
    id: "project_timeline",
    question: "Dans quel délai envisagez-vous de réaliser cet audit ?",
    field: "project_timeline",
    required: false,
    followUpQuestion: "Merci pour toutes ces informations ! Je vais les transmettre à notre équipe d'experts qui vous recontactera très prochainement pour approfondir votre projet.",
  },
]

// Configuration pour le comportement du chat
export const CHAT_CONFIG = {
  maxMessagesPerEmail: 20, // Limite de 20 messages par email (modifié de 15)
  minQualificationCriteria: ["email", "address"], // Critères minimums pour qualifier un lead
  contextTopics: [
    "audit énergétique", 
    "rénovation énergétique", 
    "économies d'énergie", 
    "chauffage", 
    "isolation"
  ],
  offTopicResponse: "Je suis désolé, mais je suis spécialisé dans les audits énergétiques et les questions liées à la rénovation énergétique des bâtiments. Puis-je vous aider sur ces sujets spécifiques ?",
}

