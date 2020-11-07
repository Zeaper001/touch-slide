// Extracts the values from css translate property fir IE compatibility
export const getTranslateCSS = (item) => {
    var transArr = [];

    if (!window.getComputedStyle) return;
    var style     = getComputedStyle(item),
        transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
    var mat       = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : transArr.push(0);
    mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : transArr.push(0);

    return transArr;
}