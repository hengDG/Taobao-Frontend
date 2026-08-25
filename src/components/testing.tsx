// import { useEffect, useState } from "react";
// import Masonry from "react-masonry-css";
// import { ProductCard } from "@/components/product/ProductCard";
// import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
// import { getThemeProducts } from "@/services/product/product.service";
// import type { TaobaoProduct } from "@/types/taobao.types";
// import { ProductCardSkeleton } from "./ui/ProductCardSkeleton";

// const TestingComponent = () => {
//   const [products, setProducts] = useState<TaobaoProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const response = await getThemeProducts("11647");
//         setProducts(response.items ?? []);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     void loadData();
//   }, []);
//   const breakpoints = {
//     default: 6,
//     1280: 5,
//     1024: 4,
//     768: 3,
//     640: 2,
//   };
//   return (
//     <div className="p-4">
//       <div className="mb-5">
//         <h3 className="m-0 text-2xl font-semibold text-slate-800">
//           Theme Products Test
//         </h3>
//       </div>

//       {loading && (
//         <div className="mt-3">
//           <ProductCardSkeleton count={12} />
//         </div>
//       )}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && (
//         <Masonry
//           breakpointCols={breakpoints}
//           className="flex -ml-4"
//           columnClassName="pl-4"
//         >
//           {" "}
//           {products.map((product) => (
//             <ProductCard
//               key={product.sourceItemId ?? product.title}
//               product={product}
//             />
//           ))}
//         </Masonry>
//       )}
//     </div>
//   );
// };

// export default TestingComponent;
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { getThemeProducts } from "@/services/product/product.service";

import type { TaobaoProduct } from "@/types/taobao.types";

import { ProductCardSkeleton } from "./ui/ProductCardSkeleton";


const TestingComponent = () => {

  const [products, setProducts] = useState<TaobaoProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        const response = await getThemeProducts("11647");

        setProducts(response.items ?? []);

      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch data"
        );

      } finally {

        setLoading(false);

      }

    };


    void loadData();

  }, []);




  return (

    <div
      className="
        mx-auto
        w-full
        max-w-8xl
        px-4
        py-2
      "
    >


      {/* TITLE */}

      <div className="mb-5">

        <h3
          className="
            text-2xl
            font-semibold
            text-slate-800
          "
        >
          Theme Products Test
        </h3>

      </div>




      {/* LOADING */}

      {loading && (

        <ProductCardSkeleton
          count={12}
        />

      )}




      {/* ERROR */}

      {error && (

        <p
          className="
            text-red-500
          "
        >
          {error}
        </p>

      )}






      {/* PRODUCTS GRID */}

      {!loading && !error && (

        <div
          className="
            grid
            grid-cols-2
            gap-2

            sm:grid-cols-3

            md:grid-cols-4

            lg:grid-cols-5

            xl:grid-cols-6

            2xl:grid-cols-7
          "
        >

          {products.map((product) => (

            <ProductCard
              key={
                product.sourceItemId ??
                product.title
              }
              product={product}
            />

          ))}


        </div>

      )}


    </div>

  );

};


export default TestingComponent;