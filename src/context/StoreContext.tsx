"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface CartItem {
  id: string; // productId + color + size
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
  avatarColor: string;
}

interface ToastMsg {
  id: string;
  text: string;
  tone?: "pink" | "blue" | "butter";
}

interface StoreContextType {
  user: AuthUser | null;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  yarnCursorEnabled: boolean;
  setYarnCursorEnabled: (enabled: boolean) => void;
  notify: (text: string, tone?: "pink" | "blue" | "butter") => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [yarnCursorEnabled, setYarnCursorEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const notify = useCallback(
    (text: string, tone: "pink" | "blue" | "butter" = "pink") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, text, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3400);
    },
    []
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
        if (data.wishlistIds) setWishlistIds(data.wishlistIds);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    try {
      const savedCart = localStorage.getItem("stitchberry_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem("stitchberry_wishlist");
      if (savedWishlist) setWishlistIds(JSON.parse(savedWishlist));
    } catch {
      // ignore storage errors
    }
  }, [refreshUser]);

  useEffect(() => {
    try {
      localStorage.setItem("stitchberry_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(
          "stitchberry_wishlist",
          JSON.stringify(wishlistIds)
        );
      } catch {
        // ignore
      }
    }
  }, [wishlistIds, user]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    notify("Signed out softly. See you soon!", "blue");
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: Math.min(updated[idx].quantity + item.quantity, item.stock || 99),
        };
        return updated;
      }
      return [...prev, item];
    });
    notify(`Added "${item.name}" to your yarn basket!`, "pink");
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string) => {
    const exists = wishlistIds.includes(productId);
    setWishlistIds((prev) =>
      exists ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    notify(
      exists ? "Removed from wishlist" : "Saved to your pastel wishlist!",
      exists ? "blue" : "pink"
    );
    if (user) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        user,
        authLoading,
        refreshUser,
        logout,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlistIds,
        toggleWishlist,
        yarnCursorEnabled,
        setYarnCursorEnabled,
        notify,
      }}
    >
      {children}
      {/* Pastel Toast Stack */}
      <div className="fixed bottom-24 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-full px-5 py-3 text-sm font-bold text-cocoa shadow-candy border-2 border-white/80 backdrop-blur-md transition-all ${
              t.tone === "blue"
                ? "bg-powder-blue/95"
                : t.tone === "butter"
                ? "bg-butter-yellow/95"
                : "bg-powder-pink/95"
            }`}
          >
            ✦ {t.text}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
