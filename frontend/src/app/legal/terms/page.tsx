'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <>
      <div className="section-header">
        <h2>Terms of Service</h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="text-content">
        <h3>1. Acceptance of Terms</h3>
        <p>By using the crisper API or web interface, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>

        <h3>2. Acceptable Use</h3>
        <p>Our service is designed to help developers extract and process audio for fair use cases. You agree not to abuse the API, perform denial-of-service attacks, or use the service for mass copyright infringement.</p>

        <h3>3. Service Availability</h3>
        <p>We provide this service for free, and as such, we do not guarantee 100% uptime. The backend engine may enter a sleep state during inactivity and may take up to 60 seconds to wake up.</p>

        <h3>4. Disclaimer of Warranties</h3>
        <p>The service is provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability, or non-infringement of intellectual property.</p>
      </div>
    </>
  );
}
