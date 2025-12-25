// Name processing functions - replicate PHP logic exactly
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function processName(input) {
  if (!input || input.trim() === '') {
    return 'Your Name';
  }
  
  // Replicate: urldecode(htmlspecialchars($n, ENT_QUOTES, 'UTF-8'))
  // Since URL params are already decoded, we escape HTML (matching htmlspecialchars)
  var safeInput = escapeHtml(input);
  
  // Replicate: str_replace(["+", "-", "@", "%", "<", ">", "&lt;", "&gt;", "&#039;", "&quot;", "&amp;", "#"], " ", $safeInput)
  var charsToRemove = ['+', '-', '@', '%', '<', '>', '&lt;', '&gt;', '&#039;', '&quot;', '&amp;', '#'];
  var name = safeInput;
  for (var i = 0; i < charsToRemove.length; i++) {
    name = name.split(charsToRemove[i]).join(' ');
  }
  
  // Replicate: preg_replace('/\s+/', ' ', ...) then rtrim
  name = name.replace(/\s+/g, ' ').replace(/\s+$/, '');
  
  return name;
}

function createUrlSafeName(name) {
  // Replicate: str_replace(["+", "-", " "], "-", $name)
  return name.replace(/[\+\-\s]/g, '-');
}

function createEmojiWrappedHTML(name) {
  // Replicate PHP's preg_replace_callback with exact Unicode ranges
  var emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F200}-\u{1F251}\u{1F1E6}-\u{1F1FF}\u{1F500}-\u{1F51F}\u{200D}\u{20E3}]/gu;
  
  var result = '<span class="emoji-free">';
  var lastIndex = 0;
  var match;
  
  while ((match = emojiRegex.exec(name)) !== null) {
    // Add text before emoji
    if (match.index > lastIndex) {
      result += escapeHtml(name.substring(lastIndex, match.index));
    }
    // Add emoji wrapped in span
    result += '</span><span class="emoji">' + match[0] + '</span><span class="emoji-free">';
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < name.length) {
    result += escapeHtml(name.substring(lastIndex));
  }
  
  result += '</span>';
  return result;
}

function updateMetaTags(name, urlSafeName) {
  // Update title
  document.title = name + ' wishing you a Merry Christmas.';
  
  // Update OG tags
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', name + ' send you a surprise message💌. Open it');
  }
  
  var ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', 'https://open-fast.com/hd/?n=' + urlSafeName);
  }
  
  var ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (ogSiteName) {
    ogSiteName.setAttribute('content', name + ' send you a surprise message💌. Open it');
  }
}

function PlaySound() {
  var sound = document.getElementById("audiocracker");
  if (sound) {
    sound.play();
  }
}

function isMobileDevice() {
  // Replicate PHP's preg_match for mobile detection
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i.test(userAgent);
}

function generateShareLinks(name, urlSafeName) {
  var isMobile = isMobileDevice();
  var ynamefb = encodeURIComponent(encodeURIComponent(urlSafeName)); // Double encoding for Facebook
  var platformsDiv = document.querySelector('.platforms center');
  
  if (!platformsDiv) return;
  
  // Clear existing content
  platformsDiv.innerHTML = '';
  
  // WhatsApp link
  var whatsappText = '🤗😇 Have you seen this??%0A*' + name + '* sent you a surprise message 😍%0A👌💁 Open this%0A👇👇🏻👇👇%0Aopen-fast.com/hd/?n=' + urlSafeName + ' %0A';
  var whatsappLink = isMobile 
    ? 'whatsapp://send?text=' + whatsappText
    : 'https://api.whatsapp.com/send?text=' + whatsappText;
  var whatsappHtml = '<a href="' + whatsappLink + '"' + (isMobile ? '' : ' target="_blank"') + ' data-os="Whatsapp"><img src="https://fastly.jsdelivr.net/gh/cdnamd/26img/main/wtsp.png" style="animation: tada 2s infinite;margin-top:5px;height: 50px;width:50px;"></a>';
  platformsDiv.innerHTML += whatsappHtml;
  
  // Facebook/Messenger link
  var fbLink = isMobile
    ? 'fb-messenger://share/?link=https%3A%2F%2Fopen-fast.com/hd/?n=' + ynamefb + '%26t=fm'
    : 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fopen-fast.com/hd/?n=' + ynamefb;
  var fbDataOs = isMobile ? 'Messenger' : 'Facebook';
  var fbImg = isMobile ? 'msg.png' : 'fb.png';
  var fbHtml = '<a href="' + fbLink + '"' + (isMobile ? '' : ' target="_blank"') + ' data-os="' + fbDataOs + '"><img src="https://fastly.jsdelivr.net/gh/cdnamd/26img/main/' + fbImg + '" style="animation: tada 2s infinite;margin-top:5px;height: 50px;width:50px;"></a>';
  platformsDiv.innerHTML += fbHtml;
}

// Detect which page we're on
function getCurrentPage() {
  var path = window.location.pathname;
  if (path.indexOf('wish.html') !== -1 || path.indexOf('wish.php') !== -1) {
    return 'wish';
  }
  return 'index';
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
  var currentPage = getCurrentPage();
  
  // Get name from URL parameter
  var urlName = getUrlParameter('n');
  var name = processName(urlName);
  var urlSafeName = createUrlSafeName(name);
  var emojiWrappedHTML = createEmojiWrappedHTML(name);
  
  // Update meta tags
  updateMetaTags(name, urlSafeName);
  
  // Update name displays
  var snameElements = document.querySelectorAll('.sname, .sname1');
  for (var i = 0; i < snameElements.length; i++) {
    snameElements[i].innerHTML = emojiWrappedHTML;
  }
  
  // Page-specific initialization
  if (currentPage === 'index') {
    // Handle form submission for index.html
    var form = document.querySelector('.footer form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = form.querySelector('input[name="n"]');
        if (input && input.value.trim() !== '') {
          var formUrlSafeName = createUrlSafeName(processName(input.value));
          window.location.href = 'wish.html?n=' + encodeURIComponent(formUrlSafeName);
        }
      });
    }
  } else if (currentPage === 'wish') {
    // Generate share links for wish.html
    generateShareLinks(name, urlSafeName);
  }
});

// Curtain animation for index.html (jQuery)
$(document).ready(function() { 
  if (getCurrentPage() === 'index') {
    $curtainopen = false; 
    $(".rope").click(function(){ 
      $(this).blur(); 
      if ($curtainopen == false){ 
        $(this).stop().animate({top: '-171%' }, {queue:false, duration:350, easing:'easeOutBounce'}); 
        $(".leftcurtain").stop().animate({width:'0px'}, 2000 ); 
        $(".rightcurtain").stop().animate({width:'0px'},2000 ); 
        $curtainopen = true; 
      }else{ 
        $(this).stop().animate({top: '-40px' }, {queue:false, duration:350, easing:'easeOutBounce'}); 
        document.write(''); 
        $(".leftcurtain").stop().animate({width:'50%'}, 2000 ); 
        $(".rightcurtain").stop().animate({width:'51%'}, 2000 ); 
        $curtainopen = false; 
      } 
      return false; 
    }); 
  }
});

// Share button toggle for wish.html (jQuery)
$(document).ready(function(){
  if (getCurrentPage() === 'wish') {
    $(".shareBtn").click(function(){
      $(".shareBtn").hide();
      $(".shareShow").show();
    });
    $(".shareShow").click(function(){
      $(".shareShow").hide();
      $(".shareBtn").show();
    });
  }
});

// Countdown timer (works on both pages)
// Set the date we're counting down to
var countDownDate = new Date("Dec 25, 2025 00:00:00").getTime();

// Update the count down every 01 second
var x = setInterval(function() {
  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  var demoEl = document.getElementById("demo");
  if (demoEl) {
    demoEl.innerHTML = "<div style='font-size: 20px; font-weight: 800; color: black;margin-top:-5px;'>" + days + "<font color='#FA069A'> Days,</font> " + hours + "<font color='#11680B'> hrs,</font> "
    + minutes + "<font color='#9B274C'>  min,<br></font> " + seconds + "<font color='#F47810'> sec before</font></div>";

    // If the count down is finished, write some text 
    if (distance < 0) {
      clearInterval(x);
      demoEl.innerHTML = "";
    }
  }
}, 1000);

