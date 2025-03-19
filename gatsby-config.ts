import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Cut Sheet Generator`,
    siteUrl: `https://github.com/tallman5/cut-sheet-generator`
  },
  graphqlTypegen: true,
  plugins:
    [
      "gatsby-plugin-image",
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          "name": "images",
          "path": "./src/images/"
        },
        __key: "images"
      }
    ]
};

export default config;
