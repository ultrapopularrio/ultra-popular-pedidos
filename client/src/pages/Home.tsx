/**
 * Design Philosophy: Corporativo Minimalista
 * - Vermelho vibrante (#E63946) como cor primária
 * - Branco puro como fundo (limpeza, higiene)
 * - Cinza escuro (#2B2D42) para textos
 * - Layout organizado em grid com cards uniformes
 * - Tipografia: Poppins (títulos), Inter (corpo)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { STORES, formatWhatsAppUrl } from "@/lib/stores";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: "pampers-1",
    name: "Fraldas Pampers Confort Sec P.",
    price: 54.99,
    image: "https://via.placeholder.com/200x200?text=Pampers",
    size: "P",
  },
  {
    id: "huggies-1",
    name: "Lenços Umedecidos Huggies Max Clean 48 un",
    price: 9.9,
    image: "https://via.placeholder.com/200x200?text=Huggies",
  },
  {
    id: "leite-ninho-1",
    name: "Leite Ninho Fases 1+ Lata 800g",
    price: 38.9,
    originalPrice: 45.5,
    image: "https://via.placeholder.com/200x200?text=Ninho",
  },
  {
    id: "dorflex-1",
    name: "Dorflex Caixa 10 comprimidos",
    price: 5.5,
    image: "https://via.placeholder.com/200x200?text=Dorflex",
  },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    neighborhood: "",
    city: "",
    paymentMethod: "money",
  });
  const [additionalProducts, setAdditionalProducts] = useState("");

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Produto removido do carrinho!");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSendOrder = () => {
    // Validação obrigatória da loja
    if (!selectedStore) {
      toast.error("Por favor, selecione a loja mais próxima para enviar seu pedido.");
      return;
    }

    // Validação do carrinho
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    // Validação dos dados do cliente
    if (
      !customerData.name ||
      !customerData.phone ||
      !customerData.address ||
      !customerData.neighborhood ||
      !customerData.city
    ) {
      toast.error("Por favor, preencha todos os dados de entrega!");
      return;
    }

    // Construir mensagem do pedido
    const store = STORES.find((s) => s.id === selectedStore);
    if (!store) {
      toast.error("Loja selecionada inválida!");
      return;
    }

    let message = `*PEDIDO ULTRA POPULAR*\n\n`;
    message += `📍 *Loja Selecionada:* ${store.name} - ${store.city}\n\n`;
    message += `*PRODUTOS:*\n`;

    cart.forEach((item) => {
      message += `• ${item.name}${item.size ? ` (${item.size})` : ""} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*TOTAL: R$ ${calculateTotal().toFixed(2)}*\n\n`;
    message += `*DADOS DE ENTREGA:*\n`;
    message += `Nome: ${customerData.name}\n`;
    message += `Telefone: ${customerData.phone}\n`;
    message += `Endereço: ${customerData.address}\n`;
    message += `Bairro: ${customerData.neighborhood}\n`;
    message += `Cidade: ${customerData.city}\n`;
    
    // Adicionar produtos adicionais se houver
    if (additionalProducts.trim()) {
      message += `\n*PRODUTOS ADICIONAIS:*\n${additionalProducts}\n`;
      message += `\nObs: A disponibilidade e o pre\u00e7o destes itens ser\u00e3o confirmados via WhatsApp.\n`;
    }
    
    const paymentMethods: { [key: string]: string } = {
      money: "Dinheiro",
      card: "Cartão",
      pix: "Pix",
    };
    message += `Forma de Pagamento: ${paymentMethods[customerData.paymentMethod] || customerData.paymentMethod}\n`;

    // Redirecionar para WhatsApp da loja selecionada
    const whatsappUrl = formatWhatsAppUrl(store.whatsappNumber, message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 shadow-md">
        <div className="container">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="Ultra Popular Logo" className="h-20" />
            <div className="text-right">
              <p className="text-sm">Monte seu pedido abaixo e envie pelo WhatsApp!</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Produtos Disponíveis
            </h2>

            <div className="space-y-4">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => {
                          const item = cart.find((i) => i.id === product.id);
                          updateQuantity(
                            product.id,
                            (item?.quantity || 0) - 1
                          );
                        }}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {cart.find((i) => i.id === product.id)?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Cart and Order Form */}
          <div className="lg:col-span-1">
            {/* Cart Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Seu Carrinho
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Carrinho vazio
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-gray-600">
                            {item.quantity}x R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-3 mb-4">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-red-600">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Order Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dados da Entrega
              </h3>

              <div className="space-y-4">
                {/* Store Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Escolha a loja mais próxima *
                  </label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORES.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name} - {store.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Seu nome"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="(21) 99999-9999"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Rua, número"
                  />
                </div>

                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={customerData.neighborhood}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        neighborhood: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Bairro"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={customerData.city}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Cidade"
                  />
                </div>

                {/* Additional Products */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Quer incluir algum produto que não está na lista? (Opcional)
                  </label>
                  <textarea
                    value={additionalProducts}
                    onChange={(e) => setAdditionalProducts(e.target.value)}
                    placeholder="Digite aqui nome e quantidade desejada, ex:\n2x Novalgina 1g cx 10 comp\n1x Protetor Solar Sundown FPS 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 min-h-24 font-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Obs: A disponibilidade e o preço destes itens serão confirmados via WhatsApp.
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Forma de Pagamento
                  </label>
                  <select
                    value={customerData.paymentMethod}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="money">Dinheiro</option>
                    <option value="card">Cartão</option>
                    <option value="pix">Pix</option>
                  </select>
                </div>

                {/* Send Order Button */}
                <Button
                  onClick={handleSendOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors"
                >
                  📱 Enviar Pedido pelo WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
