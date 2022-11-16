function functionsTest(){
  return 'hello world! functions have loaded';
}

function getWrapperClasses(collection){
  var lstClasses = ''; 
  switch(collection){
    case 'courses-meta':
      lstClasses = 'gre-programmes-listing';
    break;
    case 'people-meta':
      lstClasses = 'gre-people-listing cell gre-people-short'; //TEMP. THIS NEEDS UNPICKING.
    break;
  }

  return lstClasses;
}

function processFunnelbackContextShivs(context, collection){
  switch(collection){
    case 'courses-meta':
      if('mode' in context){
        context.mode = context.mode.replace(/;/g, ', ');
      } else {
        context.mode = '';
      }
      if('subject' in context){
        context.mode = context.mode.replace(/;/g, ', ');
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
    case 'people-meta':
      if('thumbUrl' in context){
				if (context.thumbUrl.includes('/__data/assets/image/')){ // Swap in v200 variety
					context.thumbUrl = context.thumbUrl.replace(/\/[^\/]+?\.([^\/]+?)$/, '/varieties/v200.$1');             	
				} else {
				context.thumbUrl = context.thumbUrl;             
				}
      } else {
      	context.thumbUrl = '//www.gre.ac.uk/__data/assets/image/0025/9358/varieties/v200.gif';
      }

      if('c' in context && context.c.length > 250){
        context.biog = context.c.substring(0, 250) + ' [...]';
      }
    break;
  }
  return context;
}

/* UTM STASHER */

function checkForUTMs(){
  var aURL = window.location.search.split('?');
  var aURLParams = [];
  var sURLParams = '';
  var sURLParam = '';
  var aURLParam = [];
  var x = 0;

  if(aURL.length > 1){
    sURLParams = aURL[1].toLowerCase();
    if(sURLParams.includes('utm_')){
      aURLParams = sURLParams.split('&');
      aURLParams.forEach((sURLParam, index) => {
          if(sURLParam.includes('utm_')){
            aURLParam = sURLParam.split('=');
            console.log('utm set:' + aURLParam[0] + ' - ' + aURLParam[1]);
            Cookies.set(aURLParam[0], aURLParam[1], { expires: 365 });
          }
      });
    }
  }
}

/* FOOTER COOKIES */

function checkForFixedFooter(){
  var sFooterResult = Cookies.get($('.gre-fixed-closer-v2').attr('id'));
  if(!sFooterResult == true){

    $('.gre-fixed-closer-v2').removeClass('hide');
    $('.gre-footer-close').on('click', function (event) {
      event.preventDefault();
      $('.gre-fixed-closer-v2').addClass('hide');
      Cookies.set($('.gre-fixed-closer-v2').attr('id'), 'true', { expires: 365 });
    });
    console.log('footer cookie: not matched');
  } else {
    console.log('footer cookie: matched');
  }
}