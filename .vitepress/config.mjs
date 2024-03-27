import { defineConfig } from "vitepress";
const getSidebar = require("./get_sidebar.js");
//import { getSidebar } from "./get_sidebar";

import markdownItVideo from "markdown-it-video";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PX4 Guide (main)",
  description: "PX4 User and Developer Guide",
  base: process.env.BRANCH_NAME
    ? "/" + process.env.BRANCH_NAME + "/"
    : "/px4_user_guide/",
  srcExclude: ["de/**/*.md", "ja/**/*.md", "ru/**/*.md", "tr/**/*.md"],
  ignoreDeadLinks: true,
  markdown: {
    math: true,

    //   container: {
    //     tipLabel: "Note",
    //   },

    config: (md) => {
      // use more markdown-it plugins!
      md.use(markdownItVideo);
    },
  },
  locales: {
    en: {
      label: "English",
      // other locale specific properties...
      themeConfig: {
        sidebar: getSidebar.sidebar("en"),
      },
    },
    zh: {
      label: "中文 (Chinese)",
      lang: "zh-CN", // optional, will be added  as `lang` attribute on `html` tag
      themeConfig: {
        sidebar: getSidebar.sidebar("zh"),
      },
      // other locale specific properties...
    },
    ko: {
      label: "한국어 (Korean)",
      lang: "ko-KR", // optional, will be added  as `lang` attribute on `html` tag
      themeConfig: {
        sidebar: getSidebar.sidebar("ko"),
      },

      // other locale specific properties...
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/px4-logo.svg",
    sidebar: getSidebar.sidebar("en"),
    editLink: {
      pattern: "https://github.com/PX4/PX4-user_guide/edit/main/:path",
      text: "Edit on GitHub",
    },

    nav: [
      {
        text: "PX4",
        items: [
          {
            text: "Website",
            link: "https://px4.io/",
            ariaLabel: "PX4 website link",
          },
          {
            text: "Autopilot Source Code",
            link: "https://github.com/PX4/PX4-Autopilot",
          },
          {
            text: "Docs Source Code",
            link: "https://github.com/PX4/PX4-user_guide",
          },
        ],
      },
      {
        text: "Dronecode",
        items: [
          {
            text: "QGroundControl",
            link: "http://qgroundcontrol.com/",
          },
          {
            text: "MAVSDK",
            link: "https://mavsdk.mavlink.io/",
          },
          {
            text: "MAVLINK",
            link: "https://mavlink.io/en/",
          },
          {
            text: "QGroundControl Guide",
            link: "https://docs.qgroundcontrol.com/master/en/qgc-user-guide/",
          },
          {
            text: "Dronecode Camera Manager",
            link: "https://camera-manager.dronecode.org/en/",
          },
        ],
      },
      {
        text: "Support",
        link: "https://docs.px4.io/main/en/contribute/support.html",
      },
      {
        text: "Version",
        items: [
          { text: "main", link: "https://docs.px4.io/main/zh/" },
          { text: "v1.14", link: "https://docs.px4.io/v1.14/zh/" },
          { text: "v1.13", link: "https://docs.px4.io/v1.13/zh/" },
          { text: "v1.12", link: "https://docs.px4.io/v1.12/zh/" },
          { text: "v1.11", link: "https://docs.px4.io/v1.11/zh/" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/PX4/PX4-user_guide" },
    ],
  },
});
