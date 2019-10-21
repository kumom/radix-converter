export function saveCaret(event, target) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  } else {
    if (target) {
      // avoid sel.rangeCount === 0 problem in WebKit
      // See: https://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not/23699875
      target.focus();
      let savedRange = document.getSelection().getRangeAt(0);
      target.startOffset = savedRange.startOffset;
      target.endOffset = savedRange.endOffset;
    }
  }
}

export function restoreCaret(target) {
  let sel = window.getSelection(),
    restoredRange = document.createRange(),
    textNode = target.firstChild;
  restoredRange.setStart(textNode, target.startOffset);
  restoredRange.setEnd(
    textNode,
    Math.min(target.endOffset, textNode.length - 1)
  );
  sel.removeAllRanges();
  sel.addRange(restoredRange);
}
