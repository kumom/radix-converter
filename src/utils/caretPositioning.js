export function saveCaret(target) {
  // avoid sel.rangeCount === 0 problem in WebKit
  // See: https://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not/23699875
  target.focus();
  let savedRange = document.getSelection().getRangeAt(0);
  target.startOffset = savedRange.startOffset;
  target.endOffset = savedRange.endOffset;
}

export function restoreCaret(target) {
  let sel = window.getSelection(),
    restoredRange = document.createRange();
  restoredRange.setStart(target.firstChild, target.startOffset);
  restoredRange.setEnd(target.firstChild, target.endOffset);
  sel.removeAllRanges();
  sel.addRange(restoredRange);
}
