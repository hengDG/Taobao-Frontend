import apiClient from "../api/client";

import type {
  TaobaoHomeResponse,
  TaobaoProductsResponse,
  TaobaoProductDetailResponse,
  ExploreProductsResponse,
  ByLinkProductResponse,
} from "@/types/taobao.types";

export const productService = {
  async getHomepageProducts(): Promise<TaobaoHomeResponse> {
    const { data } = await apiClient.get("/homepage");

    return data;
  },

  async getThemeProducts(themeId: string): Promise<TaobaoProductsResponse> {
    const { data } = await apiClient.get(`/themes/${themeId}/products`);

    return data;
  },

  async getProductDetail(
    productId: string,
  ): Promise<TaobaoProductDetailResponse> {
    const { data } = await apiClient.get(`/products/${productId}`);

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

  async getExploreProducts(cursor?: string): Promise<ExploreProductsResponse> {
    const { data } = await apiClient.get("/explore", {
      params: cursor ? { cursor } : undefined,
    });

    return data;
  },
};

export default productService;
