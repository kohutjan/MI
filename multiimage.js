/*
function getPixelsFromFloat(value)
{
  return Math.floor(value).toString().concat("px");
}

function hidePolygon(multiimage)
{
  for (var i = 1; i < multiimage.children.length; ++i)
  {
    multiimage.children[i].style.display = 'none';
  }
}


function drawPolygonImage(image, topOffset, leftOffset)
{
  image.style.display = '';
  image.style.position = 'absolute';
  image.style.top = getPixelsFromFloat(topOffset);
  image.style.left = getPixelsFromFloat(leftOffset);
}


function drawPolygon(multiimage, r)
{
  console.log("lol");
  var firstImage = multiimage.firstElementChild.firstElementChild;
  var firstImagePosition = firstImage.getBoundingClientRect();
  var centerTop = firstImagePosition.top;
  var centerLeft = firstImagePosition.left;
  var polygonImagesLength = multiimage.children.length - 1;
  var alfa = 2 * Math.PI / polygonImagesLength;
  for (var i = 0; i < polygonImagesLength; ++i)
  {
    var actualAlfa = i * alfa;
    var relativeTopOffset = r * Math.sin(actualAlfa);
    var relativeLeftOffset = r * Math.cos(actualAlfa);
    var topOffset = centerTop - relativeTopOffset;
    var leftOffset = centerLeft - relativeLeftOffset;
    drawPolygonImage(multiimage.children[i + 1], topOffset, leftOffset);
  }
}

function addListeners(multiimage)
{
  multiimage.addEventListener("mouseover", drawPolygon(multiimage, 250), false);
  multiimage.addEventListener("mouseout", hidePolygon(multiimage), false);
}

*/
function testim() {
  this.style.background = 'black';
};

function testim2() {
  this.style.background = 'white';
};

//var multiimage = Array.from(document.getElementsByClassName('multiimage'));
var test = document.getElementsByClassName('test')[0];
test.addEventListener("mouseenter", testim);
test.addEventListener("mouseleave", testim2);

//multiimage[0].firstElementChild.firstElementChild.addEventListener("mouseout", hidePolygon(multiimage[0]), false);
