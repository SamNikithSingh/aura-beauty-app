import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Save, Trash2, Edit3, Store, Package, ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useProducts, Product } from "../hooks/useProducts";

export function AdminScreen() {
  const { products, loading, refetch } = useProducts();
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct?.brand) return;
    
    setIsSaving(true);
    try {
      const payload = {
        name: editingProduct.name,
        brand: editingProduct.brand,
        description: editingProduct.description,
        benefit: editingProduct.description, // redundancy for now
        price: editingProduct.price,
        price_usd: editingProduct.priceUSD,
        category: editingProduct.category,
        tag: editingProduct.tag,
        image: editingProduct.image,
        rating: editingProduct.rating,
        reviews: editingProduct.reviews,
        ingredients: editingProduct.ingredients,
        skin_types: editingProduct.skinTypes,
        concerns: editingProduct.concerns,
        usage_steps: editingProduct.usageSteps,
        featured: editingProduct.featured,
        trending: editingProduct.trending,
      };

      if (editingProduct.id) {
        await supabase.from("products").update(payload).eq("id", editingProduct.id);
      } else {
        await supabase.from("products").insert([payload]);
      }
      
      await refetch();
      setView("list");
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF] pb-20">
      <header className="px-6 pt-14 pb-6 bg-white border-b border-rgba(123, 63, 196, 0.1)">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             {view === "edit" && (
                <button onClick={() => setView("list")} className="p-2 rounded-xl bg-[#F8F7FF]">
                   <ArrowLeft size={20} color="#1A1040" />
                </button>
             )}
             <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1A1040" }}>
                Aura Admin
             </h1>
          </div>
          {view === "list" && (
             <button 
                onClick={() => { setEditingProduct({ ingredients: [], skinTypes: [], concerns: [], usageSteps: [] }); setView("edit"); }}
                className="w-10 h-10 rounded-xl bg-[#7B3FC4] flex items-center justify-center shadow-lg shadow-purple-200"
             >
                <Plus size={20} color="white" />
             </button>
          )}
        </div>
      </header>

      <main className="p-6">
        {view === "list" ? (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="p-4 rounded-2xl bg-white border border-rgba(123, 63, 196, 0.1) flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-lg bg-[#F8F7FF] overflow-hidden">
                      <img src={product.image} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="font-bold text-[#1A1040]">{product.name}</p>
                      <p className="text-xs text-[#6B6880]">{product.brand} · {product.category}</p>
                   </div>
                </div>
                <button 
                   onClick={() => { setEditingProduct(product); setView("edit"); }}
                   className="p-2 text-[#7B3FC4]"
                >
                   <Edit3 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-[#A9A4C0] uppercase mb-1 block">Product Name</label>
                  <input 
                     value={editingProduct?.name || ""} 
                     onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                     className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#7B3FC4]"
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-[#A9A4C0] uppercase mb-1 block">Brand</label>
                  <input 
                     value={editingProduct?.brand || ""} 
                     onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})}
                     className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#7B3FC4]"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-[#A9A4C0] uppercase mb-1 block">Price (INR)</label>
                     <input 
                        value={editingProduct?.price || ""} 
                        onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#7B3FC4]"
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-[#A9A4C0] uppercase mb-1 block">Price (USD)</label>
                     <input 
                        value={editingProduct?.priceUSD || ""} 
                        onChange={e => setEditingProduct({...editingProduct, priceUSD: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#7B3FC4]"
                     />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-[#A9A4C0] uppercase mb-1 block">Description</label>
                  <textarea 
                     value={editingProduct?.description || ""} 
                     onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                     rows={3}
                     className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-[#7B3FC4]"
                  />
               </div>
            </div>

            <button 
               onClick={handleSave}
               disabled={isSaving}
               className="w-full py-4 rounded-2xl bg-[#7B3FC4] text-white font-bold shadow-xl shadow-purple-200 flex items-center justify-center gap-2"
            >
               {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
               Save Product
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
