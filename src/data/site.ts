export type SocialLink = {
  label: "Facebook" | "Instagram";
  href: string;
};

export type OpeningHours = {
  label: string;
  value: string;
  schemaDays: string[];
  opens: string;
  closes: string;
};

export type MenuCategory = "Coffee" | "Non-coffee" | "Matcha" | "Palamig" | "Tinapay";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  bestseller?: boolean;
  available: boolean;
};

export const siteInfo = {
  name: "Sta. Cruz Coffee Spot",
  shortName: "Sta. Cruz",
  tagline: "Coffee & Convos",
  description:
    "Coffee, matcha, and snacks at 2115 Dapitan St. in Sampaloc, Manila.",
  phoneDisplay: "0915 128 7026",
  phoneHref: "+639151287026",
  email: "stacruzcoffeespot@gmail.com",
  address: "2115 Dapitan St., Sampaloc, Manila",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=2115%20Dapitan%20St.%2C%20Sampaloc%2C%20Manila",
  socialLinks: [
    {
      label: "Facebook",
      href: "https://web.facebook.com/p/Sta-Cruz-Coffee-Spot-61577054203266/",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/sta.cruzcoffee/",
    },
  ] satisfies SocialLink[],
} as const;

export const openingHours: OpeningHours[] = [
  {
    label: "Monday–Friday",
    value: "10:00 AM–10:00 PM",
    schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "22:00",
  },
  {
    label: "Saturday",
    value: "11:00 AM–10:00 PM",
    schemaDays: ["Saturday"],
    opens: "11:00",
    closes: "22:00",
  },
  {
    label: "Sunday",
    value: "2:00 PM–10:00 PM",
    schemaDays: ["Sunday"],
    opens: "14:00",
    closes: "22:00",
  },
];

export const menuCategories: MenuCategory[] = [
  "Coffee",
  "Non-coffee",
  "Matcha",
  "Palamig",
  "Tinapay",
];

// Transcribed from the menu photo supplied by the owner on 2026-09-23.
// Update prices here when the printed menu changes.
export const menuItems: MenuItem[] = [
  { name: "Espresso", description: "A small, concentrated coffee shot.", price: "₱100", category: "Coffee", available: true },
  { name: "Americano", description: "Espresso lengthened with water.", price: "₱130", category: "Coffee", available: true },
  { name: "Cafe Latte", description: "Espresso softened with milk.", price: "₱150", category: "Coffee", available: true },
  { name: "Cafe Mocha", description: "A latte with chocolate flavor.", price: "₱160", category: "Coffee", available: true },
  { name: "Spanish Latte", description: "A sweet, creamy take on the latte.", price: "₱160", category: "Coffee", bestseller: true, available: true },
  { name: "Caramel Latte", description: "A latte with caramel sweetness.", price: "₱160", category: "Coffee", bestseller: true, available: true },
  { name: "Orange Americano", description: "An Americano with an orange twist.", price: "₱170", category: "Coffee", available: true },
  { name: "Coffee Tonic", description: "Espresso with bittersweet tonic.", price: "₱180", category: "Coffee", available: true },
  { name: "Coffee Soda", description: "Espresso with unsweetened soda water.", price: "₱170", category: "Coffee", available: true },
  { name: "Coffee Cola", description: "A coffee-and-cola combination.", price: "₱170", category: "Coffee", available: true },
  { name: "Childhood Cereal Latte", description: "A latte with Nestlé Trix cereal.", price: "₱200", category: "Coffee", available: true },
  { name: "Chocnut Latte", description: "A latte with Chocnut flavor.", price: "₱170", category: "Coffee", available: true },
  { name: "Honeyspresso", description: "An espresso drink with honey.", price: "₱180", category: "Coffee", available: true },
  { name: "Affogato", description: "Vanilla ice cream with a shot of espresso.", price: "₱160", category: "Coffee", available: true },
  { name: "Ube-spresso Oat Latte", description: "An ube, espresso, and oat milk latte.", price: "₱210", category: "Coffee", available: true },

  { name: "Chocolate Milk", description: "Chocolate and milk, without coffee.", price: "₱160", category: "Non-coffee", available: true },
  { name: "Chocolate Oat Milk", description: "Chocolate with oat milk, without coffee.", price: "₱200", category: "Non-coffee", available: true },
  { name: "Tablea Hot Chocolate", description: "Hot chocolate made with tablea.", price: "₱190", category: "Non-coffee", available: true },
  { name: "Choco-Strawberry", description: "Chocolate with strawberry flavor.", price: "₱170", category: "Non-coffee", available: true },
  { name: "Choco-Banana", description: "Chocolate with banana flavor.", price: "₱170", category: "Non-coffee", available: true },
  { name: "Ube-Oat Latte", description: "An ube latte made with oat milk.", price: "₱180", category: "Non-coffee", available: true },
  { name: "Tsa-a", description: "Tea options include lemon-ginger, peppermint, and chamomile.", price: "₱120", category: "Non-coffee", available: true },

  { name: "Matcha Latte", description: "Matcha served as a creamy latte.", price: "₱170", category: "Matcha", bestseller: true, available: true },
  { name: "Caramel-Matcha", description: "Matcha with caramel flavor.", price: "₱180", category: "Matcha", available: true },
  { name: "Chocolate-Matcha", description: "Matcha with chocolate flavor.", price: "₱180", category: "Matcha", available: true },
  { name: "Banana-Matcha", description: "Matcha with banana flavor.", price: "₱180", category: "Matcha", available: true },
  { name: "Strawberry-Matcha", description: "Matcha with strawberry flavor.", price: "₱180", category: "Matcha", available: true },
  { name: "Dirty Matcha", description: "Matcha with a shot of espresso.", price: "₱190", category: "Matcha", available: true },
  { name: "Matcha Affogato", description: "A matcha take on affogato.", price: "₱160", category: "Matcha", available: true },

  { name: "Lemon-Honey Soda", description: "A fizzy lemon-and-honey drink.", price: "₱160", category: "Palamig", available: true },
  { name: "Kalamansi-Honey Soda", description: "A fizzy kalamansi-and-honey drink.", price: "₱160", category: "Palamig", available: true },
  { name: "Strawberry Soda", description: "A bright, fizzy strawberry drink.", price: "₱170", category: "Palamig", available: true },
  { name: "Grapefruit Soda", description: "A bright, fizzy grapefruit drink.", price: "₱170", category: "Palamig", available: true },
  { name: "Vanilla Ice Cream", description: "Vanilla ice cream with a choice of choco, caramel, strawberry, or ube.", price: "₱80", category: "Palamig", available: true },

  { name: "Pan de Espanol", description: "A sweet bread for your coffee break.", price: "₱55", category: "Tinapay", available: true },
  { name: "Pan de Ube-Keso", description: "Bread with ube and cheese.", price: "₱55", category: "Tinapay", available: true },
  { name: "Toasted Pan De Coco (2 pcs.)", description: "Two pieces of toasted coconut bread.", price: "₱60", category: "Tinapay", available: true },
  { name: "Choco-Banana Loaf", description: "Chocolate-banana loaf for merienda.", price: "₱60", category: "Tinapay", available: true },
  { name: "Tsokolate-Lava", description: "A chocolate dessert for merienda.", price: "₱130", category: "Tinapay", available: true },
  { name: "Open-faced Sourdough Toast — Egg Salad", description: "Egg salad on sourdough toast, served with chips.", price: "₱95", category: "Tinapay", available: true },
  { name: "Open-faced Sourdough Toast — Tuna & Egg Salad", description: "Tuna and egg salad on sourdough toast, served with chips.", price: "₱105", category: "Tinapay", available: true },
];

export const story = {
  eyebrow: "Our story",
  heading: "Coffee on Dapitan Street.",
  paragraphs: [
    "Sta. Cruz Coffee Spot is at 2115 Dapitan St. in Sampaloc. Drop in for coffee, matcha, or a snack.",
    "Bring a friend or stop in on your own. Tara, kape tayo.",
  ],
} as const;
