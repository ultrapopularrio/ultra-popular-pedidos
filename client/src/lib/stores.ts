/**
 * Configuração de lojas e números de WhatsApp
 * 
 * Design Philosophy: Estrutura escalável para fácil adição de novas lojas
 * Cada loja contém: nome, cidade e número de WhatsApp
 * 
 * Para adicionar uma nova loja, basta adicionar um novo objeto ao array
 */

export interface Store {
  id: string;
  name: string;
  city: string;
  whatsapp: string; // Formato: (XX) XXXXX-XXXX
  whatsappNumber: string; // Apenas números para URL: 5521968450574
}

export const STORES: Store[] = [
  {
    id: "ultra-vasco",
    name: "Ultra Vasco",
    city: "Belford Roxo",
    whatsapp: "(21) 96845-0574",
    whatsappNumber: "5521968450574",
  },
  {
    id: "ultra-lote-xv",
    name: "Ultra Lote XV",
    city: "Belford Roxo",
    whatsapp: "(21) 96845-0574",
    whatsappNumber: "5521968450574",
  },
  {
    id: "ultra-jardim-primavera",
    name: "Ultra Jardim Primavera",
    city: "Duque de Caxias",
    whatsapp: "(21) 99320-2884",
    whatsappNumber: "5521993202884",
  },
  {
    id: "ultra-jardim-gramacho",
    name: "Ultra Jardim Gramacho",
    city: "Duque de Caxias",
    whatsapp: "(21) 97648-8682",
    whatsappNumber: "5521976488682",
  },
];

/**
 * Encontra a loja pelo ID
 */
export function getStoreById(id: string): Store | undefined {
  return STORES.find((store) => store.id === id);
}

/**
 * Retorna todas as lojas agrupadas por cidade
 * Útil para sugerir loja automaticamente baseado na cidade do cliente
 */
export function getStoresByCity(city: string): Store[] {
  return STORES.filter(
    (store) => store.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Formata o número de WhatsApp para URL
 */
export function formatWhatsAppUrl(whatsappNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
