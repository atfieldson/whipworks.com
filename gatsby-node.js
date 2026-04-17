const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type MarkdownRemarkFrontmatterVariantsOptions {
      name: String
      priceDiff: Float
      images: [MarkdownRemarkFrontmatterImage]
    }
    type MarkdownRemarkFrontmatterImage {
      url: String
      caption: String
    }
    type MarkdownRemarkFrontmatterSpecs {
      label: String
      value: String
    }
  `);
};

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
      .map((o) => {
        const diff = Number(o.priceDiff);
        if (!diff) return o.name;
        const sign = diff > 0 ? '+' : '';
        return `${o.name}[${sign}${diff}]`;
      })
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
  const paracordPage = path.resolve('./src/components/templates/ParacordPage.tsx');
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
                images {
                  url
                }
                headerImage
                description
                customLayout
                variants {
                  name
                  defaultValue
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
  const materials = result.data.allMarkdownRemark.edges.filter(
    (edge) => edge.node.fields.collection === 'materials'
  );

  materials.forEach((material) => {
    const isCustomLayout = material.node.frontmatter.customLayout === true;
    const snipcartOptions = resolveSnipcartFields(material.node.frontmatter.variants);

    createPage({
      path: material.node.fields.slug,
      component: isCustomLayout ? paracordPage : productPage,
      context: {
        slug: material.node.fields.slug,
        snipcartOptions,
        collection: 'materials',
      },
    });
  });

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
        collection: 'accessories',
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

exports.onPostBuild = async ({ graphql }) => {
  const fs = require(`fs`);

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              collection
            }
            frontmatter {
              title
              images {
                url
                caption
              }
              variants {
                options {
                  images {
                    url
                    caption
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error('Image sitemap generation failed:', result.errors);
    return;
  }

  const siteUrl = 'https://www.whipworks.com';
  const pages = result.data.allMarkdownRemark.edges
    .filter(({ node }) => {
      const images = node.frontmatter.images;
      return images && images.length > 0;
    })
    .map(({ node }) => {
      // Collect top-level images
      const allImages = [...(node.frontmatter.images || [])];

      // Collect variant/style images
      if (node.frontmatter.variants) {
        for (const variant of node.frontmatter.variants) {
          if (variant.options) {
            for (const option of variant.options) {
              if (option.images) {
                allImages.push(...option.images);
              }
            }
          }
        }
      }

      return {
        url: `${siteUrl}${node.fields.slug}`,
        images: allImages,
      };
    });

  const escapeXml = (str) =>
    str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.url)}</loc>
${page.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>${
      img.caption
        ? `
      <image:title>${escapeXml(img.caption)}</image:title>`
        : ''
    }
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'public', 'image-sitemap.xml'), xml);
  console.log(`Generated image-sitemap.xml with ${pages.length} pages`);
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
