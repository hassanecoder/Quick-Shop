import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      nameFr: categoriesTable.nameFr,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      descriptionAr: categoriesTable.descriptionAr,
      descriptionFr: categoriesTable.descriptionFr,
      imageUrl: categoriesTable.imageUrl,
      icon: categoriesTable.icon,
      createdAt: categoriesTable.createdAt,
      productCount: sql<number>`(SELECT COUNT(*) FROM products WHERE products.category_id = ${categoriesTable.id})::int`,
    }).from(categoriesTable).orderBy(categoriesTable.name);
    res.json(categories);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch categories" });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid_id", message: "Invalid category ID" });
    }
    const [category] = await db.select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      nameAr: categoriesTable.nameAr,
      nameFr: categoriesTable.nameFr,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      descriptionAr: categoriesTable.descriptionAr,
      descriptionFr: categoriesTable.descriptionFr,
      imageUrl: categoriesTable.imageUrl,
      icon: categoriesTable.icon,
      createdAt: categoriesTable.createdAt,
      productCount: sql<number>`(SELECT COUNT(*) FROM products WHERE products.category_id = ${categoriesTable.id})::int`,
    }).from(categoriesTable).where(eq(categoriesTable.id, id)).limit(1);

    if (!category) {
      return res.status(404).json({ error: "not_found", message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch category" });
  }
});

export default router;
