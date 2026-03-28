import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db/schema";
import { eq, ilike, gte, lte, and, desc, asc, sql, ne } from "drizzle-orm";

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

router.get("/products", async (req, res) => {
  try {
    const { categoryId, search, minPrice, maxPrice, sortBy, page = "1", limit = "20", featured } = req.query;

    const conditions: any[] = [];
    if (categoryId) conditions.push(eq(productsTable.categoryId, parseInt(categoryId as string)));
    if (search) conditions.push(
      sql`(${productsTable.name} ILIKE ${`%${search}%`} OR ${productsTable.nameAr} ILIKE ${`%${search}%`} OR ${productsTable.nameFr} ILIKE ${`%${search}%`})`
    );
    if (minPrice) conditions.push(gte(sql`${productsTable.price}::numeric`, parseFloat(minPrice as string)));
    if (maxPrice) conditions.push(lte(sql`${productsTable.price}::numeric`, parseFloat(maxPrice as string)));
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy: any;
    switch (sortBy) {
      case "price_asc": orderBy = asc(sql`${productsTable.price}::numeric`); break;
      case "price_desc": orderBy = desc(sql`${productsTable.price}::numeric`); break;
      case "popular": orderBy = desc(productsTable.reviewCount); break;
      default: orderBy = desc(productsTable.createdAt);
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
    const offset = (pageNum - 1) * limitNum;

    const [products, countResult] = await Promise.all([
      db.select(productFields).from(productsTable)
        .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
        .where(where)
        .orderBy(orderBy)
        .limit(limitNum)
        .offset(offset),
      db.select({ count: sql<number>`COUNT(*)::int` }).from(productsTable).where(where),
    ]);

    const total = countResult[0]?.count || 0;
    res.json({
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid_id", message: "Invalid product ID" });
    }

    const [product] = await db.select({
      ...productFields,
      specifications: productsTable.specifications,
      tags: productsTable.tags,
    }).from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      return res.status(404).json({ error: "not_found", message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch product" });
  }
});

router.get("/products/:id/related", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid_id", message: "Invalid product ID" });
    }

    const [product] = await db.select({ categoryId: productsTable.categoryId }).from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (!product) {
      return res.json([]);
    }

    const related = await db.select(productFields).from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(and(eq(productsTable.categoryId, product.categoryId), ne(productsTable.id, id)))
      .limit(8);

    res.json(related);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch related products" });
  }
});

export default router;
