
export const getDimension = (content: string, fontStyle: {fontFamily: string, fontSize: string}): [number, number] => {
    // style has to match the <textarea/> element in order to precisely measure the dimension
    const sizeHelper = document.createElement('div');
    document.body.append(sizeHelper);
    sizeHelper.innerHTML = content;
    sizeHelper.style.display = "block";
    sizeHelper.style.visibility = "hidden";
    sizeHelper.style.maxHeight = "100vh";
    sizeHelper.style.maxWidth = "100vw";
    sizeHelper.style.fontFamily = fontStyle.fontFamily;
    sizeHelper.style.fontSize = fontStyle.fontSize;
    sizeHelper.style.position = "fixed";
    sizeHelper.style.overflow = "auto";
    const width = sizeHelper.offsetWidth;
    const height = sizeHelper.offsetHeight;
    document.body.removeChild(sizeHelper);
    return [width, height];
  }