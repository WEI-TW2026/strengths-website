document.querySelector('#print-article')?.addEventListener('click', () => window.print());
const fontControl = document.querySelector('#font-size');
const body = document.querySelector('#article-content');
fontControl?.addEventListener('change', () => {
  const scale = ['1', '1.15', '1.3'].includes(fontControl.value) ? fontControl.value : '1';
  body.style.setProperty('--reading-scale', scale);
});
