import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "All support fields are required." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session?.userId || null,
        name: String(body.name),
        email: String(body.email),
        subject: String(body.subject),
        message: String(body.message),
        orderRef: String(body.orderRef || ""),
      },
    });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not submit message." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const body = await req.json();
  const ticket = await prisma.supportTicket.update({
    where: { id: String(body.id) },
    data: {
      status: String(body.status || "Replied"),
      adminReply: String(body.adminReply || ""),
    },
  });
  return NextResponse.json({ ticket });
}
