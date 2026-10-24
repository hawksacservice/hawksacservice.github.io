'use strict';
const galleryLinks = [...document.querySelectorAll('[data-photo]')];
const moreWork = document.querySelector('#more-work');
const extraWork = [...document.querySelectorAll('.work-card-extra')];
extraWork.forEach(card => card.hidden = true);
moreWork.hidden = false;
moreWork.addEventListener('click', () => {
  const expanded = moreWork.getAttribute('aria-expanded') !== 'true';
  extraWork.forEach(card => card.hidden = !expanded);
  moreWork.setAttribute('aria-expanded', String(expanded));
  moreWork.innerHTML = expanded ? 'Show fewer photos <span aria-hidden="true">−</span>' : 'View more work <span aria-hidden="true">+</span>';
});
const photoDialog = document.querySelector('.work-lightbox');
const fullPhoto = document.querySelector('#work-full-image');
let currentPhoto = 0;
let photoTrigger;
function displayPhoto(index) {
  currentPhoto = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[currentPhoto];
  fullPhoto.src = link.href;
  fullPhoto.alt = link.querySelector('img').alt;
  document.querySelector('#work-caption').textContent = link.closest('figure').querySelector('h3').textContent;
  document.querySelector('#work-counter').textContent = `${currentPhoto + 1} / ${galleryLinks.length}`;
}
galleryLinks.forEach((link, index) => link.addEventListener('click', event => {
  if (!photoDialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  photoTrigger = link;
  displayPhoto(index);
  photoDialog.showModal();
}));
photoDialog.querySelector('.lightbox-close').addEventListener('click', () => photoDialog.close());
photoDialog.querySelector('.lightbox-prev').addEventListener('click', () => displayPhoto(currentPhoto - 1));
photoDialog.querySelector('.lightbox-next').addEventListener('click', () => displayPhoto(currentPhoto + 1));
photoDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); displayPhoto(currentPhoto + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(currentPhoto - 1); }
});
photoDialog.addEventListener('click', event => {
  if (event.target !== photoDialog) return;
  const rect = photoDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) photoDialog.close();
});
photoDialog.addEventListener('close', () => photoTrigger?.focus({preventScroll:true}));
