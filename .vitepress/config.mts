import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TIRA NodeJS Documentation",
  description:
    "The documentation for the TIRA NodeJS package created by Labedan IT Solutions",

  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Getting Started", link: "/getting-started" },
          { text: "Examples", link: "/markdown-examples" },
        ],
        sidebar: [
          {
            text: "Getting Started",
            items: [
              { text: "Getting Started", link: "/getting-started" },
              { text: "Initialization", link: "/initialization" },
              { text: "Signing & Verification", link: "/signing-verification" },
              { text: "Callbacks & Acknowledgements", link: "/callbacks-acknowledgements" },
              { text: "Error Codes", link: "/error-codes" },
            ],
          },
          {
            text: "Examples",
            items: [
              { text: "Markdown Examples", link: "/markdown-examples" },
              { text: "Runtime API Examples", link: "/api-examples" },
            ],
          },
        ],
      },
    },
    sw: {
      label: "Kiswahili",
      lang: "sw",
      title: "Nyaraka za TIRA NodeJS",
      description:
        "Nyaraka za kifurushi cha TIRA NodeJS kilichoundwa na Labedan IT Solutions",
      themeConfig: {
        nav: [
          { text: "Nyumbani", link: "/sw/" },
          { text: "Kuanza", link: "/sw/getting-started" },
          { text: "Mifano", link: "/sw/markdown-examples" },
        ],
        sidebar: [
          {
            text: "Kuanza",
            items: [
              { text: "Kuanza", link: "/sw/getting-started" },
              { text: "Uanzishaji", link: "/sw/initialization" },
              { text: "Usainiaji na Uthibitishaji", link: "/sw/signing-verification" },
              { text: "Callback na Uthibitisho", link: "/sw/callbacks-acknowledgements" },
              { text: "Misimbo ya Makosa", link: "/sw/error-codes" },
            ],
          },
          {
            text: "Mifano",
            items: [
              { text: "Mifano ya Markdown", link: "/sw/markdown-examples" },
              { text: "Mifano ya Runtime API", link: "/sw/api-examples" },
            ],
          },
        ],
        sidebarMenuLabel: "Menyu",
        returnToTopLabel: "Rudi Juu",
        darkModeSwitchLabel: "Mandhari",
        langMenuLabel: "Badilisha lugha",
        outline: { label: "Katika ukurasa huu" },
        docFooter: { prev: "Ukurasa uliopita", next: "Ukurasa unaofuata" },
        notFound: {
          title: "UKURASA HAUJAPATIKANA",
          linkText: "Nipeleke nyumbani",
        },
      },
    },
  },

  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Labedan-IT-Solutions/tira-node",
      },
    ],

    search: {
      provider: "local",
      options: {
        locales: {
          sw: {
            translations: {
              button: { buttonText: "Tafuta", buttonAriaLabel: "Tafuta" },
              modal: {
                noResultsText: "Hakuna matokeo ya",
                resetButtonTitle: "Futa utafutaji",
                footer: {
                  selectText: "kuchagua",
                  navigateText: "kusogea",
                  closeText: "kufunga",
                },
              },
            },
          },
        },
      },
    },
  },
});
