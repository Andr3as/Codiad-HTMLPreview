/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License.
* See [root]/license.md for more information. This information must remain intact.
*/

(function(global, $){
    
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.HTMLPreview.init();
    });

    codiad.HTMLPreview = {
        
        path: curpath,
        default: "",
        
        init: function() {
            var _this = this;
            amplify.subscribe("context-menu.onShow", function(obj){
                var ext = _this.getExtension(obj.path);
                var defaultExt = ["html", "htm", "php", "php4", "php5", "phtml"];
                if (defaultExt.indexOf(ext) !== -1) {
                    $('#context-menu').append('<hr class="file-only html-preview">');
                    $('#context-menu').append('<a class="file-only html-preview" onclick="codiad.HTMLPreview.setDefault($(\'#context-menu\').attr(\'data-path\'));"><span class="icon-check"></span>Set as preview</a>');
                }
            });
            amplify.subscribe("context-menu.onHide", function(){
                $('.html-preview').remove();
            });
            amplify.subscribe("active.onOpen", function(path){
                setTimeout(function(){
                    if (codiad.editor.getActive() !== null) {
                        var manager = codiad.editor.getActive().commands;
                        manager.addCommand({
                            name: 'OpenPreview',
                            bindKey: "Ctrl-O",
                            exec: function () {
                                _this.showPreview();
                            }
                        });
                    }
                }, 10);
            });
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Set a default html file
        //
        //  Parameter:
        //
        //  path - {String} - File path
        //
		//////////////////////////////////////////////////////////
        setDefault: function(path) {
            this.default = path;
            codiad.message.success("Default added");
            codiad.filemanager.contextMenuHide();
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Show preview
        //
		//////////////////////////////////////////////////////////
        showPreview: function() {
            var path = codiad.active.getPath();
            var ext = this.getExtension(path);
            if (ext == "md" || ext == "markdown") {
                //Show preview dialog
                if (typeof(codiad.MarkdownPreview) != 'undefined') {
                    codiad.MarkdownPreview.showDialog(codiad.active.getPath());
                }
            } else if (ext == "css") {
                if (this.default === "") {
                    codiad.filemanager.openInBrowser(path);
                } else {
                    codiad.filemanager.openInBrowser(this.default);
                }
            } else {
                codiad.filemanager.openInBrowser(path);
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Get file extension
        //
        //  Parameter:
        //
        //  path - {String} - File path
        //
		//////////////////////////////////////////////////////////
        getExtension: function(path) {
            return path.substring(path.lastIndexOf(".")+1);
        }
    };
})(this, jQuery);