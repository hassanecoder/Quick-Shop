import { Router } from "express";
import { db } from "@workspace/db";
import { favoritesTable, productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const productFields = {
  id: productsTable.id,
  name: productsTable.name,
  nameAr: productsTable.nameAr,
  nameFr: productsTable.nameFr,
  slug: productsTable.slug,
  description: productsTable.description,
  descriptionAr: productsTable.descriptionAr,
  descriptionFr: productsTable.descriptionFr,
  price: productsTable.price,
  originalPrice: productsTable.originalPrice,
  categoryId: productsTable.categoryId,
  categoryName: categoriesTable.name,
  categoryNameAr: categoriesTable.nameAr,
  imageUrl: productsTable.imageUrl,
  images: productsTable.images,
  rating: productsTable.rating,
  reviewCount: productsTable.reviewCount,
  stock: productsTable.stock,
  isFeatured: productsTable.isFeatured,
  isNew: productsTable.isNew,
  badge: productsTable.badge,
  createdAt: productsTable.createdAt,
};

router.get("/favorites", async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ error: "missing_session", message: "sessionId is required" });
    }
    const favs = await db.select({ productId: favoritesTable.productId }).from(favoritesTable).where(eq(favoritesTable.sessionId, sessionId as string));
    if (favs.length === 0) return res.json([]);

    const ids = favs.map(f => f.productId);
    const products = await db.select(productFields).from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(sql`${productsTable.id} = ANY(${ids})`);

    res.json(products);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch favorites" });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    const schema = z.object({ productId: z.number().int().positive(), sessionId: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "validation_error", message: "Invalid data" });

    const { productId, sessionId } = parsed.data;
    const existing = await db.select({ id: favoritesTable.id }).from(favoritesTable)
      .where(and(eq(favoritesTable.sessionId, sessionId), eq(favoritesTable.productId, productId))).limit(1);

    if (existing.length === 0) {
      await db.insert(favoritesTable).values({ sessionId, productId });
    }
    res.status(201).json({ success: true, message: "Added to favorites" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to add favorite" });
  }
});

router.delete("/favorites/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const { sessionId } = req.query;
    if (!sessionId || isNaN(productId)) return res.status(400).json({ error: "invalid_params", message: "Invalid params" });

    await db.delete(favoritesTable).where(and(eq(favoritesTable.sessionId, sessionId as string), eq(favoritesTable.productId, productId)));
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to remove favorite" });
  }
});

export default router;
