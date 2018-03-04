var timerIdle;
var multiimages = [];

var cssImageWrapper = {
                        position: 'fixed',
                        top: '0',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        background: 'black',
                        zIndex: '100',
                      };
var cssImageToShow = {
                       position: 'fixed',
                       top: '0',
                       bottom: '0',
                       left: '0',
                       right: '0',
                       maxWidth: '100%',
                       maxHeight: '100%',
                       margin: 'auto',
                       overflow: 'auto',
                       zIndex: '101',
                     };
var cssCloseButton = {
                       position: 'absolute',
                       right: '0',
                       backgroundRepeat: 'no-repeat',
                       background: 'rgba(219,221,224,0.4)',
                       border: 'none',
                       borderRadius: '30px',
                       cursor: 'pointer',
                       overflow: 'hidden',
                       outline: 'none',
                       color: 'white',
                       height: '50px',
                       width: '50px',
                       fontSize: '40px',
                       margin: '10px',
                       zIndex: '102',
                     };


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

  self.getFirstImagePosition = function ()
  {
    var firstImage = self.element.firstElementChild.firstElementChild;
    return firstImage.getBoundingClientRect();
  }

  self.checkMouseInTheMiddle = function (x, y)
  {
    var firstImagePosition = self.getFirstImagePosition();
    if (x >= firstImagePosition.left && x <= firstImagePosition.right)
    {
      if (y >= firstImagePosition.top && y <= firstImagePosition.bottom)
      {
        self.mouseInTheMiddle = true;
      }
    }
  }

  self.hideShowImage = function (imageWrapper)
  {
    self.element.removeChild(imageWrapper);
    self.imageShown = false;
    clearTimeout(self.timerOutsideCircle);
    self.timerOutsideCircle = setTimeout(function () { self.animateHidePolygon(); }, 1200);
  }

  self.drawShowImage = function (imageWrapper, imageToShow, closeButton)
  {
    Object.assign(imageWrapper.style, cssImageWrapper);
    Object.assign(imageToShow.style, cssImageToShow);
    Object.assign(closeButton.style, cssCloseButton);
    closeButton.addEventListener('mouseenter', function() { closeButton.style.color = 'black'});
    closeButton.addEventListener('mouseleave', function() { closeButton.style.color = 'white'});
    self.imageShown = true;
  }

  self.clickThroughCircle = function ()
  {
    self.circle.style.display = 'none';
    var image = document.elementFromPoint(event.clientX , event.clientY).parentElement;
    var imageWrapper = document.createElement('DIV');
    var imageToShow = document.createElement('IMG');
    var closeButton = document.createElement('BUTTON');
    var cross = document.createTextNode('X');
    imageToShow.setAttribute('src', image.getAttribute('href'));
    self.element.appendChild(imageWrapper);
    imageWrapper.appendChild(imageToShow);
    imageWrapper.appendChild(closeButton);
    closeButton.appendChild(cross);
    closeButton.addEventListener('click', function () { self.hideShowImage(imageWrapper) })
    self.drawShowImage(imageWrapper, imageToShow, closeButton);
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
      }, 20);
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
      self.element.appendChild(self.circle);
      self.circle.addEventListener('click', function () { self.clickThroughCircle(); });
      self.circle.addEventListener('mouseleave', function () { self.mouseInsideCircle = false;
                                                               self.timerOutsideCircle = setTimeout(function ()
                                                             { self.animateHidePolygon(); }, 1200) });
      self.circle.addEventListener('mouseenter', function () { self.mouseInsideCircle = true; });
    }
    self.mouseInsideCircle = true;
    var circleRadius = getPixelsFromFloat(self.r + polygonImageSize);
    var circleDiameter = getPixelsFromFloat(2 * self.r + polygonImageSize);
    Object.assign(self.circle.style,
                 {
                   display: '',
                   position: 'absolute',
                   zIndex: '1',
                   cursor: 'pointer',
                   top: getPixelsFromFloat(centerTop - self.r),
                   left: getPixelsFromFloat(centerLeft - self.r),
                   width: circleDiameter,
                   height: circleDiameter,
                   borderRadius: circleRadius
                 });
  }

  self.drawPolygon = function (r)
  {
    var firstImagePosition = self.getFirstImagePosition();
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
      }, 20);
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



function inactiveHidePolygons()
{
  var x = event.clientX;
  var y = event.clientY;
  clearTimeout(timerIdle);
  timerIdle = setTimeout(function () { for (var i = 0; i < multiimages.length; ++i)
                                       {
                                         checkMouseInTheMiddle(multiimages[i], x, y);
                                         setMouseInsideCircleToFalse(multiimages[i]);
                                         animateHidePolygon(multiimages[i], 250, 10, 150, 250);
                                       }
                                      },
                                      2000);
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
                                    250,
                                    10,
                                    150));
  }
}


initMultiimages();
for (var i = 0; i < multiimages.length; ++i)
{
  console.log(multiimages[i]);
  multiimages[i].init();
  multiimages[i].hidePolygon();
}

//document.body.addEventListener('mousemove', function () { inactiveHidePolygons(); });
