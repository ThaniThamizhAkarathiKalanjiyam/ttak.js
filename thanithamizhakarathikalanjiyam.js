$(document).ready(function () {

		var bseWeb = "https://ThaniThamizhAkarathiKalanjiyam.github.io/"
        var bseSearchDir = "https://ThaniThamizhAkarathiKalanjiyam.github.io/agarathi/"
        var md = window.markdownit();

		searchWord = function (searchUrl) {

			var id = "#" + searchUrl.id
			var id_card = searchUrl.id
			var dict = searchUrl.dict;
			var sep_dict = searchUrl.sep_dict;
			var dict_full = searchUrl.dict_full;
			var desc = searchUrl.desc;
			//var content = "<h1>" + searchUrl.dict + "</h1>"
			var content = ""
			var url = ""
			if (sep_dict == true) {
				url = bseWeb + searchUrl.dir
			} else {
				url = bseSearchDir + searchUrl.dir
			}
				// $(id).html("Please wait . . . ");
			var txtsearchLow = $("#txtsearch").val().toLowerCase()
			var tamil_letters = get_tamil_letters(txtsearchLow);

			var gitHubUrl = ""
			if (searchUrl.id == "ResultDict" ||
				searchUrl.id == "ResultDictTamKal") {
				gitHubUrl = url + tamil_letters[0] + "/" + txtsearchLow
			} else {
				gitHubUrl = url + txtsearchLow
			}
			var pan_id = "#panel_" + id_card
			$(pan_id).css("display", "none")

			  
				$.get(gitHubUrl,
					function (data) {
					if (data.length == 0) {
						content = content + txtsearchLow + ": இச்சொல் " + dict_full + " அகராதியில் இல்லை.";
					} else {
						var result = md.render(data);
						content = content + result;
						$("#panel_" + id_card).css("display", "block")
 
						$("#card_header_" + id_card).html(dict);
						$("#card_header_" + id_card).append("<span class='material-icons copy_content_str' title='Copy'>content_copy</span>");
						 
						$("#card_title_" + id_card).html(txtsearchLow);
						$("#card_text_" + id_card).html(replaceIlakText2Links(content));
						popup_poem("#card_text_" + id_card)
						$("#card_footer_" + id_card).html("");
						
						if(searchUrl.id == "ResultWNDict"){
								
						}						
					}
				});
			
		};


  searchWordUrl = function(searchUrls){
			   
                $("#div_intro").html("")
                for (i = 0; i < searchUrls.length; i++) {
                    searchWord(searchUrls[i]);
                }                
		   }

	searchWord_Click = function (searchUrls) {
			
           $.when(		   
				searchWordUrl(searchUrls)		   
		   ).then(function(){
			   var txtsearchLow = $("#txtsearch").val().toLowerCase()
			   
			   thodarpudaya_sol(txtsearchLow)
			   isaiyini_eng_dict(txtsearchLow)
		   })
            
        }
        
        
       isaiyini_eng_dict =  function  (inputEngWord) {

			$.ajax({
				url: "data.csv",
				async: false,
				success: function (csvd) {
					var items = $.csv.toObjects(csvd);
					var jsonobject = JSON.stringify(items);
					alert(jsonobject);
				},
				dataType: "text",
				complete: function () {
					// call a function on complete 
				}
			});
       }
        
		
    $.getJSON("https://thanithamizhakarathikalanjiyam.github.io/ttakJs/urls.json", function (searchUrls) {

        $("#btnSearch").click(function(){
			searchWord_Click(searchUrls)
		});

        var sidenav_left_html = ""
            var nav_tabs_content_html = ""

            for (i = 0; i < searchUrls.length; i++) {
                var id = searchUrls[i].id;
                var dict = searchUrls[i].dict;
                var dict_full = searchUrls[i].dict_full;
                var desc = searchUrls[i].desc;
                var active_class = "",
                show_active_class = ""
                    if (i == 0) {
                        active_class = "active"
                            show_active_class = "show active"
                    }

                    sidenav_left_html += "<div class='form-check'><input class='form-check-input' type='checkbox' value='' id='sideLink" + id + "'> <label class='form-check-label' for='defaultCheck1'>" + dict + "</label></div>"
                
                    var panColor = "default"
                    var colInt = i % 6
                    if (colInt == 0) {
                        panColor = "primary"
                    } else if (colInt == 1) {
                        panColor = "success"
                    } else if (colInt == 2) {
                        panColor = "info"
                    } else if (colInt == 3) {
                        panColor = "warning"
                    } else if (colInt == 4) {
                        panColor = "danger"
                    } else {
                        panColor = "default"
                    }

                    nav_tabs_content_html += "<div class='card_div_elem panel panel-" + panColor + "' id='panel_" + id + "' style='display:none;'><div class='panel-heading' id='card_header_" + id + "'>Panel Heading</div><div class='panel-body' id='card_text_" + id + "' style='overflow:auto;'></div></div>"
            }

            $("#sidenav_left").html(sidenav_left_html)
            //$("#nav_tabs_content_html").html(nav_tabs_content_html)
            $("#nav_tabs_content_html").html(nav_tabs_content_html)

    });

    $("#txtSearch").focus();

    thodarpudaya_sol = function (search_word) {
        $.getJSON("https://thanithamizhakarathikalanjiyam.github.io/agarathi/ety/etytamildict/" + search_word, function (thod_sol_data) {
            var wordsList = ""
                $.each(thod_sol_data, function (key, val) {
                    cnt = key + 1
                    wordsList += cnt + ". " + val + "&nbsp;"
                })
                $("#thod_sol").html(wordsList)
				$('#jstree_demo_div').jstree().deselect_all(true);
				if(search_word.length > 0 && wordsList.length > 0){
					$('#jstree_demo_div').jstree(true).settings.core.data = thod_sol_data;
					$('#jstree_demo_div').jstree(true).refresh();
				}else
				{
					versol_div("வேர்",["இடது கிளை","வலது கிளை"])
				}
        });
    }

    var lightbox = $('.lightbox-container'),
    center = function () {
        var T = $(window).height() / 2 - lightbox.height() / 2 + $(window).scrollTop(),
        L = $(window).width() / 2 - lightbox.width() / 2;
        lightbox.css({
            top: T,
            left: L
        }).click(function () {
            $(this).hide();
        });
    };
    $(window).scroll(center);
    $(window).resize(center);

    replaceIlakText2Links = function (str) {

        var result_str = str
            var patt = /புறம் \d+\/\d+/g;
        var patt_href = "/purananooru/docs/";

        var result = str.match(patt);
        $.each(result, function (resultindex, resultvalue) {

            //var str = "jhkj7682834";
            var matches = resultvalue.match(/(\d+)/);

            if (matches) {
                $poem_no = matches[0];

				$div = $("<span class='popup_poem'>")
				$div.attr("poem_no", $poem_no)
				$div.attr("patt_href", patt_href)
				$div.html(resultvalue)
				$icon = $("<span class='material-icons'>")
				$icon.html("launch")
				$div.append($icon)
				                
				result_str = result_str.replace(resultvalue, $div[0].outerHTML)
 
            }
        })
        return result_str
    }

popup_poem = function(card_text_id_card){
$(card_text_id_card+" .popup_poem").click(function(){
	
alert(	$(this).attr("patt_href"))
	
})
}

side_extra_info = function(){
	$( "#accordion" ).accordion({
	  heightStyle: "content"
	});
	$(".ui-accordion-content").show();
}

versol_div = function(root_word,childs){
	$('#jstree_demo_div').jstree({ 'core' : {
    'data' : [
       'பிறசொற்கள் ',
       {
         'text' : root_word,
         'state' : {
           'opened' : true,
           'selected' : true
         },
         // 'children' : [
           // { 'text' : 'Child 1' },
           // 'Child 2'
         // ]
		 'children' : childs
      }
    ]
} })//.redraw(true);
}
$('#jstree_demo_div').on("select_node.jstree", function (e, data) {
	if(data.node != undefined){
	  $("#txtsearch").val(data.node.text);
	  $("#btnSearch").trigger("click")	  
	}
});


 getAllUrlParams = function(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

init_click_event  = function(){

	var getAllUrlParams_url      = window.location.href; 
	var searchString  =  getAllUrlParams(getAllUrlParams_url).q
	$("#txtsearch").val(searchString)
	$("#btnSearch").trigger("click")
	
}

$.when(
	versol_div("வேர்",["இடது கிளை","வலது கிளை"]),
	side_extra_info()
	
	).then(function(){
		init_click_event()
})

});
