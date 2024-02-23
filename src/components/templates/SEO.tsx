import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

type SEOProps = {
  title: string;
  description?: string;
};

const SEO = ({ title, description }: SEOProps) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  );

  const seo = {
    title: title || site.title,
    description: description || site.description,
  };

  return (
    <>
      <title>{seo.title} | WhipWorks</title>
      <meta name="description" content={seo.description} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </>
  );
};

export default SEO;
