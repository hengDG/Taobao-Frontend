import type { TaobaoProductsResponse } from "@/types/taobao.types";

import { buildHeaders, request } from "../api";

export const searchProducts = async (
  query: string,
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  return request<TaobaoProductsResponse>(`/search`, {
    params: { q: query },
    headers: buildHeaders(accessToken),
  });
};

export default {
  searchProducts,
};
