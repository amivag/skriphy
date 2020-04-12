/**
 * Utility function, sourced from...
 * https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard
 * @param {*} text
 */
export function copyTextToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  //console.log(`Copied to clipboard ${text}`);
}
