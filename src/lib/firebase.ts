
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  type User,
  type UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged, // Renamed to avoid conflict
  updateProfile
} from "firebase/auth";
import { getFirestore, type Firestore, collection, addDoc, getDocs, serverTimestamp, Timestamp } from "firebase/firestore"; // Added Firestore imports
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL, type FirebaseStorage, type UploadTaskSnapshot } from "firebase/storage";
import type { InventoryItem } from "@/types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// --- DEBUGGING LOG ---
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config Loaded by App:', firebaseConfig);
}
if (!firebaseConfig.apiKey && process.env.NODE_ENV === 'development') {
  console.error("CRITICAL: Firebase API Key is missing. Check your .env.local file and ensure the Next.js server was restarted.");
}
// --- END DEBUGGING LOG ---

let app: FirebaseApp;
let auth: Auth;
let db: Firestore; // Added db
let storage: FirebaseStorage;

if (!getApps().length) {
  if (!firebaseConfig.apiKey) {
    // Error is logged above.
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app); // Initialize Firestore
storage = getStorage(app);

// Export the User type from firebase/auth
export type { User };

// Authentication functions
const doSignInWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, pass);
};

const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

const doCreateUserWithEmailAndPassword = async (email: string, pass: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

const doSignOut = async (): Promise<void> => {
  return signOut(auth);
};

const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Storage functions
const uploadProfileImage = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileRef = storageRef(storage, `users/${userId}/profile-${Date.now()}-${file.name}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file, {
      customMetadata: {
        uploadedBy: userId,
        entityType: "profile",
        timestamp: new Date().toISOString(),
      }
    });

    uploadTask.on('state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (process.env.NODE_ENV === 'development') {
          // console.log('Upload is ' + progress + '% done');
        }
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        if (process.env.NODE_ENV === 'development') {
          // console.error("Upload failed:", error);
        }
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, { photoURL: downloadURL });
          }
          resolve(downloadURL);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            // console.error("Error getting download URL or updating profile:", error);
          }
          reject(error);
        }
      }
    );
  });
};

const uploadBusinessImage = async (
  userId: string,
  imageType: 'banner' | 'logo',
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const fileName = `${imageType}-${Date.now()}-${file.name}`;
  const fileRef = storageRef(storage, `businesses/${userId}/${imageType}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file, {
      customMetadata: {
        uploadedBy: userId,
        entityType: "businessPortfolio",
        imageType: imageType,
        timestamp: new Date().toISOString(),
      }
    });

    uploadTask.on('state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         if (process.env.NODE_ENV === 'development') {
          // console.log(`Business ${imageType} upload is ` + progress + '% done');
        }
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
         if (process.env.NODE_ENV === 'development') {
          // console.error(`Business ${imageType} upload failed:`, error);
        }
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            // console.error(`Error getting business ${imageType} download URL:`, error);
          }
          reject(error);
        }
      }
    );
  });
};

// --- Firestore Placeholder Functions for Inventory ---
// NOTE: Replace 'your_business_id' with actual dynamic business ID from user context or similar.
// You'll need to implement proper error handling and potentially more complex queries.

// Example: Add an inventory item to Firestore
const addInventoryItemToFirestore = async (businessId: string, itemData: Omit<InventoryItem, 'id' | 'image'> & { imageUrl?: string }): Promise<string> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  if (!businessId) throw new Error("Business ID is required");

  try {
    const docRef = await addDoc(collection(db, "businesses", businessId, "inventory"), {
      ...itemData,
      userId: auth.currentUser.uid, // Associate item with the user who added it
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (process.env.NODE_ENV === 'development') {
      console.log("Inventory item added with ID: ", docRef.id);
    }
    return docRef.id;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error adding inventory item to Firestore: ", error);
    }
    throw error; // Re-throw to be handled by the caller
  }
};

// Example: Get inventory items from Firestore
const getInventoryItemsFromFirestore = async (businessId: string): Promise<InventoryItem[]> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  if (!businessId) throw new Error("Business ID is required");
  
  const items: InventoryItem[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, "businesses", businessId, "inventory"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        lowStockThreshold: data.lowStockThreshold,
        supplier: data.supplier,
        // Assuming 'imageUrl' might be stored from form.image if it's a URL
        // If actual image file needs handling, this type and logic would differ.
        // image: data.imageUrl, // Adjust based on how image is stored/handled
      });
    });
    if (process.env.NODE_ENV === 'development') {
      console.log("Fetched inventory items: ", items);
    }
    return items;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching inventory items from Firestore: ", error);
    }
    return []; // Return empty array on error or handle appropriately
  }
};


export {
  app,
  auth,
  db, // Export db
  storage,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
  doSignOut,
  onAuthStateChanged,
  updateProfile,
  uploadProfileImage,
  uploadBusinessImage,
  // Export placeholder Firestore functions
  addInventoryItemToFirestore,
  getInventoryItemsFromFirestore,
};

// Placeholder for other Firestore functions for Ledger, Transactions, etc.
// You would create similar add/get/update/delete functions for those collections.
