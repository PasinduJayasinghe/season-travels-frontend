// src/components/Portal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, containerId = 'portal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // Create or get the portal container
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'relative';
      portalContainer.style.zIndex = '2147483647';
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    // Cleanup function
    return () => {
      if (portalContainer && portalContainer.childNodes.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  return container ? createPortal(children, container) : null;
};

export default Portal;
