
export const VARMAN_PRIMARY_PHONE = '+917708484811';
export const VARMAN_WHATSAPP_NUMBER = '917708484811';
export const VARMAN_CONTACT_EMAIL = 'info@varmanconstructions.in';

export function buildWhatsAppUrl(message, number) {
  var targetNumber = number || VARMAN_WHATSAPP_NUMBER;
  var sanitizedNumber = String(targetNumber).replace(/[^\d]/g, '');
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
