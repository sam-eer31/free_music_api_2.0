'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <>
      <div className="section-header">
        <h2>Privacy Policy</h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="text-content">
        <h3>1. Information Collection</h3>
        <p>We do not collect any personal information. Our service operates entirely anonymously. You do not need to create an account or provide any data to use our API.</p>

        <h3>2. Audio Processing & Storage</h3>
        <p>When you submit an audio link or search query, our servers temporarily process the request. The final audio file is uploaded to a third-party temporary CDN (tmpfiles.org) and is automatically deleted after 48 hours. We do not keep logs of your search history or downloaded files.</p>

        <h3>3. Cookies</h3>
        <p>We do not use any tracking cookies. The only local storage utilized is for saving your theme preference (Light/Dark mode) in your browser.</p>

        <h3>4. Third-Party Services</h3>
        <p>Our service relies on third-party services for rendering and CDN delivery. By using our API, you acknowledge that your extracted files will be temporarily hosted by these providers.</p>
      </div>
    </>
  );
}
