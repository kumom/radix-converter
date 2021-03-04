
// Auto-resize <input> / <textarea> element to fit exactly its content
export function resize(node: HTMLElement | HTMLInputElement | null, extraWidth?: number, extraHeight?: number) {
  if (!node) return;

  let content: string = "";
  if (node.tagName === "INPUT")
    content = (node as HTMLInputElement).value;
  else
    content = node.innerHTML;

  if (!content) content = "0";

  const sizeHelper = document.createElement('div');
  document.body.append(sizeHelper);
  sizeHelper.innerHTML = content;
  // Copy necessary styles of node to sizeHelper
  const styles = window.getComputedStyle(node);
  sizeHelper.style.display = "block";
  sizeHelper.style.visibility = "hidden";
  sizeHelper.style.position = "fixed";
  sizeHelper.style.whiteSpace = styles.getPropertyValue("white-space");
  sizeHelper.style.wordWrap = styles.getPropertyValue("word-wrap");
  sizeHelper.style.fontFamily = styles.getPropertyValue("font-family");
  sizeHelper.style.fontSize = styles.getPropertyValue("font-size");
  sizeHelper.style.maxWidth = styles.getPropertyValue("max-width");
  sizeHelper.style.maxHeight = styles.getPropertyValue("max-height");

  const width = sizeHelper.offsetWidth;
  const height = sizeHelper.offsetHeight;

  document.body.removeChild(sizeHelper);

  if (!extraWidth) extraWidth = 0;
  if (!extraHeight) extraHeight = 0;
  node.style.width = (width + extraWidth) + 'px';
  node.style.height = (height + extraHeight) + 'px';
}