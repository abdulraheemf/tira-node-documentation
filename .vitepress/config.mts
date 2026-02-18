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
          { text: "Guide", link: "/getting-started" },
          { text: "Resources", link: "/motor" },
        ],
        sidebar: [
          {
            text: "Guide",
            items: [
              { text: "Getting Started", link: "/getting-started" },
              { text: "Initialization", link: "/initialization" },
              { text: "Signing & Verification", link: "/signing-verification" },
              { text: "Callbacks & Acknowledgements", link: "/callbacks-acknowledgements" },
              { text: "Error Codes", link: "/error-codes" },
            ],
          },
          {
            text: "Resources",
            items: [
              { text: "Motor", link: "/motor" },
              { text: "Motor Fleet", link: "/motor-fleet" },
              { text: "Non-Life Other", link: "/non-life-other" },
              { text: "Reinsurance", link: "/reinsurance" },
              { text: "Policy", link: "/policy" },
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
          { text: "Mwongozo", link: "/sw/getting-started" },
          { text: "Rasilimali", link: "/sw/motor" },
        ],
        sidebar: [
          {
            text: "Mwongozo",
            items: [
              { text: "Kuanza", link: "/sw/getting-started" },
              { text: "Uanzishaji", link: "/sw/initialization" },
              { text: "Usainiaji na Uthibitishaji", link: "/sw/signing-verification" },
              { text: "Callback na Uthibitisho", link: "/sw/callbacks-acknowledgements" },
              { text: "Misimbo ya Makosa", link: "/sw/error-codes" },
            ],
          },
          {
            text: "Rasilimali",
            items: [
              { text: "Magari", link: "/sw/motor" },
              { text: "Magari ya Msafara", link: "/sw/motor-fleet" },
              { text: "Bima Nyinginezo", link: "/sw/non-life-other" },
              { text: "Bima ya Kurudisha", link: "/sw/reinsurance" },
              { text: "Sera", link: "/sw/policy" },
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
