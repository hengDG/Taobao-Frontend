// import { useEffect, useState } from "react";
// import Masonry from "react-masonry-css";
// import { ProductCard } from "@/components/product/ProductCard";
// import { ProductCardSkeleton, ProductSkeleton } from "@/components/ui/ProductSkeleton";
// import { getHomepageProducts } from "@/services/product/product.service";
// import type { TaobaoHomeRow } from "@/types/taobao.types";

// const HomepageSectionList = () => {
//   const [rows, setRows] = useState<TaobaoHomeRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHomepage = async () => {
//       try {
//         setLoading(true);
//         const response = await getHomepageProducts();
//         setRows(response.rows ?? []);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to load homepage",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     void fetchHomepage();
//   }, []);
//   const breakpoints = {
//     default: 6,
//     1280: 5,
//     1024: 4,
//     768: 3,
//     640: 2,
//   };
//   return (
//     <div className="mt-5 px-3 sm:px-5">
//       <div className="mb-4">
//         <h3 className="m-0 text-2xl font-semibold text-slate-800">
//           Homepage API Test
//         </h3>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       {loading ? (
//         <div className="grid gap-5">
//           <ProductCardSkeleton count={10} />
//         </div>
//       ) : (
//         <div className="grid gap-7">
//           {rows.map((row) => (
//             <div key={row.themeId ?? row.label ?? Math.random()}>
//               <div className="mb-3 flex items-center justify-between gap-3">
//                 <h4 className="m-0 text-xl font-semibold text-slate-800">
//                   {row.label ?? "Section"}
//                 </h4>
//                 <span className="text-xs text-slate-500">
//                   {row.items?.length ?? 0} items
//                 </span>
//               </div>

//               <Masonry
//                 breakpointCols={breakpoints}
//                 className="flex -ml-4"
//                 columnClassName="pl-4"
//               >
//                 {(row.items ?? []).slice(0, 10).map((product) => (
//                   <ProductCard
//                     key={product.sourceItemId ?? product.title}
//                     product={product}
//                   />
//                 ))}
//               </Masonry>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomepageSectionList;
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductSkeleton";

import { getHomepageProducts } from "@/services/product/product.service";

import type { TaobaoHomeRow } from "@/types/taobao.types";


const HomepageSectionList = () => {

  const [rows, setRows] = useState<TaobaoHomeRow[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    const fetchHomepage = async () => {

      try {

        setLoading(true);

        const response = await getHomepageProducts();

        setRows(response.rows ?? []);


      } catch (err) {

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load homepage"
        );


      } finally {

        setLoading(false);

      }

    };


    void fetchHomepage();

  }, []);





  return (

    <div
      className="
        mt-5
        px-3
        sm:px-5
      "
    >


      {/* TITLE */}

      <div className="mb-4">

        <h3
          className="
            text-2xl
            font-semibold
            text-slate-800
          "
        >
          Homepage API Test
        </h3>

      </div>





      {/* ERROR */}

      {error && (

        <p className="text-red-500">
          {error}
        </p>

      )}





      {/* LOADING */}

      {loading ? (

        <ProductCardSkeleton
          count={12}
        />


      ) : (


        <div
          className="
            grid
            gap-8
          "
        >

          {rows.map((row) => (

            <section
              key={
                row.themeId ??
                row.label
              }
            >


              {/* SECTION HEADER */}

              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >

                <h4
                  className="
                    text-xl
                    font-semibold
                    text-slate-800
                  "
                >
                  {row.label ?? "Section"}
                </h4>


                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  {row.items?.length ?? 0} items
                </span>


              </div>





              {/* PRODUCT GRID */}

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

                {(row.items ?? [])
                  .slice(0, 10)
                  .map((product)=>(

                    <ProductCard

                      key={
                        product.sourceItemId ??
                        product.title
                      }

                      product={product}

                    />

                  ))}


              </div>


            </section>


          ))}


        </div>


      )}


    </div>

  );

};


export default HomepageSectionList;