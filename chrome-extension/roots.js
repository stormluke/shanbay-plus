function change(html, rootsDiv) {
  if(html) {
    rootsDiv.html(html);
  } else {
    rootsDiv.html('无数据');  
  }
}

function fetch(word, rootsDiv) {
  $.get('http://www.iciba.com/' + word, function(data) {
    var html = $('#dict_content_6', data).html();
    change(html, rootsDiv);
  });
}

$('#review').bind('DOMSubtreeModified', function() {
  var rootsDiv = $('#roots div.alert');
  if(rootsDiv.html()) {
    var word = $('h1.content').text().replace(/\[.*\]/, '').replace(/\W/g, '');
    rootsDiv.removeClass();
    rootsDiv.addClass('well');
    rootsDiv.html('载入中...');
    console.log(word);
    fetch(word, rootsDiv);
  };
});
