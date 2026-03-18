// Custom JavaScript for MobileCube demo
$(document).on(':passageend', function(ev) {
    var jsDemo = document.getElementById('js-demo');
    if (jsDemo) {
        jsDemo.textContent = "JavaScript execution confirmed! Enjoy building your rich MobileCube stories.";
        jsDemo.style.color = "#4CAF50";
        jsDemo.style.fontWeight = "bold";
    }
});
