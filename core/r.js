function loadImage(url) {
  let req = new Request(url);
  return req.loadImage();
}

module.exports = {
  loadImage,
};
