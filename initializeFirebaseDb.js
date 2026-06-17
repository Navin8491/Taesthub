import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// Simple parser for .env file to load Firebase credentials in Node
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

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Configuring Firebase with Project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = "john.doe@example.com";
  const password = "password123";
  let uid = null;

  console.log("Checking / authenticating user...");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    uid = userCredential.user.uid;
    console.log("Signed in existing user with UID:", uid);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      console.log("User not found or credentials mismatched, attempting to create new user...");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
        console.log("Successfully created user with UID:", uid);
      } catch (createError) {
        console.error("Failed to create user:", createError);
        process.exit(1);
      }
    } else {
      console.error("Authentication error:", error);
      process.exit(1);
    }
  }

  if (!uid) {
    console.error("No UID resolved.");
    process.exit(1);
  }

  // 1. Seed profiles collection
  console.log("Seeding profiles collection...");
  const profileData = {
    email: email,
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Coffee Lane, Brew City, BC 12345",
    profilePic: null,
    rewardPoints: 340,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "profiles", uid), profileData);
    console.log("Profile document written successfully!");
  } catch (err) {
    console.error("Error writing profile:", err);
    process.exit(1);
  }

  // 2. Seed orders collection
  console.log("Seeding orders collection...");
  const orderId = "ORD-92813";
  const orderData = {
    id: orderId,
    userId: uid,
    email: email,
    date: new Date().toISOString(),
    total: 45.0,
    status: "Delivered",
    billingDetails: {
      firstName: "John",
      lastName: "Doe",
      email: email,
      phone: "+1 (555) 123-4567",
      address: "123 Coffee Lane, Brew City, BC 12345"
    },
    items: [
      {
        id: 1,
        name: "Delicious Pizza",
        category: "pizza",
        price: 20,
        quantity: 2,
        image: "/images/f1.png"
      },
      {
        id: 5,
        name: "French Fries",
        category: "fries",
        price: 5,
        quantity: 1,
        image: "/images/f5.png"
      }
    ]
  };

  try {
    await setDoc(doc(db, "orders", orderId), orderData);
    console.log("Order document written successfully!");
    console.log("Firebase Database initialization completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error writing order:", err);
    process.exit(1);
  }
}

run();
