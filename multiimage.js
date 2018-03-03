var idleTimer;
var multiimages = [];


function getPixelsFromFloat(value)
{
  return Math.floor(value).toString().concat("px");
}


function getFirstImagePosition(multiimageElement)
{
  var firstImage = multiimageElement.firstElementChild.firstElementChild;
  return firstImage.getBoundingClientRect();
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
  if (isCircleInMultiimage(multiimage['element']))
  {
    var circle = getCircleFromMultiimage(multiimage['element']);
    circle.style.display = 'none';
  }
  for (var i = 1; i < multiimage['element'].children.length; ++i)
  {
    multiimage['element'].children[i].style.display = 'none';
  }
}


function checkMouseInTheMiddle(multiimage, x, y)
{
  var firstImagePosition = getFirstImagePosition(multiimage['element']);
  if (x >= firstImagePosition.left && x <= firstImagePosition.right)
  {
    if (y >= firstImagePosition.top && y <= firstImagePosition.bottom)
    {
      multiimage['mouseInTheMiddle'] = true;
      console.log("in the middle");
    }
  }
}


function setMouseInsideCircleToFalse(multiimage)
{
  multiimage['mouseInsideCircle'] = false;
}


function inactiveHidePolygons()
{
  var x = event.clientX;
  var y = event.clientY;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(function () { for (var i = 0; i < multiimages.length; ++i)
                                       {
                                         checkMouseInTheMiddle(multiimages[i], x, y);
                                         setMouseInsideCircleToFalse(multiimages[i]);
                                         animateHidePolygon(multiimages[i], 250, 10, 150, 250);
                                       }
                                      },
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
                                                      { animateHidePolygon(multiimage, 250, 10, 150, 250); }, 1200)});
    circle.addEventListener('mouseenter', function () { multiimage['mouseInsideCircle'] = true; });
  }
  multiimage['mouseInsideCircle'] = true;
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


function drawPolygon(multiimage, r)
{
  var firstImagePosition = getFirstImagePosition(multiimage['element']);
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
}


function animateHidePolygon(multiimage, r, step, stopR, actualR)
{
  if (!multiimage['mouseInsideCircle'] && multiimage['polygonDrawn'])
  {
    setTimeout(function ()
    {
      if (actualR > stopR)
      {
        hidePolygon(multiimage);
        drawPolygon(multiimage, actualR);
        setMouseInsideCircleToFalse(multiimage);
        animateHidePolygon(multiimage, r, step, stopR, actualR - step);
      }
      else
      {
        hidePolygon(multiimage);
        multiimage['polygonDrawn'] = false;
      }
    }, 20);
  }
}


function animateDrawPolygon(multiimage, r, step, actualR)
{
  if (!multiimage['polygonDrawn'] && !multiimage['mouseInTheMiddle'])
  {
    setTimeout(function ()
    {
      if (actualR < r)
      {
        hidePolygon(multiimage);
        drawPolygon(multiimage, actualR);
        animateDrawPolygon(multiimage, r, step, actualR + step);
      }
      else
      {
        multiimage['polygonDrawn'] = true;
      }
    }, 20);
  }
  if (multiimage['mouseInTheMiddle'])
  {
    multiimage['mouseInTheMiddle'] = false;
  }
}


function addListeners(multiimage)
{
  multiimage['element'].firstElementChild.firstElementChild.addEventListener('mouseenter', function () { console.log("enter"), animateDrawPolygon(multiimage, 250, 10, 150);});
}

function initMultiimages()
{
  var multiimagesElements = Array.from(document.getElementsByClassName('multiimage'));
  for (var i = 0; i < multiimagesElements.length; ++i)
  {
    multiimages.push({element: multiimagesElements[i],
                      polygonDrawn: false,
                      mouseInsideCircle: false,
                      mouseInTheMiddle: false});
  }
}


initMultiimages();
multiimages.forEach(addListeners);
multiimages.forEach(hidePolygon);
document.body.addEventListener('mousemove', function () { inactiveHidePolygons(); });
