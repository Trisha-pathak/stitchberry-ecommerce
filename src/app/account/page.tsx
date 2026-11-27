"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  Palette,
  Scissors,
  Truck,
  Bookmark,
  Heart,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR, safeJsonParse } from "@/lib/constants";
import { ProductCard, ProductRecord } from "@/components/ProductCard";

type TabId =
  | "profile"
  | "addresses"
  | "orders"
  | "preorders"
  | "embroidery"
  | "tracking"
  | "saved"
  | "wishlist"
  | "payments"
  | "notifications"
  | "support";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "preorders", label: "Crochet Pre-Orders", icon: Palette },
  { id: "embroidery", label: "Embroidery Bookings", icon: Scissors },
  { id: "tracking", label: "Order Tracking", icon: Truck },
  { id: "saved", label: "Saved Designs", icon: Bookmark },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "My Addresses", icon: MapPin },
  { id: "payments", label: "Payment History", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "My Profile", icon: User },
  { id: "support", label: "Support & Help", icon: HelpCircle },
];

interface DashboardData {
  profile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarColor: string;
  };
  addresses: {
    id: string;
    label: string;
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    itemsJson: string;
    createdAt: string;
  }[];
  preOrders: {
    id: string;
    preOrderNumber: string;
    productType: string;
    size: string;
    selectedColorsJson: string;
    estimatedPrice: number;
    quotedPrice: number | null;
    advanceAmount: number;
    paymentStatus: string;
    status: string;
    expectedDeliveryDate: string;
    adminNotes: string;
    createdAt: string;
  }[];
  embroideries: {
    id: string;
    bookingNumber: string;
    garmentType: string;
    placement: string;
    embroideryType: string;
    estimatedPrice: number;
    confirmedPrice: number | null;
    status: string;
    paymentStatus: string;
    pickupPersonName: string;
    pickupScheduledAt: string;
    garmentConditionNotes: string;
    garmentConditionPhotosJson: string;
    completedWorkPhotosJson: string;
    createdAt: string;
  }[];
  savedDesigns: {
    id: string;
    title: string;
    designType: string;
    colorsJson: string;
    notes: string;
  }[];
  wishlist: { id: string; product: ProductRecord }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];
  tickets: {
    id: string;
    subject: string;
    message: string;
    status: string;
    adminReply: string;
    createdAt: string;
  }[];
}

function AccountInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authLoading, logout, refreshUser, notify } = useStore();

  const initialTab = (searchParams.get("tab") as TabId) || "orders";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [pName, setPName] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pColor, setPColor] = useState("#F7C6D9");

  // Address form
  const [aLabel, setALabel] = useState("Home");
  const [aLine1, setALine1] = useState("");
  const [aCity, setACity] = useState("");
  const [aState, setAState] = useState("");
  const [aPin, setAPin] = useState("");

  // Support form
  const [tSubject, setTSubject] = useState("");
  const [tOrderRef, setTOrderRef] = useState("");
  const [tMessage, setTMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/account", { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as DashboardData;
      setData(json);
      if (json.profile) {
        setPName(json.profile.name);
        setPPhone(json.profile.phone);
        setPColor(json.profile.avatarColor);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      loadDashboard();
    }
  }, [authLoading, user, router, loadDashboard]);

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center font-display text-2xl text-cocoa">
        Opening your pastel studio dashboard...
      </div>
    );
  }

  if (!data || !user) return null;

  const unreadCount = data.notifications.filter((n) => !n.isRead).length;

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-profile",
        name: pName,
        phone: pPhone,
        avatarColor: pColor,
      }),
    });
    if (res.ok) {
      await refreshUser();
      await loadDashboard();
      notify("Profile saved!", "butter");
    }
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add-address",
        label: aLabel,
        fullName: data.profile.name,
        phone: data.profile.phone,
        line1: aLine1,
        city: aCity,
        state: aState,
        pincode: aPin,
      }),
    });
    if (res.ok) {
      setALine1("");
      setACity("");
      setAState("");
      setAPin("");
      await loadDashboard();
      notify("Address added!", "blue");
    }
  };

  const deleteAddress = async (addressId: string) => {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-address", addressId }),
    });
    loadDashboard();
  };

  const deleteSavedDesign = async (designId: string) => {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-design", designId }),
    });
    loadDashboard();
  };

  const markRead = async () => {
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-notifications-read" }),
    });
    loadDashboard();
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.profile.name,
        email: data.profile.email,
        subject: tSubject,
        orderRef: tOrderRef,
        message: tMessage,
      }),
    });
    if (res.ok) {
      setTSubject("");
      setTOrderRef("");
      setTMessage("");
      await loadDashboard();
      notify("Support message sent to our studio!", "pink");
    }
  };

  const paymentLedger = [
    ...data.orders.map((o) => ({
      ref: o.orderNumber,
      kind: "Ready-Made Order",
      amount: o.total,
      status: o.paymentStatus,
      date: o.createdAt,
    })),
    ...data.preOrders.map((p) => ({
      ref: p.preOrderNumber,
      kind: "Custom Crochet Pre-Order",
      amount: p.advanceAmount || p.quotedPrice || p.estimatedPrice,
      status: p.paymentStatus,
      date: p.createdAt,
    })),
    ...data.embroideries.map((em) => ({
      ref: em.bookingNumber,
      kind: "Embroidery Service",
      amount: em.confirmedPrice || em.estimatedPrice,
      status: em.paymentStatus,
      date: em.createdAt,
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="stitch-card rounded-5xl p-6 sm:p-8 bg-gradient-to-r from-powder-pink/60 via-vanilla-cream to-powder-blue/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-3xl border-2 border-white shadow-sm flex items-center justify-center font-display text-2xl font-bold text-cocoa"
            style={{ backgroundColor: data.profile.avatarColor }}
          >
            {data.profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-cocoa">
              Hello, {data.profile.name}!
            </h1>
            <p className="text-xs font-semibold text-cocoa-light">
              {data.profile.email} • {data.orders.length} Orders •{" "}
              {data.preOrders.length} Pre-Orders • {data.embroideries.length}{" "}
              Embroidery Bookings
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 bg-butter-yellow border border-cocoa/15 text-xs font-bold text-cocoa"
            >
              Open Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-white/85 border border-cocoa/15 text-xs font-bold text-cocoa hover:bg-powder-pink/50"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Sidebar Tabs */}
        <aside className="lg:col-span-3 stitch-card rounded-4xl p-3 bg-white/85 flex lg:flex-col gap-1.5 overflow-x-auto">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                  active
                    ? "bg-powder-pink text-cocoa shadow-sm"
                    : "text-cocoa-light hover:bg-powder-blue/35 hover:text-cocoa"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-cocoa text-vanilla-cream px-2 py-0.5 text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Body */}
        <div className="lg:col-span-9 space-y-5">
          {tab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-cocoa">
                My Ready-Made Crochet Orders
              </h2>
              {data.orders.length === 0 ? (
                <div className="stitch-card rounded-4xl p-8 text-center text-sm text-cocoa-light">
                  No regular orders yet.{" "}
                  <Link href="/shop" className="underline font-bold text-cocoa">
                    Browse our ready-made shop!
                  </Link>
                </div>
              ) : (
                data.orders.map((ord) => {
                  const items = safeJsonParse<{ name: string; quantity: number }[]>(
                    ord.itemsJson,
                    []
                  );
                  return (
                    <div
                      key={ord.id}
                      className="stitch-card rounded-4xl p-5 bg-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-lg text-cocoa">
                            {ord.orderNumber}
                          </span>
                          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-powder-blue/70 text-cocoa">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-cocoa-light">
                          {items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                        </p>
                        <p className="text-xs text-cocoa-light">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN")} •{" "}
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl font-bold text-cocoa">
                          {formatINR(ord.total)}
                        </span>
                        <a
                          href={`/api/orders/${ord.id}/invoice`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 bg-butter-yellow text-xs font-bold text-cocoa"
                        >
                          <FileDown className="w-3.5 h-3.5" /> Invoice
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "preorders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-cocoa">
                  My Crochet Pre-Orders
                </h2>
                <Link
                  href="/custom-crochet"
                  className="rounded-full px-4 py-2 bg-powder-pink text-xs font-bold text-cocoa"
                >
                  + New Custom Pre-Order
                </Link>
              </div>
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
                        <span className="font-display text-lg font-bold text-cocoa">
                          {po.preOrderNumber} — {po.productType}
                        </span>
                        <p className="text-xs text-cocoa-light font-semibold">
                          Size: {po.size} • Payment: {po.paymentStatus}
                        </p>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-butter-yellow text-xs font-bold text-cocoa">
                        {po.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {cols.map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vanilla-cream border border-cocoa/15 text-[11px] font-bold"
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                    {po.adminNotes && (
                      <p className="text-xs bg-powder-blue/30 rounded-2xl p-3 font-semibold text-cocoa">
                        Studio Note: {po.adminNotes}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs font-bold text-cocoa">
                      <span>
                        Price: {formatINR(po.quotedPrice ?? po.estimatedPrice)}
                        {po.expectedDeliveryDate &&
                          ` • Est. Delivery: ${po.expectedDeliveryDate}`}
                      </span>
                      <Link
                        href={`/track?code=${po.preOrderNumber}`}
                        className="underline"
                      >
                        Track 9 Stages →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "embroidery" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-cocoa">
                  My Embroidery Bookings
                </h2>
                <Link
                  href="/embroidery"
                  className="rounded-full px-4 py-2 bg-powder-blue text-xs font-bold text-cocoa"
                >
                  + Book Garment Pickup
                </Link>
              </div>
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
                    className="stitch-card rounded-4xl p-5 bg-white/90 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-display text-lg font-bold text-cocoa">
                          {emb.bookingNumber} — {emb.garmentType}
                        </span>
                        <p className="text-xs font-semibold text-cocoa-light">
                          {emb.embroideryType} • Placement: {emb.placement}
                        </p>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-soft-lavender text-xs font-bold text-cocoa">
                        {emb.status}
                      </span>
                    </div>
                    {emb.pickupPersonName && (
                      <p className="text-xs font-semibold text-cocoa">
                        Pickup Personnel: {emb.pickupPersonName} ({emb.pickupScheduledAt})
                      </p>
                    )}
                    {emb.garmentConditionNotes && (
                      <div className="rounded-2xl bg-powder-blue/30 p-3 text-xs font-semibold text-cocoa">
                        <strong>Arrival Inspection:</strong> {emb.garmentConditionNotes}
                      </div>
                    )}
                    {(condPhotos.length > 0 || donePhotos.length > 0) && (
                      <div className="flex flex-wrap gap-3">
                        {condPhotos.map((u, i) => (
                          <img
                            key={`c-${i}`}
                            src={u}
                            alt="Arrival condition"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-powder-blue"
                          />
                        ))}
                        {donePhotos.map((u, i) => (
                          <img
                            key={`d-${i}`}
                            src={u}
                            alt="Completed embroidery"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-powder-pink"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs font-bold text-cocoa">
                      <span>
                        Quote: {formatINR(emb.confirmedPrice ?? emb.estimatedPrice)} ({emb.paymentStatus})
                      </span>
                      <Link
                        href={`/track?code=${emb.bookingNumber}`}
                        className="underline"
                      >
                        Track 12 Stages →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "tracking" && (
            <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
              <h2 className="font-display text-2xl font-bold text-cocoa">
                Quick Order & Service Tracking
              </h2>
              <p className="text-sm text-cocoa-light">
                Jump straight into the live stage tracker for any of your active items:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/track?code=${o.orderNumber}`}
                    className="px-4 py-2 rounded-full bg-powder-pink/60 text-xs font-bold text-cocoa"
                  >
                    {o.orderNumber} ({o.status})
                  </Link>
                ))}
                {data.preOrders.map((p) => (
                  <Link
                    key={p.id}
                    href={`/track?code=${p.preOrderNumber}`}
                    className="px-4 py-2 rounded-full bg-butter-yellow text-xs font-bold text-cocoa"
                  >
                    {p.preOrderNumber} ({p.status})
                  </Link>
                ))}
                {data.embroideries.map((e) => (
                  <Link
                    key={e.id}
                    href={`/track?code=${e.bookingNumber}`}
                    className="px-4 py-2 rounded-full bg-powder-blue/70 text-xs font-bold text-cocoa"
                  >
                    {e.bookingNumber} ({e.status})
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tab === "saved" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-cocoa">
                  Saved Yarn Designs & Palettes
                </h2>
                <Link
                  href="/studio"
                  className="rounded-full px-4 py-2 bg-butter-yellow text-xs font-bold text-cocoa"
                >
                  Open Yarn Studio
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.savedDesigns.map((d) => {
                  const cols = safeJsonParse<{ name: string; hex: string }[]>(
                    d.colorsJson,
                    []
                  );
                  return (
                    <div
                      key={d.id}
                      className="stitch-card rounded-4xl p-5 bg-white/90 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display text-lg font-bold text-cocoa">
                            {d.title}
                          </h3>
                          <p className="text-xs text-cocoa-light">{d.notes}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSavedDesign(d.id)}
                          className="p-1.5 text-cocoa-light hover:text-cocoa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cols.map((c) => (
                          <span
                            key={c.name}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-vanilla-cream border border-cocoa/10 text-[11px] font-bold"
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
                  );
                })}
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-cocoa">
                My Pastel Wishlist
              </h2>
              {data.wishlist.length === 0 ? (
                <div className="stitch-card rounded-4xl p-8 text-center text-sm text-cocoa-light">
                  Tap the heart icon on any ready-made treasure in our shop to save it here!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.wishlist.map((w) => (
                    <ProductCard key={w.id} product={w.product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold text-cocoa">
                My Saved Addresses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="stitch-card rounded-4xl p-5 bg-white/90 flex justify-between items-start gap-2"
                  >
                    <div className="text-xs font-semibold text-cocoa space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-powder-pink/70 font-bold">
                        {addr.label}
                      </span>
                      <p className="font-bold text-sm">{addr.fullName}</p>
                      <p className="text-cocoa-light">{addr.line1}</p>
                      <p className="text-cocoa-light">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1.5 text-cocoa-light hover:text-cocoa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={addAddress}
                className="stitch-card rounded-4xl p-5 bg-white/85 space-y-3"
              >
                <p className="font-display font-bold text-cocoa flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add New Address
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    value={aLabel}
                    onChange={(e) => setALabel(e.target.value)}
                    placeholder="Label (Home/Work)"
                    className="rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    required
                    value={aLine1}
                    onChange={(e) => setALine1(e.target.value)}
                    placeholder="Street & Flat"
                    className="sm:col-span-3 rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    required
                    value={aCity}
                    onChange={(e) => setACity(e.target.value)}
                    placeholder="City"
                    className="rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    required
                    value={aState}
                    onChange={(e) => setAState(e.target.value)}
                    placeholder="State"
                    className="rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    required
                    value={aPin}
                    onChange={(e) => setAPin(e.target.value)}
                    placeholder="Pincode"
                    className="rounded-full px-4 py-2 text-xs bg-vanilla-cream border border-cocoa/15"
                  />
                  <button
                    type="submit"
                    className="rounded-full px-4 py-2 bg-cocoa text-vanilla-cream text-xs font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === "payments" && (
            <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
              <h2 className="font-display text-2xl font-bold text-cocoa">
                Payment History
              </h2>
              <div className="space-y-2.5">
                {paymentLedger.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-vanilla-cream border border-cocoa/10 text-xs font-semibold"
                  >
                    <div>
                      <span className="font-bold text-cocoa">{p.ref}</span> •{" "}
                      <span className="text-cocoa-light">{p.kind}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-butter-yellow font-bold">
                        {p.status}
                      </span>
                      <span className="font-display text-base font-bold text-cocoa">
                        {formatINR(p.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-cocoa">
                  Studio Notifications
                </h2>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markRead}
                    className="text-xs font-bold underline text-cocoa"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              {data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-3xl border text-xs ${
                    n.isRead
                      ? "bg-vanilla-cream/70 border-cocoa/10"
                      : "bg-powder-pink/40 border-cocoa/25"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-cocoa">
                    {n.title}
                  </p>
                  <p className="text-cocoa-light font-semibold mt-1">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "profile" && (
            <form
              onSubmit={updateProfile}
              className="stitch-card rounded-4xl p-6 bg-white/90 space-y-4 max-w-xl"
            >
              <h2 className="font-display text-2xl font-bold text-cocoa">
                My Profile
              </h2>
              <div>
                <label className="text-xs font-bold text-cocoa-light block mb-1">
                  Full Name
                </label>
                <input
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cocoa-light block mb-1">
                  Phone Number
                </label>
                <input
                  value={pPhone}
                  onChange={(e) => setPPhone(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-cocoa-light block mb-1.5">
                  Avatar Pastel Badge
                </label>
                <div className="flex gap-2.5">
                  {["#F7C6D9", "#BFE3F5", "#E7DDF7", "#FFF0B8"].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setPColor(hex)}
                      className={`w-9 h-9 rounded-full border-2 ${
                        pColor === hex ? "border-cocoa scale-110" : "border-white"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="rounded-full px-6 py-2.5 bg-cocoa text-vanilla-cream font-bold text-sm"
              >
                Save Changes
              </button>
            </form>
          )}

          {tab === "support" && (
            <div className="space-y-5">
              <form
                onSubmit={submitTicket}
                className="stitch-card rounded-4xl p-6 bg-white/90 space-y-3"
              >
                <h2 className="font-display text-2xl font-bold text-cocoa">
                  Support & Help
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    required
                    value={tSubject}
                    onChange={(e) => setTSubject(e.target.value)}
                    placeholder="Subject (e.g. Pickup reschedule)"
                    className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                  />
                  <input
                    value={tOrderRef}
                    onChange={(e) => setTOrderRef(e.target.value)}
                    placeholder="Order / Booking Code (Optional)"
                    className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  value={tMessage}
                  onChange={(e) => setTMessage(e.target.value)}
                  placeholder="How can our studio help you?"
                  className="w-full rounded-3xl p-4 text-sm bg-vanilla-cream border border-cocoa/15"
                />
                <button
                  type="submit"
                  className="rounded-full px-6 py-2.5 bg-cocoa text-vanilla-cream font-bold text-sm"
                >
                  Send Support Message
                </button>
              </form>

              {data.tickets.map((t) => (
                <div
                  key={t.id}
                  className="stitch-card rounded-3xl p-4 bg-white/85 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between font-bold text-cocoa">
                    <span>{t.subject}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-butter-yellow">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-cocoa-light">{t.message}</p>
                  {t.adminReply && (
                    <p className="bg-powder-blue/35 rounded-2xl p-2.5 font-semibold text-cocoa">
                      Studio Reply: {t.adminReply}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-display text-xl">Loading dashboard...</div>}>
      <AccountInner />
    </Suspense>
  );
}
