var polygonDrawn = true;
var mouseInsideCircle = false;
var idleTimer;
var mouseMoved = false;

var multiimages = [];

function getPixelsFromFloat(value)
{
  return Math.floor(value).toString().concat("px");
}


function isCircleInMultiimage(multiimageElement)
{
  var circleDiv = multiimageElement.getElementsByTagName('div');
  return (typeof circleDiv !== 'undefined' && circleDiv.length > 0)
}


function getCircleFromMultiimage(multiimageElement)
{
  return multiimageElement.getElementsByTagName('div')[0];
}


function hidePolygon(multiimage)
{
  if (!multiimage['mouseInsideCircle'] && multiimage['polygonDrawn'])
  {
    console.log("hiding multiimage");
    if (isCircleInMultiimage(multiimage['element']))
    {
      var circle = getCircleFromMultiimage(multiimage['element']);
      circle.style.display = 'none';
    }
    for (var i = 1; i < multiimage['element'].children.length; ++i)
    {
      multiimage['element'].children[i].style.display = 'none';
    }
    multiimage['polygonDrawn'] = false;
  }
}


function setMouseInsideCircleToFalse(multiimage)
{
  multiimage['mouseInsideCircle'] = false;
}


function inactiveHidePolygons()
{
  console.log("clearTimer");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(function () { multiimages.forEach(setMouseInsideCircleToFalse);
                                       multiimages.forEach(hidePolygon);},
                                       2000);
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
  if (isCircleInMultiimage(multiimage['element']))
  {
    var circle = getCircleFromMultiimage(multiimage['element']);
  }
  else
  {
    var circle = document.createElement('div');
    multiimage['element'].appendChild(circle);
    circle.addEventListener('click', function (){ clickThroughCircle(circle); });
    circle.addEventListener('mouseleave', function () { multiimage['mouseInsideCircle'] = false;
                                                        setTimeout(function ()
                                                      { hidePolygon(multiimage); }, 1200)});
    circle.addEventListener('mouseenter', function () { multiimage['mouseInsideCircle'] = true; });
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


function drawPolygon(multiimage)
{
  if (!multiimage['polygonDrawn'])
  {
    var r = 250;
    var firstImage = multiimage['element'].firstElementChild.firstElementChild;
    var firstImagePosition = firstImage.getBoundingClientRect();
    var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var centerTop = firstImagePosition.top + scrollTop;
    var centerLeft = firstImagePosition.left + scrollLeft;
    var polygonImageSize = firstImagePosition.right - firstImagePosition.left;
    drawCircle(multiimage, centerTop, centerLeft, r, polygonImageSize);
    var polygonImagesLength = multiimage['element'].children.length - 2;
    var alfa = 2 * Math.PI / polygonImagesLength;
    for (var i = 0; i < polygonImagesLength; ++i)
    {
      var actualAlfa = i * alfa;
      var relativeTopOffset = r * Math.sin(actualAlfa);
      var relativeLeftOffset = r * Math.cos(actualAlfa);
      var topOffset = centerTop - relativeTopOffset;
      var leftOffset = centerLeft - relativeLeftOffset;
      drawPolygonImage(multiimage['element'].children[i + 1], topOffset, leftOffset);
    }
    multiimage['polygonDrawn'] = true;
  }
}


function addListeners(multiimage)
{
  multiimage['element'].addEventListener('mouseover', function () { drawPolygon(multiimage);});
}

function initMultiimages()
{
  var multiimagesElements = Array.from(document.getElementsByClassName('multiimage'));
  for (var i = 0; i < multiimagesElements.length; ++i)
  {
    multiimages.push({element: multiimagesElements[i],
                      polygonDrawn: true,
                      mouseInsideCircle: false});
  }
}


initMultiimages();
multiimages.forEach(addListeners);
multiimages.forEach(hidePolygon);
document.body.addEventListener('mousemove', function () { inactiveHidePolygons(); });
