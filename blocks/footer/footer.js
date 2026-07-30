import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the top-level sections so CSS can style them
  const sectionClasses = ['footer-brand', 'footer-links', 'footer-legal'];
  sectionClasses.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(c);
  });

  block.append(footer);
}
