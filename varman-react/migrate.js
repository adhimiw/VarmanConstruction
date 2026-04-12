const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'frontend/src/components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

const componentNames = files.map(f => f.replace('.jsx', ''));

// Update components
files.forEach(file => {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Prefix imports
    let prefix = `import React, { useState, useEffect } from 'react';\n`;
    prefix += `import { VarmanSite } from '../VarmanSite';\n`;
    prefix += `import { Icon } from '../Icon';\n`;
    
    // If the component uses another component, import it
    componentNames.forEach(name => {
        if (name !== file.replace('.jsx', '') && content.includes(`<${name}`)) {
            prefix += `import ${name} from './${name}';\n`;
        }
    });

    content = prefix + content;

    // Export component
    const componentName = file.replace('.jsx', '');
    content += `\nexport default ${componentName};\n`;

    fs.writeFileSync(filePath, content);
});

// Write VarmanSite.js
const varmanSiteContent = `
export const VARMAN_PRIMARY_PHONE = '+917708484811';
export const VARMAN_WHATSAPP_NUMBER = '917708484811';
export const VARMAN_CONTACT_EMAIL = 'info@varmanconstructions.in';

export function buildWhatsAppUrl(message, number) {
  var targetNumber = number || VARMAN_WHATSAPP_NUMBER;
  var sanitizedNumber = String(targetNumber).replace(/[^\\d]/g, '');
  var encodedMessage = message ? '?text=' + encodeURIComponent(message) : '';
  return 'https://wa.me/' + sanitizedNumber + encodedMessage;
}

export function openExternalUrl(url, target) {
  if (!url) {
    return null;
  }
  if (target === '_self') {
    window.location.assign(url);
    return null;
  }
  var popup = window.open(url, target || '_blank', 'noopener,noreferrer');
  if (popup) {
    popup.opener = null;
  }
  return popup;
}

export function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent || '');
}

export function openMailTo(email, options) {
  if (!email) {
    return null;
  }
  var params = new URLSearchParams();
  if (options && options.subject) {
    params.set('subject', options.subject);
  }
  if (options && options.body) {
    params.set('body', options.body);
  }
  var query = params.toString();
  var mailtoUrl = 'mailto:' + email + (query ? '?' + query : '');
  return openExternalUrl(mailtoUrl, '_self');
}

export const VarmanSite = {
  primaryPhone: VARMAN_PRIMARY_PHONE,
  whatsappNumber: VARMAN_WHATSAPP_NUMBER,
  contactEmail: VARMAN_CONTACT_EMAIL,
  buildWhatsAppUrl,
  openExternalUrl,
  isMobileDevice,
  openMailTo,
  openWhatsApp: function(message, target, number) {
    var resolvedTarget = target || (isMobileDevice() ? '_self' : '_blank');
    return openExternalUrl(buildWhatsAppUrl(message, number), resolvedTarget);
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'frontend/src/VarmanSite.js'), varmanSiteContent);

// Fix main.jsx
let mainContent = fs.readFileSync(path.join(__dirname, 'frontend/src/main.jsx'), 'utf8');

// Strip out everything before App.
mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
`;
fs.writeFileSync(path.join(__dirname, 'frontend/src/main.jsx'), mainContent);

// Write Icon.jsx
let rootContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'); // Just need a generic Icon if I didn't extract it, but I can extract from original main.
let iconSrc = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
let iconMatch = iconSrc.match(/function Icon\\(props\\) \\{[\\s\\S]*?default:\\s+return \\([\\s\\S]*?\\);\\s+\\}\\s+\\}/);
if (iconMatch) {
    let iconBody = iconMatch[0];
    fs.writeFileSync(path.join(__dirname, 'frontend/src/Icon.jsx'), "import React from 'react';\n" + iconBody + "\nexport { Icon };");
}
