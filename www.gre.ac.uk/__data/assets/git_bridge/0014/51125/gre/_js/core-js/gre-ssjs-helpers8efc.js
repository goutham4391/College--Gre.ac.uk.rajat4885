console.log("gre-ssjs-helpers.js loaded");
//replacement clearing event 28/06/2021 JC

$( document ).ready(function() {
  if($('.gre-courses-listing').length > 0){
  	
    var sJets = "";
    $( ".gre-courses-listing" ).each(function( index ) {
      sJets = $(this).data("jets");
	    if (typeof  sJets  !== typeof undefined && sJets  !==  false){
    		if (typeof  $(this).data('jets-container')  !== typeof undefined && $(this).data('jets-container')  !==  false){
          var sJetsContainer = $(this).data('jets-container');
          var sID = $(this).attr('id');
          console.log('custom container for jets');
          $('#' + sJetsContainer).addClass('jetsCustomContent').html('<div class="input-group"><label for="query-' + sID + '" class="gre-search-keywords"><span class="sr-only">Keyword filter: </span><input type="search" class="jetsCustomSearch input-group-field" id="query-' + sID + '" placeholder="Type here to filter list..."></label><a class="button jets-search-button" href="#jets-results-start">Search</a></div><div class="jets-results-count"></div>');
        } else {
	       	$(this).addClass('jetsContent').before('<label for="query-var" class="gre-search-keywords"><span class="sr-only">Keyword filter: </span></label><input type="search" class="jetsCustomSearch" id="query-var" placeholder="Type here to filter list..." aria-label="Type here to filter list">');
				};
	    	//console.log(sDomainURL);
	     	$(this).addClass('jetsContent');
	     	//console.log('jetsCustomSearch added');   
	     	postscribe('#postscribe-scripts', '<script src="' + sDomainURL + '/__data/assets/git_bridge/0023/51098/gre/_js/jets.min.js"><\/script>', {
          done: function() {
            console.log('jets');
            var jets = new Jets({
	            searchTag: '.jetsCustomSearch',
		          contentTag: '.gre-programmes-listing',
		          manualContentHandling: function(tag) {
  							return tag.getAttribute('data-content');
							},
					    didSearch: function(search_phrase) {
						    var nTotalResults = $('a[data-jets]:visible').length;
						    var nTotalPossible = $('a[data-jets]').length;      
					    	console.log(nTotalResults);
					      if(nTotalResults > 0 && nTotalPossible != nTotalResults){
					      	if(nTotalResults == 1){
					      		sMatchText = 'match';
					      	} else {
					      		sMatchText = 'matches';
					      	}
     							$('.jets-results-count').html('<i class="fas fa-check"></i> ' + nTotalResults + ' ' + sMatchText + ' found. <a href="#jets-results-start">View results.</a>');
    						} else if(nTotalPossible == nTotalResults){
    							$('.jets-results-count').html('');
    						} else {
    							$('.jets-results-count').html('<i class="fas fa-list-ul"></i> No matches found. <a class="jets-reset" href="//www.gre.ac.uk/clearing/courses">See full course list.</a>');
    						}   						
    					}
		  	    });
		    	}
			  });    
	    }
    });
  }
});