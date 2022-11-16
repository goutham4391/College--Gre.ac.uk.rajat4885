/* ONE TRUST */



/* GECKO */

function buildGeckoForm(){
	console.log("buildGeckoForm called");
$('.gre-gecko-form').each(function( i ) {
	console.log('form ')

  if($(this).data('form').length > 0) {
    var sFormId = $(this).data('form');
    var sFormFrame = '';
    var stCookies = Cookies.get();
    var sKey = '';
    var sUTMs = '&';

  	console.log('Gecko form ID ' + sFormId);

      //make the content changes
     // sPageHTML = '';
      //sPageHTML = sPageHTML + '<div id="gre-gecko-form"></div>';

      //do some basic cleaning.

      //$('.gre-gecko-form').html(sPageHTML);

      //any url params?

      var sGeckoParams = '';

      if(getUrlParameter('geckopass') === undefined){
      } else {
        sGeckoParams = window.location.search.replace('?','&');
      }

      console.log(sGeckoParams);

      //UTMS?

		for(sKey in stCookies){
			if(sKey.includes('utm_')){
				sUTMs = sUTMs + sKey + '=' + stCookies[sKey] + '&';
			}
		}

		//form id override?

		if(getUrlParameter('gform') === undefined){
	      } else {
	      	sFormId = getUrlParameter('gform');
	      }

      console.log(getUrlParameter('gform'));

      //build the form

      //HACKS FOR SPECIFIC FORMS (none currently)

      switch(sFormId){
        default:
          //sFormURL = '<script src="https://app.geckoform.com/gecko-embed/form.js?uuid=' + sFormId + sGeckoParams + sUTMs + '" id="gecko-form-embed-script"></script>';
      }

      //postscribe('#gre-gecko-form', sFormURL);

      switch(sFormId){
        default:
        	if(sFormId != 'url'){
		   	    sFormFrame = '<iframe src="https://app.geckoform.com/public/#/iframe/' + sFormId + '?' + sGeckoParams + sUTMs + '" width="100%" height="1300" frameborder="0" seamless title="GeckoForm Form Embed"></iframe>';
				$(this).html(sFormFrame);
	        }
	       console.log('new way!');
      }
    }
  });
}


function buildSingleGeckoEvent(){
  var aMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var aMonthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var sAjaxURL = 'https://api-eu.geckoform.com/events/public/FOEU03bfdiZUTtaj?id=';
  var sOrdinal = 'th';
  var sCustomForm = '';

  //get the url event id

  var nEventID = getUrlParameter('e');
  var bUseIFrame = getUrlParameter('iframe');


  if(bUseIFrame === undefined){
    bUseIFrame = false;
  }

  $.ajax({
    url:sAjaxURL + nEventID,
    type:'GET',
    success: function(response){
      var aStartDateTime = response.data[0].start_datetime.split(' ');
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


      var sStartDayLong = parseInt(sStartDay).toString() + sOrdinal;

      var stEvent = {
        evstartday: sStartDay,
        evstartdaylong: sStartDayLong,
        evstartmonth: sStartMonth, 
        evstartmonthlong: sStartMonthLong,
        evtitle: response.data[0].title,
        evdescription: response.data[0].description,
        evcategoryID: response.data[0].category_id
      };

      if(!(response.data[0].crm === null)){
        sCustomForm = response.data[0].crm;
      }

      //make the content changes


      sPageHTML = '';

      $('h1').html(stEvent.evtitle);

      sPageHTML = sPageHTML + '<div class="gre-divider-bottom">' + stEvent.evdescription + '</div><h2>Book now</h2><div id="gre-gecko-form"></div>';

      //do some basic cleaning.

      sPageHTML = sPageHTML.replace(/<br data-mce-bogus="1">/g, '').replace(/<p><\/p>/g, '').replace(/<p><span><\/span><\/p>/g, '');


      $('.gre-event-single-gecko').html(sPageHTML);

      //build the form

      //HACK FOR SPECIFIC EVENTS


      switch(nEventID){
        case '273':
          if(!bUseIFrame){
            sFormURL = '<script src="https://app.geckoform.com/gecko-embed/form.js?uuid=FOEU03bfySO7OpMW" id="gecko-form-embed-script"></script>';
          } else {
            sFormURL = '<iframe src="https://app.geckoform.com/public/#/iframe/FOEU03bfySO7OpMW" width="100%" height="1000" frameborder="0" seamless title="GeckoForm Form Embed"></iframe>';
          }
        break;
        default:
        if(sCustomForm == ''){
          sCustomForm = getGeckoUUID(stEvent.evcategoryID);
        }
          if(!bUseIFrame){
            sFormURL = '<script src="https://app.geckoform.com/gecko-embed/form.js?uuid=' + sCustomForm + '" id="gecko-form-embed-script"></script>';
          } else {
            sFormURL = '<iframe src="https://app.geckoform.com/public/#/iframe/' + sCustomForm + '" width="100%" height="1000" frameborder="0" seamless title="GeckoForm Form Embed"></iframe>';
          }
      }
      if(!bUseIFrame){
        postscribe('#gre-gecko-form', sFormURL);
      } else {
          $('#gre-gecko-form').addClass('gecko-iframe');
          $('#gre-gecko-form').html(sFormURL);
      }
    }
  });
}