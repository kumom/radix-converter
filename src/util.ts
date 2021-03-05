export const activeColor = (radix: number) => `hsla(${radix * 10}, 70%, 40%, 0.6)`;

// Auto-resize <input> / <textarea> element to fit exactly its content
export function resize(node: HTMLElement | HTMLInputElement | null) {
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
  
    const width = sizeHelper.offsetWidth + Math.floor(sizeHelper.offsetWidth / content.length);
    const height = sizeHelper.offsetHeight;
  
    document.body.removeChild(sizeHelper);
  
    node.style.width = width + 'px';
    node.style.height = height + 'px';
  }