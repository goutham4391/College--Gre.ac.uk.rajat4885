$(document).foundation();
// Hide accordion content *after* page build
$(".gre-accordion-tabheader").toggleClass('gre-accordion-tabheader').addClass('accordion-title');
$(".gre-accordion-tabpanel").toggleClass('gre-accordion-tabpanel').addClass('accordion-content');