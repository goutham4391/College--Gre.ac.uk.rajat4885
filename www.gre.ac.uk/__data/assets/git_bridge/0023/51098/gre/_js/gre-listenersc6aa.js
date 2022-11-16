$( document ).ready(function() {

   //console.log(LiveChatWidget.get('state'));

	/* NEW TIDY STUFF */

	/* FOOTERS WITH COOKIE CHECKS (gre-functions.js) */

	if($('.gre-fixed-closer-v2').length > 0){
		checkForFixedFooter();
	}

	/*SSJS SUPPORT */

	if($('.gre-ssjs-course-tabs').length > 0){
		buildSSJSCourseTabs();
	}


  //live chat checkers
  /*
  if(LiveChatWidget.get('state') == 'online'){
    console.log('live chat available!');
  } else {
    $('.gre-trigger-live-chat').addClass('hide');
    $('.gre-trigger-live-chat-unavailable').removeClass('hide');
  }
  */


  /* THIRD PARTY: GECKO */

  if($('.gre-gecko-form').length > 0){
    buildGeckoForm();
  }

  if($('.gre-event-single-gecko').length > 0){
    buildSingleGeckoEvent();
  }


  /* UTM SNIFFER */

  checkForUTMs();

  /* COURSE PAGES */

  if($('.gre-course-switcher').length > 0){
  	console.log('switcher present')
    var sSwitcherText = $('.gre-course-switcher').html();
    $('.gre-apply-action-advice .gre-course-year-information').append(sSwitcherText);
		$('.gre-apply-action-advice .gre-course-year-information').removeClass('hide');
 		//change the ids on modal.
 		$('.gre-apply-action-advice nav input').attr('id','overview-dropdown-modal');
 		$('.gre-apply-action-advice nav label').attr('for','overview-dropdown-modal');
  }

	/* END OF NTS */ 


	var currentURL = window.location.href;
	var formatOldID = "./?a="
	
	if (currentURL.indexOf("dev") > 0) {
		sBridgeURL = sDomainURL + "/__data/assets/git_bridge/0014/51125/";
	}

	/* if($('.gre-programmes-listing').length){
		createProgrammeListing();
	} */

	if($('.gre-fee-mode-group').length > 0 || $('.gre-all-fees').length > 0){
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/custom/fees.js"><\/script>', {
			done: function() {
				postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/jets.min.js"><\/script>', {
				done: function() {
					console.log("in postscribe this is the sbridge: " + sBridgeURL);
					createFeesListing();
					}
				});
			}
		});
	}


	if($('.gre-personalisation').length > 0){
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/core-js/gre-personalisation.js"><\/script>', {
			done: function() {
				initPersonalisation();
			}
		});
	}

	if($('.prog-course-outline').length > 0){
		console.log('its a prog');
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/custom/programme.js"><\/script>', {
		done: function() {
			buildCourseInfo();
			}
		});
	}

	if($('body').hasClass('gre-standard-login')){
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/custom/gre-login.js"><\/script>', {
		done: function() {
			initLogin();
			}
		});
	}


	if($('body').hasClass('gre-abt')){
		postscribe('#postscribe-scripts', '<script src="' + sBridegURL + 'gre/_js/custom/personalise.js"><\/script>', {
			done: function() {
				setABTCookie();
			}
		});
	}

	if($('.gre-build.gre-comparison-container').length > 0){
		console.log('build comparison tables');
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/custom/comparison.js"><\/script>', {
			done: function(){
				initComparisons();
			}
		});
	}


	//amcharts

	var bAmcharts = false;
	var bAmchartsPies = false;

	if($('.prog-learning').length > 0){
		bAmcharts = true;
		bAmchartsPies = true;

	}

	if(bAmcharts){
		console.log('run amcharts');
		postscribe('#postscribe-scripts', '<script src="https://www.amcharts.com/lib/3/amcharts.js"><\/script>', {
		//postscribe('#postscribe-scripts', '<script src="https://cdn.amcharts.com/lib/5/index.js"><\/script>', {
			done: function() {
				if(bAmchartsPies){
					console.log('build pies');
					postscribe('#postscribe-scripts', '<script src="https://www.amcharts.com/lib/3/pie.js"><\/script>', {
					//	postscribe('#postscribe-scripts', '<script src="https://cdn.amcharts.com/lib/5/percent.js"><\/script>', {
						done: function() {
							postscribe('#postscribe-scripts', '<script src="https://www.amcharts.com/lib/3/themes/light.js"><\/script>', {
							//postscribe('#postscribe-scripts', '<script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"><\/script>', {
								done: function() {
									postscribe('#postscribe-scripts', '<script src="https://www.amcharts.com/lib/3/plugins/dataloader/dataloader.min.js"><\/script>', {
										done: function() {
											if($('.prog-learning').length > 0){
												console.log('building pies...')
												buildAssessmentPies();
											}
										}		
									});
								}		
							});
						}					
					});
				}
			}
		});
	}

  /* SLICK SLIDER */

  if($('.gre-fader').length > 0){
		console.log('build slick sliders');
		postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/custom/slick.js"><\/script>', {
			done: function(){
		 /* Ready the slick sliders(s) */
		    $('.fader-container').slick({
		      nextArrow: '<button class="orbit-next" tabindex="0"><span class="show-for-sr">Next Slide</span><i class="fas fa-chevron-circle-right" aria-hidden="true"></i></button>',
		      prevArrow: '<button class="orbit-previous" tabindex="0"><span class="show-for-sr">Previous Slide</span><i class="fas fa-chevron-circle-left" aria-hidden="true"></i></button>',
		      arrows: false,
		      fade: true,
		      easing: "ease-out",
		      autoplay: false,
		      autoplaySpeed: 6000,
		      speed: 2000,
		      waitForAnimate: false
		    });

		/* Make controls visible */
		    $('.gre-banner.gre-fader .fader-controls').toggle();

		/* Show/hide pause/play and make functional */
		    $('.fader-pause').click(function() {
		    	$(this).closest('.fader-container').slick('slickPause');
		    	$(this).siblings('button.fader-play').toggle();
		    	$(this).toggle();
		    });
		    $('.fader-play').click(function() {
		    	$(this).closest('.fader-container').slick('slickPlay');
		    	$(this).siblings('button.fader-pause').toggle();
		    	$(this).toggle();
		    }); 
		/* Make next/prev buttons functional  */
		    $('.fader-previous').click(function() {
		    	$(this).closest('.fader-container').slick('slickPrev');
		    });
		    $('.fader-next').click(function() {
		    	$(this).closest('.fader-container').slick('slickNext');
		    });
		  }
		});
	}



	lazyLoadImages();
});



















