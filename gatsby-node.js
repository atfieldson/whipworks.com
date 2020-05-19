const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const resolveSnipcartFields = (variants) => {
  const fields = {};
  if (!variants) {
    return fields;
  }

  for (let i = 0; i < variants.length; i += 1) {
    const variant = variants[i];
    let index = i + 1;
    fields[`data-item-custom${index}-name`] = variant.name;
    const options = variant.options
      .map((o) => `${o.name}${o.priceDiff ? `[${o.priceDiff}]` : ''}`)
      .join('|');
    fields[`data-item-custom${index}-options`] = options;
    fields[`data-item-custom${index}-value`] = variant.defaultValue;
  }
  return fields;
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const whipPage = path.resolve(`./src/components/templates/SpecialtyWhipPage.tsx`);
  const productPage = path.resolve('./src/components/templates/ProductPage.tsx');
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___title], order: DESC }, limit: 1000) {
          edges {
            node {
              fields {
                slug
                collection
              }
              frontmatter {
                title
                images
                headerImage
                description
                variants {
                  name
                  options {
                    name
                    priceDiff
                  }
                }
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }

  // Create blog whip pages.
  const whips = result.data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.fields.collection === 'specialty'
  );
  const products = result.data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.fields.collection === 'accessories'
  );

  products.forEach((product, index) => {
    const previous = index === products.length - 1 ? products[0].node : products[index + 1].node;
    const next = index === 0 ? products[products.length - 1].node : products[index - 1].node;

    const snipcartOptions = resolveSnipcartFields(product.node.frontmatter.variants);

    createPage({
      path: product.node.fields.slug,
      component: productPage,
      context: {
        slug: product.node.fields.slug,
        previous,
        next,
        snipcartOptions,
      },
    });
  });

  whips.forEach((post, index) => {
    const previous = index === whips.length - 1 ? whips[0].node : whips[index + 1].node;
    const next = index === 0 ? whips[whips.length - 1].node : whips[index - 1].node;

    const snipcartOptions = resolveSnipcartFields(post.node.frontmatter.variants);

    createPage({
      path: post.node.fields.slug,
      component: whipPage,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
        snipcartOptions,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const collection = getNode(node.parent).sourceInstanceName;
    const value = createFilePath({ node, getNode });
    createNodeField({
      node,
      name: 'collection',
      value: collection,
    });
    createNodeField({
      name: `slug`,
      node,
      value: `/${collection}${value}`,
    });
  }
};
