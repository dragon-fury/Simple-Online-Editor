$(document).ready(function() {
	var projectPath = $('#project').data('project_name');
	var path = {};
	languages = {"js": "javascript", "java": "java", "rb": "ruby", "py": "python", "css": "css", "html": "html", "haml": "haml",
	            "ejs": "ejs", "cs": "csharp", "scss": "scss", "sql": "sql", "txt": "text", "erb": "html_ruby"}

	path[projectPath] = "";

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");

	$.getJSON(
	    '/project',
	    function(data) {
	        $('#project').tree({
	            data: data,

	            onCreateLi: function(node, $li) {
					var name = node.name;
					var folderName = node.parent.name;
					
					if($($li).hasClass('jqtree-folder')) {
						if(!folderName) path[name] = "";
						if(path.hasOwnProperty(folderName)) {
							path[name] = path[folderName] + name + "/";
						}
					} else {
						$li.attr('data-url', path[folderName]+name);
					}
	            },

	        });
	    }
	);

	$('#project').on('tree.select', function(event) {
	        var node = event.node;
	        var url = "code/"+$(node.element).data('url');
	        var extension = $(node.element).data('url').match("[a-z]+$")[0] || "text";
	        extension = languages[extension];
	        $.ajax({
	          type: "GET",
	          url: url,
	          success: function(data){
				editor.getSession().setMode("ace/mode/"+extension);
				editor.setValue(data, -1);
	          }
	        });
	        return false;
	    }
	);
});
