import { db } from "@workspace/db";
import { categoriesTable, productsTable, regionsTable, citiesTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

async function seed() {
  const seedMode = process.env.SEED_MODE === "bootstrap" ? "bootstrap" : "reset";
  console.log(`🌱 Seeding database in ${seedMode} mode...`);

  if (seedMode === "reset") {
    await db.execute(sql`TRUNCATE TABLE categories, products, regions, cities, orders, favorites RESTART IDENTITY CASCADE`);
    console.log("🧹 Cleared existing catalog and checkout data");
  }

  // ─── Categories ───────────────────────────────────────────────────
  const categorySeeds = [
    {
      name: "Electronics",
      nameAr: "الإلكترونيات",
      nameFr: "Électronique",
      slug: "electronics",
      description: "Latest electronic devices and gadgets",
      descriptionAr: "أحدث الأجهزة الإلكترونية والأدوات التقنية",
      descriptionFr: "Derniers appareils électroniques et gadgets",
      imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
      icon: "📱",
    },
    {
      name: "Clothing & Fashion",
      nameAr: "الملابس والأزياء",
      nameFr: "Vêtements & Mode",
      slug: "clothing",
      description: "Men, women, and kids fashion",
      descriptionAr: "أزياء للرجال والنساء والأطفال",
      descriptionFr: "Mode pour hommes, femmes et enfants",
      imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
      icon: "👕",
    },
    {
      name: "Home & Furniture",
      nameAr: "المنزل والأثاث",
      nameFr: "Maison & Meubles",
      slug: "home-furniture",
      description: "Furniture and home decor",
      descriptionAr: "أثاث وديكور المنزل",
      descriptionFr: "Meubles et décoration intérieure",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      icon: "🛋️",
    },
    {
      name: "Beauty & Personal Care",
      nameAr: "الجمال والعناية الشخصية",
      nameFr: "Beauté & Soins",
      slug: "beauty",
      description: "Skincare, makeup, and personal care products",
      descriptionAr: "العناية بالبشرة والمكياج ومنتجات العناية الشخصية",
      descriptionFr: "Soins de la peau, maquillage et produits de soins",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      icon: "💄",
    },
    {
      name: "Sports & Fitness",
      nameAr: "الرياضة واللياقة",
      nameFr: "Sport & Fitness",
      slug: "sports",
      description: "Sports equipment and fitness gear",
      descriptionAr: "معدات رياضية وأدوات اللياقة البدنية",
      descriptionFr: "Équipements sportifs et matériel de fitness",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      icon: "⚽",
    },
    {
      name: "Kitchen & Cooking",
      nameAr: "المطبخ والطبخ",
      nameFr: "Cuisine & Cooking",
      slug: "kitchen",
      description: "Kitchen appliances and cookware",
      descriptionAr: "أجهزة المطبخ وأواني الطبخ",
      descriptionFr: "Appareils de cuisine et ustensiles",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      icon: "🍳",
    },
    {
      name: "Toys & Baby",
      nameAr: "الألعاب والأطفال",
      nameFr: "Jouets & Bébé",
      slug: "toys-baby",
      description: "Toys and baby products",
      descriptionAr: "ألعاب ومنتجات الأطفال",
      descriptionFr: "Jouets et produits pour bébé",
      imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
      icon: "🧸",
    },
    {
      name: "Auto & Vehicles",
      nameAr: "السيارات والمركبات",
      nameFr: "Auto & Véhicules",
      slug: "auto",
      description: "Car accessories and vehicle parts",
      descriptionAr: "اكسسوارات السيارات وقطع الغيار",
      descriptionFr: "Accessoires auto et pièces détachées",
      imageUrl: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80",
      icon: "🚗",
    },
    {
      name: "Books & Stationery",
      nameAr: "الكتب والقرطاسية",
      nameFr: "Livres & Papeterie",
      slug: "books",
      description: "Books, educational materials, and stationery",
      descriptionAr: "الكتب والمواد التعليمية والقرطاسية",
      descriptionFr: "Livres, matériel éducatif et papeterie",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      icon: "📚",
    },
    {
      name: "Food & Groceries",
      nameAr: "الغذاء والبقالة",
      nameFr: "Alimentation & Épicerie",
      slug: "food",
      description: "Algerian food products and groceries",
      descriptionAr: "المنتجات الغذائية الجزائرية والبقالة",
      descriptionFr: "Produits alimentaires algériens et épicerie",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      icon: "🛒",
    },
  ];

  const existingCategories = seedMode === "bootstrap" ? await db.select().from(categoriesTable) : [];
  const existingCategorySlugs = new Set(existingCategories.map((category) => category.slug));
  const missingCategories = categorySeeds.filter((category) => !existingCategorySlugs.has(category.slug));

  if (missingCategories.length > 0) {
    await db.insert(categoriesTable).values(missingCategories);
  }

  const availableCategories = await db.select().from(categoriesTable);
  if (seedMode === "reset") {
    console.log(`✅ Inserted ${availableCategories.length} categories`);
  } else if (missingCategories.length > 0) {
    console.log(`✅ Inserted ${missingCategories.length} missing categories`);
  } else {
    console.log(`⏭️ Skipped categories; ${availableCategories.length} already present`);
  }

  const catMap: Record<string, number> = {};
  availableCategories.forEach((category) => {
    catMap[category.slug] = category.id;
  });

  // ─── Products ─────────────────────────────────────────────────────
  const products = [
    // Electronics
    {
      name: "Samsung Galaxy A54 5G",
      nameAr: "سامسونج جالاكسي A54 5G",
      nameFr: "Samsung Galaxy A54 5G",
      slug: "samsung-galaxy-a54-5g",
      description: "Powerful 5G smartphone with 50MP camera, 5000mAh battery, and stunning Super AMOLED display.",
      descriptionAr: "هاتف ذكي 5G قوي بكاميرا 50 ميغابكسل وبطارية 5000 مللي أمبير وشاشة Super AMOLED رائعة.",
      descriptionFr: "Smartphone 5G puissant avec caméra 50MP, batterie 5000mAh et écran Super AMOLED.",
      price: "89000",
      originalPrice: "99000",
      categoryId: catMap["electronics"],
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80"],
      rating: "4.5",
      reviewCount: 234,
      stock: 50,
      isFeatured: true,
      isNew: false,
      badge: "تخفيض",
      specifications: { "الشاشة": "6.4 بوصة Super AMOLED", "المعالج": "Exynos 1380", "RAM": "8GB", "التخزين": "256GB" },
      tags: ["هاتف", "سامسونج", "5G", "كاميرا"],
    },
    {
      name: "Xiaomi Redmi Note 12",
      nameAr: "شاومي ريدمي نوت 12",
      nameFr: "Xiaomi Redmi Note 12",
      slug: "xiaomi-redmi-note-12",
      description: "Budget-friendly smartphone with 120Hz display and 50MP triple camera.",
      descriptionAr: "هاتف ذكي بسعر مناسب مع شاشة 120 هرتز وكاميرا ثلاثية 50 ميغابكسل.",
      descriptionFr: "Smartphone abordable avec écran 120Hz et triple caméra 50MP.",
      price: "52000",
      originalPrice: null,
      categoryId: catMap["electronics"],
      imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80"],
      rating: "4.3",
      reviewCount: 189,
      stock: 80,
      isFeatured: false,
      isNew: true,
      badge: "جديد",
      specifications: { "الشاشة": "6.67 بوصة AMOLED", "المعالج": "Snapdragon 685", "RAM": "6GB", "التخزين": "128GB" },
      tags: ["هاتف", "شاومي", "جديد"],
    },
    {
      name: "JBL Tune 510BT Headphones",
      nameAr: "سماعات JBL Tune 510BT",
      nameFr: "Casque JBL Tune 510BT",
      slug: "jbl-tune-510bt",
      description: "Wireless over-ear headphones with 40 hours battery life and pure bass sound.",
      descriptionAr: "سماعات لاسلكية فوق الأذن مع 40 ساعة بطارية وصوت باس نقي.",
      descriptionFr: "Casque sans fil avec 40h d'autonomie et son basse pure.",
      price: "8500",
      originalPrice: "12000",
      categoryId: catMap["electronics"],
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
      rating: "4.7",
      reviewCount: 456,
      stock: 120,
      isFeatured: true,
      isNew: false,
      badge: "الأكثر مبيعاً",
      specifications: { "نوع": "Over-ear", "الاتصال": "Bluetooth 5.0", "البطارية": "40 ساعة" },
      tags: ["سماعات", "JBL", "لاسلكي"],
    },
    {
      name: "Laptop Lenovo IdeaPad 15",
      nameAr: "لابتوب لينوفو آيديا باد 15",
      nameFr: "Laptop Lenovo IdeaPad 15",
      slug: "lenovo-ideapad-15",
      description: "15.6-inch Full HD laptop with Intel Core i5, 8GB RAM, 512GB SSD.",
      descriptionAr: "لابتوب 15.6 بوصة Full HD مع معالج Intel Core i5 وذاكرة 8 جيجابايت وقرص SSD 512 جيجابايت.",
      descriptionFr: "Laptop 15.6 pouces Full HD avec Intel Core i5, 8Go RAM, SSD 512Go.",
      price: "135000",
      originalPrice: "145000",
      categoryId: catMap["electronics"],
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"],
      rating: "4.4",
      reviewCount: 98,
      stock: 25,
      isFeatured: true,
      isNew: false,
      badge: "تخفيض",
      specifications: { "الشاشة": "15.6 بوصة Full HD", "المعالج": "Intel Core i5-1235U", "RAM": "8GB DDR4", "SSD": "512GB" },
      tags: ["لابتوب", "لينوفو", "كمبيوتر"],
    },
    {
      name: "iPhone 13 128GB",
      nameAr: "آيفون 13 128 جيجابايت",
      nameFr: "iPhone 13 128Go",
      slug: "iphone-13-128gb",
      description: "Apple iPhone 13 with A15 Bionic chip, dual camera, and all-day battery life.",
      descriptionAr: "آبل آيفون 13 مع شريحة A15 Bionic وكاميرا مزدوجة وبطارية تدوم طوال اليوم.",
      descriptionFr: "Apple iPhone 13 avec puce A15 Bionic, double caméra et autonomie toute la journée.",
      price: "175000",
      originalPrice: null,
      categoryId: catMap["electronics"],
      imageUrl: "https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1611791484670-ce19b801d192?w=600&q=80"],
      rating: "4.8",
      reviewCount: 512,
      stock: 15,
      isFeatured: true,
      isNew: false,
      badge: null,
      specifications: { "الشاشة": "6.1 بوصة Super Retina XDR", "المعالج": "A15 Bionic", "التخزين": "128GB" },
      tags: ["آيفون", "آبل", "هاتف"],
    },

    // Clothing
    {
      name: "Men's Traditional Gandoura",
      nameAr: "قندورة رجالية تقليدية",
      nameFr: "Gandoura Homme Traditionnelle",
      slug: "gandoura-traditionnelle-homme",
      description: "Authentic Algerian traditional gandoura in premium cotton fabric.",
      descriptionAr: "قندورة جزائرية تقليدية أصيلة من قماش القطن الفاخر.",
      descriptionFr: "Gandoura traditionnelle algérienne authentique en tissu coton premium.",
      price: "3500",
      originalPrice: null,
      categoryId: catMap["clothing"],
      imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"],
      rating: "4.6",
      reviewCount: 89,
      stock: 200,
      isFeatured: true,
      isNew: false,
      badge: "تقليدي",
      specifications: { "المادة": "قطن 100%", "الحجم": "S-XXL", "اللون": "أبيض / كريمي" },
      tags: ["قندورة", "تقليدي", "رجالي"],
    },
    {
      name: "Women's Haik with Embroidery",
      nameAr: "حايك نسائي مطرز",
      nameFr: "Haïk Femme Brodé",
      slug: "haik-femme-brode",
      description: "Beautiful embroidered haik for women, made from high-quality silk blend.",
      descriptionAr: "حايك نسائي مطرز جميل مصنوع من خليط الحرير عالي الجودة.",
      descriptionFr: "Beau haïk brodé pour femmes en mélange soie haute qualité.",
      price: "7200",
      originalPrice: "9000",
      categoryId: catMap["clothing"],
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"],
      rating: "4.5",
      reviewCount: 67,
      stock: 50,
      isFeatured: false,
      isNew: true,
      badge: "جديد",
      specifications: { "المادة": "خليط حرير", "الحجم": "M-XL" },
      tags: ["حايك", "تقليدي", "نسائي"],
    },
    {
      name: "Slim Fit Men's Jeans",
      nameAr: "بنطلون جينز ضيق للرجال",
      nameFr: "Jean Slim Homme",
      slug: "jean-slim-homme",
      description: "Modern slim fit jeans in dark blue denim, comfortable for everyday wear.",
      descriptionAr: "بنطلون جينز ضيق حديث باللون الأزرق الداكن، مريح للارتداء اليومي.",
      descriptionFr: "Jean slim moderne en denim bleu foncé, confortable au quotidien.",
      price: "2800",
      originalPrice: null,
      categoryId: catMap["clothing"],
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"],
      rating: "4.2",
      reviewCount: 156,
      stock: 300,
      isFeatured: false,
      isNew: false,
      badge: null,
      specifications: { "المادة": "قطن دنيم 98%", "الحجم": "28-40" },
      tags: ["جينز", "رجالي", "ملابس"],
    },

    // Home & Furniture
    {
      name: "Traditional Berber Carpet",
      nameAr: "سجادة بربرية تقليدية",
      nameFr: "Tapis Berbère Traditionnel",
      slug: "tapis-berbere-traditionnel",
      description: "Handwoven authentic Berber carpet with traditional geometric patterns.",
      descriptionAr: "سجادة بربرية أصيلة منسوجة يدويًا بنقوش هندسية تقليدية.",
      descriptionFr: "Tapis berbère authentique tissé à la main avec motifs géométriques traditionnels.",
      price: "25000",
      originalPrice: "30000",
      categoryId: catMap["home-furniture"],
      imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80"],
      rating: "4.8",
      reviewCount: 43,
      stock: 15,
      isFeatured: true,
      isNew: false,
      badge: "يدوي الصنع",
      specifications: { "المقاس": "200x300 سم", "المادة": "صوف طبيعي", "الصنع": "يدوي" },
      tags: ["سجادة", "بربري", "تقليدي"],
    },
    {
      name: "Modern Sofa 3-Seater",
      nameAr: "أريكة حديثة 3 مقاعد",
      nameFr: "Canapé Moderne 3 Places",
      slug: "canape-moderne-3-places",
      description: "Comfortable 3-seater sofa in premium fabric, perfect for modern Algerian living rooms.",
      descriptionAr: "أريكة 3 مقاعد مريحة من القماش الفاخر، مثالية لغرف المعيشة الجزائرية الحديثة.",
      descriptionFr: "Canapé 3 places confortable en tissu premium, parfait pour les salons algériens modernes.",
      price: "85000",
      originalPrice: null,
      categoryId: catMap["home-furniture"],
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"],
      rating: "4.3",
      reviewCount: 28,
      stock: 10,
      isFeatured: false,
      isNew: true,
      badge: "جديد",
      specifications: { "المقاعد": "3", "المادة": "قماش فاخر", "الأبعاد": "220x90x85 سم" },
      tags: ["أريكة", "أثاث", "غرفة معيشة"],
    },

    // Beauty
    {
      name: "Argan Oil Hair Care Set",
      nameAr: "مجموعة العناية بالشعر بزيت الأرغان",
      nameFr: "Kit Soin Cheveux Huile d'Argan",
      slug: "argan-hair-care-set",
      description: "Complete Moroccan argan oil hair care set: shampoo, conditioner, and hair mask.",
      descriptionAr: "مجموعة العناية بالشعر بزيت الأرغان المغربي: شامبو وبلسم وقناع للشعر.",
      descriptionFr: "Kit complet soin cheveux à l'huile d'argan marocaine: shampoing, après-shampoing et masque.",
      price: "4500",
      originalPrice: "6000",
      categoryId: catMap["beauty"],
      imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80"],
      rating: "4.6",
      reviewCount: 203,
      stock: 80,
      isFeatured: true,
      isNew: false,
      badge: "الأكثر مبيعاً",
      specifications: { "المكونات": "زيت الأرغان الطبيعي", "الحجم": "3x250ml" },
      tags: ["شعر", "زيت أرغان", "عناية"],
    },
    {
      name: "Ghassoul Clay Facial Mask",
      nameAr: "قناع الوجه بالغاسول",
      nameFr: "Masque Visage Ghassoul",
      slug: "ghassoul-masque-visage",
      description: "Natural Moroccan ghassoul clay mask for deep pore cleansing and glowing skin.",
      descriptionAr: "قناع الغاسول الطيني الطبيعي لتنظيف المسام بعمق والحصول على بشرة مضيئة.",
      descriptionFr: "Masque argile ghassoul marocain naturel pour nettoyage profond des pores.",
      price: "1800",
      originalPrice: null,
      categoryId: catMap["beauty"],
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80"],
      rating: "4.4",
      reviewCount: 178,
      stock: 150,
      isFeatured: false,
      isNew: false,
      badge: "طبيعي",
      specifications: { "الوزن": "200 جرام", "النوع": "طيني طبيعي" },
      tags: ["قناع", "بشرة", "طبيعي"],
    },

    // Sports
    {
      name: "Football Ball Adidas",
      nameAr: "كرة قدم أديداس",
      nameFr: "Ballon Football Adidas",
      slug: "ballon-football-adidas",
      description: "Official size 5 football suitable for training and matches.",
      descriptionAr: "كرة قدم رسمية حجم 5 مناسبة للتدريب والمباريات.",
      descriptionFr: "Ballon de football taille 5 officiel pour entraînement et matchs.",
      price: "3200",
      originalPrice: "4500",
      categoryId: catMap["sports"],
      imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80"],
      rating: "4.5",
      reviewCount: 312,
      stock: 100,
      isFeatured: true,
      isNew: false,
      badge: "تخفيض",
      specifications: { "الحجم": "5", "المادة": "جلد صناعي" },
      tags: ["كرة قدم", "رياضة", "أديداس"],
    },
    {
      name: "Yoga Mat Premium",
      nameAr: "حصيرة يوغا بريميوم",
      nameFr: "Tapis de Yoga Premium",
      slug: "yoga-mat-premium",
      description: "Non-slip eco-friendly yoga mat with alignment lines, 6mm thickness.",
      descriptionAr: "حصيرة يوغا مضادة للانزلاق صديقة للبيئة مع خطوط المحاذاة، سماكة 6 مم.",
      descriptionFr: "Tapis de yoga antidérapant écologique avec lignes d'alignement, 6mm d'épaisseur.",
      price: "2500",
      originalPrice: null,
      categoryId: catMap["sports"],
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"],
      rating: "4.3",
      reviewCount: 145,
      stock: 60,
      isFeatured: false,
      isNew: true,
      badge: "جديد",
      specifications: { "السماكة": "6 مم", "المادة": "NBR", "الأبعاد": "183x61 سم" },
      tags: ["يوغا", "رياضة", "لياقة"],
    },

    // Kitchen
    {
      name: "Traditional Couscous Pot",
      nameAr: "قدر الكسكس التقليدي",
      nameFr: "Couscoussière Traditionnelle",
      slug: "couscoussiere-traditionnelle",
      description: "Authentic Algerian couscous pot, stainless steel, large family size.",
      descriptionAr: "قدر كسكس جزائري أصيل من الفولاذ المقاوم للصدأ، حجم عائلي كبير.",
      descriptionFr: "Couscoussière algérienne authentique en acier inoxydable, grande taille familiale.",
      price: "6500",
      originalPrice: null,
      categoryId: catMap["kitchen"],
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"],
      rating: "4.7",
      reviewCount: 267,
      stock: 45,
      isFeatured: true,
      isNew: false,
      badge: "مبيعات عالية",
      specifications: { "المادة": "فولاذ مقاوم للصدأ", "الحجم": "30 لتر", "طبقات": "2" },
      tags: ["كسكس", "مطبخ", "قدر"],
    },
    {
      name: "Electric Pressure Cooker 8L",
      nameAr: "طنجرة ضغط كهربائية 8 لتر",
      nameFr: "Autocuiseur Électrique 8L",
      slug: "autocuiseur-electrique-8l",
      description: "Smart electric pressure cooker with 12 cooking programs and safety features.",
      descriptionAr: "طنجرة ضغط كهربائية ذكية مع 12 برنامج طبخ وميزات أمان.",
      descriptionFr: "Autocuiseur électrique intelligent avec 12 programmes de cuisson et sécurité.",
      price: "14000",
      originalPrice: "18000",
      categoryId: catMap["kitchen"],
      imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80"],
      rating: "4.5",
      reviewCount: 189,
      stock: 30,
      isFeatured: false,
      isNew: false,
      badge: "تخفيض",
      specifications: { "السعة": "8 لتر", "البرامج": "12", "القدرة": "1000 واط" },
      tags: ["طنجرة ضغط", "مطبخ", "كهربائي"],
    },

    // Food
    {
      name: "Algerian Premium Dates 1kg",
      nameAr: "تمر جزائري فاخر 1 كيلو",
      nameFr: "Dattes Algériennes Premium 1kg",
      slug: "dattes-algeriennes-premium",
      description: "Premium Deglet Nour dates from Biskra, naturally sweet and fresh.",
      descriptionAr: "تمر دقلة نور الفاخر من بسكرة، حلو بشكل طبيعي وطازج.",
      descriptionFr: "Dattes Deglet Nour premium de Biskra, naturellement sucrées et fraîches.",
      price: "850",
      originalPrice: null,
      categoryId: catMap["food"],
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
      rating: "4.9",
      reviewCount: 678,
      stock: 500,
      isFeatured: true,
      isNew: false,
      badge: "جزائري 100%",
      specifications: { "الوزن": "1 كيلو", "النوع": "دقلة نور", "المنشأ": "بسكرة، الجزائر" },
      tags: ["تمر", "بسكرة", "غذاء جزائري"],
    },
    {
      name: "Organic Olive Oil 1L",
      nameAr: "زيت زيتون عضوي 1 لتر",
      nameFr: "Huile d'Olive Bio 1L",
      slug: "huile-olive-bio-1l",
      description: "Extra virgin olive oil from Kabylia, cold pressed, organic certified.",
      descriptionAr: "زيت زيتون بكر ممتاز من القبائل، معصور على البارد، معتمد عضوياً.",
      descriptionFr: "Huile d'olive vierge extra de Kabylie, pressée à froid, certifiée bio.",
      price: "1200",
      originalPrice: null,
      categoryId: catMap["food"],
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"],
      rating: "4.8",
      reviewCount: 445,
      stock: 300,
      isFeatured: true,
      isNew: false,
      badge: "عضوي",
      specifications: { "الحجم": "1 لتر", "النوع": "بكر ممتاز", "المنشأ": "القبائل، الجزائر" },
      tags: ["زيتون", "عضوي", "غذاء"],
    },

    // Toys & Baby
    {
      name: "LEGO Classic Building Set",
      nameAr: "مجموعة مكعبات ليغو الكلاسيكية",
      nameFr: "Set LEGO Classic",
      slug: "lego-classic-set",
      description: "LEGO Classic 500-piece building set for endless creative fun.",
      descriptionAr: "مجموعة مكعبات ليغو الكلاسيكية 500 قطعة للإبداع اللانهائي.",
      descriptionFr: "Set LEGO Classic 500 pièces pour un plaisir créatif sans fin.",
      price: "5500",
      originalPrice: "7000",
      categoryId: catMap["toys-baby"],
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
      rating: "4.7",
      reviewCount: 234,
      stock: 40,
      isFeatured: false,
      isNew: false,
      badge: "تخفيض",
      specifications: { "عدد القطع": "500", "العمر": "+5 سنوات" },
      tags: ["ليغو", "ألعاب", "أطفال"],
    },

    // Books
    {
      name: "Arabic Calligraphy Workbook",
      nameAr: "كتاب الخط العربي للتمارين",
      nameFr: "Cahier de Calligraphie Arabe",
      slug: "cahier-calligraphie-arabe",
      description: "Comprehensive Arabic calligraphy workbook for beginners to advanced.",
      descriptionAr: "كتاب شامل لتمارين الخط العربي من المبتدئين إلى المتقدمين.",
      descriptionFr: "Cahier complet de calligraphie arabe pour débutants à avancés.",
      price: "1500",
      originalPrice: null,
      categoryId: catMap["books"],
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80"],
      rating: "4.6",
      reviewCount: 89,
      stock: 75,
      isFeatured: false,
      isNew: true,
      badge: "جديد",
      specifications: { "الصفحات": "200", "المستوى": "مبتدئ - متقدم" },
      tags: ["خط عربي", "كتاب", "تعليم"],
    },

    // Auto
    {
      name: "Car Seat Cover Set",
      nameAr: "مجموعة أغطية مقاعد السيارة",
      nameFr: "Set Housses de Siège Auto",
      slug: "housses-siege-auto",
      description: "Universal fit seat covers in premium leather look for Algerian cars.",
      descriptionAr: "أغطية مقاعد ذات مقاس عالمي بمظهر جلدي فاخر لسيارات الجزائر.",
      descriptionFr: "Housses de siège universelles aspect cuir premium pour voitures algériennes.",
      price: "4800",
      originalPrice: "6500",
      categoryId: catMap["auto"],
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80",
      images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80"],
      rating: "4.2",
      reviewCount: 167,
      stock: 55,
      isFeatured: false,
      isNew: false,
      badge: "تخفيض",
      specifications: { "التوافق": "عالمي", "المادة": "جلد صناعي", "المقاعد": "كاملة" },
      tags: ["سيارة", "أغطية مقاعد", "سيارات"],
    },
  ];

  const existingProducts = seedMode === "bootstrap" ? await db.select().from(productsTable) : [];
  const existingProductSlugs = new Set(existingProducts.map((product) => product.slug));
  const missingProducts = products.filter((product) => !existingProductSlugs.has(product.slug));

  if (missingProducts.length > 0) {
    await db.insert(productsTable).values(missingProducts as any);
  }

  const availableProducts = await db.select().from(productsTable);
  if (seedMode === "reset") {
    console.log(`✅ Inserted ${availableProducts.length} products`);
  } else if (missingProducts.length > 0) {
    console.log(`✅ Inserted ${missingProducts.length} missing products`);
  } else {
    console.log(`⏭️ Skipped products; ${availableProducts.length} already present`);
  }

  // ─── Regions (Algerian Wilayas) ───────────────────────────────────
  const regionSeeds = [
    { code: "01", name: "Adrar", nameAr: "أدرار", nameFr: "Adrar", deliveryDays: 5, deliveryFee: "800" },
    { code: "02", name: "Chlef", nameAr: "الشلف", nameFr: "Chlef", deliveryDays: 3, deliveryFee: "450" },
    { code: "03", name: "Laghouat", nameAr: "الأغواط", nameFr: "Laghouat", deliveryDays: 4, deliveryFee: "600" },
    { code: "04", name: "Oum el Bouaghi", nameAr: "أم البواقي", nameFr: "Oum el Bouaghi", deliveryDays: 3, deliveryFee: "500" },
    { code: "05", name: "Batna", nameAr: "باتنة", nameFr: "Batna", deliveryDays: 3, deliveryFee: "500" },
    { code: "06", name: "Béjaïa", nameAr: "بجاية", nameFr: "Béjaïa", deliveryDays: 2, deliveryFee: "400" },
    { code: "07", name: "Biskra", nameAr: "بسكرة", nameFr: "Biskra", deliveryDays: 4, deliveryFee: "550" },
    { code: "08", name: "Béchar", nameAr: "بشار", nameFr: "Béchar", deliveryDays: 5, deliveryFee: "800" },
    { code: "09", name: "Blida", nameAr: "البليدة", nameFr: "Blida", deliveryDays: 1, deliveryFee: "350" },
    { code: "10", name: "Bouira", nameAr: "البويرة", nameFr: "Bouira", deliveryDays: 2, deliveryFee: "400" },
    { code: "11", name: "Tamanrasset", nameAr: "تمنراست", nameFr: "Tamanrasset", deliveryDays: 7, deliveryFee: "1200" },
    { code: "12", name: "Tébessa", nameAr: "تبسة", nameFr: "Tébessa", deliveryDays: 3, deliveryFee: "550" },
    { code: "13", name: "Tlemcen", nameAr: "تلمسان", nameFr: "Tlemcen", deliveryDays: 3, deliveryFee: "500" },
    { code: "14", name: "Tiaret", nameAr: "تيارت", nameFr: "Tiaret", deliveryDays: 3, deliveryFee: "500" },
    { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", deliveryDays: 2, deliveryFee: "400" },
    { code: "16", name: "Algiers", nameAr: "الجزائر العاصمة", nameFr: "Alger", deliveryDays: 1, deliveryFee: "300" },
    { code: "17", name: "Djelfa", nameAr: "الجلفة", nameFr: "Djelfa", deliveryDays: 3, deliveryFee: "500" },
    { code: "18", name: "Jijel", nameAr: "جيجل", nameFr: "Jijel", deliveryDays: 3, deliveryFee: "450" },
    { code: "19", name: "Sétif", nameAr: "سطيف", nameFr: "Sétif", deliveryDays: 2, deliveryFee: "450" },
    { code: "20", name: "Saïda", nameAr: "سعيدة", nameFr: "Saïda", deliveryDays: 3, deliveryFee: "500" },
    { code: "21", name: "Skikda", nameAr: "سكيكدة", nameFr: "Skikda", deliveryDays: 3, deliveryFee: "500" },
    { code: "22", name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", deliveryDays: 3, deliveryFee: "500" },
    { code: "23", name: "Annaba", nameAr: "عنابة", nameFr: "Annaba", deliveryDays: 2, deliveryFee: "450" },
    { code: "24", name: "Guelma", nameAr: "قالمة", nameFr: "Guelma", deliveryDays: 3, deliveryFee: "500" },
    { code: "25", name: "Constantine", nameAr: "قسنطينة", nameFr: "Constantine", deliveryDays: 2, deliveryFee: "450" },
    { code: "26", name: "Médéa", nameAr: "المدية", nameFr: "Médéa", deliveryDays: 2, deliveryFee: "400" },
    { code: "27", name: "Mostaganem", nameAr: "مستغانم", nameFr: "Mostaganem", deliveryDays: 3, deliveryFee: "500" },
    { code: "28", name: "M'Sila", nameAr: "المسيلة", nameFr: "M'Sila", deliveryDays: 3, deliveryFee: "500" },
    { code: "29", name: "Mascara", nameAr: "معسكر", nameFr: "Mascara", deliveryDays: 3, deliveryFee: "500" },
    { code: "30", name: "Ouargla", nameAr: "ورقلة", nameFr: "Ouargla", deliveryDays: 4, deliveryFee: "650" },
    { code: "31", name: "Oran", nameAr: "وهران", nameFr: "Oran", deliveryDays: 2, deliveryFee: "400" },
    { code: "32", name: "El Bayadh", nameAr: "البيض", nameFr: "El Bayadh", deliveryDays: 4, deliveryFee: "650" },
    { code: "33", name: "Illizi", nameAr: "إليزي", nameFr: "Illizi", deliveryDays: 7, deliveryFee: "1200" },
    { code: "34", name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj", deliveryDays: 2, deliveryFee: "400" },
    { code: "35", name: "Boumerdès", nameAr: "بومرداس", nameFr: "Boumerdès", deliveryDays: 1, deliveryFee: "350" },
    { code: "36", name: "El Tarf", nameAr: "الطارف", nameFr: "El Tarf", deliveryDays: 3, deliveryFee: "500" },
    { code: "37", name: "Tindouf", nameAr: "تندوف", nameFr: "Tindouf", deliveryDays: 7, deliveryFee: "1200" },
    { code: "38", name: "Tissemsilt", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", deliveryDays: 3, deliveryFee: "500" },
    { code: "39", name: "El Oued", nameAr: "الوادي", nameFr: "El Oued", deliveryDays: 4, deliveryFee: "600" },
    { code: "40", name: "Khenchela", nameAr: "خنشلة", nameFr: "Khenchela", deliveryDays: 3, deliveryFee: "550" },
    { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس", nameFr: "Souk Ahras", deliveryDays: 3, deliveryFee: "550" },
    { code: "42", name: "Tipaza", nameAr: "تيبازة", nameFr: "Tipaza", deliveryDays: 1, deliveryFee: "350" },
    { code: "43", name: "Mila", nameAr: "ميلة", nameFr: "Mila", deliveryDays: 3, deliveryFee: "500" },
    { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى", nameFr: "Aïn Defla", deliveryDays: 2, deliveryFee: "400" },
    { code: "45", name: "Naâma", nameAr: "النعامة", nameFr: "Naâma", deliveryDays: 4, deliveryFee: "650" },
    { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", deliveryDays: 3, deliveryFee: "500" },
    { code: "47", name: "Ghardaïa", nameAr: "غرداية", nameFr: "Ghardaïa", deliveryDays: 4, deliveryFee: "650" },
    { code: "48", name: "Relizane", nameAr: "غليزان", nameFr: "Relizane", deliveryDays: 3, deliveryFee: "500" },
    { code: "49", name: "Timimoun", nameAr: "تيميمون", nameFr: "Timimoun", deliveryDays: 6, deliveryFee: "1000" },
    { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", deliveryDays: 7, deliveryFee: "1200" },
    { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", deliveryDays: 4, deliveryFee: "600" },
    { code: "52", name: "Béni Abbès", nameAr: "بني عباس", nameFr: "Béni Abbès", deliveryDays: 6, deliveryFee: "1000" },
    { code: "53", name: "In Salah", nameAr: "عين صالح", nameFr: "In Salah", deliveryDays: 7, deliveryFee: "1200" },
    { code: "54", name: "In Guezzam", nameAr: "عين قزام", nameFr: "In Guezzam", deliveryDays: 7, deliveryFee: "1200" },
    { code: "55", name: "Touggourt", nameAr: "تقرت", nameFr: "Touggourt", deliveryDays: 4, deliveryFee: "600" },
    { code: "56", name: "Djanet", nameAr: "جانت", nameFr: "Djanet", deliveryDays: 7, deliveryFee: "1200" },
    { code: "57", name: "El M'Ghair", nameAr: "المغير", nameFr: "El M'Ghair", deliveryDays: 4, deliveryFee: "600" },
    { code: "58", name: "El Meniaa", nameAr: "المنيعة", nameFr: "El Meniaa", deliveryDays: 6, deliveryFee: "1000" },
  ];

  const existingRegions = seedMode === "bootstrap" ? await db.select().from(regionsTable) : [];
  const existingRegionCodes = new Set(existingRegions.map((region) => region.code));
  const missingRegions = regionSeeds.filter((region) => !existingRegionCodes.has(region.code));

  if (missingRegions.length > 0) {
    await db.insert(regionsTable).values(missingRegions);
  }

  const availableRegions = await db.select().from(regionsTable);
  if (seedMode === "reset") {
    console.log(`✅ Inserted ${availableRegions.length} regions`);
  } else if (missingRegions.length > 0) {
    console.log(`✅ Inserted ${missingRegions.length} missing regions`);
  } else {
    console.log(`⏭️ Skipped regions; ${availableRegions.length} already present`);
  }

  // Cities for major wilayas
  const algiersCities = [
    { name: "Algiers Center", nameAr: "وسط الجزائر العاصمة", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Bab El Oued", nameAr: "باب الوادي", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Kouba", nameAr: "القبة", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Birkhadem", nameAr: "بئر خادم", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Hussein Dey", nameAr: "حسين داي", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "El Harrach", nameAr: "الحراش", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Bachdjerrah", nameAr: "باش جراح", regionId: availableRegions.find(r => r.code === "16")!.id },
    { name: "Sidi M'Hamed", nameAr: "سيدي محمد", regionId: availableRegions.find(r => r.code === "16")!.id },
  ];

  const oranCities = [
    { name: "Oran", nameAr: "وهران", regionId: availableRegions.find(r => r.code === "31")!.id },
    { name: "Es Sénia", nameAr: "السانية", regionId: availableRegions.find(r => r.code === "31")!.id },
    { name: "Bir El Djir", nameAr: "بئر الجير", regionId: availableRegions.find(r => r.code === "31")!.id },
    { name: "Arzew", nameAr: "أرزيو", regionId: availableRegions.find(r => r.code === "31")!.id },
  ];

  const constCities = [
    { name: "Constantine", nameAr: "قسنطينة", regionId: availableRegions.find(r => r.code === "25")!.id },
    { name: "El Khroub", nameAr: "الخروب", regionId: availableRegions.find(r => r.code === "25")!.id },
    { name: "Hamma Bouziane", nameAr: "حامة بوزيان", regionId: availableRegions.find(r => r.code === "25")!.id },
  ];

  const citySeeds = [...algiersCities, ...oranCities, ...constCities];
  const existingCities = seedMode === "bootstrap" ? await db.select().from(citiesTable) : [];
  const existingCityKeys = new Set(existingCities.map((city) => `${city.regionId}:${city.name}`));
  const missingCities = citySeeds.filter((city) => !existingCityKeys.has(`${city.regionId}:${city.name}`));

  if (missingCities.length > 0) {
    await db.insert(citiesTable).values(missingCities);
  }

  const availableCities = await db.select().from(citiesTable);
  if (seedMode === "reset") {
    console.log(`✅ Inserted ${availableCities.length} cities`);
  } else if (missingCities.length > 0) {
    console.log(`✅ Inserted ${missingCities.length} missing cities`);
  } else {
    console.log(`⏭️ Skipped cities; ${availableCities.length} already present`);
  }

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
