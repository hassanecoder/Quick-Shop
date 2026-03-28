import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "QuickDz": "كويك ديزاد",
      "Home": "الرئيسية",
      "Products": "المنتجات",
      "Categories": "الأقسام",
      "Cart": "عربة التسوق",
      "Search...": "ابحث عن منتجات...",
      "Add to Cart": "أضف للسلة",
      "Buy Now": "اشتري الآن",
      "Instant Order": "طلب فوري",
      "Featured Products": "منتجات مميزة",
      "Shop by Category": "تسوق حسب القسم",
      "New Arrivals": "وصل حديثاً",
      "Price": "السعر",
      "DA": "د.ج",
      "Total": "المجموع",
      "Checkout": "الدفع",
      "Your cart is empty": "عربة التسوق فارغة",
      "Continue Shopping": "مواصلة التسوق",
      "Delivery Info": "معلومات التوصيل",
      "Wilaya": "الولاية",
      "City": "البلدية",
      "Full Name": "الاسم الكامل",
      "Phone Number": "رقم الهاتف",
      "Address": "العنوان (اختياري)",
      "Order Summary": "ملخص الطلب",
      "Place Order": "تأكيد الطلب",
      "Sign In": "تسجيل الدخول",
      "Sign Up": "إنشاء حساب",
      "Email": "البريد الإلكتروني",
      "Password": "كلمة المرور",
      "Language": "اللغة",
      "Theme": "المظهر",
      "Favorites": "المفضلة",
      "No favorites yet": "لا توجد منتجات مفضلة",
      "Delivery": "توصيل 58 ولاية",
      "Payment": "الدفع عند الاستلام",
      "Support": "دعم 24/7",
      "Related Products": "منتجات ذات صلة"
    }
  },
  fr: {
    translation: {
      "QuickDz": "QuickDz",
      "Home": "Accueil",
      "Products": "Produits",
      "Categories": "Catégories",
      "Cart": "Panier",
      "Search...": "Rechercher...",
      "Add to Cart": "Ajouter au panier",
      "Buy Now": "Acheter",
      "Instant Order": "Commande rapide",
      "Featured Products": "Produits en vedette",
      "Shop by Category": "Parcourir par catégorie",
      "New Arrivals": "Nouveautés",
      "Price": "Prix",
      "DA": "DA",
      "Total": "Total",
      "Checkout": "Paiement",
      "Your cart is empty": "Votre panier est vide",
      "Continue Shopping": "Continuer les achats",
      "Delivery Info": "Infos de livraison",
      "Wilaya": "Wilaya",
      "City": "Commune",
      "Full Name": "Nom complet",
      "Phone Number": "Numéro de téléphone",
      "Address": "Adresse (optionnel)",
      "Order Summary": "Résumé",
      "Place Order": "Confirmer la commande",
      "Sign In": "Se connecter",
      "Sign Up": "S'inscrire",
      "Email": "E-mail",
      "Password": "Mot de passe",
      "Language": "Langue",
      "Theme": "Thème",
      "Favorites": "Favoris",
      "No favorites yet": "Aucun favori",
      "Delivery": "Livraison 58 wilayas",
      "Payment": "Paiement à la livraison",
      "Support": "Support 24/7",
      "Related Products": "Produits similaires"
    }
  },
  en: {
    translation: {
      "QuickDz": "QuickDz",
      "Home": "Home",
      "Products": "Products",
      "Categories": "Categories",
      "Cart": "Cart",
      "Search...": "Search products...",
      "Add to Cart": "Add to Cart",
      "Buy Now": "Buy Now",
      "Instant Order": "Instant Order",
      "Featured Products": "Featured Products",
      "Shop by Category": "Shop by Category",
      "New Arrivals": "New Arrivals",
      "Price": "Price",
      "DA": "DA",
      "Total": "Total",
      "Checkout": "Checkout",
      "Your cart is empty": "Your cart is empty",
      "Continue Shopping": "Continue Shopping",
      "Delivery Info": "Delivery Info",
      "Wilaya": "Wilaya",
      "City": "City",
      "Full Name": "Full Name",
      "Phone Number": "Phone Number",
      "Address": "Address (optional)",
      "Order Summary": "Order Summary",
      "Place Order": "Place Order",
      "Sign In": "Sign In",
      "Sign Up": "Sign Up",
      "Email": "Email",
      "Password": "Password",
      "Language": "Language",
      "Theme": "Theme",
      "Favorites": "Favorites",
      "No favorites yet": "No favorites yet",
      "Delivery": "58 Wilayas Delivery",
      "Payment": "Cash on Delivery",
      "Support": "24/7 Support",
      "Related Products": "Related Products"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
