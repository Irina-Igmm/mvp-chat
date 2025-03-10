import type { HubSpotContact } from "./types"

export async function createHubSpotContact(contact: HubSpotContact) {
  try {
    console.log("Tentative de création du contact HubSpot:", contact)

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          email: contact.email,
          firstname: contact.firstname,
          lastname: contact.lastname,
          phone: contact.phone,
          company: contact.company,
          address: contact.address,
          city: contact.region,
          building_type: contact.building_type,
          building_size: contact.building_size,
          energy_bill: contact.energy_bill,
          current_heating_system: contact.current_heating_system,
          project_timeline: contact.project_timeline,
          renovation_type: contact.renovation_type,
          source: "MVP Bot",
          lifecyclestage: "lead",
          lead_source: "Chat Bot",
          createdate: new Date().toISOString(),
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Erreur HubSpot:", data)
      throw new Error(`Erreur HubSpot: ${data.message || "Erreur inconnue"}`)
    }

    console.log("Contact HubSpot créé avec succès:", data)
    return data
  } catch (error) {
    console.error("Erreur lors de la création du contact:", error)
    throw error
  }
}

