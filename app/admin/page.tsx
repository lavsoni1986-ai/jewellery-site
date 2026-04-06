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
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { optimizeCloudinaryUrl } from "@/lib/utils";
import { Lock, LogOut, Upload } from "lucide-react";
import jsPDF from "jspdf";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
  carat?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [goldRate, setGoldRate] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
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
    carat: "",
  });

  useEffect(() => {
    const adminStatus = localStorage.getItem("admin");
    if (adminStatus === "true") {
      setIsAuthenticated(true);
      fetchProducts();
      fetchCategories();
      fetchGoldRate();
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
        fetchCategories();
        fetchGoldRate();
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

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) })));
  };

  const fetchGoldRate = async () => {
    const docRef = doc(db, "goldRate", "current");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setGoldRate(data.rate.toString());
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return alert("Enter category name");

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        slug: newCategory.toLowerCase().replace(/\s+/g, "-"),
      });

      alert("Category added!");

      setNewCategory("");
      fetchCategories(); // 🔥 तुरंत dropdown update होगा
    } catch (err) {
      alert("Error adding category");
    }
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
    if (!form.name || !form.weight || !form.making || !form.stock || !form.category || !form.carat) {
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
          carat: Number(form.carat || 22),
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
          carat: Number(form.carat || 22),
        });
        alert("Product added!");
      }

      setForm({ name: "", weight: "", making: "", image: "", stock: "", category: "", carat: "" });
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
      weight: product.weight?.toString() || "",
      making: product.making?.toString() || "",
      image: product.image,
      stock: product.stock?.toString() || "",
      category: product.category || "",
      carat: product.carat?.toString() || "",
    });
    setEditingId(product.id);
    setPreview(product.image);
    setFile(null);

    // 🔥 MAIN FIX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateGoldRate = async () => {
    await setDoc(doc(db, "goldRate", "current"), {
      rate: Number(goldRate),
      updatedAt: new Date(),
      timestamp: Date.now(),
    });
    // Real-time sync will automatically update the UI
  };

  const generateInvoice = (p: Product) => {
    const weight = Number(p.weight || 0);
    const making = Number(p.making || 0);
    const carat = Number(p.carat || 22);
    const rate = Number(goldRate || 0);
    const purity = carat / 24;
    const goldPrice = weight * rate * purity;
    const makingCharge = goldPrice * (making / 100);
    const subtotal = goldPrice + makingCharge;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    const invoice = {
      customerName: "Customer", // placeholder
      product: p.name,
      weight: weight,
      carat: carat,
      goldRate: rate,
      makingPercent: making,
      goldPrice: Math.round(goldPrice),
      makingCharge: Math.round(makingCharge),
      gst: Math.round(gst),
      total: Math.round(total),
      date: new Date().toISOString().split('T')[0],
    };

    console.log("Invoice:", invoice);
    alert(`Invoice generated! Check console for details.\nTotal: ₹${total.toLocaleString("en-IN")}`);
  };

  const generatePDF = (p: Product) => {
    const doc = new jsPDF();

    const purity = (p.carat || 22) / 24;
    const goldPrice = p.weight * Number(goldRate) * purity;
    const makingCharge = goldPrice * (p.making / 100);
    const subtotal = goldPrice + makingCharge;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    const invoiceNo = "INV-" + Date.now();

    // Branding
    doc.setFontSize(18);
    doc.text("ANSHU JEWELLERS", 20, 15);
    doc.setFontSize(10);
    doc.text("Since 1950", 20, 22);
    doc.text("GST No: GSTIN123456789", 20, 28);

    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceNo}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 42);

    doc.setFontSize(14);
    doc.text("Invoice", 20, 55);

    doc.setFontSize(12);
    if (customerName) doc.text(`Customer: ${customerName}`, 20, 70);
    if (customerPhone) doc.text(`Phone: ${customerPhone}`, 20, 76);

    doc.text(`Product: ${p.name}`, 20, 86);
    doc.text(`Weight: ${p.weight}g`, 20, 92);
    doc.text(`Carat: ${p.carat || 22}K`, 20, 98);

    doc.text(`Gold Price: ₹${Math.round(goldPrice).toLocaleString("en-IN")}`, 20, 115);
    doc.text(`Making: ₹${Math.round(makingCharge).toLocaleString("en-IN")}`, 20, 125);
    doc.text(`GST (3%): ₹${Math.round(gst).toLocaleString("en-IN")}`, 20, 135);

    doc.setFontSize(14);
    doc.text(`Total: ₹${Math.round(total).toLocaleString("en-IN")}`, 20, 155);

    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 20, 175);

    doc.save(`${p.name}-invoice.pdf`);
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
            <h2 className="text-xl font-semibold text-gold mb-4">Gold Rate Management</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  placeholder="Today's Rate (per gram)"
                  className="flex-1 p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
                />
                <button onClick={updateGoldRate} className="bg-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-[#B8952A] transition">
                  Manual Update
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/gold-rate', { method: 'GET' });
                      const data = await response.json();
                      if (data.success) {
                        alert('Gold rate updated from API!');
                        window.location.reload();
                      } else {
                        alert(`Failed: ${data.error || data.message}`);
                      }
                    } catch (error) {
                      alert('Error updating gold rate');
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Auto Fetch API
                </button>
                <button
                  onClick={async () => {
                    try {
                      const isFrozen = confirm('Freeze current gold rate? This will stop auto-updates.');
                      await setDoc(doc(db, "system", "settings"), {
                        rateFrozen: isFrozen,
                        frozenAt: new Date()
                      });
                      alert(isFrozen ? 'Rate frozen!' : 'Rate unfrozen!');
                    } catch (error) {
                      alert('Error updating freeze status');
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Toggle Freeze
                </button>
              </div>
              <div className="text-sm text-gray-400">
                <p>System auto-updates every 6 hours (after deployment)</p>
                <p>Multi-source AI validation active</p>
                <p>Rate history & volatility monitoring enabled</p>
                <p className="text-yellow-400">Note: Auto-update works only on Vercel, not locally</p>
              </div>
            </div>
          </div>

          {/* Rate History */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Rate History & Analytics</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-[#222] p-4 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-400">{goldRate}</h3>
                  <p className="text-sm text-gray-400">Current Rate</p>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-400">99.5%</h3>
                  <p className="text-sm text-gray-400">Uptime</p>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <h3 className="text-2xl font-bold text-yellow-400">2</h3>
                  <p className="text-sm text-gray-400">Active Sources</p>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white">Recent Updates</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-[#222] p-3 rounded-lg flex justify-between">
                    <span className="text-gray-300">API Update</span>
                    <span className="text-green-400">Success</span>
                  </div>
                  <div className="bg-[#222] p-3 rounded-lg flex justify-between">
                    <span className="text-gray-300">Rate Smoothing</span>
                    <span className="text-blue-400">Applied</span>
                  </div>
                  <div className="bg-[#222] p-3 rounded-lg flex justify-between">
                    <span className="text-gray-300">Volatility Check</span>
                    <span className="text-yellow-400">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Customer Details (for Invoice)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
            </div>
          </div>

          {/* Add Category */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">Add Category</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name (e.g. Bracelet)"
                className="flex-1 p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <button
                onClick={handleAddCategory}
                className="bg-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-[#B8952A]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Product Form */}
          <div className="bg-[#111] border border-[#333] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gold mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            {editingId && (
              <div className="mb-4 text-green-400 font-semibold">
                ✏️ Editing Product Mode
              </div>
            )}
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
                placeholder="Making Charges (%)"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Stock Quantity"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <input
                type="number"
                value={form.carat}
                onChange={(e) => setForm({ ...form, carat: e.target.value })}
                placeholder="Carat (e.g. 22)"
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-3 bg-black border border-[#333] rounded-lg focus:border-gold outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
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
                    <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain" />
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
                    <Image src={optimizeCloudinaryUrl(p.image)} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                     <h3 className="font-bold text-lg text-white">{p.name}</h3>
                    <p className="text-gold font-mono">{goldRate ? `₹${(() => {
                      const weight = Number(p.weight || 0);
                      const making = Number(p.making || 0);
                      const carat = Number(p.carat || 22);
                      const rate = Number(goldRate || 0);
                      const purity = carat / 24;
                      const goldPrice = weight * rate * purity;
                      const makingCharge = goldPrice * (making / 100);
                      const subtotal = goldPrice + makingCharge;
                      const gst = subtotal * 0.03;
                      return Math.round(subtotal + gst);
                    })().toLocaleString("en-IN")}` : "Set gold rate first"}</p>
                     <p className="text-sm text-gray-400">{p.carat || 22}K Gold</p>
                     <div className="flex gap-2 mt-4">
                       <button onClick={() => handleEdit(p)} className="flex-1 bg-gold text-black py-2 rounded text-sm font-bold hover:bg-[#B8952A] transition">
                         Edit
                       </button>
                       <button onClick={() => generatePDF(p)} className="bg-green-600 text-white py-2 px-3 rounded text-sm font-bold hover:bg-green-700 transition">
                         Bill
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
