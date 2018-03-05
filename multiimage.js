/*
Author: Kohut Jan (xkohut08)
Date: 4.3.2018
*/

/*
radius - distence of images from the center image in px
startRadius - distence in which to start animationStep in px
animationStep - step of animation in px
circleTimeToHidePolygon - time to hiding images when area of images is left in mlsec
inactiveHidePolygons - time to hide images when mouse is inactive in mlsec
*/
var radius = 250;
var startRadius = 150;
var animationStep = 10;
var animationSpeed = 20;
var circleTimeToHidePolygon = 2000;
var inactivityTimeToHidePolygon = 2000;

var timerIdle;
var multiimages = [];


function getPixelsFromFloat(value)
{
 return Math.floor(value).toString().concat("px");
}


function Multiimage(element, polygonDrawn, mouseInsideCircle, timerOutsideCircle,
                    mouseInTheMiddle, imageShown, r, step, startR)
{
  var self = this;
  self.element = element;
  self.polygonDrawn = polygonDrawn;
  self.mouseInsideCircle = mouseInsideCircle;
  self.timerOutsideCircle = timerOutsideCircle;
  self.mouseInTheMiddle = mouseInTheMiddle;
  self.imageShown = imageShown;
  self.r = r;
  self.step = step;
  self.startR = startR;
  self.animateDrawBuffer = self.startR;
  self.animateHideBuffer = self.r;
  self.circle = null;

  self.hideShowImage = function (imageWrapper)
  {
    self.element.removeChild(imageWrapper);
    self.imageShown = false;
    clearTimeout(self.timerOutsideCircle);
    self.timerOutsideCircle = setTimeout(function () { self.animateHidePolygon(); }, circleTimeToHidePolygon);
  }

  self.drawShowImage = function ()
  {
    self.circle.style.display = 'none';
    var image = document.elementFromPoint(event.clientX , event.clientY).parentElement;
    //check if it has been clicked on image
    if (image.parentNode == self.element)
    {
      var imageWrapper = document.createElement('DIV');
      var imageToShow = document.createElement('IMG');
      var closeButton = document.createElement('BUTTON');
      var cross = document.createTextNode('X');
      imageWrapper.setAttribute('class', 'image_wrapper');
      imageToShow.setAttribute('class', 'image_to_show');
      closeButton.setAttribute('class', 'close_button');
      imageToShow.setAttribute('src', image.getAttribute('href'));
      self.element.appendChild(imageWrapper);
      imageWrapper.appendChild(imageToShow);
      imageWrapper.appendChild(closeButton);
      closeButton.appendChild(cross);
      closeButton.addEventListener('click', function () { self.hideShowImage(imageWrapper) })
      closeButton.addEventListener('mouseenter', function() { closeButton.style.color = 'black'});
      closeButton.addEventListener('mouseleave', function() { closeButton.style.color = 'white'});
      self.imageShown = true;
    }
    self.circle.style.display = '';
  }

  self.hidePolygon = function ()
  {
    if (self.circle != null)
    {
      self.circle.style.display = 'none';
    }
    for (var i = 1; i < self.element.children.length; ++i)
    {
      self.element.children[i].style.display = 'none';
    }
  }

  self.animateHidePolygon = function ()
  {
    if (!self.mouseInsideCircle && self.polygonDrawn && !self.imageShown)
    {
      setTimeout(function ()
      {
        if (self.animateHideBuffer >= self.startR)
        {
          self.hidePolygon();
          self.drawPolygon(self.animateHideBuffer);
          self.mouseInsideCircle = false;
          self.animateHideBuffer -= self.step;
          self.animateHidePolygon();
        }
        else
        {
          self.hidePolygon();
          self.animateHideBuffer = self.r;
          self.polygonDrawn = false;
        }
      }, animationSpeed);
    }
  }

  self.drawPolygonImage = function (image, topOffset, leftOffset)
  {
    image.style.display = '';
    image.style.position = 'absolute';
    image.style.top = getPixelsFromFloat(topOffset);
    image.style.left = getPixelsFromFloat(leftOffset);
  }

  self.drawCircle = function (centerTop, centerLeft, polygonImageSize)
  {
    if (self.circle == null)
    {
      self.circle = document.createElement('DIV');
      self.circle.setAttribute('class', 'circle');
      self.element.appendChild(self.circle);
      self.circle.addEventListener('click', function () { self.drawShowImage(); });
      self.circle.addEventListener('mouseleave', function () { self.mouseInsideCircle = false;
                                                               self.timerOutsideCircle = setTimeout(function ()
                                                             { self.animateHidePolygon(); }, circleTimeToHidePolygon) });
      self.circle.addEventListener('mouseenter', function () { self.mouseInsideCircle = true; });
    }
    var circleRadius = getPixelsFromFloat(self.r + polygonImageSize);
    var circleDiameter = getPixelsFromFloat(2 * self.r + polygonImageSize);
    Object.assign(self.circle.style,
                 {
                   display: '',
                   top: getPixelsFromFloat(centerTop - self.r),
                   left: getPixelsFromFloat(centerLeft - self.r),
                   width: circleDiameter,
                   height: circleDiameter,
                   borderRadius: circleRadius
                 });
  }

  self.drawPolygon = function (r)
  {
    var firstImage = self.element.firstElementChild.firstElementChild;
    var firstImagePosition = firstImage.getBoundingClientRect();
    var scrollTop  = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var centerTop = firstImagePosition.top + scrollTop;
    var centerLeft = firstImagePosition.left + scrollLeft;
    var polygonImageSize = firstImagePosition.right - firstImagePosition.left;
    self.drawCircle(centerTop, centerLeft, polygonImageSize);
    //-2 to ignore first image and added circle
    var polygonImagesLength = self.element.children.length - 2;
    var alfa = 2 * Math.PI / polygonImagesLength;
    for (var i = 0; i < polygonImagesLength; ++i)
    {
      var actualAlfa = i * alfa;
      var relativeTopOffset = r * Math.sin(actualAlfa);
      var relativeLeftOffset = r * Math.cos(actualAlfa);
      var topOffset = centerTop - relativeTopOffset;
      var leftOffset = centerLeft - relativeLeftOffset;
      //+1 to ignore first image
      self.drawPolygonImage(self.element.children[i + 1], topOffset, leftOffset);
    }
  }

  self.animateDrawPolygon = function ()
  {
    if (!self.polygonDrawn && !self.mouseInTheMiddle)
    {
      setTimeout(function ()
      {
        if (self.animateDrawBuffer <= self.r)
        {
          self.hidePolygon();
          self.drawPolygon(self.animateDrawBuffer);
          self.animateDrawBuffer += self.step;
          self.animateDrawPolygon();
        }
        else
        {
          self.animateDrawBuffer = self.startR;
          self.polygonDrawn = true;
        }
      }, animationSpeed);
    }
    if (self.mouseInTheMiddle)
    {
      self.mouseInTheMiddle = false;
    }
  }

  self.init = function ()
  {
    var firstImage = self.element.firstElementChild.firstElementChild;
    firstImage.addEventListener('mouseenter', function () { self.animateDrawPolygon(); });
  }

}

checkMouseInTheMiddle = function (multiimage, x, y)
{
  var firstImage = multiimage.element.firstElementChild.firstElementChild;
  var firstImagePosition = firstImage.getBoundingClientRect();
  if (x >= firstImagePosition.left && x <= firstImagePosition.right)
  {
    if (y >= firstImagePosition.top && y <= firstImagePosition.bottom)
    {
      multiimage.mouseInTheMiddle = true;
    }
  }
}

function inactiveHidePolygons()
{
  var x = event.clientX;
  var y = event.clientY;
  clearTimeout(timerIdle);
  timerIdle = setTimeout(function () { for (var i = 0; i < multiimages.length; ++i)
                                       {
                                         checkMouseInTheMiddle(multiimages[i], x, y);
                                         multiimages[i].mouseInsideCircle = false;
                                         multiimages[i].animateHidePolygon();
                                       }
                                      },
                                      inactivityTimeToHidePolygon);
}

function initMultiimages()
{
  var multiimagesElements = Array.from(document.getElementsByClassName('multiimage'));
  for (var i = 0; i < multiimagesElements.length; ++i)
  {
    multiimages.push(new Multiimage(multiimagesElements[i],
                                    false,
                                    false,
                                    i,
                                    false,
                                    false,
                                    radius,
                                    animationStep,
                                    startRadius));
  }
}


initMultiimages();
for (var i = 0; i < multiimages.length; ++i)
{
  multiimages[i].init();
  multiimages[i].hidePolygon();
}
document.body.addEventListener('mousemove', function () { inactiveHidePolygons(); });
