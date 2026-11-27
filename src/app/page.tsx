import React from "react";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";
import { ProductRecord } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: ProductRecord[] = [];
  try {
    featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { popularity: "desc" },
    });
  } catch (err) {
    console.warn("Homepage DB query fallback:", err);
  }

  if (featuredProducts.length === 0) {
    featuredProducts = INITIAL_PRODUCTS.filter((p) => p.isFeatured)
      .slice(0, 4)
      .map((p, i) => ({ ...p, id: `fallback-${i}` }));
  }

  return <HomeClient featuredProducts={featuredProducts} />;
}
