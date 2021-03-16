/* global jQuery, document, screen, window */

(function($){
  $.fn.modal = function(){
    return this.each(function(index){
      // switch index to start from 1 instead of 0 for readability in the markup
      index++;
      // check for option to disable automatic hiding of source element
      let showSourceElem = $(this).attr('data-modal-show-source');
      // get the ID of the element that contains the content for the modal from the "data-modal-source" attribute
      let modalSourceId = $(this).attr('data-modal-source');
      let modalSourceElem = $( modalSourceId );
      let modalLinkId = $(this).attr('id');

      let modalIdSlug;
      if ( modalSourceId ) {
        modalIdSlug = modalSourceId.replace( /(#|\.)/, '');
      } else if (modalLinkId) {
        modalIdSlug = modalLinkId;
      } else {
        modalIdSlug = index;
      }
      let modalWrapperId = 'modal-' + modalIdSlug;
      // if showing the source element...
      if (showSourceElem){
        modalSourceElem.removeClass('hidden js-hidden');
      } else {
        // Make sure the modal source element is hidden only with inline styles
        modalSourceElem.hide().removeClass('hidden js-hidden');
      }
      // get the optional list of classes to add to the inner content area from the "data-modal-classes-inner" attribute in the HTML tag
      let modalInnerClassesAttr = $(this).attr('data-modal-classes-inner');
      // use the default classes to set the inner modal to be a white box with lots of padding
      let modalInnerClasses = modalInnerClassesAttr ? modalInnerClassesAttr : 'padding-medium bg-white text-color-override';
      // get the optional list of classes to add to the inner content area from the "data-modal-classes-outer" attribute in the HTML tag
      let modalOuterClassesAttr = $(this).attr('data-modal-classes-outer');
      // use the default classes to set the modal container to have a transparent dark gray background and lots of horizontal padding
      let modalOuterClasses = modalOuterClassesAttr ? modalOuterClassesAttr : 'bg-dkgray-trans width-narrow';

      // set up modal wrappers
      // assemble the outer and inner modal wrappers around the content
      let modal = '<div id="' + modalWrapperId + '" class="modal-wrapper section ' + modalOuterClasses + '"><div class="modal-inner section-inner ' + modalInnerClasses + '"><a class="modal-close modal-close-x">X</a><div class="modal-content"></div></div></div>';
      // append the modal before the closing </body> tag and add the class "open" (which hooks into CSS3 animations)
      // NOTE: animate() is used just to provide a slight delay before adding the 'open' class, which is necessary to trigger CSS3 animation (for some reason)
      $(modal).appendTo('body');

      // set up the click event
      $(this).on('click', function(e){
        e.preventDefault();
        let modalWrapper = $('#' + modalWrapperId);
        let modalContent = modalWrapper.find('.modal-content');
        // unhide the source element before appending it to the modal window
        modalSourceElem
          .clone()
          .removeClass('nav-desktop-dropdown')
          .show()
          .appendTo(modalContent);
        // Open the modal
        // check for any lazy loading inside the modal and swap data-src into src and kill any spinners
        modalWrapper
          .addClass('open')
          .find('[data-src]')
          .each(function(){
            let modalDataSrc = $(this).attr('data-src');
            $(this).attr('src',modalDataSrc).removeClass('lazy').parent().spin(false);
          });

        // set up the "close modal" function
        function modalClose(){
          modalWrapper.removeClass('open');
          modalContent.empty();
          $(document).unbind('keyup', modalClose );
        }
        // call modalClose() when the "close" button is clicked
        $('.modal-close').on('click', function(event){
          modalClose();
          event.stopPropagation();
        });
        // call modalClose() when the modal background is clicked
        modalWrapper.on('click', function(){
          modalClose();
        });
        // stop clicks in the modal content from propagating up and triggering a "close" event
        modalContent.on('click',function(event){
          event.stopPropagation();
        });
        // call modalClose() when the Esc key is pressed
        $(document).keyup(function(e){
          if (e.keyCode == 27) {
            modalClose();
          }
        });
      });
    });
  };
}(jQuery));

/*
Open links in a new window with size and position options
Useful for things like placing the small "share dialog" window that facebook and twitter use.
*/
(function(){
  jQuery.fn.newWindowPopup = function() {
    jQuery(this).on('click', function(e) {
      e.preventDefault();
      let destination = jQuery(this).attr('href');
      let popupWidthAttr = jQuery(this).attr('data-popup-width');
      let popupHeightAttr = jQuery(this).attr('data-popup-height');
      let popupWidth;
      let popupHeight;
      if ( jQuery(this).is('.fb-share, .button-facebook, .button-share-facebook') ){
        popupWidth = 520;
        popupHeight = 350;
      } else if ( jQuery(this).is('.tw-share, .button-twitter, .button-share-twitter') ){
        popupWidth = 550;
        popupHeight = 420;
      } else if ( popupHeightAttr || popupWidthAttr ){
        if ( popupHeightAttr ){
          popupHeight = popupHeightAttr;
        }
        if ( popupWidthAttr ){
          popupWidth = popupWidthAttr;
        }
      } else {
        popupWidth = 500;
        popupHeight = 500;
      }
      let winTop = (screen.height / 2) - (popupHeight / 2);
      let winLeft = (screen.width / 2) - (popupWidth / 2);
      window.open( destination , 'new-window-popup', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,resizable=yes,scrollbars=yes,width=' + popupWidth + ',height=' + popupHeight );
    });
  };
}(jQuery));

/*
Expando
Collapsible/expandable content sections.
*/
(function($){
  $.fn.expando = function(device, oneAtATime){
    let screenSize = device ? device + '-' : '';
    $(this).each(function(){
      let expandoText = $(this).attr('title');
      let expandoText2 = $(this).find('h1,h2,h3,h4,h5,h6').first().addClass(screenSize+'expando-title').text();
      let expandoText3raw = $(this).children().first().text();
      let expandoText3 = expandoText3raw.substring(0,60);
      let expandedOnLoad = $(this).hasClass(screenSize+'expando-expanded');

      if ( expandoText ){
        $(this).wrapInner('<div class="'+screenSize+'expando-inner" />').prepend('<a class="'+screenSize+'expando-link" href="#">' + expandoText + '</a>');
      } else if (expandoText2) {
        $(this).wrapInner('<div class="'+screenSize+'expando-inner" />').prepend('<a class="'+screenSize+'expando-link" href="#">' + expandoText2 + '</a>');
      } else if (expandoText3) {
        $(this).wrapInner('<div class="'+screenSize+'expando-inner" />').prepend('<a class="'+screenSize+'expando-link" href="#">' + expandoText3 + '...</a>');
      } else {
        $(this).wrapInner('<div class="'+screenSize+'expando-inner" />').prepend('<a class="'+screenSize+'expando-link" href="#">Click to expand</a>');
      }
      // if set to pre-expanded, don't add the "collapsed" class
      if ( !expandedOnLoad ){
        $(this).addClass( screenSize+'expando-collapsed');
      }

    });
    $('a.'+screenSize+'expando-link').unbind().click(function(e){
      e.preventDefault();
      let thisParent = $(this).parent();
      if (oneAtATime){
        $('.expando').not(thisParent).removeClass(screenSize + 'expando-expanded').addClass(screenSize+'expando-collapsed');
      }
      $(thisParent)
        .toggleClass(screenSize+'expando-expanded')
        .toggleClass(screenSize+'expando-collapsed');
    });
    return this;
  };
}(jQuery));

/*
Parent focus
Add .focus class to parent when direct child input has focus
*/
(function($){
  $.fn.parentFocus = function(){
    return this.each(function(){
      $(this).on({
        focus: function(){
          $(this).parent().addClass('focus');
        },
        blur: function(){
          $(this).parent().removeClass('focus');
        }
      });
    });
  };
}(jQuery));

// Add .contains-input class if an input has value
(function($){
  $.fn.containsInput = function(){
    return this.each(function(){
      // Test if an input has a value
      function hasValue(elem) {
        return $(elem).filter(function() { return $(this).val(); }).length > 0;
      }
      $(this).on('change',function(){
        if (hasValue(this)){
          $(this).addClass('contains-input');
        } else {
          $(this).removeClass('contains-input');
        }
      });
    });
  };
}(jQuery));

function setupMobileMenuToggle() {
  const el = document.querySelector('.mobile-toggle');
  function toggleShownClass() {
    if (window.matchMedia('(max-width: 480px)').matches) {
      el.classList.toggleClass('shown');
    }
  }
  el.addEventListener('click', toggleShownClass);
  el.addEventListener('touchend', toggleShownClass);
}

/* Run scripts on page ready */
jQuery(document).ready(function($) {
  $('html').removeClass('no-js').addClass('js');
  $('.js-modal').modal();
  $('.tw-share, .fb-share, .button-dot.facebook, .button-share-facebook, .button-share-twitter').newWindowPopup();
  $('.expando').expando('',true);
  $('.mobile-expando').expando('mobile');
  $('.tablet-expando').expando('tablet');
  // Add a 'focus' class to the parent element when input gets focus
  $('input, select, textarea').parentFocus().containsInput();
  setupMobileMenuToggle();
});
