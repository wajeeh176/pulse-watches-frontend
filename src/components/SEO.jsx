import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'Pulse Watches - Premium Luxury Watches in Pakistan',
  description = 'Discover authentic luxury timepieces from world-renowned brands at Pulse Watches. Premium watches with fast delivery across Pakistan. 100% authentic, cash on delivery.',
  keywords = 'luxury watches, premium watches, rolex, patek philippe, tissot, citizen, watches pakistan, authentic watches, buy watches online',
  author = 'Pulse Watches',
  image = 'https://pulsewatches.pk/images/hero-bg.jpg',
  url = 'https://pulsewatches.pk',
  type = 'website',
  noindex = false,
  nofollow = false
}) {
  const fullTitle = title.includes('Pulse Watches') ? title : `${title} | Pulse Watches`;
  const robots = noindex || nofollow 
    ? `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`
    : 'index, follow';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Pulse Watches" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#c4975b" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
