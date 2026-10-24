'use strict';

document.body.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.menu-label').textContent = 'Menu';
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);

const form = document.querySelector('#service-form');
const result = document.querySelector('#email-result');
const draftLink = document.querySelector('#email-draft-link');
const preview = document.querySelector('#request-text');
const copyStatus = document.querySelector('#copy-status');
let requestText = '';
form.hidden = false;
function invalidateDraft() {
  result.hidden = true;
  copyStatus.textContent = '';
  requestText = '';
  draftLink.href = 'mailto:hawksacservice@gmail.com';
}
form.addEventListener('input', invalidateDraft);
form.addEventListener('change', invalidateDraft);
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    form.elements.service.value = link.dataset.service;
    invalidateDraft();
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim();
  const subject = `Service request: ${value('service')}`;
  const body = [
    'Hello Hawks AC Service,', '',
    `I would like help with: ${value('service')}.`, '',
    `Name: ${value('name')}`,
    `Phone: ${value('phone')}`,
    `Email: ${value('email')}`,
    `City / ZIP: ${value('city')}`, '',
    'Details:', value('message') || 'Please contact me to discuss the details.', '',
    'Please contact me to confirm availability and the next steps.', '', 'Thank you!'
  ].join('\n');
  requestText = `To: hawksacservice@gmail.com\nSubject: ${subject}\n\n${body}`;
  draftLink.href = `mailto:hawksacservice@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  preview.textContent = requestText;
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestText);
    copyStatus.textContent = 'Copied. Paste this into your email and send it to Hawks.';
  } catch {
    document.querySelector('.request-preview').open = true;
    copyStatus.textContent = 'Please select and copy the request text shown below.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
