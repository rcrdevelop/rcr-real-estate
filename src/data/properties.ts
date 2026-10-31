import type { Property, Client } from "@/lib/estate";

/** Genera una imagen SVG "foto" de propiedad como data-uri (sin assets externos). */
export function propImage(hue: number, variant = 0): string {
  const h1 = hue % 360;
  const h2 = (hue + 40) % 360;
  const roof =
    variant % 3 === 0 ? "#7f1d1d" : variant % 3 === 1 ? "#78350f" : "#334155";
  const body =
    variant % 3 === 0 ? "#f5f5f4" : variant % 3 === 1 ? "#e7e5e4" : "#fde68a";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsl(${h1},60%,72%)"/>
      <stop offset="100%" stop-color="hsl(${h2},55%,85%)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#sky)"/>
  <circle cx="540" cy="70" r="34" fill="#fff8" />
  <rect y="290" width="640" height="110" fill="hsl(${h1},30%,38%)"/>
  <rect x="150" y="170" width="340" height="150" fill="${body}"/>
  <polygon points="130,170 320,80 510,170" fill="${roof}"/>
  <rect x="290" y="240" width="60" height="80" fill="#57534e"/>
  <rect x="180" y="210" width="60" height="55" fill="#93c5fd" stroke="#57534e" stroke-width="4"/>
  <rect x="400" y="210" width="60" height="55" fill="#93c5fd" stroke="#57534e" stroke-width="4"/>
  <rect x="60" y="230" width="60" height="90" fill="hsl(${h2},35%,45%)"/>
  <polygon points="50,230 90,185 130,230" fill="hsl(${h2},40%,30%)"/>
  <circle cx="90" cy="180" r="30" fill="#166534"/>
  <rect x="86" y="190" width="8" height="45" fill="#713f12"/>
  <rect x="520" y="245" width="70" height="75" fill="hsl(${h1},30%,55%)"/>
  <polygon points="512,245 555,205 598,245" fill="hsl(${h1},35%,38%)"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function seedProperties(): Property[] {
  const now = Date.now();
  const mk = (
    i: number,
    p: Omit<Property, "id" | "slug" | "createdAt" | "images">
  ): Property => ({
    ...p,
    id: `prop-${i}`,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    createdAt: new Date(now - i * 86400000 * 3).toISOString(),
    images: [propImage(i * 47, i), propImage(i * 47 + 20, i + 1)]
  });

  return [
    mk(1, {
      title: "Villa moderna con piscina en Lomas",
      price: 485000,
      status: "Disponible",
      type: "Casa",
      beds: 4,
      baths: 3,
      area: 280,
      city: "Madrid",
      address: "Calle de los Robles 12",
      description:
        "Chalet independiente de diseño con piscina privada, jardín de 400 m², domótica integral y paneles solares.",
      coords: { lat: 40.45, lng: -3.72 },
      agentId: "agent-1",
      featured: true
    }),
    mk(2, {
      title: "Ático con terraza en el centro",
      price: 320000,
      status: "Disponible",
      type: "Apartamento",
      beds: 2,
      baths: 2,
      area: 95,
      city: "Madrid",
      address: "Gran Vía 45, 8ºA",
      description:
        "Ático luminoso reformado con terraza de 30 m² orientada al sur. A 2 minutos del metro.",
      coords: { lat: 40.42, lng: -3.7 },
      agentId: "agent-1",
      featured: true
    }),
    mk(3, {
      title: "Apartamento junto a la playa",
      price: 198000,
      status: "Reservada",
      type: "Apartamento",
      beds: 3,
      baths: 1,
      area: 78,
      city: "Valencia",
      address: "Paseo Marítimo 210",
      description:
        "Primera línea de playa con vistas al Mediterráneo. Ideal inversión vacacional.",
      coords: { lat: 39.47, lng: -0.33 },
      agentId: "agent-2",
      featured: false
    }),
    mk(4, {
      title: "Casa familiar con jardín",
      price: 265000,
      status: "Disponible",
      type: "Casa",
      beds: 3,
      baths: 2,
      area: 160,
      city: "Bogotá",
      address: "Calle 127 #45-30",
      description:
        "Casa de dos plantas en conjunto cerrado con vigilancia 24h, parque infantil y zona BBQ.",
      coords: { lat: 4.71, lng: -74.06 },
      agentId: "agent-1",
      featured: false
    }),
    mk(5, {
      title: "Local comercial esquinero",
      price: 150000,
      status: "Alquilada",
      type: "Local",
      beds: 0,
      baths: 1,
      area: 120,
      city: "Ciudad de México",
      address: "Av. Insurgentes Sur 890",
      description:
        "Local a pie de calle con gran escaparate, ideal para retail o cafetería. Contrato vigente.",
      coords: { lat: 19.39, lng: -99.17 },
      agentId: "agent-2",
      featured: false
    }),
    mk(6, {
      title: "Terreno urbano edificable",
      price: 89000,
      status: "Disponible",
      type: "Terreno",
      beds: 0,
      baths: 0,
      area: 500,
      city: "Lima",
      address: "Urb. Los Pinos Mz. 7 Lt. 3",
      description:
        "Terreno plano con todos los servicios, uso residencial. A 15 min del centro.",
      coords: { lat: -12.05, lng: -77.03 },
      agentId: "agent-1",
      featured: false
    }),
    mk(7, {
      title: "Oficina premium en torre corporativa",
      price: 410000,
      status: "Disponible",
      type: "Oficina",
      beds: 0,
      baths: 2,
      area: 140,
      city: "Ciudad de México",
      address: "Paseo de la Reforma 250, Piso 12",
      description:
        "Oficina con vistas panorámicas, 3 privados, sala de juntas y 2 estacionamientos.",
      coords: { lat: 19.42, lng: -99.16 },
      agentId: "agent-2",
      featured: true
    }),
    mk(8, {
      title: "Dúplex reformado en barrio histórico",
      price: 235000,
      status: "Vendida",
      type: "Apartamento",
      beds: 3,
      baths: 2,
      area: 110,
      city: "Madrid",
      address: "Calle Mayor 18",
      description:
        "Dúplex con encanto, vigas vistas, cocina abierta y dos balcones a la calle principal.",
      coords: { lat: 40.41, lng: -3.71 },
      agentId: "agent-1",
      featured: false
    }),
    mk(9, {
      title: "Casa de campo con huerto",
      price: 178000,
      status: "Disponible",
      type: "Casa",
      beds: 4,
      baths: 2,
      area: 220,
      city: "Valencia",
      address: "Camino Viejo de Liria km 4",
      description:
        "Finca de 3.000 m² con huerto, árboles frutales, pozo propio y barbacoa de obra.",
      coords: { lat: 39.5, lng: -0.45 },
      agentId: "agent-2",
      featured: false
    })
  ];
}

export function seedClients(): Client[] {
  return [
    {
      id: "c-1",
      fullName: "María Fernanda López",
      email: "mflopez@mail.com",
      phone: "+34 600 111 222",
      documentId: "51234567A"
    },
    {
      id: "c-2",
      fullName: "Carlos Andrés Ruiz",
      email: "caruiz@mail.com",
      phone: "+52 55 1234 5678",
      documentId: "RUFC800512"
    },
    {
      id: "c-3",
      fullName: "Ana Sofía Mendoza",
      email: "asmendoza@mail.com",
      phone: "+57 310 555 8899",
      documentId: "1032456789"
    }
  ];
}
