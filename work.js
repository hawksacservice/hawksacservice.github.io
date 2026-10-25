'use strict';
const galleryLinks = [...document.querySelectorAll('[data-photo]')];
const moreWork = document.querySelector('#more-work');
const galleryCards = [...document.querySelectorAll('#work-grid .work-card')];
const mobileGallery = window.matchMedia('(max-width: 680px)');
function updateGalleryVisibility() {
  const expanded = moreWork.getAttribute('aria-expanded') === 'true';
  const collapsedCount = mobileGallery.matches ? 4 : 6;
  galleryCards.forEach((card, index) => card.hidden = !expanded && index >= collapsedCount);
  moreWork.hidden = galleryCards.length <= collapsedCount;
  moreWork.innerHTML = expanded ? 'View less <span aria-hidden="true">−</span>' : 'View more <span aria-hidden="true">+</span>';
}
updateGalleryVisibility();
mobileGallery.addEventListener('change', updateGalleryVisibility);
moreWork.addEventListener('click', () => {
  const expanded = moreWork.getAttribute('aria-expanded') !== 'true';
  moreWork.setAttribute('aria-expanded', String(expanded));
  updateGalleryVisibility();
  if (!expanded) moreWork.scrollIntoView({block: 'nearest'});
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
