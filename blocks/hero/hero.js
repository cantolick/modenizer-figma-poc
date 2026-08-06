/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  // The default hero renders its authored rows as-is. Only the "atelier"
  // variant restructures content into an overlay column with buttons.
  if (!block.classList.contains('atelier')) return;

  const rows = [...block.children];
  let picture;
  const contentEls = [];

  // separate the background image from the text content across all rows
  rows.forEach((row) => {
    const pic = row.querySelector('picture');
    if (pic) {
      picture = pic;
      return;
    }
    const cell = row.firstElementChild || row;
    contentEls.push(...cell.children);
  });

  block.textContent = '';

  // background image layer
  if (picture) {
    block.append(picture);
  }

  // content column
  const content = document.createElement('div');
  content.className = 'hero-content';
  const buttons = document.createElement('div');
  buttons.className = 'hero-buttons';

  // paragraphs before the first heading are treated as the eyebrow label
  let headingSeen = false;
  contentEls.forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) headingSeen = true;
    if (el.classList.contains('button-wrapper')) {
      buttons.append(el);
    } else {
      if (!headingSeen && el.tagName === 'P') el.classList.add('hero-eyebrow');
      content.append(el);
    }
  });

  if (buttons.children.length) {
    content.append(buttons);
  }

  block.append(content);
}
