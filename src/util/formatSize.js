const unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
export function formartSize(size = "") {
  try {
    if (!size) return "0";

    if (parseInt(size)) {
      let index = 0,
        srcsize = parseFloat(size);
      index = Math.floor(Math.log(srcsize) / Math.log(1024));
      var sizes = srcsize / Math.pow(1024, index);
      sizes = sizes.toFixed(2);
      return sizes + unitArr[index];
    }
  } catch (err) {
    throw new Error(err);
  }
}
