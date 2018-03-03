var polygonDrawn = false;
var mouseInsideCircle = false;

function getPixelsFromFloat(value)
{
  return Math.floor(value).toString().concat("px");
}


function hideCircle(circle)
{
  if (!mouseInsideCircle)
  {
    circle.style.display = 'none';
  }
}


function hidePolygon(multiimage)
{
  if (!mouseInsideCircle)
  {
    for (var i = 1; i < multiimage.children.length; ++i)
    {
      multiimage.children[i].style.display = 'none';
    }
    polygonDrawn = false;
  }
}


function drawPolygonImage(image, topOffset, leftOffset)
{
  image.style.display = '';
  image.style.position = 'absolute';
  image.style.top = getPixelsFromFloat(topOffset);
  image.style.left = getPixelsFromFloat(leftOffset);
}


function clickThroughCircle(circle)
{
  var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  circle.style.display = 'none';
  document.elementFromPoint(event.clientX , event.clientY).click();
  circle.style.display = '';
}


function drawCircle(multiimage, centerTop, centerLeft, r, polygonImageSize)
{
  var circleDiv = multiimage.getElementsByTagName('div');
  if (typeof circleDiv !== 'undefined' && circleDiv.length > 0)
  {
    var circle = circleDiv[0];
  }
  else
  {
    var circle = document.createElement("div");
    multiimage.appendChild(circle);
    circle.addEventListener("click", function (){ clickThroughCircle(circle); });
    circle.addEventListener("mouseleave", function () { mouseInsideCircle = false;
                                                        setTimeout(function ()
                                                      { hideCircle(circle); }, 1200);
                                                        setTimeout(function ()
                                                      { hidePolygon(multiimage); }, 1200)});
    circle.addEventListener("mouseenter", function () { mouseInsideCircle = true; });
  }
  circle.style.display = '';
  circle.style.position = 'absolute';
  circle.style.zIndex = '1';
  circle.style.cursor = 'pointer';
  circle.style.top = getPixelsFromFloat(centerTop - r);
  circle.style.left = getPixelsFromFloat(centerLeft - r);
  circle.style.width = getPixelsFromFloat(2 * r + polygonImageSize);
  circle.style.height = circle.style.width;
  circle.style.borderRadius = getPixelsFromFloat(r + polygonImageSize);
}


function drawPolygon()
{
  if (!polygonDrawn)
  {
    var r = 250;
    var multiimage = this;
    var firstImage = multiimage.firstElementChild.firstElementChild;
    var firstImagePosition = firstImage.getBoundingClientRect();
    var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var centerTop = firstImagePosition.top + scrollTop;
    var centerLeft = firstImagePosition.left + scrollLeft;
    var polygonImageSize = firstImagePosition.right - firstImagePosition.left;
    drawCircle(multiimage, centerTop, centerLeft, r, polygonImageSize);
    var polygonImagesLength = multiimage.children.length - 2;
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
    polygonDrawn = true;
  }
}


function addListeners(multiimage)
{
  multiimage.addEventListener("mouseover", drawPolygon);
}

function blackCircle()
{
  this.style.background = 'black';
}


var multiimage = Array.from(document.getElementsByClassName('multiimage'));
multiimage.forEach(hidePolygon);
multiimage.forEach(addListeners);
