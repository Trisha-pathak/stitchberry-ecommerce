import React from "react";
import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
    orderBy: { popularity: "desc" },
  });

  return <HomeClient featuredProducts={featuredProducts} />;
}
