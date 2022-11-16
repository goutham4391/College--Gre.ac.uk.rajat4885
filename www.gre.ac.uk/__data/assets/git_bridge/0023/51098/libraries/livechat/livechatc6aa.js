window.__lc = window.__lc || {};
window.__lc.license = 1204221;
;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice));

function onReady(initialData) {
  // Chat Widget is ready
   console.log('on ready called...');
  console.log(LiveChatWidget.get('state'));

  //call our own custom code if required

  /* NEW CUSTOM LIVE CHAT BUTTON */

  if($('.gre-custom-chat').length > 0){
    postscribe('#postscribe-scripts', '<script src="' + sBridgeURL + 'gre/_js/core-js/gre-livechat.js"><\/script>', {
      done: function() {
        if(LiveChatWidget.get('state') == 'online'){
          initLiveChatButton();
            console.log('live chat available!');
          }
      }
    });
   }


   if($('.gre-trigger-live-chat').length > 0){
      var stState = LiveChatWidget.get('state');
      if(stState.availability == 'online'){
        $('.gre-trigger-live-chat').on('click', function (e) {
            LiveChatWidget.call('maximize');
        });
      } else {
         $('.gre-trigger-live-chat').addClass('hide');
         $('.gre-trigger-live-chat-unavailable').removeClass('hide');
      }
   }

}

LiveChatWidget.on('ready', onReady);

