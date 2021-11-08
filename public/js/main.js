// document.addEventListener('DOMContentLoaded', function(){
//     $('#table').on('click-row.bs.table', function (e, row, element, field) {
//         console.log(element);
//     });
// });

// basic usage
// document.addEventListener('DOMContentLoaded', function () {
$(document).ready(function() {
  $('.tablemanager').tablemanager({
    firstSort: [[3, 0], [2, 0], [1, 'asc']],
    disable: ["last"],
    appendFilterby: true,
    dateFormat: [[4, "mm-dd-yyyy"]],
    debug: true,
    vocabulary: {
      voc_filter_by: 'Сортировать по',
      voc_type_here_filter: 'Фильтр...',
      voc_show_rows: 'Строк на странице'
    },
    pagination: false,
    // showrows: [5, 10, 20, 50, 100],
    disableFilterBy: [1],
  });
  $('.select-two').select2();
});

var inlineEditRowContents = {};
var updUrl = "";
var srcFile = {};
var loadFile = function (event) {
  var prev = document.getElementById('prev');
  prev.src = URL.createObjectURL(event.target.files[0]);
  srcFile.url = prev.src;
  srcFile.file = event.target.files[0];
  prev.onload = function () {
    URL.revokeObjectURL(prev.src) // free memory
  }
};

class StringEscaper {
  static replaceTag(tag) {
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    return tagsToReplace[tag] || tag;
  }

  static safe_tags_replace(str) {
    return str.replace(/[&<>]/g, StringEscaper.replaceTag);
  }
}

function simpleRowDataParser(rowData) {
  var str = "";
  for (var key in rowData) {
    if (rowData.hasOwnProperty(key))
      str += key + ":" + rowData[key] + "\n";
  }
  return str;
}

function defaultSampleCallback(rowData, rowName) {
  // alert(rowName+"\n"+simpleRowDataParser(rowData)+"\nHello");
  console.log(rowData['cover']);
  let formData = new FormData();
  formData.append('cover', rowData['cover']);
  formData.append('title', rowData['title']);
  formData.append('year', rowData['year']);
  formData.append('description', rowData['description']);
  formData.append('author', rowData['author']);
  $.ajax({
    type: 'POST',
    url: updUrl,
    data: formData,
    processData: false,
    contentType: false,
    cache: false
  }).done(function(res) {
    console.log(res);
  })
}

function selectCallback(rowData, rowName) {
  var colors = ["FF", "CC", "99", "66", "33", "00"];
  document.getElementById(rowName).children[3].style.backgroundColor = "#" + colors[rowData.red] + colors[rowData.green] + colors[rowData.blue];
}

var defaultSampleOptions = {"finishCallback": defaultSampleCallback};
var customFunctionsOptions = {
  "updateCell": inlineDefaultUpdateCell,
  "finish": inlineDefaultFinish,
  "finishCallback": defaultSampleCallback,
  "finishCell": inlineDefaultFinishCell
};
var sampleOptions = {"finishCallback": selectCallback};

function inlineEdit(rowName, options, url) {
  updUrl = url;
  var tableRow = document.getElementById(rowName);
  inlineEditRowContents[rowName] = {};
  for (var i = 0; i < tableRow.childElementCount; i++) {
    var cell = tableRow.children[i];
    inlineEditRowContents[rowName][i] = cell.innerHTML;
    if (options.hasOwnProperty("updateCell"))
      options.updateCell(cell, i, rowName, options, url);
    else
      inlineDefaultUpdateCell(cell, i, rowName, options, url);
  }
}

function removeItem(url) {
  let response = fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'multipart/form-data',
    },
  });
  response.then(() => {
    location.reload();
  });
}

function inlineDefaultUpdateCell(cell, i, rowName, options) {
  var attributesFilter = ["inlineoptionsvalue", "inlineoptionstitle"];
  var cellContent = "";
  var key;
  if (i === 0) {
    cellContent += `<form id='${rowName}Form'></form>`;
  }
  switch (cell.dataset.inlinetype) {
    case "plain":
      cellContent += inlineEditRowContents[rowName][i];
      break;
    case "doneButton":
      cellContent += `<input type='submit' value='Принять' form='${rowName}Form'/>`;
      break;
    case "button":
      cellContent += inlineEditRowContents[rowName][i];
      break;
    case "link":
      cellContent += `<input type='text' id='imgInp' value='${cell.innerText}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += "/>";
      break;
    case "file":
      var prev = document.getElementById('prev');
      cellContent += `<input type='file' accept='image/*' onchange='loadFile(event)' value='${cell.innerText}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += `/><img id='prev' width='100' height='100' alt='' src='${prev.src}'>`;
      break;
    case "text":
      cellContent += `<input type='text' value='${inlineEditRowContents[rowName][i]}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += "/>";
      break;
    case "date":
      cellContent += `<input type='date' value='${inlineEditRowContents[rowName][i]}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += "/>";
      break;
    case "tel":
      cellContent += `<input type='tel' value='${inlineEditRowContents[rowName][i]}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += "/>";
      break;
    case "email":
      cellContent += `<input type='email' value='${inlineEditRowContents[rowName][i]}' form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += "/>";
      break;
    case "select":
      cellContent += "<select class='form-control select-two' multiple='multiple'";
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += ">";
      var optionsTitle = JSON.parse(cell.dataset.inlineoptionstitle);
      var optionsValue = cell.dataset.hasOwnProperty("inlineoptionsvalue") ? JSON.parse(cell.dataset.inlineoptionsvalue) : [];
      for (var j = 0; j < optionsTitle.length; j++) {
        cellContent += "<option ";
        cellContent += ((optionsValue.length <= j) ? "" : `value='${optionsValue[j]}'`);
        cellContent += ((inlineEditRowContents[rowName][i] == optionsTitle[j]) ? " selected='selected'" : "");
        cellContent += ">";
        cellContent += optionsTitle[j];
        cellContent += "</option>";
      }
      cellContent += "</select>";
      break;
    case "textarea":
      cellContent += `<textarea form='${rowName}Form'`;
      for (key in cell.dataset) {
        if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
          cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
        }
      }
      cellContent += ">";
      cellContent += inlineEditRowContents[rowName][i];
      cellContent += "</textarea>";
      $('.select-two').select2();
      break;
    default:
      cellContent += inlineEditRowContents[rowName][i];
      break;
  }
  cell.innerHTML = cellContent;
  if (i === 0) {
    // set the onsubmit function of the form of this row
    document.getElementById(rowName + "Form").onsubmit = function () {
      event.preventDefault();
      if (this.reportValidity()) {
        if (options.hasOwnProperty("finish"))
          options.finish(rowName, options);
        else
          inlineDefaultFinish(rowName, options, url);
      }
    };
  }
}

function inlineDefaultFinish(rowName, options) {
  var tableRow = document.getElementById(rowName);
  var rowData = {};
  for (var i = 0; i < tableRow.childElementCount; i++) {
    var cell = tableRow.children[i];
    var getFromChildren = (i === 0) ? 1 : 0;
    switch (cell.dataset.inlinetype) {
      case "plain":
        break;
      case "doneButton":
        break;
      case "button":
        break;
      case "link":
        rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
        inlineEditRowContents[rowName][i] = `<a href='${cell.dataset.inlinelinkformat.replace("%link%", StringEscaper.safe_tags_replace(cell.children[getFromChildren].value))}'>${StringEscaper.safe_tags_replace(cell.children[getFromChildren].value)}</a>`;
        break;
      case "file":
        var prev = document.getElementById('prev');
        // rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
        rowData[cell.dataset.inlinename] = cell.children[getFromChildren].files[0];
        // rowData[cell.dataset.inlinename] = prev.src;
        inlineEditRowContents[rowName][i] = `<img id='prev' width='100' height='100' src='${prev.src}'>`;
        // inlineEditRowContents[rowName][i] = `<img id='prev' width='100' height='100' src='${srcFile}'>`;
        break;
      case "text":
      case "date":
      case "tel":
      case "email":
        rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
        inlineEditRowContents[rowName][i] = StringEscaper.safe_tags_replace(cell.children[getFromChildren].value);
        break;
      case "select":
        rowData[cell.dataset.inlinename] = cell.children[getFromChildren].selectedIndex;
        rowData["_" + cell.dataset.inlinename + "Title"] = JSON.parse(cell.dataset.inlineoptionstitle)[cell.children[getFromChildren].selectedIndex];
        rowData["_" + cell.dataset.inlinename + "Value"] = JSON.parse(cell.dataset.inlineoptionsvalue)[cell.children[getFromChildren].selectedIndex];
        inlineEditRowContents[rowName][i] = JSON.parse(cell.dataset.inlineoptionstitle)[cell.children[getFromChildren].selectedIndex];
        break;
      case "textarea":
        // TODO textarea value is \n not <br/>
        rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
        inlineEditRowContents[rowName][i] = cell.children[getFromChildren].value;
        break;
      default:
        break;
    }
  }

  // do whatever ajax magic
  if (options.hasOwnProperty("finishCallback")) {
    rowData['id'] = tableRow.dataset.bookid;
    options.finishCallback(rowData, rowName);
  }

  for (i = 0; i < tableRow.childElementCount; i++) {
    var cell = tableRow.children[i];
    if (options.hasOwnProperty("finishCell")) {
      // return true invokes the default finishCell function
      if (options.finishCell(cell, i, rowName, inlineEditRowContents[rowName][i]) === true) {
        inlineDefaultFinishCell(cell, i, rowName);
      }
    } else
      inlineDefaultFinishCell(cell, i, rowName);
  }
}

function inlineDefaultFinishCell(cell, i, rowName) {
  var cellContent = "";
  cellContent += inlineEditRowContents[rowName][i];
  cell.innerHTML = cellContent;
}
