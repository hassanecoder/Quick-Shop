import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, regionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const createOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  regionId: z.number().int().positive(),
  cityId: z.number().int().positive().optional().nullable(),
  address: z.string().optional().nullable(),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1),
  isInstant: z.boolean().optional().default(false),
  notes: z.string().optional().nullable(),
});

function generateOrderNumber() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `QDZ-${now}-${rand}`;
}

router.post("/orders", async (req, res) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "validation_error", message: "Invalid order data" });
    }

    const data = parsed.data;
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [region] = await db.select({ name: regionsTable.name }).from(regionsTable).where(eq(regionsTable.id, data.regionId)).limit(1);

    const [order] = await db.insert(ordersTable).values({
      orderNumber: generateOrderNumber(),
      fullName: data.fullName,
      phone: data.phone,
      regionId: data.regionId,
      cityId: data.cityId ?? null,
      address: data.address ?? null,
      total: total.toString(),
      isInstant: data.isInstant ?? false,
      notes: data.notes ?? null,
      items: data.items,
      status: "pending",
    }).returning();

    res.status(201).json({
      ...order,
      regionName: region?.name ?? "",
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to create order" });
  }
});

export default router;
