import { Building2, BarChart3, LineChart, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 font-montserrat bg-white">
      <div className="text-center space-y-6 w-full max-w-6xl mx-auto">
        <div className="bg-[#2D7FF9] py-8 px-4 rounded-lg mb-8 text-white shadow-md">
          <h1 className="text-3xl md:text-4xl font-bold">Audit énergétique intelligent</h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Optimisez la performance énergétique de votre bâtiment avec notre assistant IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Building2 className="h-6 w-6 text-[#2D7FF9] mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Diagnostic complet</h2>
            </div>
            <p className="text-gray-600 text-left">
              Analyse détaillée de la performance énergétique de votre bâtiment avec des recommandations personnalisées.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-[#2D7FF9] mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Suivi de consommation</h2>
            </div>
            <p className="text-gray-600 text-left">
              Surveillez et optimisez votre consommation d'énergie en temps réel avec nos outils d'analyse avancés.
            </p>
          </div>

          <Link
            href="/solutions"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 text-[#2D7FF9] mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Solutions d'amélioration</h2>
            </div>
            <p className="text-gray-600 text-left">
              Découvrez des solutions concrètes pour améliorer l'efficacité énergétique de votre bâtiment.
            </p>
          </Link>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 text-[#2D7FF9] mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Conseils personnalisés</h2>
            </div>
            <p className="text-gray-600 text-left">
              Bénéficiez de recommandations adaptées à votre situation pour réduire votre consommation énergétique.
            </p>
          </div>
        </div>

        <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Commencez votre audit énergétique</h3>
          <p className="text-gray-700">
            Cliquez sur l'icône de chat en bas à droite pour discuter avec notre assistant et obtenir une première évaluation de votre situation.
          </p>
        </div>
      </div>
    </main>
  )
}