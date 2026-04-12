import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

type SEOProps = {
  title: string;
  description?: string;
  image?: string;
  pathname?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const SEO = ({ title, description, image, pathname, structuredData }: SEOProps) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
            description
          }
        }
      }
    `
  );

  const seo = {
    title: title || site.title,
    siteUrl: site.siteMetadata.siteUrl,
    description: description || site.description,
  };

  const ogImage = image || `${seo.siteUrl}/favicon_large.png`;

  return (
    <>
      <title>{seo.title} | WhipWorks</title>
      <meta name="description" content={seo.description} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      {pathname && (
        <meta property="og:url" content={`${seo.siteUrl}${pathname}`} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
};

export default SEO;
