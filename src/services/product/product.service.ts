import apiClient from "../api/client";
import type { Language } from "@/contexts/LanguageContext";

type TranslationKind = "title" | "sku";

type TranslationResponse = {
  translations: Record<string, string>;
};
import type {
  TaobaoHomeResponse,
  TaobaoProductsResponse,
  TaobaoProductDetailResponse,
  ExploreProductsResponse,
  ByLinkProductResponse,
  CategoryGroup,
} from "@/types/taobao.types";

export const productService = {
  async getCategories(): Promise<CategoryGroup[]> {
    const { data } = await apiClient.get("/categories");

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.categories)) {
      return data.categories;
    }

    return data ? [data] : [];
  },
  async getHomepageProducts(): Promise<TaobaoHomeResponse> {
    const { data } = await apiClient.get("/homepage");

    return data;
  },

  async getPicks(): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get("/picks");

    return data;
  },

  async getThemeProducts(
    themeId: string,
    scrollId?: string,
    signal?: AbortSignal,
  ): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get(`/themes/${themeId}/products`, {
      params: {
        ...(scrollId ? { scrollId } : {}),
      },
      signal,
    });

    return data;
  },

  // async getProductDetail(
  //   productId: string,
  // ): Promise<TaobaoProductDetailResponse> {
  //   const { data } = await apiClient.get(`/products/${productId}`);

  //   return data;
  // },
  async getProductDetail(
    productId: string,
    lang: Language = "en",
    signal?: AbortSignal,
  ): Promise<TaobaoProductDetailResponse> {
    const { data } = await apiClient.get(`/products/${productId}`, {
      params: { lang },
      signal,
    });

    return data;
  },
  async getSimilarProducts(
    productId: string,
    limit: number = 20,
  ): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get(`/products/${productId}/similar`, {
      params: {
        limit,
      },
    });

    if (Array.isArray(data)) {
      return { items: data };
    }

    return data;
  },

  async getShopProducts(
    shopId: string,
    size: number = 12,
  ): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get(`/products/shop/${shopId}`, {
      params: {
        size,
      },
    });

    if (Array.isArray(data)) {
      return { items: data };
    }

    return data;
  },

  async searchProducts(
    keyword: string,
    page: number = 1,
    size: number = 20,
  ): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get("/products/search", {
      params: {
        keyword,
        page,
        size,
      },
    });

    return data;
  },

  async searchByLink(url: string): Promise<ByLinkProductResponse> {
    const { data } = await apiClient.get("/products/by-link", {
      params: {
        url,
      },
    });

    return data;
  },

  // async getExploreProducts(cursor?: string): Promise<ExploreProductsResponse> {
  //   const { data } = await apiClient.get("/explore", {
  //     params: cursor ? { cursor } : undefined,
  //   });

  //   return data;
  // },

  async getExploreProducts(
    cursor?: string,
    lang: Language = "en",
    signal?: AbortSignal,
  ): Promise<ExploreProductsResponse> {
    const { data } = await apiClient.get("/explore", {
      params: {
        lang,
        ...(cursor ? { cursor } : {}),
      },
      signal,
    });

    return data;
  },

  async translateTexts(
    sources: string[],
    lang: Language,
    kind: TranslationKind,
    signal?: AbortSignal,
  ): Promise<TranslationResponse> {
    const { data } = await apiClient.post(
      "/translations",
      {
        sources,
        lang,
        kind,
      },
      {
        signal,
      },
    );

    return data;
  },
};

export default productService;
