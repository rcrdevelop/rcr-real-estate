// Real estate domain types + helpers

export type PropertyStatus =
  | "Disponible"
  | "Vendida"
  | "Alquilada"
  | "Reservada";
export type PropertyType =
  | "Casa"
  | "Apartamento"
  | "Terreno"
  | "Local"
  | "Oficina";

export interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  beds: number;
  baths: number;
  area: number; // m2
  city: string;
  address: string;
  description: string;
  images: string[]; // data-uri or url
  coords: { lat: number; lng: number };
  agentId: string;
  featured: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  documentId: string;
}

export interface Contract {
  id: string;
  propertyId: string;
  clientName: string;
  clientDoc: string;
  clientEmail: string;
  type: "Compraventa" | "Arrendamiento";
  amount: number;
  months?: number;
  status: "Borrador" | "Firmado";
  createdAt: string;
  signedAt?: string;
  signatureDataUrl?: string;
  hash?: string;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function money(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(n);
}

export function buildContractText(c: Contract, p?: Property): string[] {
  const today = new Date(c.createdAt).toLocaleDateString("es-ES");
  const lines: string[] = [
    `CONTRATO DE ${c.type === "Compraventa" ? "COMPRAVENTA" : "ARRENDAMIENTO"} DE INMUEBLE`,
    "",
    `Fecha de emisión: ${today}`,
    `Referencia: ${c.id.toUpperCase()}`,
    "",
    "COMPARECEN:",
    "",
    `DE UNA PARTE, la agencia "RCR Inmobiliaria Demo", en adelante LA PARTE VENDEDORA/ARRENDADORA.`,
    `DE OTRA PARTE, D./Dña. ${c.clientName}, con documento de identidad ${c.clientDoc} y correo`,
    `electrónico ${c.clientEmail}, en adelante LA PARTE COMPRADORA/ARRENDATARIA.`,
    "",
    "OBJETO DEL CONTRATO:",
    "",
    p
      ? `El inmueble "${p.title}", sito en ${p.address}, ${p.city}, con una superficie de ${p.area} m²,`
      : "El inmueble descrito en el anexo del presente contrato,",
    p ? `${p.beds} habitaciones y ${p.baths} baños.` : "",
    "",
    "CLÁUSULAS:",
    "",
    c.type === "Compraventa"
      ? `PRIMERA.- El precio de venta acordado es de ${money(c.amount)} que la parte compradora abonará`
      : `PRIMERA.- La renta mensual acordada es de ${money(c.amount)} durante ${c.months ?? 12} meses,`,
    c.type === "Compraventa"
      ? "al contado mediante transferencia bancaria a la firma del presente documento."
      : "pagadera dentro de los cinco primeros días de cada mes.",
    "SEGUNDA.- El inmueble se entrega en el estado en que se encuentra, habiendo sido visitado y",
    "aceptado por la parte compradora/arrendataria.",
    "TERCERA.- Ambas partes se someten a la jurisdicción de los tribunales de la ciudad del inmueble,",
    "con renuncia expresa a cualquier otro fuero que pudiera corresponderles.",
    "",
    c.status === "Firmado"
      ? `FIRMADO ELECTRÓNICAMENTE el ${c.signedAt ? new Date(c.signedAt).toLocaleString("es-ES") : today}.`
      : "Pendiente de firma electrónica.",
    c.hash ? `Huella digital del documento (SHA-256): ${c.hash}` : "",
    "",
    "LA PARTE VENDEDORA/ARRENDADORA          LA PARTE COMPRADORA/ARRENDATARIA",
    "",
    "_________________________               _________________________",
    "  RCR Inmobiliaria Demo                    " + c.clientName
  ];
  return lines.filter((l, i) => !(l === "" && lines[i - 1] === "" && i > 0));
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
