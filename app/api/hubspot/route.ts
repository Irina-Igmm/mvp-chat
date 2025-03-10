import { createHubSpotContact } from "@/lib/hubspot"
import type { HubSpotContact } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const contact: HubSpotContact = await req.json()

    console.log("Réception de la requête de création de contact:", contact)

    // Vérification des champs requis
    if (!contact.email || !contact.firstname || !contact.lastname || !contact.phone || !contact.company) {
      console.error("Champs requis manquants:", {
        email: !contact.email,
        firstname: !contact.firstname,
        lastname: !contact.lastname,
        phone: !contact.phone,
        company: !contact.company,
      })

      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: "Tous les champs obligatoires doivent être remplis",
        }),
        { status: 400 },
      )
    }

    const hubspotResponse = await createHubSpotContact(contact)

    console.log("Réponse de HubSpot:", hubspotResponse)

    return new Response(
      JSON.stringify({
        success: true,
        contactId: hubspotResponse.id,
        message: "Contact créé avec succès",
      }),
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur dans la route HubSpot:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to create contact",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    )
  }
}

