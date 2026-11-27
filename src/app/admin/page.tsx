"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Palette,
  Scissors,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  PREORDER_STATUSES,
  EMBROIDERY_STATUSES,
  formatINR,
  safeJsonParse,
} from "@/lib/constants";
import { useStore } from "@/context/StoreContext";
import { ProductRecord } from "@/components/ProductCard";

type AdminTab =
  | "overview"
  | "products"
  | "preorders"
  | "embroidery"
  | "customers"
  | "reports";

interface AdminOverviewData {
  kpis: {
    totalRevenue: number;
    regularRevenue: number;
    preOrderRevenue: number;
    embroideryRevenue: number;
    totalOrders: number;
    readyMadeSalesCount: number;
    preOrderCount: number;
    embroideryCount: number;
    pendingPickups: number;
    ongoingEmbroidery: number;
    pendingDeliveries: number;
    lowStockCount: number;
  };
  products: ProductRecord[];
  orders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
  }[];
  preOrders: {
    id: string;
    preOrderNumber: string;
    productType: string;
    size: string;
    contactName: string;
    contactPhone: string;
    selectedColorsJson: string;
    referenceImageUrl: string;
    personalizedText: string;
    estimatedPrice: number;
    quotedPrice: number | null;
    status: string;
    expectedDeliveryDate: string;
    adminNotes: string;
  }[];
  embroideries: {
    id: string;
    bookingNumber: string;
    garmentType: string;
    placement: string;
    embroideryType: string;
    customerName: string;
    mobileNumber: string;
    pickupAddress: string;
    pincode: string;
    preferredPickupDate: string;
    garmentImageUrl: string;
    referenceDesignUrl: string;
    estimatedPrice: number;
    confirmedPrice: number | null;
    status: string;
    pickupPersonName: string;
    pickupPersonPhone: string;
    pickupScheduledAt: string;
    garmentConditionNotes: string;
    garmentConditionPhotosJson: string;
    completedWorkPhotosJson: string;
  }[];
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    addresses: { city: string; pincode: string }[];
    orders: { id: string; total: number; paymentStatus: string }[];
    preOrders: { id: string }[];
    embroideries: { id: string }[];
  }[];
  tickets: {
    id: string;
    name: string;
    subject: string;
    message: string;
    status: string;
    adminReply: string;
  }[];
  bestSellers: { name: string; sold: number; revenue: number }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, authLoading, notify } = useStore();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Product State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [newPrice, setNewPrice] = useState("999");
  const [newStock, setNewStock] = useState("10");
  const [newDesc, setNewDesc] = useState("");
  const [newImgUrl, setNewImgUrl] = useState(
    "/images/products/cotton-candy-tulip-bouquet-1.svg"
  );

  const loadAdmin = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/login");
      } else {
        loadAdmin();
      }
    }
  }, [authLoading, user, router, loadAdmin]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-display text-2xl text-cocoa">
        Loading StitchBerry Admin Studio...
      </div>
    );
  }
  if (!data || !user || user.role !== "ADMIN") return null;

  const uploadAdminImage = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    return res.ok ? json.url : null;
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        category: newCategory,
        price: Number(newPrice),
        stock: Number(newStock),
        description: newDesc,
        images: [newImgUrl],
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewDesc("");
      await loadAdmin();
      notify("Product added to ready-made store!", "butter");
    }
  };

  const toggleOutOfStock = async (p: ProductRecord) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOutOfStock: !p.isOutOfStock }),
    });
    loadAdmin();
  };

  const updateProductStock = async (p: ProductRecord, stock: number) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock, isOutOfStock: stock <= 0 }),
    });
    loadAdmin();
  };

  const deleteProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    notify("Product deleted", "pink");
    loadAdmin();
  };

  const updatePreOrder = async (
    id: string,
    payload: Record<string, unknown>
  ) => {
    const res = await fetch(`/api/preorders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      notify("Pre-order updated & customer notified!", "blue");
      loadAdmin();
    }
  };

  const updateEmbroidery = async (
    id: string,
    payload: Record<string, unknown>
  ) => {
    const res = await fetch(`/api/embroidery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      notify("Embroidery workflow updated & customer notified!", "butter");
      loadAdmin();
    }
  };

  const replyTicket = async (id: string, adminReply: string) => {
    await fetch("/api/support", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Replied", adminReply }),
    });
    notify("Reply sent to customer", "blue");
    loadAdmin();
  };

  const k = data.kpis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="stitch-card rounded-5xl p-6 sm:p-8 bg-gradient-to-r from-butter-yellow/70 via-vanilla-cream to-powder-blue/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cocoa-light">
            StitchBerry Operations Console
          </span>
          <h1 className="font-display text-3xl font-bold text-cocoa">
            Studio Admin Panel
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
            { id: "products" as const, label: "Products", icon: Package },
            { id: "preorders" as const, label: "Pre-Orders", icon: Palette },
            { id: "embroidery" as const, label: "Embroidery", icon: Scissors },
            { id: "customers" as const, label: "Customers", icon: Users },
            { id: "reports" as const, label: "Reports", icon: BarChart3 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition ${
                  tab === t.id
                    ? "bg-cocoa text-vanilla-cream shadow-sm"
                    : "bg-white/80 text-cocoa hover:bg-powder-pink/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", val: formatINR(k.totalRevenue), bg: "bg-powder-pink/55" },
              { label: "Total Orders & Bookings", val: k.totalOrders, bg: "bg-powder-blue/55" },
              { label: "Ready-Made Sales", val: `${k.readyMadeSalesCount} (${formatINR(k.regularRevenue)})`, bg: "bg-butter-yellow/75" },
              { label: "Crochet Pre-Orders", val: `${k.preOrderCount} (${formatINR(k.preOrderRevenue)})`, bg: "bg-soft-lavender/75" },
              { label: "Embroidery Bookings", val: `${k.embroideryCount} (${formatINR(k.embroideryRevenue)})`, bg: "bg-baby-pink/75" },
              { label: "Pending Pickups", val: k.pendingPickups, bg: "bg-powder-blue/45" },
              { label: "Ongoing Embroidery Jobs", val: k.ongoingEmbroidery, bg: "bg-butter-yellow/60" },
              { label: "Pending Deliveries / Low Stock", val: `${k.pendingDeliveries} / ${k.lowStockCount}`, bg: "bg-powder-pink/45" },
            ].map((card) => (
              <div key={card.label} className={`stitch-card rounded-4xl p-5 ${card.bg}`}>
                <p className="text-xs font-bold text-cocoa-light">{card.label}</p>
                <p className="font-display text-2xl font-bold text-cocoa mt-1">
                  {card.val}
                </p>
              </div>
            ))}
          </div>

          <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-3">
            <h2 className="font-display text-xl font-bold text-cocoa">
              Recent Ready-Made Orders
            </h2>
            {data.orders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-vanilla-cream border border-cocoa/10 text-xs font-semibold"
              >
                <span>
                  <strong>{ord.orderNumber}</strong> • {ord.customerName} •{" "}
                  {formatINR(ord.total)}
                </span>
                <select
                  value={ord.status}
                  onChange={async (e) => {
                    await fetch(`/api/orders/${ord.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: e.target.value }),
                    });
                    loadAdmin();
                  }}
                  className="rounded-full px-3 py-1 bg-white border border-cocoa/15 font-bold"
                >
                  {["Confirmed", "Packed with Care", "Shipped", "Delivered"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    )
                  )}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT MANAGEMENT */}
      {tab === "products" && (
        <div className="space-y-6">
          <form
            onSubmit={createProduct}
            className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4"
          >
            <h2 className="font-display text-2xl font-bold text-cocoa flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Ready-Made Product
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Product Name"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 font-semibold"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price ₹"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                type="number"
                required
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="Stock Qty"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Short description..."
                className="sm:col-span-2 rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 bg-powder-blue/70 text-xs font-bold text-cocoa cursor-pointer">
                <Upload className="w-4 h-4" /> Upload Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await uploadAdminImage(f);
                      if (url) setNewImgUrl(url);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <button
              type="submit"
              className="rounded-full px-6 py-2.5 bg-cocoa text-vanilla-cream font-bold text-sm"
            >
              Publish Product
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.products.map((p) => {
              const imgs = safeJsonParse<string[]>(p.imagesJson, []);
              return (
                <div
                  key={p.id}
                  className="stitch-card rounded-4xl p-4 bg-white/90 flex items-center gap-4"
                >
                  <img
                    src={imgs[0]}
                    alt={p.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-display font-bold text-cocoa truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-cocoa-light">
                      {p.category} • {formatINR(p.price)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="text-xs font-bold flex items-center gap-1">
                        Stock:
                        <input
                          type="number"
                          defaultValue={p.stock}
                          onBlur={(e) =>
                            updateProductStock(p, Number(e.target.value))
                          }
                          className="w-14 rounded-full px-2 py-0.5 bg-vanilla-cream border border-cocoa/15 text-center"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleOutOfStock(p)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          p.isOutOfStock
                            ? "bg-cocoa text-vanilla-cream"
                            : "bg-butter-yellow text-cocoa"
                        }`}
                      >
                        {p.isOutOfStock ? "Marked Out of Stock" : "In Stock"}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 rounded-full text-cocoa-light hover:text-cocoa hover:bg-baby-pink/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRE-ORDER MANAGEMENT */}
      {tab === "preorders" && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-cocoa">
            Custom Crochet Pre-Order Requests
          </h2>
          {data.preOrders.map((po) => {
            const cols = safeJsonParse<{ name: string; hex: string }[]>(
              po.selectedColorsJson,
              []
            );
            return (
              <div
                key={po.id}
                className="stitch-card rounded-4xl p-5 bg-white/90 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold text-cocoa">
                      {po.preOrderNumber} • {po.productType} ({po.size})
                    </p>
                    <p className="text-xs font-semibold text-cocoa-light">
                      Customer: {po.contactName} ({po.contactPhone}) • Text:{" "}
                      {po.personalizedText || "None"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cols.map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vanilla-cream border text-[11px] font-bold"
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {po.referenceImageUrl && (
                  <img
                    src={po.referenceImageUrl}
                    alt="Customer reference"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-powder-pink"
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center pt-2">
                  <select
                    value={po.status}
                    onChange={(e) =>
                      updatePreOrder(po.id, { status: e.target.value })
                    }
                    className="rounded-full px-3.5 py-2 text-xs font-bold bg-vanilla-cream border border-cocoa/15"
                  >
                    {PREORDER_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    defaultValue={po.quotedPrice ?? po.estimatedPrice}
                    onBlur={(e) =>
                      updatePreOrder(po.id, {
                        quotedPrice: Number(e.target.value),
                      })
                    }
                    placeholder="Quote Price ₹"
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15 font-bold"
                  />
                  <input
                    type="date"
                    defaultValue={po.expectedDeliveryDate}
                    onBlur={(e) =>
                      updatePreOrder(po.id, {
                        expectedDeliveryDate: e.target.value,
                      })
                    }
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    defaultValue={po.adminNotes}
                    onBlur={(e) =>
                      updatePreOrder(po.id, { adminNotes: e.target.value })
                    }
                    placeholder="Admin studio note..."
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMBROIDERY MANAGEMENT */}
      {tab === "embroidery" && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-cocoa">
            Custom Embroidery Bookings & Garment Pickup Control
          </h2>
          {data.embroideries.map((emb) => {
            const condPhotos = safeJsonParse<string[]>(
              emb.garmentConditionPhotosJson,
              []
            );
            const donePhotos = safeJsonParse<string[]>(
              emb.completedWorkPhotosJson,
              []
            );
            return (
              <div
                key={emb.id}
                className="stitch-card rounded-4xl p-5 bg-white/90 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold text-cocoa">
                      {emb.bookingNumber} • {emb.garmentType} ({emb.placement})
                    </p>
                    <p className="text-xs font-semibold text-cocoa-light">
                      {emb.customerName} ({emb.mobileNumber}) • Pickup:{" "}
                      {emb.pickupAddress}, {emb.pincode} on {emb.preferredPickupDate}
                    </p>
                  </div>
                  <select
                    value={emb.status}
                    onChange={(e) =>
                      updateEmbroidery(emb.id, { status: e.target.value })
                    }
                    className="rounded-full px-4 py-2 text-xs font-bold bg-powder-blue/60 border border-cocoa/15"
                  >
                    {EMBROIDERY_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  {emb.garmentImageUrl && (
                    <img
                      src={emb.garmentImageUrl}
                      alt="Customer garment"
                      className="w-16 h-16 rounded-2xl object-cover border"
                    />
                  )}
                  {emb.referenceDesignUrl && (
                    <img
                      src={emb.referenceDesignUrl}
                      alt="Reference design"
                      className="w-16 h-16 rounded-2xl object-cover border"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    defaultValue={emb.pickupPersonName}
                    onBlur={(e) =>
                      updateEmbroidery(emb.id, {
                        pickupPersonName: e.target.value,
                      })
                    }
                    placeholder="Assign Pickup Person"
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    defaultValue={emb.pickupScheduledAt}
                    onBlur={(e) =>
                      updateEmbroidery(emb.id, {
                        pickupScheduledAt: e.target.value,
                      })
                    }
                    placeholder="Pickup Schedule (e.g. Dec 4, 10 AM)"
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    type="number"
                    defaultValue={emb.confirmedPrice ?? emb.estimatedPrice}
                    onBlur={(e) =>
                      updateEmbroidery(emb.id, {
                        confirmedPrice: Number(e.target.value),
                      })
                    }
                    placeholder="Confirmed Price ₹"
                    className="rounded-full px-3.5 py-2 text-xs bg-vanilla-cream border border-cocoa/15 font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <input
                    defaultValue={emb.garmentConditionNotes}
                    onBlur={(e) =>
                      updateEmbroidery(emb.id, {
                        garmentConditionNotes: e.target.value,
                      })
                    }
                    placeholder="Record garment arrival condition notes..."
                    className="rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <div className="flex flex-wrap gap-2">
                    <label className="rounded-full px-3.5 py-2 bg-powder-blue/70 text-[11px] font-bold text-cocoa cursor-pointer">
                      + Arrival Condition Photo ({condPhotos.length})
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const url = await uploadAdminImage(f);
                          if (url) {
                            updateEmbroidery(emb.id, {
                              garmentConditionPhotos: [...condPhotos, url],
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <label className="rounded-full px-3.5 py-2 bg-powder-pink/70 text-[11px] font-bold text-cocoa cursor-pointer">
                      + Completed Work Photo ({donePhotos.length})
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const url = await uploadAdminImage(f);
                          if (url) {
                            updateEmbroidery(emb.id, {
                              completedWorkPhotos: [...donePhotos, url],
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CUSTOMERS & SUPPORT */}
      {tab === "customers" && (
        <div className="space-y-6">
          <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Registered Customers
            </h2>
            <div className="space-y-3">
              {data.customers.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-3xl bg-vanilla-cream border border-cocoa/10 flex flex-wrap justify-between gap-3 text-xs font-semibold"
                >
                  <div>
                    <p className="font-display text-base font-bold text-cocoa">
                      {c.name}
                    </p>
                    <p className="text-cocoa-light">
                      {c.email} • {c.phone || "No phone"}
                    </p>
                    <p className="text-cocoa-light">
                      Addresses: {c.addresses.map((a) => `${a.city} (${a.pincode})`).join(", ") || "None"}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-powder-pink/60 font-bold">
                      {c.orders.length} Orders • {c.preOrders.length} Pre-Orders •{" "}
                      {c.embroideries.length} Embroidery
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Customer Support Messages
            </h2>
            {data.tickets.length === 0 ? (
              <p className="text-xs text-cocoa-light">No open support tickets.</p>
            ) : (
              data.tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-3xl bg-vanilla-cream border border-cocoa/10 space-y-2 text-xs"
                >
                  <div className="flex justify-between font-bold text-cocoa">
                    <span>
                      {t.subject} — {t.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-butter-yellow">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-cocoa-light">{t.message}</p>
                  <input
                    defaultValue={t.adminReply}
                    onBlur={(e) => {
                      if (e.target.value.trim()) replyTicket(t.id, e.target.value);
                    }}
                    placeholder="Type reply & press Tab/blur to send..."
                    className="w-full rounded-full px-4 py-2 bg-white border border-cocoa/15"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* REPORTS */}
      {tab === "reports" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Revenue Split by Module
            </h2>
            {[
              { label: "Ready-Made Crochet Sales", val: k.regularRevenue, color: "bg-powder-pink" },
              { label: "Custom Crochet Pre-Orders", val: k.preOrderRevenue, color: "bg-powder-blue" },
              { label: "Custom Embroidery Services", val: k.embroideryRevenue, color: "bg-butter-yellow" },
            ].map((row) => {
              const pct = k.totalRevenue
                ? Math.round((row.val / k.totalRevenue) * 100)
                : 0;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-cocoa">
                    <span>{row.label}</span>
                    <span>
                      {formatINR(row.val)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-vanilla-cream overflow-hidden border border-cocoa/10">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Best-Selling Products & Low Stock Alert
            </h2>
            {data.bestSellers.map((bs) => (
              <div
                key={bs.name}
                className="flex justify-between text-xs font-bold p-2.5 rounded-2xl bg-vanilla-cream"
              >
                <span>
                  {bs.name} ({bs.sold} sold)
                </span>
                <span>{formatINR(bs.revenue)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-dashed border-cocoa/15">
              <p className="text-xs font-bold text-cocoa-light mb-2">
                Low Stock Inventory (&le; 5 left):
              </p>
              <div className="flex flex-wrap gap-2">
                {data.products
                  .filter((p) => p.stock <= 5 || p.isOutOfStock)
                  .map((p) => (
                    <span
                      key={p.id}
                      className="px-3 py-1 rounded-full bg-baby-pink text-xs font-bold text-cocoa"
                    >
                      {p.name}: {p.stock} left
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
