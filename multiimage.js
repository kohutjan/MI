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


function hideShowImage(multiimage, imageWrapper)
{
  multiimage['element'].removeChild(imageWrapper);
  multiimage['imageShown'] = false;
  clearTimeout(multiimage['timerOutsideCircle']);
  multiimage['timerOutsideCircle'] = setTimeout(function ()
                                     { animateHidePolygon(multiimage, 250, 10, 150, 250); }, 1200);
}


function drawShowImage(multiimage, imageWrapper, imageToShow, closeButton)
{
  imageWrapper.style.position = 'fixed';
  imageWrapper.style.top = '0';
  imageWrapper.style.bottom = '0';
  imageWrapper.style.left = '0';
  imageWrapper.style.right = '0';
  imageWrapper.style.maxWidth = '100%';
  imageWrapper.style.maxHeight = '100%';
  imageWrapper.style.background = 'black';
  imageWrapper.style.zIndex = '100';
  imageToShow.style.position = 'fixed';
  imageToShow.style.top = '0';
  imageToShow.style.bottom = '0';
  imageToShow.style.left = '0';
  imageToShow.style.right = '0';
  imageToShow.style.maxWidth = '100%';
  imageToShow.style.maxHeight = '100%';
  imageToShow.style.margin = 'auto';
  imageToShow.style.overflow = 'auto';
  imageToShow.style.zIndex = '101';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '0px';
  closeButton.style.zIndex = '102';
  closeButton.style.backgroundRepeat = 'no-repeat';
  closeButton.style.background = 'rgba(219,221,224,0.4)';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '30px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.overflow = 'hidden';
  closeButton.style.outline = 'none';
  closeButton.style.color = 'white';
  closeButton.style.height = '50px';
  closeButton.style.width = '50px';
  closeButton.style.fontSize = '40px';
  closeButton.style.margin = '10px';
  closeButton.addEventListener('mouseenter', function() { closeButton.style.color = 'black'});
  closeButton.addEventListener('mouseleave', function() { closeButton.style.color = 'white'});
  multiimage['imageShown'] = true;
}


function clickThroughCircle(multiimage, circle)
{
  circle.style.display = 'none';
  var image = document.elementFromPoint(event.clientX , event.clientY).parentElement;
  var imageWrapper = document.createElement('DIV');
  var imageToShow = document.createElement('IMG');
  var closeButton = document.createElement('BUTTON');
  var cross = document.createTextNode("X");
  imageToShow.setAttribute('src', image.getAttribute('href'));
  multiimage['element'].appendChild(imageWrapper);
  imageWrapper.appendChild(imageToShow);
  imageWrapper.appendChild(closeButton);
  closeButton.appendChild(cross);
  closeButton.addEventListener('click', function () { hideShowImage(multiimage, imageWrapper) })
  drawShowImage(multiimage, imageWrapper, imageToShow, closeButton);
  console.log(imageToShow);
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
    circle.addEventListener('click', function (){ clickThroughCircle(multiimage, circle); });
    circle.addEventListener('mouseleave', function () { multiimage['mouseInsideCircle'] = false;
                                                        multiimage['timerOutsideCircle'] = setTimeout(function ()
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
  if (!multiimage['mouseInsideCircle'] && multiimage['polygonDrawn'] && !multiimage['imageShown'])
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
                      timerOutsideCircle: i,
                      mouseInTheMiddle: false,
                      imageShown: false});
  }
}


initMultiimages();
multiimages.forEach(addListeners);
multiimages.forEach(hidePolygon);
document.body.addEventListener('mousemove', function () { inactiveHidePolygons(); });
