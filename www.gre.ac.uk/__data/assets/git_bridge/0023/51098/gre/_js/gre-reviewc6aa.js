// filter funnelback listings based on data attributes set in html. Options are location, audience and category

function createFBFilter() {
	if($(".gre-listing-filter" ).length > 0) {

		$( ".gre-listing-item" ).each(function( index ) {
			filterType = $(this).closest('.gre-fb-listing').find( ".gre-listing-filter" ).data("filter");
			console.log("filter type is " +filterType);

			if (filterType=="location"){
				var value = $(this ).data("location");
			}
			if (filterType=="audience"){
				var value = $(this ).data("audience");
			}
			if (filterType=="category"){
				var value = $(this ).data("category");
			}



			if ($(this).closest('.gre-fb-listing').find( '.gre-listing-filter option[value="' + value + '"]').length < 1) {

			$('.gre-listing-filter').append('<option value="' + value + '">' + value + '</option>');
			}
		});
		
		$(".gre-listing-filter").append($("option").remove().sort(function(a, b) {
			var at = $(a).val(), bt = $(b).val();
			return (at > bt)?1:((at < bt)?-1:0);
		}));
		
		$('.gre-listing-filter').prepend('<option value="all" selected="selected">All ' + filterType + 's </option>');
		
//on select change, filter by assigned filter-type
	
		$( ".gre-listing-filter" ).change(function() {
			filterType = $(this).closest('.gre-fb-listing').find( ".gre-listing-filter" ).data("filter");
			$('.gre-listing-item').addClass("hide");
			var filteredValue = $(this).find(':selected').val();
			$('.gre-listing-item[data-' + filterType + '="' + filteredValue + '"]').removeClass('hide');
			
		// RETURN ALL VALUES TO VISIBLE
			if ($(this).find(':selected').val() == 'all'){
				$('.gre-listing-item').removeClass("hide");
			}
		});
	}
}