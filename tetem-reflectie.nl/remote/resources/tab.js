function getCodeBoxElement(index) {
  return document.getElementById("codeBox" + index);
}

function onKeyUpEvent(index, event) {
  const eventCode = event.which || event.keyCode;
  if (getCodeBoxElement(index).value.length === 1) {
    if (index !== 6) {
      getCodeBoxElement(index + 1).focus();
    } else {
      getCodeBoxElement(index).blur();

      // Submit code
      console.log("submit code ");
      // show loading circle
      document.getElementById("loader").hidden = false;

      // connect
      document.getElementById("submitbutton").click();
    }
  }
  if (eventCode === 8 && index !== 1) {
    getCodeBoxElement(index - 1).focus();
  }
}
function onFocusEvent(index) {
  for (item = 1; item < index; item++) {
    const currentElement = getCodeBoxElement(item);
    if (!currentElement.value) {
      currentElement.focus();
      break;
    }
  }
}
