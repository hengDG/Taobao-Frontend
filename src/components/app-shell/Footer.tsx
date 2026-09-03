import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Rules and Regulations",
    links: ["E-Taobao rules", "Platform service agreement", "Privacy policy"],
  },

  {
    title: "Newbie on the road",
    links: ["Open a store", "Merchant services", "Seller center"],
  },

  {
    title: "Payment method",
    links: ["Quick payment", "Secure transaction", "Refund policy"],
  },

  {
    title: "E-Taobao features",
    links: ["Product search", "Order tracking", "International shipping"],
  },
];

const bottomLinks = [
  "About E-Taobao",
  "Marketing center",
  "Open platform",
  "Career",
  "Privacy policy",
  "Legal statement",
  "Contact us",
  "VTS Company",
];

const paymentImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShaTU8DRjv1TobkIpcLL8_efH0_7pP8TbFV7rFYclmjg&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCmeUXPLEQqN3TPHnfhPXcJynWeaMj70gE8wOKoX8MkA&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7rGey_UdcXYMyQogoSV40gX_VfrVYrfAiRGAMTvMZkw&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqG2UYc8AXaLHuFgATkeEFgze9yCyT7RROpGWZhxJpBBBWLp21TIBdrK0&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLYbS4pA5-MpmjowQH22xK-k0WTmEbKaSuywcyJsc46A&s",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU5zCiSO40T3teujZVs0Tg5RJCEdO5tJljTf9LBahK8Q&s=10",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div
        className="
        mx-auto
        max-w-7xl
        px-6
        pb-8
        pt-4
        "
      >
        {/* Main Footer */}

        <div
          className="
          grid
          grid-cols-2
          gap-2
          md:grid-cols-4
          "
        >
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3
                className="
                mb-1
                text-[13px]
                font-semibold
                text-slate-900
                "
              >
                {section.title}
              </h3>

              <ul className="space-y-1">
                {section.links.map((item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="
                      text-[12px]
                      text-slate-500
                      transition
                      hover:text-[#ff6a00]
                      "
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Links */}

        <div
          className="
          mt-3
          border-t
          border-slate-200
          pt-6
          "
        >
          <div
            className="
            flex
            flex-wrap
            gap-x-6
            gap-y-3
            text-xs
            text-slate-400
            "
          >
            {bottomLinks.map((item) => (
              <Link
                key={item}
                to="/"
                className="
                transition
                hover:text-[#ff6a00]
                "
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Copyright */}

          <div
            className="
            mt-3
            space-y-2
            text-xs
            leading-5
            text-slate-400
            "
          >
            <p>© {year} E-Taobao by VTS Company. All rights reserved.</p>

            <p>
              Cambodia online shopping platform · Secure payment · International
              delivery service · Buyer protection and seller support.
            </p>

            <p>
              VTS Express Co., Ltd · Phnom Penh, Cambodia · License registration
              and digital commerce operations are conducted in compliance with
              applicable local laws and marketplace policies.
            </p>

            <p className="pt-1">
              This website is operated as an online marketplace for cross-border
              trade, product discovery, payment processing, customer support,
              and secure logistics coordination. Users are responsible for
              adhering to all applicable platform policies, product regulations,
              and trade compliance requirements while using the service.
            </p>
          </div>

          {/* Payment Gateway Bottom */}

          <div
            className="
            mt-6
            flex
            flex-wrap
            items-center
            gap-3
            "
          >
            {paymentImages.map((image, index) => (
              <div
                key={index}
                className="
                flex
                items-center
                justify-center
                rounded-md
                border
                border-slate-200
                bg-white
                transition
                hover:shadow-sm
                "
              >
                <img
                  src={image}
                  alt="payment gateway"
                  className="
                  max-h-6
                  max-w-full
                  object-contain
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
