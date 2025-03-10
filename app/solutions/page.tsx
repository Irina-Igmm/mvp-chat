"use client"

import { motion } from "framer-motion"
import { ArrowRight, Activity, Home, Lightbulb, Sun, Brain, Users, ChevronDown } from "lucide-react"
import { useState } from "react"

const solutions = [
  {
    id: 1,
    title: "Audit énergétique",
    icon: Activity,
    description: "Analyse complète et suivi en temps réel de la consommation énergétique",
    details: [
      "Identification des zones de déperdition de chaleur",
      "Installation de compteurs intelligents",
      "Monitoring en temps réel",
      "Analyse des données de consommation",
    ],
  },
  {
    id: 2,
    title: "Isolation thermique",
    icon: Home,
    description: "Optimisation de l'enveloppe thermique du bâtiment",
    details: [
      "Isolation des murs et toitures",
      "Installation de doubles/triples vitrages",
      "Traitement des ponts thermiques",
      "Amélioration de l'étanchéité",
    ],
  },
  {
    id: 3,
    title: "Systèmes CVC",
    icon: Lightbulb,
    description: "Modernisation des systèmes de chauffage, ventilation et climatisation",
    details: [
      "Installation de chaudières à condensation",
      "Mise en place de pompes à chaleur",
      "VMC double flux",
      "Récupération de chaleur",
    ],
  },
  {
    id: 4,
    title: "Énergies renouvelables",
    icon: Sun,
    description: "Intégration de sources d'énergie propre et durable",
    details: [
      "Panneaux photovoltaïques",
      "Capteurs solaires thermiques",
      "Solutions géothermiques",
      "Systèmes hybrides",
    ],
  },
  {
    id: 5,
    title: "Gestion intelligente",
    icon: Brain,
    description: "Automatisation et contrôle intelligent des systèmes",
    details: [
      "Building management system (BMS)",
      "Automatisation de l'éclairage",
      "Contrôle intelligent du chauffage",
      "Analyse prédictive",
    ],
  },
  {
    id: 6,
    title: "Sensibilisation",
    icon: Users,
    description: "Formation et implication des occupants",
    details: [
      "Formation aux bonnes pratiques",
      "Suivi des performances",
      "Communication régulière",
      "Engagement collectif",
    ],
  },
]

export default function SolutionsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleStartAudit = () => {
    window.open("https://irinasitraka67.bubbleapps.io/version-test/contactez_nous?debug_mode=true", "_blank")
  }

  return (
    <div className="min-h-screen bg-white font-montserrat">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        <div className="bg-[#2D7FF9] py-8 px-4 rounded-lg mb-8 text-white shadow-md text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Solutions d'amélioration énergétique
          </motion.h1>
          <motion.p 
            className="text-lg mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Découvrez nos solutions concrètes pour optimiser l'efficacité énergétique de votre bâtiment
          </motion.p>
        </div>
      </motion.div>

      {/* Solutions Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
                hoveredId === solution.id ? "shadow-md" : ""
              } transition-all`}
              onMouseEnter={() => setHoveredId(solution.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === solution.id ? null : solution.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <solution.icon className="h-6 w-6 text-[#2D7FF9]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{solution.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === solution.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-[#2D7FF9]" />
                  </motion.div>
                </div>
                <p className="text-gray-600 mb-4">{solution.description}</p>

                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedId === solution.id ? "auto" : 0,
                    opacity: expandedId === solution.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 mb-4">
                    {solution.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: expandedId === solution.id ? 1 : 0, 
                          x: expandedId === solution.id ? 0 : -20 
                        }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <ArrowRight className="h-4 w-4 text-[#2D7FF9] flex-shrink-0" />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="container mx-auto px-4 py-12 md:py-16"
      >
        <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Prêt à améliorer votre efficacité énergétique ?</h2>
          <p className="text-gray-700 mb-6">
            Contactez nos experts pour un audit personnalisé de votre bâtiment
          </p>
          <motion.button
            onClick={handleStartAudit}
            className="bg-[#2D7FF9] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Commencer l'audit
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

