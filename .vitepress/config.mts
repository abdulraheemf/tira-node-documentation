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
          { text: "Examples", link: "/markdown-examples" },
        ],
        sidebar: [
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
          { text: "Mifano", link: "/sw/markdown-examples" },
        ],
        sidebar: [
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
  },
});
