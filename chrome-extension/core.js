function changeRoot(trimWord, rootList) {
  if(getTrimWord(getOriWord()) != trimWord) return;
  if(rootList.length) {
    var html = '';
    for(var i = 0; i < rootList.length; i++) {
      var root = rootList[i];
      if(i > 0) {
        html += '<hr />';
      }
      html += '<div class="basic-info row"><div class="span8"><span class="content">' + root['content'] + '&nbsp;</span><span class="meaning-cn">' + root['meaning'] + '</span></div>';
      if(root['note']) {
        html += '<div class="span8"><label><b>词根助记：<span class="root-vocabulary-note">' + root['note'] + '</span></b></label></div>';
      }
      html += '</div>';
      if(root['wordList'].length) {
        html += '<div class="advanced-info row"><div class="brevity span7"><label><b>同根词</b>&nbsp;</label>';
        for(var j = 0; j < root['wordList'].length; j++) {
          var word = root['wordList'][j];
          if(j != 0) {
            html += ' | ';
          }
          html += '<label>' + word['content'] + '</label>';
        }
        html += '</div><a class="show-details span1" href="javascript:void(0)"><span class="on">详细(R)</span><span class="off hide">收起(R)</span></a></div><div class="row"><div class="details span8 hide"><table class="table"><thead><tr><th></th></tr></thead><tbody>';
        for(var j = 0; j < root['wordList'].length; j++) {
          var word = root['wordList'][j];
          html += '<tr class="detail"><td class="word"><span>' + word['content'] + '</span></td><td class="note" width="70%">' + word['note'] + '<div class="definition-btn"><a href="javascript:;" class="">释义</a><span class="definition hide">：' + word['partOfSpeech'] + word['definition'] + '</span></div></td></tr>';
        }
        html += '</tbody></table></div></div>';
      }
    }
    $('#roots div.well').html(html);
  } else {
    $('#roots').slideUp('fast');
  }
}

function changeWord(trimWord, empWord) {
  if(getTrimWord(getOriWord()) != trimWord) return;
  $('h1.content').html(empWord + '<small>' + $('h1.content small').html() + '</small>'); 
}

function fetch(trimWord, isEmpWordOn, isRootsOn) {

  $.get('http://www.iciba.com/' + trimWord, function(data) {

    if(isEmpWordOn) {
      var empWord =  $('#emphasize_ec_word div.tips_content', data).text().replace('音节划分：', '').replace(/▪/g, '·');
      if(empWord) {
        changeWord(trimWord, empWord);
      }
    }

    if(isRootsOn) {
      var rootList = [];
      $('#dict_content_6 div.industry', data).each(function() {
        var root = {};
        root['content'] = $(this).find('h4 span').text();
        root['meaning'] = $(this).find('div.vCigen_h4').text();
        var wordList = [];
        $(this).find('div.pos_box').each(function() {
          var partOfSpeech = $(this).text();
          $(this).next().find('li').each(function() {
            var word = {};
            word['partOfSpeech'] = partOfSpeech;
            word['content'] = $(this).find('a:first').text();
            word['note'] = $(this).find('span').text().replace(/<\/?a>/, '').replace('(', '').replace(')', '');
            $(this).find('a').remove();
            $(this).find('span').remove();
            word['definition'] = $(this).text();
            if(word['content'] == trimWord) {
              root['note'] = word['note'];
            } else if ($.inArray(word, wordList) == -1) {
              wordList.push(word);
            }
          });
        });
        root['wordList'] = wordList;
        rootList.push(root);
      });
      changeRoot(trimWord, rootList);
    }

  });
}

function getOriWord() {
  return $('h1.content').text().replace(/\[.*\]/, '').replace(/\s/g, '');
}

function getTrimWord(oriWord) {
  return oriWord.replace(/\W/g, '');
}

$('#review').bind('DOMSubtreeModified', function() {
  var rootsWrapper = $('#roots div.roots-due-wrapper');
  if(rootsWrapper.length) {
    rootsWrapper.removeClass('roots-due-wrapper').addClass('roots-wrapper').html('<div class="well"><img src="data:image/gif;base64,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" /></div>');
    fetch(getTrimWord(getOriWord()), true, true);
  } else if($('#learning_word').length && $('#learning_word.changed').length == 0 && getOriWord() == getTrimWord(getOriWord())) {
    $('#learning_word').addClass('changed');
    fetch(getTrimWord(getOriWord()), true, false);
  }
});
