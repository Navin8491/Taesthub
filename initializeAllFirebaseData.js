import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc,
  collection
} from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// Load environmental variables in Node environment
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

// Check configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Connecting to Firebase Project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Data Definitions
const categoriesData = [
  { categoryId: "burger", name: "Burger", image: "/images/f2.png", description: "Gourmet burgers with premium beef and fresh toppings." },
  { categoryId: "pizza", name: "Pizza", image: "/images/f1.png", description: "Wood-fired artisanal pizzas with fresh mozzarella and tomato sauce." },
  { categoryId: "pasta", name: "Pasta", image: "/images/f4.png", description: "Freshly made artisanal pastas with delicious signature sauces." },
  { categoryId: "fries", name: "Fries", image: "/images/f5.png", description: "Crispy rosemary seasoned side fries." }
];

const productsData = [
  { productId: "p1", name: "Delicious Pizza", categoryId: "pizza", price: 20, description: "Premium mozzarella, fresh basil, and our signature tomato sauce on a hand-tossed crust.", image: "/images/f1.png", isAvailable: true, isFeatured: true },
  { productId: "p2", name: "Delicious Burger", categoryId: "burger", price: 15, description: "Wagyu beef patty with caramelized onions, cheddar cheese, and house sauce on a brioche bun.", image: "/images/f2.png", isAvailable: true, isFeatured: true },
  { productId: "p3", name: "Delicious Pizza", categoryId: "pizza", price: 17, description: "Wood-fired pizza topped with spicy pepperoni, jalapenos, and a drizzle of hot honey.", image: "/images/f3.png", isAvailable: true, isFeatured: true },
  { productId: "p4", name: "Delicious Pasta", categoryId: "pasta", price: 18, description: "Handmade fettuccine tossed in a rich, creamy truffle alfredo sauce with shaved parmesan.", image: "/images/f4.png", isAvailable: true, isFeatured: true },
  { productId: "p5", name: "French Fries", categoryId: "fries", price: 10, description: "Crispy golden fries seasoned with sea salt and rosemary, served with garlic aioli.", image: "/images/f5.png", isAvailable: true, isFeatured: true },
  { productId: "p6", name: "Delicious Pizza", categoryId: "pizza", price: 15, description: "Classic Margherita pizza with fresh heirloom tomatoes, basil, and a balsamic glaze.", image: "/images/f6.png", isAvailable: true, isFeatured: true },
  { productId: "p7", name: "Tasty Burger", categoryId: "burger", price: 12, description: "Crispy fried chicken sandwich with spicy mayo, pickles, and crisp lettuce.", image: "/images/f7.png", isAvailable: true, isFeatured: true },
  { productId: "p8", name: "Tasty Burger", categoryId: "burger", price: 14, description: "Double smash burger with American cheese, pickles, and our secret house spread.", image: "/images/f8.png", isAvailable: true, isFeatured: true },
  { productId: "p9", name: "Delicious Pasta", categoryId: "pasta", price: 10, description: "Spaghetti tossed in a vibrant basil pesto with pine nuts and cherry tomatoes.", image: "/images/f9.png", isAvailable: true, isFeatured: true }
];

const reviewsData = [
  { reviewId: "rev1", userId: null, name: "Moana Michell", subtitle: "Food Enthusiast", rating: 5, text: "The flavors here are absolutely incredible. Every dish feels like a work of art. The atmosphere is warm and the service is truly exceptional. I highly recommend the premium pasta!", image: "/images/client1.jpg" },
  { reviewId: "rev2", userId: null, name: "Mike Hamell", subtitle: "Local Guide", rating: 5, text: "I've been to many cafes, but TasteHub stands out. The coffee is roasted to perfection and their signature burgers are bursting with flavor. A must-visit spot in the city.", image: "/images/client2.jpg" },
  { reviewId: "rev3", userId: null, name: "John Doe", subtitle: "Coffee Connoisseur", rating: 4, text: "Stunning interior and beautifully presented food. The caramel latte is to die for. It can get a bit busy during lunch, but the quality never dips. Excellent experience overall.", image: "/images/client1.jpg" },
  { reviewId: "rev4", userId: null, name: "Jane Smith", subtitle: "Pastry Chef", rating: 5, text: "As someone who bakes professionally, I am blown away by their artisan pizzas. The crust is perfectly fermented and charred. Absolutely delicious and perfectly balanced.", image: "/images/client2.jpg" }
];

async function seed() {
  const email = "john.doe@example.com";
  const password = "password123";
  let uid = null;

  console.log("Authenticating user...");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    uid = userCredential.user.uid;
    console.log("Authenticated existing user with UID:", uid);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        console.log("Created test user with UID:", uid);
      } catch (createError) {
        console.error("Failed to create user:", createError);
        process.exit(1);
      }
    } else {
      console.error("Auth error:", error);
      process.exit(1);
    }
  }

  // 1. Seed Categories
  console.log("Seeding categories...");
  for (const category of categoriesData) {
    await setDoc(doc(db, "categories", category.categoryId), category);
  }
  console.log("Seeding categories complete.");

  // 2. Seed Products
  console.log("Seeding products...");
  for (const product of productsData) {
    await setDoc(doc(db, "products", product.productId), {
      ...product,
      createdAt: new Date().toISOString()
    });
  }
  console.log("Seeding products complete.");

  // 3. Seed Reviews
  console.log("Seeding reviews...");
  for (const review of reviewsData) {
    await setDoc(doc(db, "reviews", review.reviewId), {
      ...review,
      createdAt: new Date().toISOString()
    });
  }
  console.log("Seeding reviews complete.");

  // 4. Seed User
  console.log("Seeding users collection...");
  const userData = {
    uid: uid,
    name: "John Doe",
    email: email,
    phone: "+1 (555) 123-4567",
    photoURL: null,
    role: "customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, "users", uid), userData);
  console.log("Seeding user complete.");

  // 5. Seed Address
  console.log("Seeding addresses collection...");
  const addressId = "addr-john-1";
  const addressData = {
    addressId: addressId,
    userId: uid,
    address: "123 Coffee Lane",
    city: "Brew City",
    state: "BC",
    pincode: "12345",
    country: "USA"
  };
  await setDoc(doc(db, "addresses", addressId), addressData);
  console.log("Seeding address complete.");

  // 6. Seed Split Orders & Order Items
  console.log("Seeding orders & order_items...");
  const orderId = "ORD-92813";
  const orderHeader = {
    orderId: orderId,
    userId: uid,
    totalAmount: 45.00,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    createdAt: new Date().toISOString(),
    billingDetails: {
      firstName: "John",
      lastName: "Doe",
      email: email,
      phone: "+1 (555) 123-4567",
      address: "123 Coffee Lane, Brew City, BC 12345"
    }
  };
  
  const orderItemsData = [
    { orderItemId: "oi-1", orderId: orderId, productId: "p1", quantity: 2, price: 20 },
    { orderItemId: "oi-2", orderId: orderId, productId: "p5", quantity: 1, price: 5 }
  ];

  await setDoc(doc(db, "orders", orderId), orderHeader);
  for (const item of orderItemsData) {
    await setDoc(doc(db, "order_items", item.orderItemId), item);
  }
  console.log("Seeding orders & order_items complete.");

  // 7. Seed Table Booking
  console.log("Seeding bookings...");
  const bookingId = "book-john-1";
  const bookingData = {
    bookingId: bookingId,
    userId: uid,
    customerName: "John Doe",
    phone: "+1 (555) 123-4567",
    bookingDate: "2026-06-25",
    bookingTime: "19:00",
    guests: "4 Persons",
    status: "Confirmed"
  };
  await setDoc(doc(db, "bookings", bookingId), bookingData);
  console.log("Seeding bookings complete.");

  // 8. Seed Contact Message
  console.log("Seeding contact_messages...");
  const messageId = "msg-1";
  const messageData = {
    messageId: messageId,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 987-6543",
    subject: "Gourmet Catering Query",
    message: "Hello, I would like to inquire about hosting a birthday dinner at your lounge. Please get back to me.",
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, "contact_messages", messageId), messageData);
  console.log("Seeding contact messages complete.");

  // 9. Seed Newsletter Subscriber
  console.log("Seeding newsletter_subscribers...");
  const subscriberEmail = "john.doe@example.com";
  const subscriberData = {
    email: subscriberEmail,
    subscribedAt: new Date().toISOString()
  };
  await setDoc(doc(db, "newsletter_subscribers", subscriberEmail), subscriberData);
  console.log("Seeding newsletter subscribers complete.");

  console.log("\nDatabase audit seeding successfully completed!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
