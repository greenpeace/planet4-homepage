/* global jQuery, document */

jQuery(document).ready(function($){
  /* Expandable features sections */
  // set up letiables
  let featuresRotatorParent = $('#features-engagement');
  let featuresCounter = 0;

  let featureImageArray = [
    'img/features/p4-features-engagement-petitions.png',
    'img/features/p4-features-engagement-events.png',
    'img/features/p4-features-engagement-meaningful.png',
    'img/features/p4-features-engagement-momentum.png'
  ];
  featureImageArray.forEach(function(img){
    featuresCounter++;
    // create empty divs for bg image crossfading
    featuresRotatorParent.append('<div class="feature-bg feature-bg-' + featuresCounter + '" style="background-image:url(' + img + ')"></div>');
  });

  // set up click handlers
  $('#features-engagement .expando').on('click', function() {
    let featureNumber = $(this).data('feature');

    if ( !( $(this).hasClass('bg-active') ) ){
      $('#features-engagement .expando').removeClass('bg-active');
      $(this).addClass('bg-active');
      $('.feature-bg').removeClass('active');
      $('.feature-bg-' + featureNumber).addClass('active');
    }
  });

});
