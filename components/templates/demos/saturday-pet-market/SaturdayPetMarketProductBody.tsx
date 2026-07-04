"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PetMarketProductDTO } from "@/lib/templates/db/pet-market";
import { SPM_IMG } from "./saturdayPetMarketImages";
import { SPM_PATHS, spmProductHref } from "./saturdayPetMarketConfig";
import { formatSpmPrice } from "./saturdayPetMarketData";
import { useSpmCart } from "./SaturdayPetMarketCartContext";
import { SaturdayPetMarketShopLoading } from "./SaturdayPetMarketShopLoading";
import { SpmContainer, SpmIcon, SpmImg } from "./SaturdayPetMarketShared";
import { usePetMarketProduct } from "./usePetMarketProduct";
import { usePetMarketProducts } from "./usePetMarketProducts";
import type { SpmProduct } from "./saturdayPetMarketData";

const TABS = ["Description", "Ingredients", "Directions", "Reviews", "Shipping", "FAQ"] as const;

const GALLERY = [
  { src: SPM_IMG.product.thumb1, alt: "Single paw treat close-up" },
  { src: SPM_IMG.product.thumb2, alt: "Vintage packaging" },
  { src: SPM_IMG.product.thumb3, alt: "Golden retriever with treats" },
] as const;

function buildTabContent(dto: PetMarketProductDTO, product: SpmProduct): Record<(typeof TABS)[number], string> {
  return {
    Description: dto.description,
    Ingredients: `Material: ${dto.material}. Color: ${dto.color}. Weight: ${dto.weight}g.`,
    Directions: `Recommended for ages ${dto.recommended_age}+. Size: ${dto.size}. Best for ${dto.breed_size} ${dto.pet_type}s.`,
    Reviews: `${product.reviews} verified reviews with an average of ${product.rating} stars.`,
    Shipping: "Free express delivery on orders over $50. Local pickup available at Main St. Market within 2 hours.",
    FAQ: dto.veterinarian_approved
      ? "Veterinarian approved. Store in a cool, dry place. See expiration date on packaging."
      : `Use before ${dto.expiration_date}. Suitable for ${dto.pet_type}s.`,
  };
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1 text-[var(--spm-tertiary)]">
      {[1, 2, 3, 4, 5].map((n) => (
        <SpmIcon
          key={n}
          name="star"
          fill={n <= fullStars || (n === fullStars + 1 && hasHalf)}
          className="text-base"
        />
      ))}
      <span className="spm-body-md ml-1 text-[var(--spm-on-surface-variant)]">({reviews} Reviews)</span>
    </div>
  );
}

function RelatedProductCard({ product, onAdd }: { product: SpmProduct; onAdd: () => void }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] transition-all hover:shadow-md">
      <div className="relative">
        <Link href={spmProductHref(product.id)} className="block">
          <SpmImg
            variant="relatedProduct"
            frameClassName="bg-[var(--spm-surface-variant)]"
            src={product.image}
            alt={product.name}
            className="transition-transform group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={onAdd}
          className="absolute bottom-4 right-4 rounded-full bg-[var(--spm-primary)] p-2 text-[var(--spm-on-primary)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <SpmIcon name="add_shopping_cart" />
        </button>
      </div>
      <div className="p-6">
        <h4 className="spm-headline-md mb-1">
          <Link href={spmProductHref(product.id)} className="hover:text-[var(--spm-primary)]">
            {product.name}
          </Link>
        </h4>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[var(--spm-primary)]">{formatSpmPrice(product.price)}</span>
          {product.tag ? (
            <span className="spm-label-sm text-[var(--spm-on-surface-variant)]">{product.tag}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SaturdayPetMarketProductBody({ productId }: { productId: string }) {
  const { addToCart } = useSpmCart();
  const { dto, product, loading, notFound, error } = usePetMarketProduct(productId);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Description");
  const [mainSrc, setMainSrc] = useState<string>(SPM_IMG.product.main);

  useEffect(() => {
    if (product?.image) setMainSrc(product.image);
  }, [product?.image]);

  const relatedQuery = useMemo(
    () =>
      dto
        ? {
            filter: { category: dto.category },
            pageSize: 5,
            sort: "name-asc" as const,
          }
        : { pageSize: 0 },
    [dto],
  );

  const { products: relatedProducts, loading: relatedLoading } = usePetMarketProducts(relatedQuery);
  const related = relatedProducts.filter((item) => item.id !== productId).slice(0, 4);

  if (loading) {
    return <SaturdayPetMarketShopLoading message="Fetching product details..." />;
  }

  if (notFound) {
    return (
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer className="text-center">
          <h1 className="spm-headline-xl mb-4 text-[var(--spm-on-surface)]">Product not found</h1>
          <p className="spm-body-lg mb-8 text-[var(--spm-on-surface-variant)]">
            That item may have sold out or moved off the shelf.
          </p>
          <Link
            href={SPM_PATHS.shop}
            className="spm-headline-md inline-flex rounded-full bg-[var(--spm-primary)] px-8 py-3 text-[var(--spm-on-primary)]"
          >
            Back to Shop
          </Link>
        </SpmContainer>
      </main>
    );
  }

  if (!product || !dto) {
    return (
      <main className="px-[var(--spm-margin)] py-16">
        <SpmContainer className="text-center">
          <p className="spm-body-lg text-[var(--spm-error)]">{error ?? "Unable to load this product."}</p>
          <Link href={SPM_PATHS.shop} className="mt-6 inline-block font-bold text-[var(--spm-primary)] hover:underline">
            Back to Shop
          </Link>
        </SpmContainer>
      </main>
    );
  }

  const gallery = GALLERY;
  const tabContent = buildTabContent(dto, product);

  const selectThumb = (index: number) => {
    setActiveThumb(index);
    setMainSrc(gallery[index].src);
  };

  return (
    <main className="px-[var(--spm-margin)] py-12">
      <SpmContainer>
        <nav className="spm-label-sm mb-12 flex flex-wrap items-center gap-1 text-[var(--spm-on-surface-variant)]">
          <Link href={SPM_PATHS.shop} className="hover:text-[var(--spm-primary)]">
            Shop
          </Link>
          <SpmIcon name="chevron_right" className="text-sm" />
          <span>{dto.category}</span>
          <SpmIcon name="chevron_right" className="text-sm" />
          <span className="font-bold text-[var(--spm-on-surface)]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          <div className="grid grid-cols-12 gap-4 lg:col-span-7">
            <div className="col-span-2 flex flex-col gap-3">
              {gallery.map((thumb, i) => (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => selectThumb(i)}
                  className={`rounded-lg border-2 p-0 transition-colors ${
                    activeThumb === i
                      ? "border-[var(--spm-primary)]"
                      : "border-[var(--spm-outline-variant)] hover:border-[var(--spm-primary)]"
                  }`}
                >
                  <SpmImg variant="productThumb" src={thumb.src} alt={thumb.alt} frameClassName="rounded-md" />
                </button>
              ))}
            </div>
            <div className="relative col-span-10">
              <SpmImg
                variant="productHero"
                frameClassName="rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container)] shadow-md"
                src={mainSrc}
                alt={product.name}
                className="transition-opacity duration-300"
              />
              {product.tag ? (
                <span className="spm-label-sm absolute right-4 top-4 rounded-full bg-[var(--spm-secondary)] px-3 py-1 text-[var(--spm-on-secondary)] shadow-sm">
                  {product.tag}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div>
              <h2 className="spm-label-sm mb-1 uppercase tracking-widest text-[var(--spm-primary)]">{product.brand}</h2>
              <h1 className="spm-headline-xl mb-2 leading-none">{product.name}</h1>
              {product.subtitle ? (
                <p className="spm-body-md mb-2 text-[var(--spm-on-surface-variant)]">{product.subtitle}</p>
              ) : null}
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>
            <div className="spm-price-tag-hole spm-label-price w-fit rounded-full bg-[var(--spm-secondary-container)] px-8 py-2 text-[var(--spm-on-secondary-container)] shadow-md">
              {formatSpmPrice(product.salePrice ?? product.price)}
            </div>
            <div className="space-y-6 rounded-lg border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-6">
              <div className="flex items-center justify-between">
                <label className="spm-headline-md">Quantity</label>
                <div className="flex items-center overflow-hidden rounded-full border-2 border-[var(--spm-outline)] bg-[var(--spm-background)]">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-1 hover:bg-[var(--spm-surface-container)]"
                    aria-label="Decrease"
                  >
                    <SpmIcon name="remove" />
                  </button>
                  <span className="px-4 py-1 font-bold text-[var(--spm-primary)]">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="px-4 py-1 hover:bg-[var(--spm-surface-container)]"
                    aria-label="Increase"
                  >
                    <SpmIcon name="add" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addToCart(product, qty)}
                className="spm-coupon-button spm-headline-md flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--spm-primary)] py-4 text-[var(--spm-on-primary)] shadow-[4px_4px_0px_0px_rgba(0,106,106,0.2)]"
              >
                <SpmIcon name="shopping_bag" /> Add to Cart
              </button>
              <button
                type="button"
                className="spm-label-sm flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[var(--spm-secondary)] py-2 text-[var(--spm-secondary)] transition-colors hover:bg-[var(--spm-secondary-fixed)]"
              >
                <SpmIcon name="favorite" /> Save for Later
              </button>
            </div>
            <div className="space-y-2">
              {[
                { icon: "local_shipping", title: "Express Delivery", desc: "Free for orders over $50. Arrives tomorrow." },
                { icon: "store", title: "Pickup Available", desc: "Ready in 2 hours at Main St. Market" },
              ].map((row) => (
                <div
                  key={row.title}
                  className="flex items-center gap-3 rounded-md border border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-high)] p-3"
                >
                  <SpmIcon name={row.icon} className="text-[var(--spm-primary)]" />
                  <div>
                    <p className="font-bold">{row.title}</p>
                    <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="spm-no-scrollbar flex gap-8 overflow-x-auto border-b-2 border-[var(--spm-outline-variant)]">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`spm-headline-md whitespace-nowrap pb-4 transition-colors ${
                  activeTab === tab
                    ? "border-b-4 border-[var(--spm-primary)] text-[var(--spm-primary)]"
                    : "text-[var(--spm-on-surface-variant)] hover:text-[var(--spm-primary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="spm-body-lg py-12 leading-relaxed text-[var(--spm-on-surface-variant)]">{tabContent[activeTab]}</p>
        </div>

        <section className="mt-16">
          <div className="mb-12 flex items-center justify-between">
            <h3 className="spm-headline-lg">Complete the Picnic</h3>
            <Link href={SPM_PATHS.shop} className="flex items-center gap-1 font-bold text-[var(--spm-primary)]">
              View all <SpmIcon name="arrow_forward" />
            </Link>
          </div>
          {relatedLoading ? (
            <div className="flex justify-center py-8">
              <SpmIcon name="progress_activity" className="animate-spin text-3xl text-[var(--spm-primary)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {related.map((item) => (
                <RelatedProductCard key={item.id} product={item} onAdd={() => addToCart(item)} />
              ))}
            </div>
          )}
        </section>

        <section className="relative mt-16 overflow-hidden rounded-xl bg-[var(--spm-surface-container-highest)] p-8">
          <div className="spm-candy-stripe-teal absolute left-0 top-0 h-2 w-full" />
          <h3 className="spm-headline-md mb-6">Recently Viewed</h3>
          <div className="spm-no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {related.slice(0, 3).map((item) => (
              <Link key={item.id} href={spmProductHref(item.id)} className="shrink-0">
                <SpmImg
                  variant="productRecent"
                  frameClassName="rounded-lg border-2 border-[var(--spm-outline-variant)] bg-[var(--spm-background)] transition-all hover:border-[var(--spm-primary)]"
                  src={item.image}
                  alt={item.name}
                />
              </Link>
            ))}
          </div>
        </section>
      </SpmContainer>
    </main>
  );
}
