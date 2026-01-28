(function() {
  'use strict';

  // Parse config from script tag
  const scriptTag = document.currentScript;
  const partnerId = scriptTag.dataset.partner;
  const embedType = scriptTag.dataset.embedType || 'inline';
  const targetElement = scriptTag.dataset.target || 'paddlefit-widget';

  // Get base URL (for local dev vs production)
  const baseUrl = scriptTag.dataset.baseUrl || 'https://paddlefit.co';

  // Create iframe
  function createQuizIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/widget/quiz?partner=${partnerId}`;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0.5rem';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'PaddleFit Quiz');

    // Listen for height changes from iframe
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'paddlefit-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });

    return iframe;
  }

  // Mount widget
  function mount() {
    const container = document.getElementById(targetElement);
    if (!container) {
      console.error(`PaddleFit: Container #${targetElement} not found`);
      return;
    }

    const iframe = createQuizIframe();
    container.appendChild(iframe);
  }

  // Auto-mount on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  // Expose global API
  window.PaddleFit = {
    version: '1.0.0',
    mount: mount,
  };
})();
