'use client'

import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-11324883721"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11324883721');
          
          // Conversion tracking function
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
                'send_to': 'AW-11324883721/7OqlCMnpl_0ZEImGkJgq',
                'value': 1.0,
                'currency': 'INR',
                'event_callback': callback
            });
            return false;
          }
        `}
      </Script>
      
      {/* Google AdSense Script */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9525032831778850"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  )
}

