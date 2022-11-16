/**********************************************/
console.log('gre-searchjs.js #1624888');
/**********************************************/

//GLOBALS

//sFunnelbackSearchURL = '//search.gre.ac.uk/s/search.json?';
//sFunnelbackSearchSuggestionURL = '//search.gre.ac.uk/s/suggest.json?';

var sFunnelbackSearchURL = '//search.gre.ac.uk/s/search.json?';
var sFunnelbackSearchSuggestionURL = '//search.gre.ac.uk/s/suggest.json?';


function initFullSearch(){
  buildSearchStruct();
  addSearchListeners();
}

function addSearchListeners(){

  var sFirstSearch = getUrlParameter('collection');
  
  if(sFirstSearch == undefined){
    sFirstSearch = 'everything-meta';
  }

  $('.gre-search-results-container #' + sFirstSearch).addClass('is-active');
  $('.tabs-title.' + sFirstSearch).addClass('is-active');
  $('.tabs-title.' + sFirstSearch + ' a').attr('aria-selected','true');

  $('#query').on('keyup', function() {
    //suggestions...
    var sFirstSearch = getUrlParameter('collection');


    if(sFirstSearch == undefined){
      sFirstSearch = 'everything-meta';
    }

    var sSuggestionURL = sFunnelbackSearchSuggestionURL + 'collection=' + stSearches[sFirstSearch].collection + '&partial_query=' + escapeHtml($('#query').val()) + '&show=5';

    $.ajax({
      url: sSuggestionURL,
      type:'GET',
      success: function(suggestiondata){
         buildSuggestionList(sFirstSearch, suggestiondata);
      }
    });
  });

  //SEARCH

  $('#query').on('keyup', function() {
    var sModifier = '*';
    var sFirstSearch = getUrlParameter('collection');

    
    $('#query').val($('#query').val().replace(/</,' ').replace(/>/,' '));

    if(sFirstSearch == undefined){
      sFirstSearch = 'everything-meta';
    }

    runFullSearch(sFirstSearch, sModifier);

    //sort the url

    rebuildURLParams('query', escapeHtml($(this).val()));
  });

 // $('#query').on('blur', function() {
   // $('#query').val($('#query').val().replace(/</,' ').replace(/>/,' '));
 // });

  $('#query').on("paste", function(e){
      $('#query').val(cleanPaste(e));
      console.log('fired search cleaner');  
  });

  //ENTER / REGULAR SUBMIT

  $( "#gre-main-search" ).submit(function( event ) {
    var sModifier = '';
    runFullSearch(sFirstSearch, sModifier);
    event.preventDefault();
  });

  //RUN STRAIGHT AWAY?

  if(getUrlParameter('query') != undefined){
    $('#query').val(getUrlParameter('query'));
    
    var sSuggestionURL = sFunnelbackSearchSuggestionURL + 'collection=' + stSearches[sFirstSearch].collection + '&partial_query=' + escapeHtml($('#query').val()) + '&show=5';

    $.ajax({
      url: sSuggestionURL,
      type:'GET',
      success: function(suggestiondata){
         buildSuggestionList(sFirstSearch, suggestiondata);
      }
    });

    var sModifier = '*';

    runFullSearch(sFirstSearch, sModifier);
  }

  //TAB TRIGGERS

  $('.tabs-title a').on('click', function() {
    var sModifier = '*';

    //sort the url (before running search)
    rebuildURLParams('collection', $(this).attr('href').replace('#',''));
    runFullSearch($(this).attr('href').replace('#',''), sModifier);

  });

}

function buildSearchStruct(){
  //for full search these are always embedded in the page. add more here if necessary;

  stSearches = [] //no var because this is a GLOBAL variable!

  stSearches['documents-meta'] = [];
  stSearches['courses-meta'] = [];
  stSearches['everything-meta'] = [];
  stSearches['people-meta'] = [];
  stSearches['articles-meta'] = [];
  stSearches['events-meta'] = [];
  stSearches['sites-meta'] = [];

  stSearches['documents-meta'].collection  = 'documents-push-v1';
  stSearches['courses-meta'].collection  = 'courses-push-v1';
  stSearches['everything-meta'].collection  = 'everything-public';
  stSearches['people-meta'].collection  = 'people-push-v1';
  stSearches['articles-meta'].collection = 'articles-push-v1';
  stSearches['events-meta'].collection = 'events-push-v1';
  stSearches['sites-meta'].collection = 'sites-v1';

  stHandlebars = [];

  stHandlebars['documents-meta'] = Handlebars.compile(document.getElementById("docs_horizontal").innerHTML);
  stHandlebars['people-meta'] = Handlebars.compile(document.getElementById("person_horizontal").innerHTML);
  stHandlebars['events-meta'] = Handlebars.compile(document.getElementById("event_horizontal").innerHTML);
  stHandlebars['courses-meta'] = Handlebars.compile(document.getElementById("programme_horizontal").innerHTML);
  stHandlebars['articles-meta'] = Handlebars.compile(document.getElementById("articles_horizontal").innerHTML);
  stHandlebars['events-meta'] = Handlebars.compile(document.getElementById("event_horizontal").innerHTML);
  stHandlebars['sites-meta'] = Handlebars.compile(document.getElementById("sites_horizontal").innerHTML);
  stHandlebars['research-meta'] = Handlebars.compile(document.getElementById("research_search_horizontal").innerHTML);


}

function buildSearchResults(collection, results, totalresults){

  switch(collection){
    case "articles-push-v1":
      collection = 'articles-meta';              
    break;
    case "sites-v1":
      collection = 'sites-meta';              
    break;
    case "courses-push-v1":
      collection = 'courses-meta'; 
    break;
    case "documents-push-v1":
      collection = 'documents-meta'; 
    break;
    case "people-push-v1":
      collection = 'people-meta'; 
    break;
    case "social-push-v1":
      collection = 'social-meta'; 
    break;
    case 'eventbrite-custom-v1':
    case 'gecko-custom-v1':
    case 'events-push-v1':
    case 'events-meta':
      collection = 'events-meta';
    break;

  }
  //note - this uses the standard funnelback results processor you'll find in gre.js

  //console.log('collection: ' + collection);

  var sContentKey = '';
  for(sContentKey in stContentTypes){
    if(stContentTypes[sContentKey].collection == collection){
      var stProps = stContentTypes[sContentKey];
      break;
    }
  }

  switch(collection){
    case 'courses-meta':
      var sResultsContainer = 'courses-meta-results';
       processFunnelbackResults(sResultsContainer,  results, stHandlebars[collection], stProps);
    break;
    case 'documents-meta':
      var sResultsContainer = 'documents-meta-results';
      processFunnelbackResults(sResultsContainer,  results, stHandlebars[collection], stProps);
    break;
    case 'people-meta':
      var sResultsContainer = 'people-meta-results';
      processFunnelbackResults(sResultsContainer,  results, stHandlebars[collection], stProps);
    break;
    case 'articles-meta':
      var sResultsContainer = 'articles-meta-results';
      processFunnelbackResults(sResultsContainer,  results, stHandlebars[collection], stProps);
    break;
    case 'events-meta':
      var sResultsContainer = 'events-meta-results';
      processFunnelbackResults(sResultsContainer,  results, stHandlebars[collection], stProps);
    break;
    case 'everything-meta':
      var sResultsContainer = 'everything-meta-results';
      processFunnelbackResults(sResultsContainer,  results, stHandlebars, stProps);
    break;
    default:
      var sHTML = '<ul>';
      var sKey = '';
      for(sKey in results){
        sHTML = sHTML + '<li>' + results[sKey].title + '</li>';
      }        
      sHTML = sHTML + '</ul>';  
  }

  //paginate?
  //current page?

  var nCurrentPage = getUrlParameter('page');
  var sSearchURL = location.href;

  if(nCurrentPage == undefined){
    nCurrentPage = 1;
  } else {
    var sCurrentPageSting = '&page=' + nCurrentPage;
    sSearchURL = sSearchURL.replace(sCurrentPageSting, '');
  }

  if(totalresults > 10){
    $('#' + sResultsContainer).append(buildSearchPagination(sSearchURL, nCurrentPage, 10, totalresults));
  }
}

function buildSuggestionList(collection, results){
  var sHTML = '<ul>';
  var sKey = '';
  for(sKey in results){
    sHTML = sHTML + '<li><a href="' + sDomainURL + '/search/?collection=' + collection + '&query=' + results[sKey] + '">' + results[sKey] + '</a></li>';
  }
 sHTML + '</ul>';
 $('.gre-search-results-suggestions').html(sHTML);
}

function runFullSearch(firstsearch, modifier){

//console.log('runFullSearch(' + firstsearch + ',' + modifier + ')');
  //spinnerize

  $('.tabs-panel .gre-search-results').html('<div class="spinner"><img src="' + sDomainURL + '/images/university-logos/logo-999.jpg" /></div>');

  //get everything results

  var re= /<\S[^><]*>/g;
  var sKeywords = $('#query').val().replace(re, "");
  sKeywords =  escapeHtml(sKeywords);

  if(sKeywords != '' && sKeywords.length > 2){
    $('.gre-search-section').removeClass('hide');

    //which search to do first?

    var sFirstSearch = firstsearch

    

    var sSearchURL = sFunnelbackSearchURL + 'collection=' + stSearches['everything-meta'].collection + '&query=' + sKeywords + modifier;

    nStartRank = getUrlParameter('start_rank');

    if(nStartRank != undefined){
      sSearchURL = sSearchURL + '&start_rank=' + nStartRank;
    }

    $.ajax({
      url: sSearchURL,
      type:'GET',
      success: function(data){      

        //this catches if it was a wildcard search with no results

        var stResultCounts = [];

        stResultCounts['everything-meta'] = 0;
        stResultCounts['courses-meta'] = 0;
        stResultCounts['documents-meta'] = 0;
        stResultCounts['people-meta'] = 0;
        stResultCounts['articles-meta'] = 0;

        if(data.response.resultPacket != null && 'resultsSummary' in data.response.resultPacket){
          stResultCounts['everything-meta'] = data.response.resultPacket.resultsSummary.totalMatching;
          stResultCounts['courses-meta'] = data.response.resultPacket.documentsPerCollection['courses-push-v1'];
          stResultCounts['people-meta'] = data.response.resultPacket.documentsPerCollection['people-push-v1'];
          stResultCounts['documents-meta'] = data.response.resultPacket.documentsPerCollection['documents-push-v1'];
          stResultCounts['articles-meta'] = data.response.resultPacket.documentsPerCollection['articles-push-v1'];

          //EVENTS SHIV FOR COMBINED COUNT

          stResultCounts['events-meta'] = data.response.resultPacket.documentsPerCollection['gecko-custom-v1'];
          stResultCounts['events-meta'] = stResultCounts['events-meta'] + data.response.resultPacket.documentsPerCollection['eventbrite-custom-v1'];
          stResultCounts['events-meta'] = stResultCounts['events-meta'] + data.response.resultPacket.documentsPerCollection['events-push-v1'];
        }



        //tabs

        $('.tabs-title.everything-meta a span').html('(' + stResultCounts['everything-meta'] + ')');        

        //and the rest...

        $('.tabs-title.people-meta a span').html('(' + stResultCounts['people-meta'] + ')');
        $('.tabs-title.courses-meta a span').html('(' + stResultCounts['courses-meta'] + ')');                
        $('.tabs-title.documents-meta a span').html('(' + stResultCounts['documents-meta'] + ')');
        $('.tabs-title.articles-meta a span').html('(' + stResultCounts['articles-meta'] + ')');
        $('.tabs-title.events-meta a span').html('(' + stResultCounts['events-meta'] + ')');

        //search result counts

        $('.search-result-count .keyword').html($('#query').val());

        var sKey = '';

        for(sKey in stResultCounts){
          //console.log(sKey);
          $('#' + sKey + ' .search-result-count .total').html(stResultCounts[sKey]);
        }


        //either update everything results or run extra search 

        if($('.tabs-title.everything-meta').hasClass('is-active')){
          if(stResultCounts['everything-meta'] != 0){


            $('#everything-meta .search-result-count .start').html(data.response.resultPacket.resultsSummary.currStart);
            $('#everything-meta .search-result-count .end').html(data.response.resultPacket.resultsSummary.currEnd);
            $('#everything-meta .gre-search-results').html(buildSearchResults('everything-meta', data.response.resultPacket.results, stResultCounts['everything-meta']));

          } else {
            var stProps = {};
            stProps.sorryDesc = 'results';
            stProps.collection = 'everything-public';
            buildFunnelbackListingSorryBox('everything-meta-results', stProps);
          }
        } else {
          if(sFirstSearch != 'events-meta'){
            sSearchURL = sFunnelbackSearchURL + 'collection=everything-public&clive=' + stSearches[sFirstSearch].collection + '&query=' + sKeywords + modifier;
          } else {
             sSearchURL = sFunnelbackSearchURL + 'collection=everything-public&clive=events-push-v1,gecko-custom-v1,eventbrite-custom-v1&query=' + sKeywords + modifier + '&sort=adate';
          }


//console.log('314 > ' + sSearchURL);
          if(nStartRank != undefined){
            sSearchURL = sSearchURL + '&start_rank=' + nStartRank;
          }

          $.ajax({
            url: sSearchURL,
            type:'GET',
            success: function(data){
              if(stResultCounts[sFirstSearch] != 0 && data.response.resultPacket != null){
                buildSearchResults(sFirstSearch, data.response.resultPacket.results, data.response.resultPacket.resultsSummary.totalMatching);

                //pagecounter

                //console.log(data.response);

                $('#' + sFirstSearch + ' .search-result-count .start').html(data.response.resultPacket.resultsSummary.currStart);
                $('#' + sFirstSearch + ' .search-result-count .end').html(data.response.resultPacket.resultsSummary.currEnd);

              } else {
                stContentTypes = getDefaultContentTypeProperties();

                var sContentKey = '';
                for(sContentKey in stContentTypes){
                  if(stContentTypes[sContentKey].collection == sFirstSearch){
                    var sSorryBoxID = sFirstSearch + '-results';
                    buildFunnelbackListingSorryBox(sSorryBoxID, stContentTypes[sContentKey]);
                    break;
                  }
                }
              }
            }
          });
        }
      }
    });
  } else {
    $('.gre-search-section').addClass('hide');
  }
}

function buildSearchPagination(searchurl, currentpage, resultsperpage, totalresults){
  var nNumberOfPages = Math.ceil((totalresults / resultsperpage))
  var bShowPrevious = false;
  var bShowNext = false;
  var nPagesToShow = 5;

  var sPagination = '<nav aria-label="Pagination"><ul class="pagination text-center">';
  var sPages = '';
  var i = 0;
  var nPagePos = 0;
  var sPageURL = '';

  //clean the search url

  var nStartRank = getUrlParameter('start_rank');

  if(nStartRank != undefined){
    sReplaceString = '&start_rank=' + nStartRank;
    searchurl = searchurl.replace(sReplaceString, '');
  }

  if(currentpage == 1){
    //show next?

    if(nNumberOfPages > 1){ 
      bShowNext = true;    
      if(nNumberOfPages < nPagesToShow){
        nPagesToShow = nNumberOfPages;
      }
    }
  } else if(currentpage == 2){
    nPagePos = 0;
    bShowPrevious = true;

    if(nNumberOfPages < nPagesToShow){
      nPagesToShow = nNumberOfPages;
    }

    if(nPagesToShow > currentpage){
      bShowNext = true;
    }
  } else {
    bShowPrevious = true;
    nPagePos = currentpage - 3;
    if(nPagesToShow > currentpage){
      bShowNext = true;
    }

  }

  //build pages

  while(i < nPagesToShow){
    i++;
    nPagePos++;

    sPageURL = searchurl + '&start_rank=' + (((nPagePos - 1) * resultsperpage) + 1) + '&page=' + (nPagePos);

    if(nPagePos == currentpage){
      sPages = sPages + '<li class="current"><span class="show-for-sr">You are on page</span> ' + nPagePos + '</li>'
    } else {
      sPages = sPages + '<li><a href="' + sPageURL + '" aria-label="Page' + nPagePos + '">' + nPagePos + '</a></li>';
    }
  }

  if(bShowPrevious){
    sPreviousLink = searchurl + '&start_rank=' + (((currentpage - 2) * resultsperpage) + 1) + '&page=' + (parseInt(currentpage) - 1);
    sPagination = sPagination + '<li class="pagination-previous"><a href="' + sPreviousLink +'" aria-label="Previous page">Previous</a></li>';
  }

    sPagination = sPagination + sPages;

  if(bShowNext){
    sNextLink = searchurl + '&start_rank=' + ((currentpage * resultsperpage) + 1) + '&page=' + (parseInt(currentpage) + 1);
    sPagination = sPagination + '<li class="pagination-next"><a href="' + sNextLink +'" aria-label="Next page">Next</a></li>';
  }

  sPagination = sPagination + '</ul></nav>';

  return sPagination; 
}