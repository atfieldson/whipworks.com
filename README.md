## 🚀 Quick start

1.  **Install Gatsby**
    This site is built on [gatsby.js](https://www.gatsbyjs.org/), so you haven't done so already, you'll need to install the CLI tools.

    ```shell
    npm install -g gatsby-cli
    ```

2.  **Start developing**

    Navigate into the root directory (the same as this README) and start the gatsby server.

    ```shell
    gatsby develop
    ```

3.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Any changes made to the source code will update in real time!

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: The source code, cleverly enough.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

## 💫 Deploy

1. If you haven't done so already, you'll also need to install the [aws-cli tools](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html). Make sure that your credentials are the default as the s3-deployment plugin only reads the default values (i.e. no named profile).

Terminal Commands
dir              = ls on Terminal
cd               just like in Mac
yarn             (no arguments) installs dependencies
yarn build       builds the site
mkdir .cache     for if .cache doesn't exist and I don't have permission to create it


2. run `yarn run build`, followed by `yarn run deploy`. That's it!

## Tasks for Adam

1. Select hero image (green background) for `index` page.
2. Populate Instagram feed with images (6 of them)
3. Flesh out "What goes into a bullwhip" section on `index`.
