import { useQuery } from "@tanstack/react-query";
import { sanityClient, isSanityConfigured } from "@/lib/sanity";
import {
  siteSettingsQuery,
  productsQuery,
  productBySlugQuery,
  homePageQuery,
  aboutPageQuery,
  shopPageQuery,
  contactPageQuery,
  termsPageQuery,
  testimonialsQuery,
} from "@/lib/queries";
import { mapSanityProduct } from "@/lib/mapProduct";
import type { Product } from "@/types/product";
import { productCategoriesQuery } from "@/lib/queries";

async function fetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  if (!isSanityConfigured) return [] as T;

  const data = await sanityClient.fetch<T>(query, params ?? {});
  return data;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => fetch(siteSettingsQuery),
    staleTime: 60_000,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const raw = await fetch<Parameters<typeof mapSanityProduct>[0][]>(
        productsQuery
      );

      if (!Array.isArray(raw)) return [];

      const mapped = raw.map(mapSanityProduct);

      console.log("Mapped products:", mapped);

      return mapped;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const raw = await fetch<Parameters<typeof mapSanityProduct>[0] | null>(
        productBySlugQuery,
        { slug }
      );
      return raw ? mapSanityProduct(raw) : null;
    },
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["productCategories"],
    queryFn: () =>
      fetch<{ _id: string; title: string; sortOrder?: number }[]>(
        productCategoriesQuery
      ),
    staleTime: 60_000,
  });
}

export function useHomePage() {
  return useQuery({
    queryKey: ["homePage"],
    queryFn: async () => {
      const data = await fetch<{
        featuredProducts?: Parameters<typeof mapSanityProduct>[0][];
      } & Record<string, unknown>>(homePageQuery);
      if (data?.featuredProducts?.length) {
        data.featuredProducts = data.featuredProducts.map(mapSanityProduct) as never;
      }
      return data;
    },
    staleTime: 60_000,
  });
}

export function useAboutPage() {
  return useQuery({ queryKey: ["aboutPage"], queryFn: () => fetch(aboutPageQuery), staleTime: 60_000 });
}

export function useShopPage() {
  return useQuery({ queryKey: ["shopPage"], queryFn: () => fetch(shopPageQuery), staleTime: 60_000 });
}

export function useContactPage() {
  return useQuery({ queryKey: ["contactPage"], queryFn: () => fetch(contactPageQuery), staleTime: 60_000 });
}

export function useTermsPage() {
  return useQuery({ queryKey: ["termsPage"], queryFn: () => fetch(termsPageQuery), staleTime: 60_000 });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => fetch(testimonialsQuery),
    staleTime: 60_000,
  });
}

export function useResolvedProducts(): {
  products: Product[];
  isLoading: boolean;
} {
  const { data, isLoading } = useProducts();

  return {
    products: data ?? [],
    isLoading,
  };
}