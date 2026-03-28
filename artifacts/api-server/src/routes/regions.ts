import { Router } from "express";
import { db } from "@workspace/db";
import { regionsTable, citiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/regions", async (req, res) => {
  try {
    const regions = await db.select().from(regionsTable).orderBy(regionsTable.code);
    res.json(regions);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch regions" });
  }
});

router.get("/regions/:id/cities", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "invalid_id" });
    const cities = await db.select().from(citiesTable).where(eq(citiesTable.regionId, id)).orderBy(citiesTable.name);
    res.json(cities);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "internal_error", message: "Failed to fetch cities" });
  }
});

export default router;
