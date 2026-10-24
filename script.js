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
document.addEventListener('click', event => {
  if (navigation.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('focusin', event => {
  if (navigation.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);

const form = document.querySelector('#service-form');
const result = document.querySelector('#email-result');
const statusTitle = document.querySelector('#form-status-title');
const statusMessage = document.querySelector('#form-status-message');
const draftLink = document.querySelector('#email-draft-link');
const submitButton = form.querySelector('[type="submit"]');
const submitLabel = submitButton.innerHTML;
let sending = false;
function clearResult() {
  if (sending) return;
  result.hidden = true;
  submitButton.disabled = false;
  submitButton.removeAttribute('data-sent');
  submitButton.innerHTML = submitLabel;
}
form.addEventListener('input', clearResult);
form.addEventListener('change', clearResult);
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    if (sending) return;
    form.elements.service.value = link.dataset.service;
    clearResult();
  });
});
function showResult(state, title, message) {
  result.dataset.state = state;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  draftLink.hidden = state !== 'error';
  result.hidden = false;
  result.focus({preventScroll:true});
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim();
  if (value('_honey')) return;
  const subject = `Website service request: ${value('service')}`;
  data.set('_subject', subject);
  const body = ['Hello Hawks AC Service,', '', `Service: ${value('service')}`, `Name: ${value('name')}`, `Phone: ${value('phone')}`, `Email: ${value('email')}`, `City / ZIP: ${value('city')}`, '', 'Details:', value('message') || 'Please contact me to discuss the details.'].join('\n');
  draftLink.href = `mailto:hawksacservice@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const controls = [...form.querySelectorAll('input,select,textarea,button')];
  controls.forEach(control => control.disabled = true);
  sending = true;
  form.setAttribute('aria-busy','true');
  result.hidden = true;
  submitButton.textContent = 'Sending your request…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  let sent = false;
  try {
    const response = await fetch('https://formsubmit.co/ajax/hawksacservice@gmail.com', {
      method:'POST', headers:{'Accept':'application/json'}, body:data, signal:controller.signal
    });
    const payload = await response.json();
    if (/activat|confirm.*email|verify.*email|check.*email/i.test(payload.message || '')) {
      showResult('error', 'Please contact Hawks directly.', 'Online delivery is still being set up. Your request has not been confirmed. Please call (561) 780-5220 or email the details below.');
    } else {
      if (!response.ok || !(payload.success === true || payload.success === 'true')) {
        console.warn('Form delivery service:', response.status, payload.message || 'Submission not accepted');
        throw new Error('Submission not accepted');
      }
      sent = true;
      showResult('success', 'Your request has been sent.', 'Thank you for contacting Hawks. We’ll follow up to discuss your needs and confirm availability. An appointment is not booked until we confirm it with you.');
    }
  } catch {
    showResult('error', 'We couldn’t confirm your request.', 'Your details are still here. Please call (561) 780-5220 or use the email button below so we can help.');
  } finally {
    clearTimeout(timeout);
    sending = false;
    controls.forEach(control => control.disabled = false);
    form.removeAttribute('aria-busy');
    submitButton.innerHTML = sent ? 'Request sent ✓' : submitLabel;
    submitButton.disabled = sent;
    if (sent) submitButton.setAttribute('data-sent','');
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
