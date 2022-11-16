/* GENERAL */


/* SSJS SUPPORTING FUNCTIONS */

function buildSSJSCourseTabs(){
	//this slices a single course listing into fd/ug/pg tabs
	console.log('build tabs...');

  var stResultCounts = {};

  stResultCounts.undergraduate = 0;
  stResultCounts.postgraduate = 0;
  stResultCounts.foundation = 0;

  if($('.gre-ssjs-course-tabs .prog-ucas-list-item').length > 4){
    //count number of each

    $('.gre-ssjs-course-tabs .prog-ucas-list-item').each(function( index ) {
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

    console.log(stResultCounts);

    //okay, worth tabbing?

    if(stResultCounts.postgraduate > 0 || stResultCounts.foundation > 0){
      //let's tab

      $('.gre-ssjs-course-tabs .prog-ucas-list-item').each(function( index ) {
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