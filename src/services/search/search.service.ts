import type { TaobaoProductsResponse } from "@/types/taobao.types";

import { buildHeaders, request } from "../api";

export const searchProducts = async (
  keyword: string,
  page = 1,
  size = 20,
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  return request<TaobaoProductsResponse>(`/products/search`, {
    params: { keyword, page, size },
    headers: buildHeaders(accessToken),
  });
};

export default {
  searchProducts,
};
