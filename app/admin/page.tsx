"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
setDoc,
} from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
}

export default function AdminPage() {
useEffect(() => {
  if (typeof window !== "undefined") {
    const pass = prompt("Enter Admin Password");
    if (pass !== process.env.NEXT_PUBLIC_ADMIN_PASS) {
      window.location.href = "/";
    }
  }
}, []);

const [goldRate, setGoldRate] = useState("");
const [products, setProducts] = useState<Product[]>([]);
const [editingId, setEditingId] = useState<string | null>(null);
const [uploading, setUploading] = useState(false);
const [file, setFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);

const [form, setForm] = useState({
name: "",
weight: "",
making: "",
image: "",
stock: "",
category: "",
});

// 🔹 Fetch Products
const fetchProducts = async () => {
const snapshot = await getDocs(collection(db, "products"));
setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) })));
};

useEffect(() => {
fetchProducts();
}, []);

// 🔹 Handle File Change
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const selectedFile = e.target.files?.[0];
if (selectedFile) {
  setFile(selectedFile);
  setPreview(URL.createObjectURL(selectedFile));
}
};

// 🔹 Upload Image to Cloudinary
const uploadImage = async (file: File): Promise<string> => {
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', 'jewellery_upload');

const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
  method: 'POST',
  body: formData,
});

const data = await res.json();
console.log(data);
if (!res.ok) {
  throw new Error(data.error?.message || 'Upload failed');
}
return data.secure_url;
};

// 🔹 Add or Update Product
const handleSubmit = async () => {
if (!form.name || !form.weight || !form.making || !form.stock || !form.category) {
return alert("Fill all fields");
}

setUploading(true);
try {
  let imageUrl = form.image;

  if (file) {
    imageUrl = await uploadImage(file);
  } else if (!editingId) {
    return alert("Please select an image file");
  }

  if (editingId) {
    await updateDoc(doc(db, "products", editingId), {
      name: form.name,
      weight: Number(form.weight),
      making: Number(form.making),
      image: imageUrl,
      stock: Number(form.stock),
      category: form.category,
    });
    alert("Product updated!");
    setEditingId(null);
  } else {
    await addDoc(collection(db, "products"), {
      name: form.name,
      weight: Number(form.weight),
      making: Number(form.making),
      image: imageUrl,
      stock: Number(form.stock),
      category: form.category,
    });
    alert("Product added!");
  }

  setForm({ name: "", weight: "", making: "", image: "", stock: "", category: "" });
  setFile(null);
  setPreview(null);
  fetchProducts();
} catch (err) {
  alert("Upload failed: " + (err as Error).message);
} finally {
  setUploading(false);
}
};

// 🔹 Delete Product
const handleDelete = async (id: string) => {
await deleteDoc(doc(db, "products", id));
alert("Deleted!");
fetchProducts();
};

// 🔹 Edit Product
const handleEdit = (product: Product) => {
setForm({
name: product.name,
weight: product.weight.toString(),
making: product.making.toString(),
image: product.image,
stock: product.stock?.toString() || "",
category: product.category || "",
});
setEditingId(product.id);
setPreview(product.image);
setFile(null);
};

// 🔹 Update Gold Rate (Single Doc)
const updateGoldRate = async () => {
await setDoc(doc(db, "goldRate", "current"), {
  rate: Number(goldRate),
});

alert("Gold rate updated!");
};

return (
  <div className="min-h-screen bg-black text-white p-4 md:p-10">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl text-yellow-500 font-bold">Admin Panel</h1>
      <div className="flex gap-4">
        <Link href="/jewellery" className="text-sm bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400">
          View Products
        </Link>
        <Link href="/" className="text-sm bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400">
          ⬅ Back to Website
        </Link>
      </div>
    </div>
    <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#D4AF37]">Admin Panel</h1>

    <div className="max-w-6xl mx-auto space-y-8">
      {/* Gold Rate Section */}
      <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl mb-6 text-[#D4AF37] font-semibold">Update Gold Rate</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            placeholder="Enter Gold Rate"
            value={goldRate}
            onChange={(e) => setGoldRate(e.target.value)}
            className="flex-1 p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <button
            onClick={updateGoldRate}
            className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg hover:bg-[#B8952A] transition duration-300 font-semibold"
          >
            Update Rate
          </button>
        </div>
      </div>

      {/* Product Form Section */}
      <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl mb-6 text-[#D4AF37] font-semibold">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <input
            type="number"
            placeholder="Weight (grams)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <input
            type="number"
            placeholder="Making Charges"
            value={form.making}
            onChange={(e) => setForm({ ...form, making: e.target.value })}
            className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="">Select Category</option>
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="bangles">Bangles</option>
            <option value="earrings">Earrings</option>
          </select>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="p-3 bg-white text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-full"
            />
            {preview && (
              <Image src={preview} alt="Preview" width={80} height={80} className="mt-2 object-cover rounded-lg" style={{ height: "auto" }} />
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="mt-6 bg-[#D4AF37] text-black px-8 py-3 rounded-lg hover:bg-[#B8952A] transition duration-300 font-semibold w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Product List Section */}
      <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl mb-6 text-[#D4AF37] font-semibold">All Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white text-black p-4 rounded-xl shadow-md border border-gray-200">
              <Image
                src={p.image}
                alt={p.name}
                width={200}
                height={160}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-600 mb-1">Weight: {p.weight}g</p>
              <p className="text-gray-600 mb-1">Making: ₹{p.making}</p>
              <p className="text-gray-600 mb-1">Stock: {p.stock || 0}</p>
              <p className="text-gray-600 mb-4">Category: {p.category || 'Uncategorized'}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-[#D4AF37] text-black py-2 px-4 rounded-lg hover:bg-[#B8952A] transition duration-300 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}