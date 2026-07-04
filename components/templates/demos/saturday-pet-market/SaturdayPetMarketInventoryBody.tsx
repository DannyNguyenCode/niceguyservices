"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { PetMarketProductDTO, PetMarketProductInput } from "@/lib/templates/db/pet-market";
import {
  consumePetMarketApiError,
  createPetMarketProduct,
  deletePetMarketProduct,
  updatePetMarketProduct,
} from "@/lib/templates/api/pet-market";
import { SPM_PATHS, isSpmAdminUsername } from "./saturdayPetMarketConfig";
import { useSpmAuth, useSpmRequireAuth } from "./SaturdayPetMarketAuthContext";
import { usePetMarketProducts } from "./usePetMarketProducts";
import { SpmContainer, SpmIcon } from "./SaturdayPetMarketShared";
import { SPM_SHOP_BRANDS, SPM_SHOP_CATEGORIES, SPM_SHOP_PET_TYPES } from "./spmShopFilters";

const DEFAULT_PRODUCT: PetMarketProductInput = {
  product_name: "",
  brand: SPM_SHOP_BRANDS[0],
  category: SPM_SHOP_CATEGORIES[0],
  price: 19.99,
  quantity: 12,
  description: "Neighborhood pet supply staple.",
  size: "Medium",
  color: "Assorted",
  material: "Mixed",
  weight: 1,
  expiration_date: "2027-12-31",
  recommended_age: 1,
  breed_size: "All sizes",
  pet_type: SPM_SHOP_PET_TYPES[0],
  veterinarian_approved: false,
};

type FormMode = "create" | "edit";

export function SaturdayPetMarketInventoryBody() {
  const router = useRouter();
  const { hydrated } = useSpmRequireAuth();
  const { username } = useSpmAuth();
  const isAdmin = isSpmAdminUsername(username);

  const { result, loading, error, refetch } = usePetMarketProducts({
    page: 1,
    pageSize: 200,
    sort: "name-asc",
  });

  const products = result?.items ?? [];
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PetMarketProductInput>(DEFAULT_PRODUCT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetCreateForm = useCallback(() => {
    setFormMode("create");
    setEditingId(null);
    setForm(DEFAULT_PRODUCT);
    setFormError(null);
  }, []);

  const startEdit = useCallback((product: PetMarketProductDTO) => {
    setFormMode("edit");
    setEditingId(product._id);
    setForm({
      product_name: product.product_name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      size: product.size,
      color: product.color,
      material: product.material,
      weight: product.weight,
      expiration_date: product.expiration_date,
      recommended_age: product.recommended_age,
      breed_size: product.breed_size,
      pet_type: product.pet_type,
      veterinarian_approved: product.veterinarian_approved,
    });
    setFormError(null);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (formMode === "create") {
        await createPetMarketProduct(form);
      } else if (editingId) {
        await updatePetMarketProduct(editingId, form);
      }
      resetCreateForm();
      await refetch();
    } catch (err) {
      const message = consumePetMarketApiError(err, "Could not save product");
      if (message === null) return;
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Remove "${name}" from store inventory?`)) return;

    setDeletingId(id);
    try {
      await deletePetMarketProduct(id);
      if (editingId === id) resetCreateForm();
      await refetch();
    } catch (err) {
      const message = consumePetMarketApiError(err, "Could not delete product");
      if (message === null) return;
      setFormError(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (!hydrated) return null;

  if (!isAdmin) {
    return (
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer className="rounded-lg border border-dashed border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] px-8 py-16 text-center">
          <SpmIcon name="lock" className="mb-4 text-5xl text-[var(--spm-secondary)]" />
          <h1 className="spm-headline-lg mb-2 text-[var(--spm-on-surface)]">Staff Only</h1>
          <p className="spm-body-md mb-6 text-[var(--spm-on-surface-variant)]">
            Sign in as the store admin to manage inventory.
          </p>
          <Link href={SPM_PATHS.login} className="spm-label-sm font-bold text-[var(--spm-primary)] hover:underline">
            Go to Login
          </Link>
        </SpmContainer>
      </main>
    );
  }

  return (
    <main className="px-[var(--spm-margin)] py-12">
      <SpmContainer className="space-y-8">
        <header className="flex flex-col gap-4 border-b border-dashed border-[var(--spm-outline-variant)] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="spm-filter-coupon-header mb-3 inline-flex">Backroom Inventory</span>
            <h1 className="spm-headline-xl text-[var(--spm-secondary)]">Store Stock Room</h1>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              Add new arrivals, adjust shelf counts, or pull discontinued items.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetCreateForm}
              className="spm-label-sm rounded-full border-2 border-[var(--spm-primary)] px-4 py-2 font-bold text-[var(--spm-primary)]"
            >
              New Product
            </button>
            <button
              type="button"
              onClick={() => router.push(SPM_PATHS.shop)}
              className="spm-label-sm rounded-full bg-[var(--spm-surface-container-high)] px-4 py-2 font-bold text-[var(--spm-on-surface-variant)]"
            >
              View Shop Floor
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[380px_1fr]">
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="spm-filter-sidebar h-fit rounded-xl border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-5 shadow-md"
          >
            <h2 className="spm-headline-md mb-4 text-[var(--spm-primary)]">
              {formMode === "create" ? "Add to Inventory" : "Edit Product"}
            </h2>

            {formError ? (
              <p className="spm-label-sm mb-4 rounded-lg bg-[var(--spm-error-container)] px-3 py-2 text-[var(--spm-on-error-container)]">
                {formError}
              </p>
            ) : null}

            <div className="space-y-3">
              <InventoryField label="Product Name">
                <input
                  required
                  value={form.product_name}
                  onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
                  className="spm-filter-input w-full rounded-lg px-3 py-2"
                />
              </InventoryField>

              <div className="grid grid-cols-2 gap-3">
                <InventoryField label="Brand">
                  <select
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="spm-filter-input w-full rounded-lg px-2 py-2"
                  >
                    {SPM_SHOP_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </InventoryField>
                <InventoryField label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="spm-filter-input w-full rounded-lg px-2 py-2"
                  >
                    {SPM_SHOP_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </InventoryField>
              </div>

              <InventoryField label="Pet Type">
                <select
                  value={form.pet_type}
                  onChange={(e) => setForm((f) => ({ ...f, pet_type: e.target.value }))}
                  className="spm-filter-input w-full rounded-lg px-2 py-2"
                >
                  {SPM_SHOP_PET_TYPES.map((petType) => (
                    <option key={petType} value={petType}>
                      {petType}
                    </option>
                  ))}
                </select>
              </InventoryField>

              <div className="grid grid-cols-2 gap-3">
                <InventoryField label="Price">
                  <input
                    required
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="spm-filter-input w-full rounded-lg px-3 py-2"
                  />
                </InventoryField>
                <InventoryField label="Quantity">
                  <input
                    required
                    type="number"
                    min={0}
                    step="1"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                    className="spm-filter-input w-full rounded-lg px-3 py-2"
                  />
                </InventoryField>
              </div>

              <InventoryField label="Description">
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="spm-filter-input w-full rounded-lg px-3 py-2"
                />
              </InventoryField>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.veterinarian_approved}
                  onChange={(e) => setForm((f) => ({ ...f, veterinarian_approved: e.target.checked }))}
                  className="spm-filter-checkbox"
                />
                <span className="spm-label-sm">Vet Recommended</span>
              </label>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="spm-label-sm flex-1 rounded-full bg-[var(--spm-primary)] py-3 font-bold text-[var(--spm-on-primary)] disabled:opacity-60"
              >
                {saving ? "Saving..." : formMode === "create" ? "Add Product" : "Save Changes"}
              </button>
              {formMode === "edit" ? (
                <button
                  type="button"
                  onClick={resetCreateForm}
                  className="spm-label-sm rounded-full border border-[var(--spm-outline-variant)] px-4 py-3 font-bold"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="spm-headline-md text-[var(--spm-on-surface)]">
                On the Shelves ({result?.total ?? products.length})
              </h2>
              {error ? <span className="spm-label-sm text-[var(--spm-error)]">{error}</span> : null}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <SpmIcon name="progress_activity" className="animate-spin text-4xl text-[var(--spm-primary)]" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-[var(--spm-outline-variant)] bg-white shadow-sm">
                <div className="spm-custom-scrollbar overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[var(--spm-surface-container-high)] spm-label-sm uppercase tracking-wide text-[var(--spm-on-surface-variant)]">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const low = product.quantity <= 3;
                        const out = product.quantity <= 0;
                        return (
                          <tr
                            key={product._id}
                            className="border-t border-[var(--spm-outline-variant)]/50 hover:bg-[var(--spm-surface-container-low)]"
                          >
                            <td className="px-4 py-3 font-semibold text-[var(--spm-on-surface)]">
                              {product.product_name}
                              <p className="spm-label-sm font-normal text-[var(--spm-on-surface-variant)]">
                                {product.pet_type}
                              </p>
                            </td>
                            <td className="px-4 py-3">{product.brand}</td>
                            <td className="px-4 py-3">{product.category}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`spm-label-sm rounded-full px-2 py-1 font-bold ${
                                  out
                                    ? "bg-[var(--spm-error-container)] text-[var(--spm-on-error-container)]"
                                    : low
                                      ? "bg-[var(--spm-secondary-fixed)] text-[var(--spm-on-secondary-fixed)]"
                                      : "bg-[var(--spm-primary-fixed)] text-[var(--spm-on-primary-fixed)]"
                                }`}
                              >
                                {out ? "Out" : product.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(product)}
                                  className="spm-label-sm rounded-full border border-[var(--spm-outline-variant)] px-3 py-1 font-bold hover:border-[var(--spm-primary)]"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(product._id, product.product_name)}
                                  disabled={deletingId === product._id}
                                  className="spm-label-sm rounded-full border border-[var(--spm-error)] px-3 py-1 font-bold text-[var(--spm-error)] disabled:opacity-50"
                                >
                                  {deletingId === product._id ? "..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </SpmContainer>
    </main>
  );
}

function InventoryField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="spm-label-sm mb-1 block text-[var(--spm-on-surface-variant)]">{label}</span>
      {children}
    </label>
  );
}
