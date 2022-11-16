//**************************************
console.log('gre.js BITBUCKET DEV');
//**************************************



  //set the global url to match the environment

var sDomainURL =  '//' + window.location.hostname
var sBridgeURL = sDomainURL + '/__data/assets/git_bridge/0023/51098/';
//var sFunnelbackURL = '//search.gre.ac.uk/s/search.json?';
var sFunnelbackURL = '//search.gre.ac.uk/s/search.json?';

$( document ).ready(function() {

  //pers...

  runPersonalisation();

  //BETA SHIV. TURN THIS OFF PRE-LAUNCH!!!!!!!!!

  var sBetaShivs= getUrlParameter('noshivs');

  if(sBetaShivs === undefined || sBetaShivs === 1){
    //runBetaShivs();
  }

  //quick personalisation

function runPersonalisation(){
  console.log('personalised');
  var sCampus = getUrlParameter('p-campus');

  if(sCampus === undefined){}{
    $('.gre-personalised-campus').each(function(index){
      if($(this).hasClass(sCampus)){
        $(this).removeClass('hide');
      }
    });
  };
}



  function runBetaShivs(){
    //shiv links
    if(sDomainURL.includes('www.gre.ac.uk') ){
      //do nothing (placeholder for if we ever want to do SOMETHING)
    } else {
      $('a').each(function( index ) {
        var attr = $(this).attr('href');
        if (typeof attr !== typeof undefined && attr !== false) {
          var sShivedLink = $(this).attr('href').replace('www-beta.gre','beta.gre').replace('www.gre','beta.gre');
          $(this).attr('href', sShivedLink);
        }
      });

      //shiv header backgrounds

      $('.gre-interrupt-text').each(function( index ) {
        var attr = $(this).attr('style');
        if (typeof attr !== typeof undefined && attr !== false) {
          var sShivedLink = $(this).attr('style').replace('www-beta.gre','beta.gre').replace('www.gre','beta.gre');
          $(this).attr('style', sShivedLink);
        }
      });
    }
  }

  //general triggers

  var ua = window.navigator.userAgent;
  var isIE = /MSIE|Trident/.test(ua);

  //if ( isIE ) { //IE specific code goes here }


  if($('.gre-cookie-confirmation').length > 0){
    var sCookieResult = Cookies.get('cookiepermission');
    if(!sCookieResult == true){
      $('#cookieconfirm').on('click', function () {
        hideCookieMessage();
      });
      showCookieMessage();
    }
  }
  
  //update trigger

  if($('.gre-dynamic-updates').length > 0){
    //console.log('dyno fired');
    buildDynamicUpdates();
  }

  //clearing triggers obsolete commented out 24/06/2021 JC

  // if($('.gre-clearing-subject-switcher').length > 0){
  //   clearingSubjectSwitcher(0);
  // }

  // if($('.gre-clearing-listing').length > 0){
  //   $('.gre-interrupt-text').addClass('gre-clearing-interrupt');
  //   $('.gre-clearing-listing-results').html('<div class="spinner" id="spinner"><img src="' + sDomainURL + '/images/university-logos/logo-999.jpg" /></div>');
  //   $('.gre-clearing-listing-subjects').addClass('hide');
  //   $.ajax({
  //     url:  '//www.gre.ac.uk/__data/assets/text_file/0011/1659575/clearinglivefeed2019.json',
  //     type:'GET',
  //     success:  function(data){
  //       buildClearingListing(data.programmes);
  //     }
  //   });
  // }

  //sortable elements?

  if($('.gre-sortable').length > 0){
    //check for force audience

    var sForceAudience= getUrlParameter('faud');

    if(sForceAudience === undefined){
    } else {
      setPossibleAudience(sForceAudience);
    }

    buildSortableListing();
  }

  //research pies

  if($('.gre-research-chart').length > 0){
    buildResearchCharts();
  }

  //priority clearing form

  if($('.gre-priority-clearing').length > 0){
    buildPriorityClearingForm();
  }

  //this is for auto-campaign pages on the study section it runs BEFORE the scanForFBContent

  if($('.gre-campaign-courses').length > 0){

    var sTags = getUrlParameter('t');

    if(sTags === undefined){

    } else {
      var sFilter = 'meta_collections=' + sTags;

      $('.gre-campaign-courses').removeClass('hide');
      $('.gre-campaign-hide').addClass('hide');

      $('.gre-campaign-courses').addClass('gre-programmes-listing');
      $('.gre-campaign-courses').attr('data-filter', sFilter);

    }
   
  }

  //HAX HAX FOR PROFILE TO PEOPLE

  if($('.gre-profile-listing').length > 0){
    $('.gre-profile-listing').each(function( index ) {
      $(this).addClass('gre-people-listing');
      $(this).removeClass('gre-profile-listing');
    });
  }

  createAutoSelectors();
  getNextOpenDay();
  scanForFunnelbackContent();
  deDupeFeatures();
  scanForTextContainers();

  $('.hide-for-js').addClass('hide');

  //this is for auto-campaign pages on the study section

  if($('.gre-docs-details').length > 0){
    initDocs();
  }

  if($('.gre-full-search').length > 0){
    initFullSearch();
  }

  if($('.gre-flag').length > 0){
    buildFlags();
  }

  if($('.gre-ils-service-status').length > 0){
    getILSServiceStatus();
  }

  if($('.gre-asset-tag-list').length > 0){
    createKeywordLinks('.gre-asset-tag-list','t');
  }
  if($('.gre-asset-faculty-list').length > 0){
    createKeywordLinks('.gre-asset-faculty-list','f');
  }
  if($('.gre-asset-subject-list').length > 0){
    createKeywordLinks('.gre-asset-subject-list','s');
  }

  // AUTOCOMPLETE

  if($('.gre-auto-content').length > 0){
    autoEmbedContent();
  }


  if($('.gre-eventbrite').length > 0){
    getEventBriteEvents($('.gre-eventbrite').data('category'));
  }

  if($('.gre-select-box-it').length > 0 || $('.gre-course-auto-complete').length > 1 || $('.gre-search-box').length > 0){

    postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'libraries/selectboxit/selectboxit.js"><\/script>', {
      done: function() {
        $('.gre-select-box-it').each(function( index ) {

          // Find and hide the autoselect content

          var $optionClass = $(this).data('action');

          $( "." + $optionClass ).addClass("hide");
          $( "." + $optionClass ).first().removeClass("hide");

          // End find and hide

          $(this).selectBoxIt();
        });

        if($('.gre-course-auto-complete').length > 0){
          buildJUICourseSearch();
        }

        if($('.gre-search-box').length > 0){
          if(!$('.gre-search-box').hasClass('gre-home-search-box')){
            $(".gre-search-box select").selectBoxIt();
          }
        }

      }
    });
  }

/*
  //init live chat

  window.__lc = window.__lc || {};
  window.__lc.license = 1204221;
  (function() {
    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
    lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
  })();

  var LC_API = LC_API || {};

  if($('.gre-trigger-live-chat').length > 0){

  LC_API.on_after_load = function(){
    if (LC_API.agents_are_available()){
        $('.gre-trigger-live-chat').on('click', function (e) {
          LC_API.open_chat_window();
          e.preventDefault();
        });
      } else {
        $('.gre-trigger-live-chat').addClass('hide');
        $('.gre-trigger-live-chat-unavailable').removeClass('hide');
      }
    }

  }

  $('.gre-trigger-live-chat').on('click', function () {
  LC_API.open_chat_window();
  });
*/

  //in viewport function

  var isInViewport = function(id) {
    var elementTop = $('#' + id).offset().top;
    var elementBottom = elementTop + $('#' + id).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return (elementBottom) > viewportTop && elementTop < viewportBottom;
  }


    //text function which Nick will hate
/*
  var showText = function (target, message, index) { 
    var bStopTextFunction = false;
    var interval = 0
    if(!bStopTextFunction){
      if (index < message.length) { 
        sExistingMessage = $(target).attr('placeholder');
        if(message[index] == ';'){
          sExistingMessage = '';
          sNewMessage = '';
        } else {
          sNewMessage = sExistingMessage + message[index];

          if(message[index + 1] == ';'){
            interval = 850;
          } else {
            interval = Math.floor(Math.random() * 200) + 120;
          }
        }

        $(target).attr('placeholder', sNewMessage); 

        index++;
        setTimeout(function () { showText(target, message, index); }, interval); 
      }
    } 
  }
*/
 var getWindowWidthInEms = function (){

  return $(window).width() / parseFloat($("body").css("font-size"));

 }

 /*
  $(function () {        
    setTimeout(function () { }, 1500);        
  }); 

*/
  //footer

  if($('.gre-fixed-footer').length > 0){

  //check to see whether it has already been dismissed

  var bShowOverlay = true;

    var sOverlayCode = $('.gre-fixed-footer').data('code');
    console.log('cookie ' + Cookies.get(sOverlayCode));
    if(Cookies.get(sOverlayCode) == null){
      $('.gre-fixed-footer a.close-link').on('click',function (e) {
        bShowOverlay = false;
        Cookies.set(sOverlayCode, true, { expires: 365, domain: 'gre.ac.uk' });
        $('.gre-fixed-footer').addClass('hide');
        e.preventDefault();
        return false;
      });
    } else {
      bShowOverlay = false;
    }

    console.log('overlay show ' + bShowOverlay);

    var triggered_times = 0;
    var searchtexttriggered = 0;

    if(bShowOverlay){
      
  } else {
    $('.gre-fixed-footer').addClass('hide');
  }
  }

  if($('.gre-course-auto-complete .gre-search-box').length > 0 && isInViewport('gre-search-box') && !isIE ){
    //console.log('Autocomplete course search found');
    if(searchtexttriggered == 0){
      showText("#query", ";History;Business;Psychology;Engineering;Find your course...", 0);
      searchtexttriggered = 1;
    }
  }

  //iframe resizing

  if($('.gre-iframe-resize').length > 0){
    $('.gre-iframe-resize').each(function( index ) {
       sID = 'iframe-' + index;
       $(this).attr('id', sID);
       iFrameResize({log:false}, ('#' + sID));
    });
  }


  // Mark video features that have been hovered over (to stop title sliding back in on blur)

    if($('.gre-feature-media.video').length > 0){

      $('.gre-feature-media.video').hover(function(){ 
        $( '.selected' ).removeClass( 'selected' );
        $( this ).addClass( 'selected' );
      });
    }
  });

  // general triggers END


  function showText (target, message, index) { 
    var bStopTextFunction = false;
    var interval = 0
    if(!bStopTextFunction){
      if (index < message.length) { 
        sExistingMessage = $(target).attr('placeholder');
        if(message[index] == ';'){
          sExistingMessage = '';
          sNewMessage = '';
        } else if(message[index] == '<'){ 
            sNewMessage = sExistingMessage.slice(0,-1);
        } else {
          sNewMessage = sExistingMessage + message[index];
        }

       if(message[index + 1] == ';'){
         interval = 850;
       } else {
         interval = Math.floor(Math.random() * 200) + 120;
       }
       
       $(target).attr('placeholder', sNewMessage); 

        index++;
        setTimeout(function () { showText(target, message, index); }, interval); 
      }
    } 
  }



  //select-box-it 

function createKeywordLinks(selector,param){

    $(selector).each(function( index ) {

      var sMyJourney = getUrlParameter('j');
      var sDelimiter = "; ";
      var aList = $( this ).text().replace(/\W+$/,'').split(sDelimiter);
      var sNewText = "";
      var sKeywordPath = sDomainURL + '/articles/keyword?' + param + '=';

      $.each(aList, function( i, value ) {
        var cleanKey = $.trim(value).toLowerCase().replace(/\W+/g,'+');
        sNewText += '<a href="' + sKeywordPath + cleanKey + '&j=' + sMyJourney + '">' + value + '</a>; '
      });

      $( this ).replaceWith(sNewText);

    });

  }

  function clearingSubjectSwitcher(index){
    var sMessage = ';Biology;Nursing;Business;Computing;university'
    var interval = 0;
    var bStopTextFunction = false;
    if(!bStopTextFunction){
      if (index < sMessage.length) { 
        sExistingMessage = $('.gre-clearing-subject-switcher').html();
        if(sMessage[index] == ';'){
          sExistingMessage = '';
          sNewMessage = '';
        } else {
          sNewMessage = sExistingMessage + sMessage[index];

          if(sMessage[index + 1] == ';'){
            interval = 850;
          } else {
            interval = Math.floor(Math.random() * 80) + 120;
          }
        }

        $('.gre-clearing-subject-switcher').html(sNewMessage); 

        index++;
        setTimeout(function () { clearingSubjectSwitcher(index); }, interval); 
      }
    } 
  }


  function scanForTextContainers(){
    if($('.gre-tabs').length > 0){
      buildFoundationTextContainers('tabs');
    }
    if($('.gre-accordion').length > 0){
      buildFoundationTextContainers('accordion');
    }
  }

  function buildResearchCharts(){

    var stPublicationData = [{
    "discipline": "Natural sciences",
    "publications": 21.8,
    "color" : "#171A28"
  },{
    "discipline": "Engineering",
    "publications": 16.7,
    "color" : "#39478C"
  }, {
    "discipline": "Healthcare & medicine",
    "publications": 16.6,
    "color" : "#296BBF"
  }, {
    "discipline": "Social sciences (inc. business)",
    "publications": 11.6,
    "color" : "#817895"
  }, {
    "discipline": "Computer and Mathematics",
    "publications": 10.7,
    "color" : "#7BABBE"
  }, {
    "discipline": "Psychology",
    "publications": 5.7,
    "color" : "#D48E8E"
  }, {
    "discipline": "Other",
    "publications": 16.9,
    "color" : "#E6E4EC"
  }];

    var chart = AmCharts.makeChart( "chart-publications", {
      "hideCredits": true,
    "type": "pie",
    "balloonText": "[[discipline]]<br>[[publications]]%",
    "percentPrecision": 0,
    "labelsEnabled": false,
    "pullOutRadius": "0",
    "startRadius": "25%",
    "baseColor": "#00785D",
    "theme": "none",
    "dataProvider": stPublicationData,
    "valueField": "publications",
    "titleField": "discipline",
    "colorField": "color",
    "balloon":{
      "fixedPosition":false
    },
    "legend": {
      "enabled": true,
      "accessibleLabel": "[[discipline]]",
      "align": "center",
      "equalWidths": true,
      "markerType": "circle",
      "switchable": false,
      "valueText": " -  [[publications]]%"
    },
    "export": {
      "enabled": true
    }
  });


  }

  function buildFoundationTextContainers(containertype){

    switch(containertype){
      case 'tabs':
        $('.gre-tabs').each(function( index ){
          var sNewID = 'tabs-' + index;
          var sTabHeader = 'h3';
          var aTabHeaders = [];

          if (typeof $(this).data('tabheader') !== 'undefined') {
            sTabHeader = $(this).data('tabheader');
          }

          $(this).attr('id', sNewID);

          //scrape out the headers 

          var sHeaderRef = '#' + sNewID + ' ' + sTabHeader;

          $(sHeaderRef).each(function( tabindex ){

            //shorten it?

            var sTabHeader = $(this).html();

            if(sTabHeader.length > 50){
              sTabHeader = sTabHeader.substr(0,30) + '...';
            } else {
            }
            aTabHeaders.push(sTabHeader.replace(/&nbsp;/g, ' '));
            $(this).html('TABMARKER');
          });

          //now split the content

          var aTabContent = $('#' + sNewID).html().split('<h3>TABMARKER</h3>');

          //clear the first element (it's an empty one created by the split);

          aTabContent.shift();

          //clear the element

          $('#' + sNewID).html('');

          //build the tab layer

          var sTabsHTML = '<ul class="tabs" data-tabs id="' + sNewID + '-tabs">';
          var i;
          for (i = 0; i < aTabHeaders.length; i++) { 
            if(i == 0){
              var sActiveString = ' is-active';
            } else {
              var sActiveString = '';
            }

            sTabsHTML = sTabsHTML + '<li class="tabs-title' + sActiveString + '"><a data-tabs-target="' + sNewID + '-panel-' + i.toString() + '" href="#' + sNewID + '-panel-' + i.toString() + '">' + aTabHeaders[i].trim() + '</a></li>';
          }

          sTabsHTML = sTabsHTML + '</ul>';

          $(this).html(sTabsHTML);

          //build the content layer

          var sTabsContent = '<div class="tabs-content" data-tabs-content="' + sNewID + '-tabs">';

          var i;
          for (i = 0; i < aTabContent.length; i++) {      
            if(i == 0){
              var sActiveString = ' is-active';
            } else {
              var sActiveString = '';
            }       
            sTabsContent = sTabsContent + '<div class="tabs-panel' + sActiveString + '" id="' + sNewID + '-panel-' + i.toString() + '">' + aTabContent[i] + '</div>';
          }

          var sTabsContent = sTabsContent + '</div>';

          $(this).append(sTabsContent);
        });

        $('.gre-tabs').foundation();
      break;
      case 'accordion':
        var aHeaders = [];
        var aContainerContent = [];
        var sListString = '';
        var sContentString = ''; 
        var sNewID = '';

        $('.gre-accordion').each(function( index ){
          sNewID = 'accordion-' + index;
          aHeaders = [];
          $(this).attr('id', sNewID);

          //build header struct and replace with markers

          $('#' + sNewID + ' h3').each(function( headerIndex ){
            aHeaders.push($(this).text());
            $(this).html('ACCMARKER');
          });

          //now split the content;

          aContainerContent = $('#' + sNewID).html().split('<h3>ACCMARKER</h3>');          

          //clear the first element (it's an empty one created by the split);

          aContainerContent.shift();

          //clear the element

          $('#' + sNewID).html('<ul class="panel-group module accordion long-titles accordion" data-accordion></ul>');

          //loop through and create the accordions

          var i;
          for (i = 0; i < aHeaders.length; i++) {
            if(i == 0){
              sListString = '<li id="accordion-item-' + i + '" class="accordion-item is-active" data-accordion-item><a href="#accordion-item-content' + i + '" class="accordion-title"><h3 class="panel-title">' + aHeaders[i] + '</h3></a></li>';
            } else {
              sListString = '<li id="accordion-item-' + i + '" class="accordion-item" data-accordion-item><a href="#accordion-item-content' + i + '" class="accordion-title"><h3 class="panel-title">' + aHeaders[i] + '</h3></a></li>';
            }

            $('#' + sNewID + ' ul').append(sListString);
          }

        });

        // now create and insert the content

        for (i = 0; i < aContainerContent.length; i++) {
          sContentString = '<div id=accordion-item-content-' + i + '" class="accordion-content" data-tab-content>' + aContainerContent[i] + '</div>';

          $('#' + sNewID + ' #accordion-item-' + i).append(sContentString);
        }
        $('.gre-accordion').foundation();
      break;
    }
  }

  function createAutoSelectors(){

    $('.gre-autoselector').each(function( index ) {
      var sActionClass = '.' + $(this).data('action');
      $(this).on('change', function () {
        var sClassToShow = $(this).val();
        $(sActionClass).each(function( index ) {
          if($(this).hasClass(sClassToShow)){
            $(this).removeClass('hide');
          } else {
            $(this).addClass('hide');
          }
        });
      });
    });
  }




  /* GENERAL FUNCTIONS */

  function lazyLoadImages(){
    console.log('lazy loader')
    $('.gre-lazy').each(function( index ) {
      if($(this).attr('data-lazy')){
        $(this).attr('src', $(this).data('lazy'));
      } else if($(this).attr('data-lazybg')){
        $(this).css('background-image', 'url(' + $(this).data('lazybg') + ')');
      }

      if($(this).hasClass('hide')){
        $(this).removeClass('hide');
      }
    });
  }



  /* EVENTS FUNCTIONS */

  function getEventBriteEvents(eventtype){
    var sOrganiserID = '9769604851'; //default to greenwich-wide
    var sStandardHandlebarsURL = '/assets/content/handlebars/events/event-eventbrite';
    var bHasEvents = false;

    $('.gre-eventbrite').html('<div class="spinner"><img src="' + sDomainURL + '/images/university-logos/logo-999.jpg" /></div>');

    $.ajax({
      url: sStandardHandlebarsURL,
      type:'GET',
      success: function(data){

        sAjaxURL = 'https://www.eventbriteapi.com/v3/events/search/?token=43JLAZOLS4EP22OT4AJT&organizer.id=' + sOrganiserID + '&sort_by=date&dev=yes';

        var html = jQuery.parseHTML(data, true);
        var hEventTemplateSource = html[0].innerHTML; //this bypasses the surrounding script tags and gets the div which forms the handlebar template.      
        var hEventTemplate = Handlebars.compile(hEventTemplateSource);

        $.ajax({
          url:sAjaxURL,
          type:'GET',
          success: function(data){

            $('.gre-eventbrite').html('');

            //build the events

            var sKey = '';
            var sSearchUrl = sAjaxURL;

            for(sKey in data.events){

              var aStartDateTime = data.events[sKey].start.local.split('T');
              var sStartDate = aStartDateTime[0];
              var aStartDateParts = sStartDate.split('-');
              var aMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              var sDescription = '';
              var sLocation = '';
              var sEventType = '';
              var sFilterVenue='';
              var sStartTimeOfDay = 'am';
              var aStartTime = aStartDateTime[1].split(':');

              if(+aStartTime[0] >= 12){
                sStartTimeOfDay = 'pm';
              }

              if(+aStartTime[0] > 12){
                aStartTime[0] = aStartTime[0] - 12;
              }


              var sStartString = aStartDateParts[2] + ' ' + aMonthNames[(aStartDateParts[1] - 1)] +  ' ' + aStartDateParts[0] + ' ' + aStartTime[0] + ':' + aStartTime[1] + sStartTimeOfDay;

              sDescription = data.events[sKey].description.text;

              if(sDescription.length > 210) {
                sDescription = sDescription.substring(0, 210)
                nLastSpace = sDescription.lastIndexOf(' ');
                sDescription = sDescription.substring(0, nLastSpace) + '...';
              }

              //set event type

              if(data.events[sKey].name.text.indexOf('Taster') !== -1 || data.events[sKey].name.text.indexOf('Open') !== -1){
                sEventType = 'experience';
               } else if(data.events[sKey].name.text.indexOf('Skills') !== -1 || data.events[sKey].name.text.indexOf('Application') !== -1 ){
                sEventType = 'application';
              } else {
                sEventType = 'public';
              }


             var gaCookie = "";
              var gaCookie = document.cookie.match(/(^|[;,]\s?)_ga=([^;,]*)/);
              var gaEvent = gaCookie[2].match(/\d+\.\d+$/)[0];
              //console.log(gaEvent);
       
              var context = {
                evstartdate: sStartDate,
                evstartday: aStartDateParts[2],
                evstartmonth: aMonthNames[(aStartDateParts[1] - 1)],
                evname: data.events[sKey].name.text,
                evdescription: sDescription,
                evvenue: sLocation,
                evfulldate: sStartString,
                evlink: data.events[sKey].url,
                evvenuefilter: sFilterVenue,
                evtype: sEventType,
                evcampus: sLocation
                        };


              if(sEventType == eventtype){

                var eventBox = hEventTemplate(context);

                $('.gre-eventbrite').append(eventBox);
                bHasEvents = true;
              };
          }

      //  
          if(data.events.length==50){
                      $('.gre-events-main').append('<div class="gre-accented"><a href="https://www.eventbrite.co.uk/o/9769604851" target="_blank" class="btn btn-primary btn-lg"><i class="fa fa-external-link-square"></i> See full events listing</a></div>');
          }
      //
          if(!bHasEvents){
            $('.gre-eventbrite').html("<div class='gre-accented'><h3>No events currently scheduled</h3><p>We don't have any events like this running at the moment. Check back soon for updates.</p></div>");
          }


          },
          error: function(data){
            $('.gre-eventbrite-error').removeClass('hidden');
          }
        })
      }
    });

  }

  function deDupeFeatures(){
  /* REMOVE DUPLICATE FEATURE BOXES */
    if($('.gre-feature-box').length > 0){
      $('.gre-feature-box').each(function() {
        $('[id]').each(function (i) {
          if($(this).hasClass('gre-feature-box')){
            $('[id="' + this.id + '"]').slice(1).remove();

          }
        });
      });
    }
  }


  function getNextOpenDay(){
    getGeckoOpenDay();
  }

  function getGeckoOpenDay(){
    var aMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var aMonthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var sAjaxURL = 'https://api-eu.geckoform.com/categories/public/FOEU03bfdiZUTtaj/75?include=events:all&event_status=active&event_closed=0&order_by=start_datetime%7CASC';
    var sOrdinal = 'th';

    $.ajax({
      url:sAjaxURL,
      type:'GET',
      success: function(data){
        var aEvents = data.category.events; 
        var sKey = ''
        var sSearchUrl = sAjaxURL;
        var x = 0;
        for(sKey in aEvents){
          if(x < 1){
            var aStartDateTime = aEvents[sKey].start_datetime.split(' ');
            var aStartDate = aStartDateTime[0].split('-');
            var sStartDay = aStartDate[2];
            var sStartMonth = aMonths[(aStartDate[1] - 1)];
            var sStartMonthLong = aMonthsLong[(aStartDate[1] - 1)];

            if(parseInt(sStartDay) == 1){
              sOrdinal = 'st';
            } else if(parseInt(sStartDay) == 2){
              sOrdinal = 'nd';
            } else if(parseInt(sStartDay) == 3){
              sOrdinal = 'rd';
            }


            var sStartDayLong = parseInt(sStartDay).toString();

            var stOpenDay = {
              evstartday: sStartDay,
              evstartdaylong: sStartDayLong,
              evstartmonth: sStartMonth, 
              evstartmonthlong: sStartMonthLong             
            };

            x = 1;
          }
        }
      
        //find and replace

        replaceNextOpenDayValues(stOpenDay);
      }
    });
  }

  function replaceNextOpenDayValues(stOpenDay){
    try {
    
  // NB Does not strip the tags from the document <title> - use *SEO page title* to avoid [NJA]

      $('.gre-openday-replace').removeClass('hide');
      $('.gre-openday-day').html(stOpenDay['evstartday']);
      $('.gre-openday-daylong').html(stOpenDay['evstartdaylong']);
      $('.gre-openday-month').html(stOpenDay['evstartmonth']);
      $('.gre-openday-monthlong').html(' ' + stOpenDay['evstartmonthlong']);   
    }
    catch(err) {
      console.log('gecko open day error!');
    }

  }

  function buildGeckoListings(){

    var sStandardHandlebarsURL = '/assets/content/handlebars/events/event-gecko';

    $.ajax({
      url: sStandardHandlebarsURL,
      type:'GET',
      success: function(data){
      var html = jQuery.parseHTML(data, true);
      var hEventTemplateSource = html[0].innerHTML; //this bypasses the surrounding script tags and gets the div which forms the handlebar template.      
      var hEventTemplate = Handlebars.compile(hEventTemplateSource);

      //we now have a template! so create the listing....

        $('.gre-gecko').each(function( index ) {
          var sCustomTemplate = $(this).data('handlebars');
          var sListingID = 'gecko-' + index;

          $(this).attr('id', sListingID);
          $(this).html('<div class="spinner"><img src="' + sDomainURL + '/images/university-logos/logo-999.jpg" /></div>');

          var sAjaxURL = 'https://api-eu.geckoform.com/categories/public/FOEU03bfdiZUTtaj/' + $(this).data('categoryid') + '?include=events:all&event_status=active&event_closed=0&order_by=start_datetime';


          $.ajax({
              url:sAjaxURL,
              type:'GET',
              success: function(data){
                $('#' + sListingID).html('');
                var aEvents = data.category.events; 
                var sSearchUrl = sAjaxURL;
               // var category = sAjaxURL.replace('https://api-eu.geckoform.com/categories/public/FOEU03bfdiZUTtaj/', '').replace('?include=events:all&event_status=active&event_closed=0&order_by=start_datetime', '');

                if  (typeof  sCustomTemplate  !== typeof undefined &&  sCustomTemplate  !== false) {
                  $.ajax({
                    url:  sCustomTemplate,
                    type:'GET',
                    success:  function(data){

                      var html  = jQuery.parseHTML(data, true);
                      var hTemplateSource = html[0].innerHTML;  

                      //this  bypasses  the surrounding  script  tags and gets the div which forms the handlebar template

                      var hEventTemplate = Handlebars.compile(hTemplateSource);

                      $('#' + sListingID).append(processGeckoBoxes(aEvents, hEventTemplate));

                    }
                  });    
                } else {

                  $('#' + sListingID).append(processGeckoBoxes(aEvents, hEventTemplate));
                }
              }
          });
        });

      }
    });
  }

  function processGeckoBoxes(events, hEventTemplate){
    var sKey = ''
    var aEvents = events;
    var hEventBox = '';
    var sFinalString = '';
    var aMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for(sKey in aEvents){

      var aStartDateTime = aEvents[sKey].start_datetime.split(' ');

      var aStartDate = aStartDateTime[0].split('-');
      var sStartDay = aStartDate[2];
      var sStartMonth = aMonths[(aStartDate[1] - 1)];
      var aCategory =  aEvents[sKey].pivot;
      var sCatID = aCategory.category_id;
      var sCatURLKey = '';
      var aDescription = aEvents[sKey].description;
      var sDescIntro = $(aDescription).filter("p").first().text();
      //console.log(sDescIntro);
      
       switch(sCatID){
        case 2:
           sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfOWuWRHMP'
        break;
        case 3:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bf1HyCMRxk'
        break;
        case 5:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfVVgNwTtu'
        break;
        case 7:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfLPppw4qH'
        break;
        case 8:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bf13zFwS7x'
        break;
        case 16:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bf3t4kE5zU'
        break;     
        case 21:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfsaNOdLTY'
        break;
        case 24:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/21FO00qnpww3py0073ohcilkxa'
        break;
        case 25:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfv6qu57Eg'
        break;
        case 26:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/21FO00qnpx1pfm00b2zyb0jhod'
        break;
        case 27:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfnscN4xPR'
        break;
        case 28:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfcmV1Sfe6'
        break;
        case 30:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bf7brnNy0U'
        break;
        case 31:
          sCatURLKey = 'https://app.geckoform.com/public/#/modern/FOEU03bfUZtGfbcj'
        break;



      }

      var context = {
        evstartday: sStartDay,
        evstartmonth: sStartMonth,
        evenddate: aEvents[sKey].end_datetime,
        evname: aEvents[sKey].title,
        //evdescription: aEvents[sKey].description    
        evdescription: sDescIntro,
        evlink: sCatURLKey

      };



      hEventBox = hEventTemplate(context);

      sFinalString = sFinalString + hEventBox;
    }



    return sFinalString;
  }


  function getGeckoUUID(categoryid){
    var sCatURLKey = '';

    switch(categoryid){
      case 2:
        sCatURLKey = 'FOEU03bfOWuWRHMP';
      break;
      case 3:
        sCatURLKey = 'FOEU03bf1HyCMRxk';
      break;
      case 5:
        sCatURLKey = 'FOEU03bfVVgNwTtu';
      break;
      case 7:
        sCatURLKey = 'FOEU03bfLPppw4qH';
      break;
      case 8:
        sCatURLKey = 'FOEU03bf13zFwS7x';
      break;        
      case 16:
        sCatURLKey = 'FOEU03bf3t4kE5zU';
      break;       
      case 21:
        sCatURLKey = 'FOEU03bfsaNOdLTY';
      break; 
      case 24:
        sCatURLKey = '21FO00qnpww3py0073ohcilkxa';
      break;
      case 25:
        sCatURLKey = 'FOEU03bfv6qu57Eg';
      break;
      case 26:
        sCatURLKey = '21FO00qnpx1pfm00b2zyb0jhod';
      break;
      case 27:
        sCatURLKey = 'FOEU03bfnscN4xPR';
      break;
      case 28:
        sCatURLKey = 'FOEU03bfcmV1Sfe6';
      break;
      case 30:
        sCatURLKey = 'FOEU03bf7brnNy0U';
      break;
      case 31:
        sCatURLKey = 'FOEU03bfUZtGfbcj';
      break;
    }
      return sCatURLKey

  }

  /* PROGRAMME FUNCTIONS */

  //GLOBAL VARS

  var aFacultyPages = [1220650,1161739,1161772,1220631,1161768,1161735,1220659,1161776,1220668,1161780,1161747];

  var sCachedProgrammeJSON = '';

  //OTHER STUFF

  var getUrlParameter = function getUrlParameter(sParam) {
      var sPageURL = escapeHtml(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
//console.log('sPageURL ' + sPageURL );
//console.log('sURLVariables ' + sURLVariables );
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');

//console.log ('sURLVariables['  + i + '] - ' + sURLVariables[i] + '{' + sParameterName[i] + '}')

          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : sParameterName[1];

          }
      }
  };

  function autoEmbedContent(){
    $('.gre-auto-content').each(function( index ){
      var sUrl = $(this).attr('href');
      var sContentClass = $(this).data('contentclass');
      var sTarget = $(this).data('target');
      var sFollowFunction = '';
      var bHasRequiredAttributes = true;
      var bNoBootstrap = false;

      if(!$(this)[0].hasAttribute('href')){
        bHasRequiredAttributes = false;
      }

      if(!$(this)[0].hasAttribute('data-contentclass')){
        bHasRequiredAttributes = false;
      }

      if(!$(this)[0].hasAttribute('data-target')){
        bHasRequiredAttributes = false;
      }

      if($(this)[0].hasAttribute('data-followfunction')) {
        sFollowFunction = $(this).data('followfunction');
      }

      if($(this)[0].hasAttribute('data-nobootstrap')) {
        bNoBootstrap = true;
      }

      if(bHasRequiredAttributes){

        embedContent(sUrl,sContentClass,sTarget,sFollowFunction, bNoBootstrap);

        //then hide the link

        $(this).addClass('hide');
      } else {
        console.log('Warning: missing ALL required attributes (href, data-contentclass, data-target) so content not embedded');
      }
    });
  }

  function embedContent(url, contentclass, target, customfunction, nobootstrap){

    //get the form

    $.ajax({
    url: url
    }).done(function(data) {

      //get the specific form from the resulting request
      var sContentClass = '.' + contentclass;
      var sTargetClass = '.' + target;

      if($(sContentClass).length > 0 ) {
        var sContent = $(data).find(sContentClass).html();
        //console.log("class found = " + sContent);
      } else {
        // default to standard page (presumed form) body
        var sContent = $(data).find('.gre-page-copy').html();

      }

//      var sContent = $(data).find(sContentClass).html();
      
      if(typeof sContent !== typeof undefined &&  sContent  !== false) {
        $(sTargetClass).html(sContent);
        
      } 

      // else {
      //   $(sTargetClass).html(data);
      // }

      //now clean out any style elements

      $(sTargetClass + ' input').removeAttr('style');
      $(sTargetClass + ' div').removeAttr('style');
      $(sTargetClass + ' span').removeAttr('style');
      $(sTargetClass + ' label').removeAttr('style');
      $(sTargetClass + ' p').removeAttr('style');

      //some fixes for forms
      $('.sq-form-submit').addClass('button');
      $( ".sq-form-question-answer" ).each(function() {
      if ($( this ).find('input').hasClass( "hide")){
        $(this).closest('.sq-form-question').addClass('hide')
      }
      if ($( this ).find('input').hasClass( "gre-hp")){
        $(this).closest('.sq-form-question').addClass('gre-hp')
      }
    });

      //console.log(sTargetClass);

      if (customfunction != '' && typeof customfunction == 'function') { 
        customfunction(); 
      }

      //bootstrapize?
      /*
      if(!nobootstrap){
        //console.log('here');
        bootstrapizeSquizForm(sTargetClass); 
      } */   
    });

  }


  function getDefaultContentTypeProperties(){
    var stContentTypes  = {};
    var stProps = {};

    stProps.class       = 'gre-programmes-listing';
    stProps.collection  = 'courses-meta';
    stProps.sorryDesc    = 'courses';
//    stProps.handlebars  = '/_assets/content/template-includes/handlebars/programme_basic/';
    stProps.handlebars  = '/assets/content/handlebars/prospectus/programme-horizontal/';


    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-events-listing';
    stProps.collection  = 'events-meta';
    stProps.sorryDesc    = 'events';
    stProps.handlebars  = '/assets/content/handlebars/events/event-gecko/_nocache';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-staffdev-events-listing';
    stProps.collection  = 'events-meta';
    stProps.sorryDesc    = 'events';
    stProps.handlebars  = '/assets/content/handlebars/events/event-staffdev';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-people-listing';
    stProps.collection  = 'people-meta';
    stProps.sorryDesc    = 'people';
    stProps.handlebars  = '/assets/content/handlebars/people/person-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-article-listing';
    stProps.collection  = 'articles-meta';
    stProps.sorryDesc    = 'stories';
    stProps.handlebars  = '/assets/content/handlebars/articles/articles-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-doc-listing';
    stProps.collection  = 'documents-meta';
    stProps.sorryDesc    = 'documents';
    stProps.handlebars  = '/assets/content/handlebars/docs/docs-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-opp-listing';
    stProps.collection  = 'opportunities-push-v1';
    stProps.sorryDesc    = 'opportunities';
    stProps.handlebars  = '/assets/content/handlebars/opps/opps-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-staffdev-listing';
    stProps.collection  = 'opportunities-push-v1';
    stProps.sorryDesc    = 'opportunities';
    stProps.handlebars  = '/assets/content/handlebars/opps/opportunity-staffdev';

    stContentTypes[stProps.class] = stProps;


    stProps = {};
    stProps.class       = 'gre-agent-listing';
    stProps.collection  = 'agents-meta';
    stProps.sorryDesc    = 'agents';
    stProps.handlebars  = '/assets/content/handlebars/agents/agents-sidebar';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-tourdates-listing';
    stProps.collection  = 'events-meta';
    stProps.sorryDesc    = 'tour dates';
    stProps.handlebars  = '/assets/content/handlebars/tourdates/tourdates-sidebar';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-research-activity-listing';
    stProps.collection  = 'research-meta';
    stProps.sorryDesc    = 'research projects';
    stProps.handlebars  = '/assets/content/handlebars/research/research-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-research-groups-listing';
    stProps.collection  = 'research-meta';
    stProps.sorryDesc    = 'research groups';
    stProps.handlebars  = '/assets/content/handlebars/research/research-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-bursaries-listing';
    stProps.collection  = 'bursaries-push-v1';
    stProps.sorryDesc    = 'bursaries';
    stProps.handlebars  = '/assets/content/handlebars/bursaries/bursaries-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-sites-listing';
    stProps.collection  = 'sites-meta';
    stProps.sorryDesc    = 'sites';
    stProps.handlebars  = '/assets/content/handlebars/sites/sites-horizontal';

    stContentTypes[stProps.class] = stProps;

    stProps = {};
    stProps.class       = 'gre-social-listing';
    stProps.collection  = 'social-meta';
    stProps.sorryDesc    = 'items';
    stProps.handlebars  = '/assets/content/handlebars/social/social-horizontal';
    
    stContentTypes[stProps.class] = stProps;

    return stContentTypes;
  }

  //this is the auto functions for including funnelback stuff.

  function scanForFunnelbackContent(){
    stContentTypes = getDefaultContentTypeProperties();
    var sKey = '';

    for(sKey in stContentTypes){
      var stContentType = stContentTypes[sKey];
      if($('.' + stContentType.class).length > 0 && $('.' + stContentType.class).hasClass('gre-search-results') == false && $('.' + stContentType.class).hasClass('fb-ignore') == false){
        createFunnelbackListing(stContentType);
      }
    }
  }

  function createFunnelbackListing(props){
    var sDefaultHandlebarsURL = props.handlebars;

    //if that got an empy string it's not a valid call, so just don't do anything!

    if(sDefaultHandlebarsURL != ''){
      $.ajax({
        url:  props.handlebars,
        type:'GET',
        success: function(data){
          var html = jQuery.parseHTML(data,  true);
          var hTemplateSource = html[0].innerHTML;  //this  bypasses  the surrounding  script  tags and gets  the div which forms the handlebar template. 

          props.hTemplate  = Handlebars.compile(hTemplateSource);

          //we  now have a template! so create  the listing..... 

          buildFunnelbackListing(props)    
        }
      });
    }  
  }

  function buildFunnelbackListing(props){    
    var sBaseAjaxURL = sFunnelbackURL;
    $('.' + props.class).each(function(i){
      var sID = props.class + i; 
      $(this).attr('id', sID);

      var sBackgroundType = $(this).data('background');

      $('#' + sID).addClass('hide');

      switch(sBackgroundType){
        case "light":
          $('#' + sID).after('<div class="spinner" id="spinner-' + sID + '"><img src="' + sDomainURL + '/images/university-logos/logo-999-e4e.jpg" /></div>');
        break;
        case "variant":
          $('#' + sID).after('<div class="spinner" id="spinner-' + sID + '"><img src="' + sDomainURL + '/images/university-logos/logo-999-v.jpg" /></div>');
        break;


        case "dark":
        break;
        default:
          $('#' + sID).after('<div class="spinner" id="spinner-' + sID + '"><img src="' + sDomainURL + '/images/university-logos/logo-999.jpg" /></div>');
      }

      var sTags = '';
      var aTags  = $(this).data('filter').replace('greSubject','subject').split('?');
      var sCustomTemplate = $(this).data('handlebars');    
      var sPostProcess = $(this).data('postprocess'); 
      var sTracking =  '';
      var sJets = $(this).data('jets'); 
      if ($(this).data('tracking') !== undefined) {
          sTracking='&tracking=yes';
      } 

    // custom fields?

    var sCustomFields = '';
    if ($(this).data('fields') !== undefined) {
      var bAllResults = true;
    var sBaseAjaxURL = sFunnelbackURL.replace('search.json', 'all-results.json');
    var sCustomFields = $(this).data('fields') + '&optimisations=false';
    } else {
      var bAllResults = false;
      var sBaseAjaxURL = sFunnelbackURL;
    }

      //this kicks in if a data-backup has been specified. e.g. to reduce load during clearing

      if ($(this).data('backup-url') !== undefined) {
        console.log('url override');
        //url override?

        sAjaxURL = $(this).data('backup-url');

      } else {
        console.log('url regular');
        var sURLCollection = getUrlParameter('c');
        var sURLCollectionInject = '';

        //this next bit injects a url param in BUT PRESERVES any existing stuff on data-filter

        if(sURLCollection === undefined){} else {
        	var sURLCollectionInject = '&meta_collections=' + getUrlParameter('c');
        }
 
      if(aTags.length ==  1){
        var sTags  = 'collection=' + props.collection + '&num_ranks=700&query=%21padrenull&fmo=1&' + processFunnelbackFilterShivs($(this).data('filter'), props.collection ) + sTracking + '&fields=';
      } else {
        var sTags  = processFunnelbackFilterShivs(aTags[1], props.collection);
      }

      var sAjaxURL = sBaseAjaxURL  + sTags + sURLCollectionInject;


        //HAX FOR DATE



        if(props.class == 'gre-events-listing'){
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth(); //January is 0!
          var yyyy = today.getFullYear();
          var aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          sAjaxURL = sAjaxURL + '&meta_d3=' + dd + aMonths[mm] + yyyy;
        }
      }

      $.ajax({
        url:  sAjaxURL,
        type:'GET',
        success:  function(data){
          if(bAllResults){
          var aResults = {};
            //okay, we need to restructure the all results response to match the base
          var aAllResults = data;
          var stResult = {};
          var sAllResultsKey = '';
      for (i = 0; i < aAllResults.length; i++) {
        // always present at top level

        stResult.title = aAllResults[i].title;
              stResult.liveUrl = aAllResults[i].liveUrl;
        
             // dummying for now as i don't think you'd ever use them with allresults. will probably regret that though!
              stResult.clickTrackingUrl = '';
              stResult.searchUrl = '';

              //okay metadata. this we have to do as a mini for loop.
              stMetaData = {};

        for (var sMetaKey in aAllResults[i]) {
          if(sMetaKey.includes('metaData')){
            stMetaData[sMetaKey.replace('metaData/','')] = aAllResults[i][sMetaKey];
          }
        }

        stResult.metaData = stMetaData;

        aResults[i] = stResult;
        stResult = {};
        stMetaData = {};
      }         

          } else {
          var aResults = data.response.resultPacket.results;
          } 
          var hCustomTemplate = props.hTemplate;
          var sSearchUrl = sAjaxURL;

          //custom  template?  

          if (typeof  sCustomTemplate  !== typeof undefined && sCustomTemplate  !==  false){

            //fix any old assetsv3 refs (old squiz. we fixed paths in new)

            sCustomTemplate = sCustomTemplate.replace('_assetsv3', 'assets');

            $.ajax({
              url: sCustomTemplate,
              type:'GET',
              success:  function(data){
                var html  = jQuery.parseHTML(data, true);
                var hTemplateSource  = html[0].innerHTML; //this  bypasses the surrounding script tags and gets the div which forms the handlebar template.    
                var hCustomTemplate = Handlebars.compile(hTemplateSource);
                //custom template?

                processFunnelbackResults(sID, aResults,  hCustomTemplate, props, sSearchUrl);

                //post process

                if (typeof  sPostProcess  !== typeof undefined && sPostProcess  !==  false){
                  var stPostArgs = {};
                  stPostArgs.props = props;
                  stPostArgs.aResults = aResults;
                  stPostArgs.sID = sID;
                  window[sPostProcess](stPostArgs);
                }
              }
            });    
          } else {

            processFunnelbackResults(sID, aResults, hCustomTemplate, props, sSearchUrl);

            //post process

            if (typeof  sPostProcess  !== typeof undefined && sPostProcess  !==  false){
              var stPostArgs = {};
              stPostArgs.props = props;
              stPostArgs.aResults = aResults;
              stPostArgs.sID = sID;
              window[sPostProcess](stPostArgs);
            }
          }
            console.log('check for jets');
            if (typeof  sJets  !== typeof undefined && sJets  !==  false){
              console.log('jets running...');
              var searchtexttriggered = 0;
              if (typeof  $('#' + sID ).data('jets-container')  !== typeof undefined && $('#' + sID ).data('jets-container')  !==  false){
                var sJetsContainer = $('#' + sID ).data('jets-container');
                console.log('custom container for jets');
                $('#' + sJetsContainer).addClass('jetsCustomContent').html('<label for="query-' + sID + '" class="gre-form-label">Keyword filter</label><div class="input-group"><input type="search" class="jetsCustomSearch input-group-field" id="query-' + sID + '" placeholder="Type here to filter list..." aria-label="Accounting, history, science..."><div class="input-group-button"><input type="submit" class="button jets-search-buttom" value="Search" /></div></div>');
              } else {
                 $('#' + sID ).addClass('jetsCustomContent').before('<label for="query-' + sID + '" class="gre-form-label">Keyword filter</label><input type="search" class="jetsCustomSearch" id="query-' + sID + '" placeholder="Type here to filter list..." aria-label="Type here to filter list">');
              }
              //console.log('jetsCustomSearch added');
// Try to have your no-JS fallback search button always present (i.e. after the gre-listing DIV) so that filter users have an action if their preferred result is not present
               if(searchtexttriggered == 0) {
                  if(sJets.length > 5){
                     showText(".jetsCustomSearch", ';' + sJets + ';Type here to filter list...', 0);
                     searchtexttriggered = 1;
                  } else {
                     showText(".jetsCustomSearch", ';Avr<ery Hill;how to aply<<ply;Type here to filter list...', 0);
                     searchtexttriggered = 1;
                  }
               }

               postscribe('#postscribe-scripts', '<script src="' + sDomainURL + '/assets/framework/gre/_js/jets.min.js"><\/script>', {

                  done: function() {
                     //console.log('jets');
                     var jets = new Jets({
                       searchTag: '.jetsCustomSearch',
                       contentTag: '.jetsCustomContent'
                     });
                  }
               });

            }

        }
      });
    });
  }

  function advancedFunnelbackJetsFilter(postArgs){
    var sAdvancedFilterParams = '';
    $('#' + postArgs.sID).addClass('gre-jets-results-container');

    if ($('#' + postArgs.sID).data('jets-params')) {
      sAdvancedFilterParams = $('#' + postArgs.sID).data('jets-params');
    }

    //add link marker

    $('#' + postArgs.sID).before( '<a id="gre-jets-results" class="gre-anchor"></a>');

    //override form submit action

    $( ".gre-advanced-jets" ).submit(function( event ) {
      $([document.documentElement, document.body]).animate({
        scrollTop: $('#gre-jets-results').offset().top
      }, 500);
    event.preventDefault();
  });

  //add count link
  

    //console.log('filter me!');
  var jets = new Jets({
      searchTag: '#query',
      contentTag: '#' + postArgs.sID,
      manualContentHandling: function(tag) {
       return tag.getAttribute('data-content');
    },
    didSearch: function(search_phrase) {
      //results?
      $('.gre-jets-results-container').removeClass('hide');

        $('gre-jets-matches a').attr('href', '#gre-jets-results');

    var nTotalResults = $('.gre-jets-results-container' + ' a:visible').length;      
    //console.log(nTotalResults);
      if(nTotalResults > 0){
        var bShowIfEmpty = true;

        if(sAdvancedFilterParams.includes('hide-empty')){
          var bShowIfEmpty = false;          
        }

         $('.gre-advanced-jets-alt').addClass('hide');

        if($('#query').val().length > 0){
          $('.gre-jets-matches-number').html(nTotalResults + ' matching');
            $('.jets-results-container').removeClass('hide');
        } else {
          $('.gre-jets-matches-number').html('all available');
          if(!bShowIfEmpty){
            $('.gre-jets-results-container').addClass('hide');
          }
        }
        $('.gre-jets-matches').removeClass('hide');           
      } else {
          $('.gre-jets-results-container').addClass('hide');
          $('.gre-jets-search-phrase').html(search_phrase);
          $('.gre-advanced-jets-alt').removeClass('hide');        
          $('.gre-jets-matches-number').html('all available');
          $('.gre-jets-matches a').attr('href', window.location.href.replace('#gre-jets-results',''));
      }

      }

    });
  }

  function processFunnelbackFilterShivs(url, collection){
    //this is to catch any 'old' meta references that need to be replace post funnelback renaming.

    url = url.replace('f.Global+subject%7C7','f.Subject%7Csubject');
    url = url.replace('f.Subject%7C7','f.Subject%7Csubject');
    url = url.replace('f.Tagging%7CG=','f.Collection%7Ccollections=');


    switch(collection){
      case 'courses-meta':
        url = url.replace('meta_Y=','meta_progFaculty=');
        url = url.replace('meta_J=','meta_collections=');
      break;
      case 'people-meta':
        url = url.replace('meta_Y=','meta_faculty=');
        url = url.replace('meta_D=','meta_department=');
        url = url.replace('metaq=','meta_level=');
        url = url.replace('sort=metam','sort=metaSurname');
      break;
      case 'documents-meta':

        //for where old search urls are used

        url = url.replace('collection=Documents', 'collection=documents-meta');
        url = url.replace('meta_M=', 'meta_type=');
        url = url.replace('meta_G=', 'meta_collections=');
        url = url.replace('meta_l=', 'meta_faculty=');

      break;
      case 'events-meta':

        //for where old search urls are used

        url = url.replace('meta_G=', 'meta_collections=');
        url = url.replace('meta_l=', 'meta_faculty=');

      break;
      case 'articles-meta':
        url = url.replace('meta_G=', 'meta_collections=');
      break;
      case 'events-meta':
        url = url.replace('meta_r=','meta_audiences=')
      break;
    }

    return url;
  }

  function processFunnelbackResults(id, results, customtemplate, props, sSearchUrl){


    //ONLY NEEDED IF FUNNELBACK DOESN'T RECOGNISE TODAY'S DATE AS STARTING POINT FOR LISTING


  // var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // function dateFormat(d) {
 //   var t = new Date(d);
 //   return t.getDate() +  monthShortNames[t.getMonth()]  + t.getFullYear();
  // }

  // console.log(dateFormat(new Date()));

    // REMOVE THIS WHEN FUNNELBACK SORT THEIR DATE ISSUE OUT FOR EVENTS

    // if(typeof props !== 'undefined'){

    //   if('collection' in props && props.collection == 'events-meta-public'){
    //     results.sort(function(a,b){
    //       a.metaData.splitDate = a.metaData.sortJSDate.split(' ');
    //       b.metaData.splitDate = b.metaData.sortJSDate.split(' ');
    //       console.log(a.metaData.splitDate[0]);
    //       a = new Date(a.metaData.splitDate[0]);
    //       b = new Date(b.metaData.splitDate[0]);
    //       return a - b;
    //     });
    //   }
    // }

    //NOTE: customtemplate will contain EVERY template if it's an 'everything' search
//    $('#' + id).html('');
    if ($(results).length > 0 ) {
      $('#' + id).html('');
      for(sKey  in  results){
        var stContext = {};
        stContext.title = results[sKey].title;


        //NOW INCLUDES ENV FIX!

        stContext.liveUrl = results[sKey].liveUrl.replace('//www.gre.ac.uk', sDomainURL).replace('//www-beta.gre.ac.uk', sDomainURL);
        stContext.clickTrackingUrl = stContext.liveUrl //results[sKey].clickTrackingUrl;
        stContext.searchUrl = stContext.liveUrl //sSearchUrl;
        stMetaData = results[sKey].metaData;
        for(sMetaKey in stMetaData){
          stContext[sMetaKey] = stMetaData[sMetaKey];
        }
        

        if(id != 'everything-meta-results'){

          $('#' + id).append(customtemplate(processClientFunnelbackContextShivs(stContext,props, sSearchUrl)));
        } else {
          //CORRECT EVENTS COLLECTIONS TO META
        switch(results[sKey].collection){
            case "articles-push-v1":
              results[sKey].collection = 'articles-meta';              
            break;
            case "sites-v1":
              results[sKey].collection = 'sites-meta';              
            break;
            case "courses-push-v1":
              results[sKey].collection = 'courses-meta'; 
            break;
            case "documents-push-v1":
              results[sKey].collection = 'documents-meta'; 
            break;
            case "people-push-v1":
              results[sKey].collection = 'people-meta'; 
            break;
            case "social-push-v1":
              results[sKey].collection = 'social-meta'; 
            break;
            case 'eventbrite-custom-v1':
            case 'gecko-custom-v1':
            case 'events-push-v1':
            case 'events-meta':
              results[sKey].collection = 'events-meta';
            break;

          }
        
          if(results[sKey].collection in customtemplate){
            //console.log(results[sKey].collection.replace('-public',''));
            var hCustomTemplate = customtemplate[results[sKey].collection];

            var sContentKey = '';
            for(sContentKey in stContentTypes){
              if(stContentTypes[sContentKey].collection == results[sKey].collection){
                var props = stContentTypes[sContentKey];
                break;
              }
            }
            $('#' + id).append(hCustomTemplate(processClientFunnelbackContextShivs(stContext,props, sSearchUrl)));
          }
        }

//        $('#' + id).append(hCustomTemplate(processClientFunnelbackContextShivs(stContext,props)));
        $('#' + id).removeClass('hide');
        $('#spinner-' + id).remove();

      }    
    } else {

      var fallbackContent = $('#' + id).html();

      console.log('#' + id + 'sorry');
      console.log('Content #' + id + ' ' + fallbackContent); 
      console.log('Length trimmed #' + id + ' ' + $.trim(fallbackContent).length);

      if($.trim(fallbackContent).length > 0) {

      } else {
        buildFunnelbackListingSorryBox(id, props);        
      }
        $('#' + id).removeClass('hide');
        $('#spinner-' + id).remove();
    }
  }

  function processClientFunnelbackContextShivs(context, props, sSearchUrl){

      var aBaseSearchUrl = sFunnelbackURL.replace('s/search.json?','');
      var strClickTracking =  aBaseSearchUrl + context.clickTrackingUrl;

        var strUrl = window.location.href;
        if ((strUrl).indexOf('www.gre.ac.uk/search') != -1) {
          if ('liveUrl' in context) {
            context.liveURL = context.liveUrl + '?y=2021';
           //context.liveUrl = strClickTracking;
//console.log('new liveUrl' + context.liveUrl);
          }
          if ('eventURL' in context) {
           //context.eventURL = strClickTracking;
//console.log('new liveUrl' + context.liveUrl);
            context.eventURL = conctex.liveUrl;
          }
        }


    //placeholder for if needed.
      var aBaseSearchUrl = 'https://search.gre.ac.uk';
      var strClickTracking =  aBaseSearchUrl + context.clickTrackingUrl;
      if (sSearchUrl !== undefined) {
        var strUrl = context.searchUrl;
        if ((strUrl).indexOf('&tracking=yes') != -1) {
          if ('liveUrl' in context) {
           context.liveUrl = strClickTracking;
          }
          if ('eventURL' in context) {
           context.eventURL = strClickTracking;
          }
        }
      }

      //console.log('shiv collection ' + props.collection.toLowerCase());
      //console.log("props is " + props.collection.toLowerCase());

      switch(props.collection.toLowerCase()){
        case 'courses-push-v1':
        case 'courses-meta':
          if('mode' in context){
            context.mode = context.mode.replace(/;/g, ', ');
          } else {
            context.mode = '';
          }

          if(!('location' in context)){
            context.location = 'Partner College';
          }


          if(context.overseasEligibility == 'No'){
            context.domesticOnly = '<li><i class="fas fa-home"></i> <strong>Home/EU students only</strong></li>';
            //this is for domestic only marking, where necessary.

          } else {
            context.domesticOnly = '';
          }

        break;
        case 'documents-push-v1':
        case 'documents-meta':
          //remove these when nu-Funnel is live
/*
          if('c' in context){
            context.description = context.c;
            context.updated = context.d;
            context.type = context.M;
          }
*/
        break;
        case 'people-push-v1':
        case 'people-meta':
           if('thumbUrl' in context){
             context.thumbUrl = context.thumbUrl.replace('www.gre.ac.uk', sDomainURL);
             if (context.thumbUrl.includes('/__data/assets/image/')){ // Swap in v200 variety
             	context.thumbUrl = context.thumbUrl.replace(/\/[^\/]+?\.([^\/]+?)$/, '/varieties/v200.$1');             	
             }
           } else {
            context.thumbUrl = sDomainURL + '/__data/assets/image/0025/9358/varieties/v200.gif';
           }

           if('c' in context && context.c.length > 250){
              context.biog = context.c.substring(0, 250) + ' [...]';
           }

           //console.log(context);

          //remove these when nu-Funnel is live
/*
          if('a' in context){
            context.jobTitle = context.D;
            context.OtherInitials = context.b;
            context.profileImage = context.B;
            if('r' in context){
              context.Title = context.r;
            }
            context.Forename = context.a;
            context.Surname = context.m
          }
*/
        break;
        case 'research-meta':
        case 'research-groups-push-v1':
            if('link' in context && context.link != ''){
              //override the liveurl
              context.liveUrl = context.link;
            }
        break;
        case 'eventbrite-custom-v1':
        case 'gecko-custom-v1':
        case 'events-push-v1':
        case 'events-meta':

          //change the context for now. can remove when everything is coming from Funnelback as can redo the handlebar then
          //console.log(context)
          //console.log("Title is " + context.title + "sortdate is " + context.sortDate);

          console.log("context is " + context);
          var aStartDateTime = context.startTimeReadable.split(' ');


          //var aStartDate = aStartDateTime[0].split('-');
          //var sStartDay = aStartDate[0];
          //var sStartMonth = aStartDate[1];
          //var aMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

          context.evstartday = aStartDateTime[0];
          context.evstartmonth = aStartDateTime[1]
          //context.evstartmonth = aMonths[(sStartMonth - 1)];
          context.evname = context.title;
          context.evdescription = context.c;

          if('externalLink' in context){

            context.evlink = context.externalLink;
          } else {
            context.evlink = context.liveURL;
          }

        if('description' in context){
          var sDescription = context.description;
          if(sDescription.length > 210) {
            sDescription = sDescription.substring(0, 210)
            nLastSpace = sDescription.lastIndexOf(' ');
            sDescription = sDescription.substring(0, nLastSpace) + '...';
            context.description = sDescription;
          }
        }
        break;
        case 'opportunities-meta':

          if('shortDescription' in context){
          var sDescription = context.shortDescription;
          if(sDescription.length > 210) {
            sDescription = sDescription.substring(0, 210)
            nLastSpace = sDescription.lastIndexOf(' ');
            sDescription = sDescription.substring(0, nLastSpace) + '...';
            context.shortDescription = sDescription;
          }
        }
        if('opportunityType' in context){
          var type = context.opportunityType;
          if (type == "staff-development") {
            var sTitle = context.title;
            sTitle = sTitle.toLowerCase();
            context.jets = sTitle;
            
          }

        }


// -----------

        break;


        case 'sites-meta':
        // Is this a site home?
        if(/\|/.test(context.title) == false){
          context.siteHome = 1;
        }

// -----------
        break;


        case 'social-meta':
        
        if(context.thumbRatio > 1){
          context.thumbAspect = 'portrait';
        } else {
          context.thumbAspect = 'landscape';
        }
        context.handle = context.liveUrl.replace(/.*\//,'') + ' on ' + context.type.substr(0,1).toUpperCase() + context.type.substr(1);
        context.handle = context.handle.replace('on Blog','on blogs.gre.ac.uk');
        if (context.handle.indexOf("on Other") >= 0){
          context.handle = context.liveUrl.replace(/(.*\/\/|\W*$)/g,'');
        } else {
          context.handle = '@' + context.handle;
        }


// -----------

        break;
        case 'articles-push-v1':
        case 'articles-meta':

          //check for thumbnail
          //no thumbnail (or invalid type) marks the class as text-only

          context.articleClass = "";  //NEW
          var sImageVarietyRegex = /\/[^\/]*$/;  //NEW

          //testing fudge!

          if('articleThumbnail' in context){

            if(context.articleThumbnail == sDomainURL || /(.jpg|.jpeg|.png|.gif)$/i.test(context.articleThumbnail) == false ){
              // Content is not a thumbnail, so delete it
              //console.log (context.articleThumbnail + ' does not look like a valid thumbnail image ' + context.title);
              delete context.articleThumbnail;
              context.thumbWidth = 'hide';
              context.textWidth = '';
              context.articleClass = 'gre-text-only text-only'; //NEW
            } else {
              if (/\/varieties\/v/.test(context.articleThumbnail) == false){
                // If the thumbnail isn't already a variety (it shouldn't be) then swap in the v800
//console.log ('Creating variety for ' + context.articleThumbnail);
                var sImageType = context.articleThumbnail.replace(/.*\./,"").toLowerCase();
//console.log ('MIME is ' + sImageType);
                context.articleThumbnail = context.articleThumbnail.replace('^http:','https:').replace(sImageVarietyRegex,'/varieties/v800.') + sImageType;
//console.log ('New path: ' + context.articleThumbnail);
              }
            }
            // Thumb should now be a v800 variety, so is easy to also reference the v200
            context.articleThumbnailSmall = context.articleThumbnail.replace(/\/varieties\/v800/,'/varieties/v200');
            context.thumbWidth = 'medium-2';
            context.textWidth = 'medium-10';

          } else {
            context.thumbWidth = 'hide';
            context.textWidth = '';
            context.articleClass = 'gre-text-only text-only'; //NEW
          }
        break;
      }

    return context;

  }

  function processFunnelbackLayerShivs(context, props){

      if (props.collection == "Opportunities"

        // uncomment any content types you wish to use the filter on. The filters should be specified on each handlebar file.
        // || props.collection == "Events"
        // || props.collection == "Documents"
        // || props.collection == "Articles"
        // || props.collection == "people-2018"
         ) {
        createFBFilter();
    }
  }

  function buildFunnelbackListingSorryBox(id, props){
    var sSorryTitle = "<h5>We don't seem to have any " +  props.sorryDesc + " like this right now</h5>"
    var sSorryText = '<p>Currently there are no ' + props.sorryDesc + ' to show here. Please check back later or get in touch to find out more.</p>';
    var sSorryDiv = '<div class="alert gre-funnelback-sorry">' + sSorryTitle + sSorryText + '</div>';
    console.log(sSorryDiv);
    $('#' + id).html(sSorryDiv);
  }

  function getBackgroundColourByID(id) {
    var elem = document.getElementById(id);
    var theCSSprop = window.getComputedStyle(elem, null).getPropertyValue("background-color");
    return theCSSprop;
  }

  function buildJUICourseSearch(){
    console.log('building autocomplete...')
    var sAjaxURL = sFunnelbackURL.replace('search.json','all-results.json') + 'num_ranks=700&collection=courses-meta&sort=title&query=%21padrenull&fmo=1&fields=liveUrl,title,metaData/subject&optimisations=false&';
    var aAutocompleteValues = [];
    //any params?
    
    if ($('.gre-course-auto-complete').length && typeof $('.gre-course-auto-complete').attr('data-filter') !== typeof undefined && $('.gre-course-auto-complete').attr('data-filter') !== false) {
      sAjaxURL = sAjaxURL + '&' + $('.gre-course-auto-complete').data('filter');
    }

    //backup if specified (e.g. in clearing)

    if (typeof $('.gre-course-auto-complete').attr('data-backup-url') == undefined || $('.gre-course-auto-complete').attr('data-backup-url') == false) {
      console.log('no backup override');
    } else {
      //url override?
      console.log('override autocomplete');
      console.log('val: ' + $('.gre-course-auto-complete').attr('data-backup-url'));
      sAjaxURL = $('.gre-course-auto-complete').data('backup-url');
    }

    //destroy any existing autocomplete

    if($('#query').hasClass('ui-autocomplete-input')){
      $('#query').autocomplete('destroy');
    }

    //build autocomplete 

    $.ajax({
      url: sAjaxURL,
      context: document.body
    }).done(function(data) {
      aProgrammes = data;
      var sSearchUrl = sAjaxURL;
      for(sKey in aProgrammes){
        aProgramme = aProgrammes[sKey];
        var aProgrammeCategories = [];
        if('metaData/subject' in aProgramme && aProgramme['metaData/subject'] != null){
          aProgrammeCategories = aProgramme['metaData/subject'].split(';');
        }
        //create the val array

        stAutocomplete       = {};
        stAutocomplete.value = $.trim(aProgramme['title']);
        stAutocomplete.url = aProgramme['liveUrl'].replace('www.gre.ac.uk', sDomainURL).replace('www-beta.gre.ac.uk', sDomainURL);
        stAutocomplete.desc  = decodeURIComponent(aProgrammeCategories.join().replace(',',', '));
        stAutocomplete.type = '';
        stAutocomplete.label = $.trim(aProgramme['title']);
        aAutocompleteValues.push(stAutocomplete);
        
      }

      //build the autocomplete
      buildJUICourseAutocomplete(aAutocompleteValues);

      jQuery.ui.autocomplete.prototype._resizeMenu = function () {
        var ul = this.menu.element;
        ul.outerWidth(this.element.outerWidth());
      }
    });

  }

  function buildJUICourseAutocomplete(aAutocompleteValues){
    $( "#query" ).autocomplete({
      minLength: 0,
      source: function( request, response ) {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
        response($.grep(aAutocompleteValues, function(value) {
            return matcher.test(value.value)
                || matcher.test(value.desc);
        }));
      },
      select: function( event, ui ) {
        var spinner = "<i class='fas fa-sync fa-spin' style='padding:0 1rem'></i>";
        $( "#query" ).val( ui.item.label );
        $(":submit").html(spinner).attr("disabled", true);
        window.location = ui.item.url;       
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      var re = new RegExp("^" + this.term,'i') ;
      var sLab = item.label.replace(re,'<span class="search-matched">' + this.term + '</span>');
      var sDesc = item.desc.replace(re,'<span class="search-matched">' + this.term + '</span>');
      return $( "<li>" )
        .append( '<a>' + sLab + '<span class="search-type">' + item.type + '</span><span class="search-desc"><i class="fas fa-tags"></i>' + sDesc + '</span></a>' )
        .appendTo( ul );
    };
  }

  function initDocs(){

    autoSearchLinks();
    if($('.gre-file-item-icon-link').length > 0){
      addDocumentFileIcons();
    };
  }


  function autoSearchLinks(){
    var sSearchURL = '';
    var x = 0;
    var sSearchType = '';
    var sSearchMeta = '';
    var sWrapperLink = '';
    var aSearchTerms = [];
    var sFinalHTML = '';

    $('.gre-auto-search-link').each(function( index ) {
      sSearchType = $(this).data('searchtype');
      sSearchMeta = '&meta_' + $(this).data('searchmeta');
      switch(sSearchType){
        default:
          sSearchURL = '//search.gre.ac.uk/s/search.html?collection=documents-meta&num_ranks=700&sort=title&query=%21padrenull&fmo=1&';
        break;
      }

      if (typeof $(this).attr('data-searchdelimiter') !== typeof undefined && $(this).attr('data-searchdelimiter') !== false) {
        aSearchTerms = $(this).text().split($(this).data('searchdelimiter'));
        x = 0;
        while(x < aSearchTerms.length){
          sWrapperLink = '<a href="' + sSearchURL + sSearchMeta + '=' + $.trim(aSearchTerms[x]) + '">' + $.trim(aSearchTerms[x]) + '</a>';
          if(x != (aSearchTerms.length - 1)){
            sWrapperLink = sWrapperLink + $(this).data('searchdelimiter') + ' ';
          }
          sFinalHTML = sFinalHTML + sWrapperLink;
          x++
        }
        $(this).html(sFinalHTML);
      } else {
        sWrapperLink = '<a href="' + sSearchURL + sSearchMeta + '=' + $.trim($(this).text()) + '"></a>';
        $(this).wrapInner(sWrapperLink);
      }
    });
  }

function addDocumentFileIcons(){
  $('.gre-docs-file').each(function( i ) {
    var sID = 'file-' + i;
    $(this).attr('id', sID);

    sFileHref = $('#' + sID + ' .gre-file-item-link').attr('href');

    //get extension - look for the LAST array item dot separated

    var aSplitHref = sFileHref.split('.');

    switch(aSplitHref[(aSplitHref.length - 1)]){
      case 'pdf':
        $('#' + sID + ' i').removeClass('fa-file');
        $('#' + sID + ' i').addClass('fa-file-pdf');
      break;
      case 'doc':
      case 'docx':
        $('#' + sID + ' i').removeClass('fa-file');
        $('#' + sID + ' i').addClass('fa-file-word');
      break;
      case 'xls':
      case 'xlsx':
        $('#' + sID + ' i').removeClass('fa-file');
        $('#' + sID + ' i').addClass('fa-file-excel');
      break;
      case 'ppt':
      case 'pptx':
        $('#' + sID + ' i').removeClass('fa-file');
        $('#' + sID + ' i').addClass('fa-file-powerpoint');
      break;        
    }

  });
}

function checkCountryForAgents(funnelbackresults){
  if(funnelbackresults.aResults.length == 0){
    $('.gre-agent-cta').addClass('hide');
    $('#agents').addClass('hide');
  }
}

function buildFlags(){
  $.ajax({
    url: sDomainURL + '/assets/content/feeds/flags/flags-static-content',
    type:'GET',
    success: function(data){

      //build flag struct

      var stFlags = {};
      var sKey = '';


      jCountries = JSON.parse(data);

      for(sKey in jCountries){
        stFlags[jCountries[sKey].alpha_2.toLowerCase()] = jCountries[sKey];
      }

      $('.gre-flag').each(function( index ){
        var sFlagCode = $(this).data('countrycode');
        var sVariety = $(this).data('variety');

        //v32 v800 v1200

        if (typeof  sFlagCode  !== typeof undefined && sFlagCode  !==  false){
          sFlagCode = sFlagCode.toLowerCase();

          if(sFlagCode in stFlags){
            var sFlagURL = stFlags[sFlagCode].flag_url;

            /* if (typeof  sVariety  !== typeof undefined && sVariety  !==  false){
              var aFlag = sFlagURL.split('/');
              sVariety = sVariety.toLowerCase();

              aFlag[(aFlag.length - 1)] = 'varieties';
              aFlag[aFlag.length] = sVariety + '.png';
              var sFlagURL = aFlag.join('/'); 
            } */

            var sFlagHTML = '<img src="' + sFlagURL + '" aria-hidden="true" />';
            $(this).html(sFlagHTML);
          }
        }
      });
    }
  });    
}

//polyfill includes function for ie IF MOVING REBUILD URL PARAMS TAKE THIS WITH IT

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

function rebuildURLParams(key, value){
  // Rebuilt URLs don't want pagination data
  var sURL = location.href.replace(/&(start_rank|page)=\d*/g,'');

  if(!sURL.includes(key)){
    if(sURL.includes('?')){
      sURL = sURL + '&' + key + '=' + value;
    } else {
      sURL = sURL + '?' + key + '=' + value;
    }
  } else {
    var aURLParts = sURL.split('?');
    var aURLParams = aURLParts[1].split('&');
    var sKey = '';

    for(sKey in aURLParams){
      if(aURLParams[sKey].includes(key)){
        var aCollectionParams = aURLParams[sKey].split("=");
        aCollectionParams[1] = value;
        aURLParams[sKey] = aCollectionParams.toString().replace(/,/g,"=");
      }
    } 

    sURL = aURLParts[0] + '?' + aURLParams.toString().replace(/,/g,'&');
  }

  window.history.pushState({}, document.title, sURL);
}

/* POST PROCESSES */

function checkForProgrammeTabs(funnelbackresults){
  var stResultCounts = {};

  stResultCounts.undergraduate = 0;
  stResultCounts.postgraduate = 0;
  stResultCounts.foundation = 0;

  if(funnelbackresults.aResults.length > 4){
    //count number of each

    $('#' + funnelbackresults.sID + ' .prog-ucas-list-item').each(function( index ) {
      switch($(this).data('level').toLowerCase()){
        case 'foundation':
          stResultCounts.foundation = stResultCounts.foundation + 1;
        break;
        case 'undergraduate':
          stResultCounts.undergraduate = stResultCounts.undergraduate + 1;
        break;
        default:
          stResultCounts.postgraduate = stResultCounts.postgraduate + 1;
        break;
      }
    });

    //okay, worth tabbing?

    if(stResultCounts.postgraduate > 0 || stResultCounts.foundation > 0){
      //let's tab

      $('#' + funnelbackresults.sID + ' .prog-ucas-list-item').each(function( index ) {
        switch($(this).data('level').toLowerCase()){
          case 'foundation':
            $('.gre-programmes-tabs-container .tabs-content #foundation').append($(this)[0].outerHTML);
          break;
          case 'undergraduate':
            $('.gre-programmes-tabs-container .tabs-content #undergraduate').append($(this)[0].outerHTML);
          break;
          default:
            $('.gre-programmes-tabs-container .tabs-content #postgraduate').append($(this)[0].outerHTML);
          break;
        }      
      });

      //hide the prog layer and unhide tabs

      $('.gre-programmes-listing').addClass('hide');

      //hide any tabs?

      if(stResultCounts.postgraduate == 0){
        $('.gre-programmes-tabs-container .tabs-content #postgraduate').addClass('hide');
        $('.gre-programmes-tabs .postgraduate').addClass('hide');        
      }

      if(stResultCounts.foundation == 0){
        $('.gre-programmes-tabs-container .tabs-content #foundation').addClass('hide');
        $('.gre-programmes-tabs .foundation').addClass('hide');        
      }

      //unhide the rest

      $('.gre-programmes-tabs-container').removeClass('hide');  

      //check and set different tab if appropriate

      var sURL = location.href

      if(sURL.includes('#foundation')){
        $('#programmes-tabs').foundation('selectTab', 'foundation');
      } else if(sURL.includes('#postgraduate')){
        $('#programmes-tabs').foundation('selectTab', 'postgraduate');
      }
    }
  }
}

//ILS SERVICE CHECKER

function getILSServiceStatus(){
  var sCustomTemplate = sDomainURL + '/assets/content/handlebars/ils/status-horizontal';
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://servicestatus.gre.ac.uk/api/v1/issues/all",
    "method": "GET",
    "headers": {
      "X-Auth-Token": "464b103b-dd56-4afd-821e-6cd8b8025fdf",
      "X-Auth-Secret": "iz0JreeHmDJG09YqS3VXjlHfpjFA9X",
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      "Postman-Token": "6b18f942-6028-4c99-b05e-236f41b918f7"
    }
  }

  $.ajax({
    url: sCustomTemplate,
    type:'GET',
    success:  function(data){
      var html  = jQuery.parseHTML(data, true);
      var hTemplateSource  = html[0].innerHTML; //this  bypasses the surrounding script tags and gets the div which forms the handlebar template.    
      var hCustomTemplate = Handlebars.compile(hTemplateSource);
      var sKey = '';

      $.ajax(settings).done(function (response) {

        //console.log(response);

        for(sKey  in  response.data){

          var stContext = {}

          stContext.title = response.data[sKey].title;
          stContext.status = response.data[sKey].state;
          stContext.updated = response.data[sKey].updated_at;
          stContext.liveURL = '//servicestatus.gre.ac.uk';

          if(stContext.status != 'resolved'){
            $('.gre-ils-service-status').append(hCustomTemplate(stContext));
          }
        }
      });
    }
  });
}

function escapeHtml(unsafe) {
// Don't remove the delimiters...
    return unsafe
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

 function hideCookieMessage(){
  $('.gre-cookie-confirmation').addClass('hide');
  Cookies.set('cookiepermission', 'true', { expires: 365 });
 }

function showCookieMessage(){
  $('.gre-cookie-confirmation').removeClass('hide');
}

function buildSortableListing(){
  //this is the REORDERED list that you want the page to show.

  var aPageOrder = getSortablePageOrder();
  var nSecondaryStart = 5;
  var nTertiaryStart = 7;
  var sNewID = '';
  var bShowHints = getUrlParameter('hints');
  var aAlphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var sLetter = '';
  var sEditLink = '';

  $('.gre-sortable-block').each(function(index) {
    $(this).data('order', aPageOrder.indexOf((index + 1)));
    $(this).data('origin', index);
    $(this).css('order', $(this).data('order'));
    
    //where should it be?

    if($(this).data('order') >= nSecondaryStart){
      if($(this).data('order') >= nTertiaryStart){
        //it's tertiary
        $('.gre-sortable-footer-right .grid-y').append($(this));
      } else {
        //it's secondary
        $('.gre-sortable-footer-left .grid-y').append($(this));
      }
    } else {
      //add flip class if necessary

      if(!isOdd($(this).data('order'))){
        $(this).addClass('flip');
      }
    }
  });

  //clean up moved html

  $('.gre-sortable-footer-right .sortable-content').removeClass('medium-6');
  $('.gre-sortable-footer-left .sortable-content').removeClass('medium-6');
  $('.gre-sortable-footer-left .sortable-content').addClass('medium-9');

 $('.gre-sortable-footer-left .sortable-image').removeClass('medium-6');
  $('.gre-sortable-footer-left .sortable-image').addClass('medium-3');

  //add links 

  $('.gre-sortable-footer .sortable-content').each(function(index) {
    sNewID = 'sortable-' + index;
    $(this).attr('id',sNewID);

    if($('#' + sNewID + ' .gre-cta a').length > 0){
      $('#' + sNewID + ' h2').wrapInner('<a></a>');
      $('#' + sNewID + ' h2 a').attr('href', $('#' + sNewID + ' .gre-cta a').attr('href'));
    }
  });

  //admin bits

    if(bShowHints === undefined){

    } else {
      $('.sortable-content h2').each(function(index) {
        sLetter = '<span class="gre-hint">' + aAlphabet[index] + '</span>';
        $(this).prepend(sLetter);
      });
    }

}

function getSortablePageOrder(){
  var aPageOrder = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
  var aAlphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var aLetterOrder = [];
  var aNewOrder = [];
  var sKey = '';
  var nNewPosition = 0;
  var sAudience = getAudience();
  //is there a url param (this will always take precedence)?
  var sAudienceTag = '';
  var sURLOrder= getUrlParameter('o');

  if(sURLOrder === undefined){

    //is there an audience list specified?

    if(sAudience != ''){
      sAudienceTag = 'aud-' + sAudience;
      if($('.gre-sortable').data(sAudienceTag)){
        aLetterOrder = $('.gre-sortable').data(sAudienceTag).split('');
      }
    }


  } else {
    sURLOrder = sURLOrder.toLowerCase();
    aLetterOrder = sURLOrder.split('');
  }

  //okay, if we have letters, do something

  if(aLetterOrder.length > 0){

    //first, create the right initial numbers

    for(sKey in aLetterOrder){
      nNewPosition = aAlphabet.indexOf(aLetterOrder[sKey]) + 1;
      aNewOrder.push(nNewPosition);
      aPageOrder.splice(aPageOrder.indexOf(nNewPosition),1);
    }

    aPageOrder = aNewOrder.concat(aPageOrder);

  }

  return aPageOrder;
}

function isOdd(num) { return num % 2;}

function getAudience(){
  //check url for audience first
  var sAudience = getUrlParameter('aud');
  var sPossibleAudience = '';

  if(sAudience === undefined){
    //check cookie for probable

     sPossibleAudience = Cookies.get('paud');

    if(typeof sPossibleAudience !== 'undefined' && sPossibleAudience.length > 0){
      sAudience = sPossibleAudience;
    } else {
      sAudience = 'g';
    }
  }

  return sAudience.toLowerCase();
}

function setPossibleAudience(audience){
  Cookies.set('paud', audience, { expires: 365 });
}

function buildSubjectResearch(funnelbackresults){
  if(funnelbackresults.aResults.length > 2){
    //it's worth showing research

    $('.gre-research-contact').removeClass('grid-x');
    $('.gre-research-contact').removeClass('grid-margin-x');
    $('.gre-research-contact .cell').removeClass('large-auto');
    $('.gre-research-contact').addClass('grid-y');
    $('.gre-subject-research-secondary').append($('.gre-research-contact'));
    $('.gre-subject-research').removeClass('hide');
  }
}

function removeEmptySection(funnelbackresults){
  if(funnelbackresults.aResults.length < 1 ){
    //no results so blitz the whole <section>
    var sID = funnelbackresults.sID;
    $('#'+sID).closest('section').remove();
  }
}

function removeEmptyDiv(funnelbackresults){
  if(funnelbackresults.aResults.length < 1 ){
    //no results so blitz the whole <div>
    //nb need to kill the parent of thenearest <div>, since the search element itself is a <div>
    var sID = funnelbackresults.sID;
    $('#'+sID).parents().eq(0).remove();
  }
}

function buildPriorityClearingForm(){
  var sEmail = getUrlParameter('e');
  var sFormURL = 'https://analytics-eu.clickdimensions.com/greacuk-aezbz/pages/1rd40i3yeempyaanorpxow.html';

  addEvent(window, 'message', function(message) {

    // Do something with the message

    if(message.data && message.data === 'prioritySubmit' && message.origin === 'https://analytics-eu.clickdimensions.com') {

      console.log('push submit to analytics')

      var dataLayer = window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        'event': 'formSubmit'
      });

    }

    console.log(message);
  });

  if(sEmail === undefined){
    sEmail = '';
  } else {
    sFormURL = sFormURL + '?_clde=' + sEmail;
  }

  $('<iframe class="gre-iframe-resize" src="' + sFormURL + '" allowtransparency="true" width="100%" height="500px" type="text/html" frameborder="0" style="border:0"></iframe>')
     .appendTo('.gre-priority-clearing');

}

function addEvent(el, evt, fn) {
  if (el.addEventListener) {
    el.addEventListener(evt, fn);
  } else if (el.attachEvent) {
    el.attachEvent('on' + evt, function(evt) {
      fn.call(el, evt);
    });
  } else if (typeof el['on' + evt] === 'undefined' || el['on' + evt] === null) {
    el['on' + evt] = function(evt) {
      fn.call(el, evt);
    };
  }
}

// function buildClearingListing(availableCourses){
  // //backup url: https://www.gre.ac.uk/__data/assets/file/0009/1666359/all-results.json
  // $.ajax({
  //   url:  sFunnelbackURL.replace('search.json', 'all-results.json') + 'num_ranks=700&collection=courses-meta&sort=title&query=%21padrenull&fmo=1&fields=liveUrl,title,metaData/greSubject,metaData/greSubjectKey,metaData/mode,metaData/description,metaData/location,metaData/id&optimisations=false&',
  //   type:'GET',
  //   success:  function(data){
  //     var results = data;
  //     var hTemplateSource  = $('#programme_clearing').html(); //this  bypasses the surrounding script tags and gets the div which forms the handlebar template.    
  //     var hCustomTemplate = Handlebars.compile(hTemplateSource);
  //     $('.gre-clearing-listing-results').html('');
  //     for(sKey in results){
  //       if(results[sKey]['metaData/id'] in availableCourses){
  //         var stCourseInfo = availableCourses[results[sKey]['metaData/id']];

  //         //shivs

  //         if(results[sKey]['metaData/mode'] === null){
  //           results[sKey]['metaData/mode'] = 'Unspecified';
  //         }

  //         if(results[sKey]['metaData/greSubject'] === null){
  //           results[sKey]['metaData/greSubject'] = 'Other courses';
  //         }

  //         if(results[sKey]['metaData/location'] === null){
  //           results[sKey]['metaData/location'] = 'Partner college';
  //         }

  //         //console.log(results[sKey]['metaData/id']);
  //         //console.log(availableCourses[results[sKey]['metaData/id']]);

  //         //TEST HACK 

  //         //if(results[sKey]['metaData/id'] == 1561237){
  //         //  stCourseInfo.available = 'no';
  //         //}

  //         if(stCourseInfo.available.toLowerCase().trim() == 'yes'){
  //           var stContext = {};
  //           stContext.title = results[sKey].title;
  //           stContext.liveUrl = results[sKey].liveUrl;
  //           stContext.mode = results[sKey]['metaData/mode'].replace(/;/g, ', ');
  //           stContext.greSubjectIcon = results[sKey]['metaData/greSubjectKey'];
  //           stContext.greSubject = results[sKey]['metaData/greSubject'].replace(/;/g, ', ');
  //           stContext.greDisciplineIcon = results[sKey]['metaData/greDisciplineKey'];
  //           stContext.greDiscipline = results[sKey]['metaData/discipline'].replace(/;/g, ', ');

  //           stContext.description = results[sKey]['metaData/description'];
  //           stContext.id = results[sKey]['metaData/id'];
  //           stContext.location = results[sKey]['metaData/location'].replace(/;/g, ', ');


  //           $('.gre-clearing-listing-results').append(hCustomTemplate(stContext));
  //         } else {

  //           console.log('unavailable: ' + results[sKey]['metaData/id']);
  //           console.log(stCourseInfo['alternativesquizids']);

  //           //is there an alt?
  //           if(stCourseInfo['alternativesquizids'] != ''){
  //             //there's an alt is IT available?

  //             if(stCourseInfo['alternativesquizids'] in availableCourses){
  //               for(sAltKey in results){
  //                 if(results[sAltKey]['metaData/id'] == stCourseInfo['alternativesquizids']){
  //                   var stAlternativeCourseInfo = availableCourses[stCourseInfo['alternativesquizids']];

  //                   console.log(stAlternativeCourseInfo);

  //                   if(stAlternativeCourseInfo.available.toLowerCase().trim() == 'yes'){
  //                     var stContext = {};
  //                     stContext.title = '<span class="strike-out">' + results[sKey].title + '</span> ' + results[sAltKey].title;
  //                     stContext.liveUrl = results[sAltKey].liveUrl;
  //                     stContext.mode = results[sAltKey]['metaData/mode'].replace(/;/g, ', ');
  //                     stContext.greSubjectIcon = results[sAltKey]['metaData/greSubjectKey'];
  //                     stContext.greSubject = results[sAltKey]['metaData/greSubject'].replace(/;/g, ', ');
  //                     stContext.greDisciplineIcon = results[sKey]['metaData/greDisciplineKey'];
  //                     stContext.greDiscipline = results[sKey]['metaData/discipline'].replace(/;/g, ', ');

  //                     stContext.description = results[sKey].title + ' is unavailable, but you may like ' + results[sAltKey].title + '.';
  //                     stContext.id = results[sAltKey]['metaData/id'];
  //                     stContext.location = results[sAltKey]['metaData/location'].replace(/;/g, ', ');


  //                     $('.gre-clearing-listing-results').append(hCustomTemplate(stContext));
  //                   }
  //                 }
  //               }
  //             }

  //           }

  //         }
  //       }
  //     }

//   $('.gre-search-links').removeClass('hide');
//   $('.gre-clearing-listing-subjects').addClass('hide');      

//   //jets stuff

//   var jets = new Jets({
//     searchTag: '#query',
//     contentTag: '#jetsResults',
//     didSearch: function(search_phrase) {
//       countVisibleAssets();
//     },
//     manualContentHandling: function(tag) {
//       return tag.getAttribute('data-custom-jets');
//     }
//   });

//    // }
//  // });
// }

 function countVisibleAssets() {
  $('.gre-clearing-listing-results').removeClass('hide');
  var totalAssets = $('.prog-ucas-list-item:visible').length;
  if(totalAssets > 0 && $('#query').val() != ''){
    $('.gre-clearing-listing-results').removeClass('hide');
    $('.gre-search-courses-link .total').html(totalAssets);
    $('.gre-search-courses-link').removeClass('hide');
    $('.gre-clearing-listing-subjects').addClass('hide');
    $('#gre-search-courses').addClass('hide');
  } else {
    $('#gre-search-courses').removeClass('hide');
    $('.gre-search-courses-link').addClass('hide');
    $('.gre-clearing-listing-subjects').removeClass('hide');
    $('.gre-clearing-listing-results').addClass('hide');
  }
}

function buildDynamicUpdates(){
  //build the sidebar array
  //console.log('dynamic updates fired');
  var aUpdates = [];
  var stUpdate = {};
  var sRowID = '';
  var sCellID = '';
  var bAddUpdate = false;
  var bHasUpdates = false;
  var sBaseURL = window.location.href;
  var aBaseURL = sBaseURL.split('#');
  var sBaseURL = encodeURIComponent(aBaseURL[0]);
  var sShareDiv = '';
  var sPageTitle = $.trim($('.gre-long-title').text());

  $('.gre-dynamic-updates table tr').each(function( index ) {  
    stUpdate = {};

    sRowID = 'row-' + index;

    $(this).attr('id', sRowID);

    //loop through the cells

    $('#' + sRowID + ' td').each(function( cellindex ) {
      sCellID = sRowID + '-' + cellindex;
      $(this).attr('id', sCellID);
      bAddUpdate = true;

      if(cellindex == 0){
        //date
        stUpdate.sDate = $.trim($(this).text());
        $(this).addClass('gre-dynamic-updates-date');
      } else {
        stUpdate.sAnchor = sCellID + '-anchor';        
        $(this).prepend('<div><span class="gre-anchor" id="' + stUpdate.sAnchor + '"></span></div>');

        //clean this up?

        sShareDiv = '<div class="gre-share-buttons"><a class="button gre-twitter" href="https://twitter.com/share?url=' + sBaseURL + '#' + sCellID + '"><i class="fab fa-twitter" title="Twitter" aria-role="img" aria-label="Share on Twitter"></i></a><a class="button dark gre-facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + sBaseURL + '#' + sCellID + '"><i class="fab fa-facebook" title="Facebook" aria-role="img" aria-label="Share on Facebook"></i></a><a class="button light gre-linkedin" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=' + sBaseURL + '#' + sCellID + '&amp;title='+ sPageTitle + '&amp;summary=&amp;source=https://www.gre.ac.uk"><i class="fab fa-linkedin" title="LinkedIn" aria-role="img" aria-label="Share on LinkedIn"></i></a></div>';

        $(this).append(sShareDiv);


        if($('#' + sCellID + ' h3').length > 0){
          stUpdate.sTitle = $.trim($('#' + sCellID + ' h3').text());
          bHasUpdates = true;
        } else {
          bAddUpdate = false;
        }
      }
    })

    if(bAddUpdate){
      aUpdates.push(stUpdate);
    }

  });

  if(bHasUpdates){
    buildDynamicUpdatesSidebar(aUpdates);
  }
}

function buildDynamicUpdatesSidebar(updates){
  var sKeyUpdates = '<div class="gre-dynamic-updates-sidebar gre-accented gre-sticky-top"><h2>Key updates</h2><ul></ul></div>';
  var sKey = '';
  var stUpdate = {};
  var sBaseURL = window.location.href;
  var sAnchor = '';
  var sDate = '';
  var sTitle = '';
  var sListItem = '';
  //sort out the base URL to remove any previous anchors

  var aBaseURL = sBaseURL.split('#');
  var sBaseURL = aBaseURL[0];

  $('.gre-article-body .grid-container').prepend(sKeyUpdates);

  for(sKey in updates){
    stUpdate = updates[sKey];
    sListItem = '<li><span>' + stUpdate.sDate + '</span><a href="' + sBaseURL + '#' + stUpdate.sAnchor + '">' + stUpdate.sTitle + '</a></lri>';
    $('.gre-dynamic-updates-sidebar ul').append(sListItem);
  }
}

function cleanPaste (e) {
    var sClipboardData, sPastedData, sCleanedString;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    sClipboardData = e.originalEvent.clipboardData || window.clipboardData;
    sPastedData = sClipboardData.getData('text');
    
    //clean it

    sCleanedString = sPastedData.replace(/<|>/g, ' ');

    // Do whatever with pasteddata
    //console.log(sPastedData);
    //console.log(sCleanedString);
    return sCleanedString;
}
