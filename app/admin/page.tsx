"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Lock, LogOut, Upload } from "lucide-react";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const adminStatus = localStorage.getItem("admin");
    if (adminStatus === "true") {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("admin", "true");
        setIsAuthenticated(true);
        fetchProducts();
      } else {
        alert("Wrong password");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setIsAuthenticated(false);
    router.push("/");
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) })));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'jewellery_upload');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    return data.secure_url;
  };

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

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

  const updateGoldRate = async () => {
    await setDoc(doc(db, "goldRate", "current"), {
      rate: Number(goldRate),
    });
    alert("Gold rate updated!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="bg-[#0c0c0c] border border-[#333] rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <Lock className="mx-auto text-gold mb-4" size={48} />
            <h1 className="text-2xl font-bold text-gold">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-2">Enter password to manage jewellery</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="w-full p-4 bg-black border border-[#333] rounded-xl text-white focus:outline-none focus:border-gold transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rosewood hover:bg-[#4d0008] text-white py-4 rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-sm border border-gold text-gold px-4 py-2 rounded hover:bg-gold hover:text-black transition flex items-center gap-2">
              View Website
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm bg-red-900/50 border border-red-800 text-red-200 px-4 py-2 rounded hover:bg-red-900 transition flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {/* Gold Rate Section */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Update Gold Rate</h2>
            <div className="flex gap-4">
              <input
                type="number"
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
                placeholder="Today's Rate (per gram)"
                className="flex-1 p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <button onClick={updateGoldRate} className="bg-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-[#B8952A] transition">
                Update
              </button>
            </div>
          </div>

          {/* Product Form */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product Name"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="Weight (grams)"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="number"
                value={form.making}
                onChange={(e) => setForm({ ...form, making: e.target.value })}
                placeholder="Making Charges"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Stock Quantity"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              >
                <option value="">Select Category</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="bangles">Bangles</option>
                <option value="earrings">Earrings</option>
              </select>
              <div className="md:col-span-2 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="block w-full p-3 bg-black border border-[#333] rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition flex items-center justify-center gap-2">
                  <Upload size={16} />
                  {file ? file.name : "Upload Image"}
                </label>
                {preview && (
                  <div className="mt-4 relative h-40 w-full rounded-lg overflow-hidden border border-[#333]">
                    <Image src={preview} alt="Preview" fill sizes="100vw" className="object-contain" />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="mt-6 bg-rosewood hover:bg-[#4d0008] text-white px-8 py-3 rounded-lg font-bold transition disabled:opacity-50 w-full md:w-auto"
            >
              {uploading ? "Uploading..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </div>

          {/* Product List */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-6">Inventory ({products.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden">
                  <div className="h-48 relative">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{p.name}</h3>
                    <p className="text-gold font-mono">₹{(p.weight * (goldRate ? Number(goldRate) : 0)) + p.making}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleEdit(p)} className="flex-1 bg-gold text-black py-2 rounded text-sm font-bold hover:bg-[#B8952A] transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-900/50 text-red-200 py-2 rounded text-sm font-bold hover:bg-red-900 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
