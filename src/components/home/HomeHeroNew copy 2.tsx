// import { Star, Eye, ShoppingBag } from "lucide-react";
// import { Fragment, useEffect, useState } from "react";
// import image1 from "/slideImage/tg_image_266439099.png";
// import image2 from "/slideImage/tg_image_887748772.png";
// import image3 from "/slideImage/tg_image_1831750447.png";
// import image4 from "/slideImage/tg_image_2548941537.png";
// import image5 from "/slideImage/tg_image_2582722055.png";
// import { products } from "@/data/products";
// import CategoryMenu from "@/components/home/CategoryMenu";

// type Slide = {
//   id: string;
//   title: string;
//   subtitle: string;
//   bgClass: string;
//   image?: string;
// };

// const slides: Slide[] = [
//   {
//     id: "slide-1",
//     title: "NIKE Official Flagship ",
//     subtitle: "The selected type is ready",
//     bgClass: "bg-gradient-to-r from-[#37b97f] to-[#5ec47c]",
//     image: image1,
//   },
//   {
//     id: "slide-2",
//     title: "Top Home Living Picks",
//     subtitle: "Trusted quality and fast shipping",
//     bgClass: "bg-gradient-to-r from-[#3b82d6] to-[#5d8df0]",
//     image: image2,
//   },
//   {
//     id: "slide-3",
//     title: "Beauty & Daily ",
//     subtitle: "Hot products updated every day",
//     bgClass: "bg-gradient-to-r from-[#6c63ff] to-[#8c7dff]",
//     image: image3,
//   },
//   {
//     id: "slide-4",
//     title: "Home Essentials",
//     subtitle: "Everything you need for your home",
//     bgClass: "bg-gradient-to-r from-[#ff7e5f] to-[#feb47b]",
//     image: image4,
//   },
//   {
//     id: "slide-5",
//     title: "Fashion & Accessories",
//     subtitle: "Stay trendy with our latest collection",
//     bgClass: "bg-gradient-to-r from-[#ff6a88] to-[#ff99ac]",
//     image: image5,
//   },
// ];

// export function HomeMarketplaceDashboard() {
//   const [activeSlideIndex, setActiveSlideIndex] = useState(0);
//   const [activeOrder, setActiveOrder] = useState(0);
//   const [enableTransition, setEnableTransition] = useState(true);

//   const orders = [
//     {
//       image: products[0]?.imageUrl,
//       status: "Shipping",
//       date: "09-02",
//       message: "Package arrived at China warehouse",
//     },
//     {
//       image: products[1]?.imageUrl,
//       status: "Paid",
//       date: "09-01",
//       message: "Waiting seller to prepare your order",
//     },
//     {
//       image: products[2]?.imageUrl,
//       status: "Cambodia",
//       date: "08-30",
//       message: "Package arrived in Cambodia",
//     },
//     {
//       image: products[3]?.imageUrl,
//       status: "Delivered",
//       date: "08-28",
//       message: "Order delivered successfully",
//     },
//   ];

//   // clone first item
//   const userOrders = [...orders, orders[0]];
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveOrder((prev) => prev + 1);
//     }, 3000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     if (activeOrder === orders.length) {
//       const timer = setTimeout(() => {
//         setEnableTransition(false);

//         setActiveOrder(0);

//         requestAnimationFrame(() => {
//           requestAnimationFrame(() => {
//             setEnableTransition(true);
//           });
//         });
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [activeOrder]);

//   useEffect(() => {
//     if (!slides.length) return;

//     const timer = window.setInterval(() => {
//       setActiveSlideIndex((prev) => (prev + 1) % slides.length);
//     }, 3500);

//     return () => window.clearInterval(timer);
//   }, []);

//   const activeSlide = slides[activeSlideIndex] ?? slides[0];

//   return (
//     <section className="mx-auto w-full space-y-2 px-3 sm:px-4 lg:px-0">
//       <CategoryMenu />

//       {/* TOP AREA */}
//       <div className="grid gap-2 lg:grid-cols-10">
//         {" "}
//         {/* USER + TRACK COMBINED CARD */}
//         {/* <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#3f89f8] via-[#E3F2FD] to-[#E3F2FD] p-3 shadow-sm sm:p-4 lg:col-span-5">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-[42%_58%]">
//             <div className="border-b border-gray-100 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
//               <div className="flex items-center gap-3">
//                 <img
//                   src="https://i.pravatar.cc/100"
//                   alt="avatar"
//                   className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
//                 />

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-sm font-bold text-[#222]">VTS-55734</h3>

//                     <span className="rounded-full bg-[#F97908] px-1.5 py-0.5 text-[9px] font-bold text-white">
//                       VIP
//                     </span>
//                   </div>

//                   <div className="mt-1 flex gap-3 text-[11px] text-[#ecedf2]">
//                     <span>Premium User</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-3 grid grid-cols-3 gap-2 text-center">
//                 {[
//                   {
//                     number: "21",
//                     label: "Cart",
//                   },
//                   {
//                     number: "2",
//                     label: "To Pay",
//                   },
//                   {
//                     number: "0",
//                     label: "To Ship",
//                   },
//                 ].map((item) => (
//                   <div key={item.label}>
//                     <p className="text-sm font-bold text-gray-800">
//                       {item.number}
//                     </p>

//                     <span className="text-[10px] text-[#133458]">
//                       {item.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-2 grid grid-cols-3 gap-2">
//                 {[
//                   {
//                     icon: <ShoppingBag size={15} />,
//                     label: "Orders",
//                   },
//                   {
//                     icon: <Star size={15} />,
//                     label: "Favorites",
//                   },
//                   {
//                     icon: <Eye size={15} />,
//                     label: "Viewed",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     className="rounded-xl bg-gray-50 py-2 text-center text-gray-500"
//                   >
//                     <div className="flex justify-center">{item.icon}</div>

//                     <p className="mt-1 text-[10px]">{item.label}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-3">
//                 <div className="overflow-hidden rounded-xl">
//                   <div
//                     className={`flex ${enableTransition ? "transition-transform duration-500 ease-out" : ""}`}
//                     style={{
//                       transform: `translateX(-${activeOrder * 100}%)`,
//                     }}
//                   >
//                     {userOrders.map((order, index) => (
//                       <div
//                         key={index}
//                         className="flex min-w-full items-center gap-3 rounded-xl bg-gray-50 p-2.5 transition hover:bg-gray-100"
//                       >
//                         <img
//                           src={order.image}
//                           alt=""
//                           className="h-8 w-8 shrink-0 rounded-xl object-cover"
//                         />

//                         <div className="flex-1 overflow-hidden">
//                           <div className="flex items-center justify-between">
//                             <span className="text-[11px] font-bold text-[#F97908]">
//                               {order.status}
//                             </span>

//                             <span className="text-[11px] text-gray-400">
//                               {order.date}
//                             </span>
//                           </div>

//                           <p className="mt-1 truncate text-[10px] text-gray-600">
//                             {order.message}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full pt-1 sm:pr-5">
//               <div className="mb-5 flex items-center justify-between">
//                 <h3 className="text-sm font-bold">Track Your Orders</h3>

//                 <button className="text-xs text-gray-400">View All</button>
//               </div>

//               <div className="space-y-5">
//                 {[
//                   {
//                     image: products[0]?.imageUrl,
//                     step: 1,
//                   },
//                   {
//                     image: products[1]?.imageUrl,
//                     step: 2,
//                   },
//                   {
//                     image: products[6]?.imageUrl,
//                     step: 5,
//                   },
//                 ].map((order, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <img
//                       src={order.image}
//                       className="h-12 w-12 rounded-xl object-cover"
//                     />

                   
//                     <div className="flex-1">
//                       <div className="flex items-center">
//                         {[1, 2, 3, 4, 5, 6].map((step, i) => (
//                           <Fragment key={step}>
//                             <div
//                               className={`h-2 w-2 rounded-full ${
//                                 step <= order.step
//                                   ? "bg-[#F97908]"
//                                   : "bg-gray-400"
//                               }`}
//                             />

//                             {i < 5 && (
//                               <div
//                                 className={`h-[2px] flex-1 ${
//                                   step < order.step
//                                     ? "bg-[#F97908]"
//                                     : "bg-gray-300"
//                                 }`}
//                               />
//                             )}
//                           </Fragment>
//                         ))}
//                       </div>

//                       <div className="mt-2 flex justify-between gap-1 text-[10px] text-gray-500">
//                         <span>Paid</span>
//                         <span>Store</span>
//                         <span>China</span>
//                         <span>Shipping</span>
//                         <span>Cambodia</span>
//                         <span>Done</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div> */}
//         <div
//           className="relative overflow-hidden rounded-2xl border border-blue-100 bg-cover bg-center bg-no-repeat  p-3 shadow-sm sm:p-4 lg:col-span-5"
//           style={{
//             backgroundImage: "url('/backgroundSlideImage.png')",
//           }}
//         >
//           {/* Background overlay */}
//           <div className="absolute inset-0 bg-white/80 opacity-100" />

//           {/* USER + TRACK CONTENT */}
//           <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-[42%_58%]">
//             {/* USER SECTION */}
//             <div className="border-b border-white/40 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
//               {/* USER INFO */}
//               <div className="flex items-center gap-3">
//                 <img
//                   src="https://i.pravatar.cc/100"
//                   alt="avatar"
//                   className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
//                 />

//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-sm font-bold text-[#222]">VTS-55734</h3>

//                     <span className="rounded-full bg-[#F97908] px-1.5 py-0.5 text-[9px] font-bold text-white">
//                       VIP
//                     </span>
//                   </div>

//                   <div className="mt-1 flex gap-3 text-[11px] text-[#ecedf2]">
//                     <span>Premium User</span>
//                     {/* <span>Shipping</span> */}
//                   </div>
//                 </div>
//               </div>

//               {/* ORDER STATUS */}
//               <div className="mt-3 grid grid-cols-3 gap-2 text-center">
//                 {[
//                   {
//                     number: "21",
//                     label: "Cart",
//                   },
//                   {
//                     number: "2",
//                     label: "To Pay",
//                   },
//                   {
//                     number: "0",
//                     label: "To Ship",
//                   },
//                 ].map((item) => (
//                   <div key={item.label}>
//                     <p className="text-sm font-bold text-gray-800">
//                       {item.number}
//                     </p>

//                     <span className="text-[10px] text-[#133458]">
//                       {item.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* QUICK MENU */}
//               <div className="mt-2 grid grid-cols-3 gap-2">
//                 {[
//                   {
//                     icon: <ShoppingBag size={15} />,
//                     label: "Orders",
//                   },
//                   {
//                     icon: <Star size={15} />,
//                     label: "Favorites",
//                   },
//                   {
//                     icon: <Eye size={15} />,
//                     label: "Viewed",
//                   },
//                 ].map((item) => (
//                   <div
//                     key={item.label}
//                     className="rounded-xl bg-gray-50 py-2 text-center text-gray-500"
//                   >
//                     <div className="flex justify-center">{item.icon}</div>

//                     <p className="mt-1 text-[10px]">{item.label}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* ACTIVE ORDER SLIDER */}
//               <div className="mt-3">
//                 {/* Slider Container */}
//                 <div className="overflow-hidden rounded-xl">
//                   <div
//                     className={`flex ${enableTransition ? "transition-transform duration-500 ease-out" : ""}`}
//                     style={{
//                       transform: `translateX(-${activeOrder * 100}%)`,
//                     }}
//                   >
//                     {userOrders.map((order, index) => (
//                       <div
//                         key={index}
//                         className="flex min-w-full items-center gap-3 rounded-xl bg-gray-50 p-2.5 transition hover:bg-gray-100"
//                       >
//                         {/* Product Image */}
//                         <img
//                           src={order.image}
//                           alt=""
//                           className="h-8 w-8 shrink-0 rounded-xl object-cover"
//                         />

//                         {/* Order Information */}
//                         <div className="flex-1 overflow-hidden">
//                           <div className="flex items-center justify-between">
//                             <span className="text-[11px] font-bold text-[#F97908]">
//                               {order.status}
//                             </span>

//                             <span className="text-[11px] text-gray-400">
//                               {order.date}
//                             </span>
//                           </div>

//                           <p className="mt-1 truncate text-[10px] text-gray-600">
//                             {order.message}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* TRACK SECTION */}
//             <div className="w-full pt-1 sm:pr-5">
//               <div className="mb-5 flex items-center justify-between">
//                 <h3 className="text-sm font-bold">Track Your Orders</h3>

//                 <button className="text-xs text-gray-400">View All</button>
//               </div>

//               <div className="space-y-5">
//                 {[
//                   {
//                     image:
//                       "https://img.alicdn.com/imgextra/i1/2214183122092/O1CN011VvJPQ1RKBNZ61qun_!!0-item_pic.jpg",
//                     step: 1,
//                   },
//                   {
//                     image:
//                       "https://img.alicdn.com/imgextra/i1/132334451/O1CN01undF2r1ikc2VjbaER~crop,0,0,1842,1842~_!!132334451.jpg",
//                     step: 2,
//                   },
//                   {
//                     image:
//                       "https://img.alicdn.com/imgextra/i2/2215507736160/O1CN01fnRgKL1vNKht37F1E_!!2215507736160.jpg",
//                     step: 5,
//                   },
//                 ].map((order, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <img
//                       src={order.image}
//                       className="h-12 w-12 rounded-xl object-cover"
//                     />

//                     {/* update tracking to paid store china shipping cambodia delivered */}
//                     <div className="flex-1">
//                       <div className="flex items-center">
//                         {[1, 2, 3, 4, 5, 6].map((step, i) => (
//                           <Fragment key={step}>
//                             <div
//                               className={`h-2 w-2 rounded-full ${
//                                 step <= order.step
//                                   ? "bg-[#F97908]"
//                                   : "bg-gray-500"
//                               }`}
//                             />

//                             {i < 5 && (
//                               <div
//                                 className={`h-[2px] flex-1 ${
//                                   step < order.step
//                                     ? "bg-[#F97908]"
//                                     : "bg-gray-400"
//                                 }`}
//                               />
//                             )}
//                           </Fragment>
//                         ))}
//                       </div>

//                       <div className="mt-2 flex justify-between gap-1 text-[10px] text-gray-800">
//                         <span>Paid</span>
//                         <span>Store</span>
//                         <span>China</span>
//                         <span>Shipping</span>
//                         <span>Cambodia</span>
//                         <span>Done</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* TOP STORE + SMALL CARDS */}
//         <div className="space-y-2 lg:col-span-3">
//           {/* TOP STORE */}
//           <div className="rounded-2xl bg-white p-5 shadow-sm">
//             <div className="flex justify-between">
//               <h3 className="font-bold">Top Stores</h3>

//               <span className="text-xs text-gray-400">View All</span>
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
//               {["Xiaomi", "Apple", "Nike", "Uniqlo", "Adidas"].map((store) => (
//                 <div key={store} className="text-center">
//                   <div className="mx-auto h-10 w-10 rounded-xl bg-gray-100" />

//                   <p className="mt-2 text-xs font-semibold">{store}</p>

//                   {/* <span className="text-[10px] text-gray-400">
//                   Official Store
//                 </span> */}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* SMALL CARDS */}
//           <div className="grid grid-cols-2 gap-2">
//             {/* COUPON */}
//             <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 shadow-sm">
//               <div className="text-xl">🎟️</div>

//               <h4 className="mt-2 text-sm font-bold text-gray-800">Coupon</h4>

//               <p className="mt-1 text-[11px] text-gray-500">
//                 Get discount coupons
//               </p>
//             </div>

//             {/* LIVE */}
//             <div className="rounded-2xl bg-gradient-to-br from-red-50 to-pink-100 p-4 shadow-sm">
//               <div className="text-xl">📺</div>

//               <h4 className="mt-2 text-sm font-bold text-gray-800">Live</h4>

//               <p className="mt-1 text-[11px] text-gray-500">
//                 Watch shopping live
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* AD */}
//         <div className="relative lg:col-span-2">
//           <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl">
//             {slides.map((slide, index) => (
//               <div
//                 key={slide.id}
//                 className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
//                   index === activeSlideIndex
//                     ? "translate-x-0 opacity-100"
//                     : "translate-x-6 opacity-0"
//                 }`}
//               >
//                 {slide.image && (
//                   <img
//                     src={slide.image}
//                     alt={slide.title}
//                     className="h-full w-full rounded-2xl bg-red-300 object-cover"
//                   />
//                 )}
//               </div>
//             ))}

//             {/* Slider Dots */}
//             <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
//               {slides.map((slide, index) => (
//                 <button
//                   key={slide.id}
//                   type="button"
//                   onClick={() => setActiveSlideIndex(index)}
//                   className={`h-2.5 rounded-full transition-all duration-300 ${
//                     index === activeSlideIndex
//                       ? "w-7 bg-white"
//                       : "w-2.5 bg-white/60"
//                   }`}
//                   aria-label={`View slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
