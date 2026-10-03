export const SITE = {
  url: "https://paheventos.com",
  name: "pah! eventos",
  phone: "+34614143503",
  phoneDisplay: "+34 614 14 35 03",
  email: "info@paheventos.com",
  image: "/eventos/puestas-de-largo/1/evento-puesta-de-largo-02.webp",
};

export function whatsappUrl(message?: string): string {
  const url = new URL("https://api.whatsapp.com/send");
  url.searchParams.set("phone", SITE.phone.replace("+", ""));
  if (message) url.searchParams.set("text", message);
  return url.href;
}
