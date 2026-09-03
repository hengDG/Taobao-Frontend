export default {
  theme: {
    extend: {
      keyframes: {
        "sidebar-enter": {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },

        "icon-bounce": {
          "0%,100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },

        "cart-shake": {
          "0%,100%": {
            transform: "rotate(0)",
          },
          "25%": {
            transform: "rotate(-12deg)",
          },
          "75%": {
            transform: "rotate(12deg)",
          },
        },

        "badge-pop": {
          "0%": {
            scale: "0",
          },
          "70%": {
            scale: "1.2",
          },
          "100%": {
            scale: "1",
          },
        },

        "active-glow": {
          "0%,100%": {
            boxShadow:
              "0 0 0 rgba(37,99,235,0)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(37,99,235,.35)",
          },
        },
      },

      animation: {
        "sidebar-enter":
          "sidebar-enter .5s ease-out",
        "icon-bounce":
          "icon-bounce .6s ease-in-out infinite",
        "cart-shake":
          "cart-shake .5s ease",
        "badge-pop":
          "badge-pop .3s ease-out",
        "active-glow":
          "active-glow 2s infinite",
      },
    },
  },
};