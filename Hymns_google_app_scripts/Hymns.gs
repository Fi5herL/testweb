var hymnsPic_url = "https://script.google.com/macros/s/AKfycbz-0otFiOR27IzQ-suUaHehrRZeTpVUDWA-uV1aX1W3a5qtlqlb4dXASmnizvNd3QEy/exec?hymns="

function doGet() {
  const output = HtmlService.createTemplateFromFile('index');
  const evaluate = output.evaluate()
                          .addMetaTag('viewport', 'width=device-width, initial-scale=0.5, minimum-scale=0.5,')// , user-scalable=2 user-scalable=0.5'
                          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                          .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  return evaluate
}
function test() {
  Logger.log(search("3001"))
}

function search(keyword) {
  var spreadsheet = SpreadsheetApp.openById('1WafE1V_tW2yHYNguCnAftn8Rbwi34gSTrrq6FYYlSQo');
  var sheet = spreadsheet.getSheetByName('Hymns');
  var data = sheet.getDataRange().getValues();
  var results = [];

  if (keyword.match(/[0-9]+/) != null) {
    // number
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
        
      if (keyword.toString() == data[i][2].toString()) {
        var resultRow = []

        if (row[7] != "") {
          resultRow = [ '<a href="' + hymnsPic_url + row[7] + '">' + row[8] + " " + row[2] + row[3] + '</a><p>' + replace2Html(row[4])]; // 欄位2,3,5,7
        }
        else {
          resultRow = [ '<a href="' + row[6] + '">' + row[8] + " " + row[2] + row[3] + '</a><p>' + replace2Html(row[4])]; // 欄位2,3,5,7
        }
        
        results.push(resultRow);
      }
    }
  }
  else {
    // keywords
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var searchData = row[4]; // 搜尋的資料放在第五欄
      
      if (searchData) {
        var searchTerms = keyword.split(" ");
        var match = true;
        
        for (var j = 0; j < searchTerms.length; j++) {
          var searchTerm = searchTerms[j].toLowerCase();
          
          if (!searchData.toLowerCase().includes(searchTerm)) {
            match = false;
            break;
          }
          // searchData = highlightKeyword(searchData, searchTerm)
        }
        
        if (match) {
          var resultRow = []
          searchData = searchData.substr((searchData.indexOf(searchTerm[0]) - 10 < 0) ? 0 : searchData.indexOf(searchTerms[0]) - 10, 60)

          if (row[7] != "") {
            resultRow = [ '<a href="' + hymnsPic_url + row[7] + '">' + row[8] + " " + row[2] + row[3] + '</a><p>' + highlightKeyword(searchData, searchTerms[0])]; // 欄位2,3,5,7
          }
          else {
            resultRow = [ '<a href="' + row[6] + '">' + row[8] + " " + row[2] + row[3] + '</a><p>' + highlightKeyword(searchData, searchTerms[0])]; // 欄位2,3,5,7
          }
          results.push(resultRow);
        }
      }
    }
  }


  return results;
}

function highlightKeyword(text, keyword) {
  // Highlight the keyword using HTML `<mark>` tag
  return text.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');
}

function replace2Html(text) {
  // Highlight the keyword using HTML `<mark>` tag
  return text.replace(new RegExp('\n', 'gi'), '<br>');
}
