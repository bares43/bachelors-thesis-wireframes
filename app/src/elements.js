// some element
jQuery.expr[":"].isElement = function(elem){
    return true;
};

Wireframe.processElement = function(node){
    Wireframe.doBaseFormat(node);
    return {walkChilds:true};
};

jQuery.expr[":"].isIframe = function(node){
  return $(node).is("iframe");
};

Wireframe.processIframe = function(node){
    var $node_wf = $("<div></div>").css({
        width : node.width()+"px",
        height : node.height()+"px",
        backgroundColor : Wireframe.GRAY_OTHER
    });
    node.replaceWith($node_wf);
    return {walkChildes:false};
};

// dont process
jQuery.expr[":"].isDoNothing = function(elem){
    return $(elem).is(":displayNone") || $(elem).is("script");
};

Wireframe.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

jQuery.expr[":"].isBackgroundImage = function(elem){
   return $(elem).children().length === 0 && $(elem).text().length === 0 && $(elem).css("background-image") !== "" && $(elem).css("background-image") !== "none";
};

Wireframe.processBackgroundImage = function(node){
    switch (Wireframe.wireframeOptions.imageMode) {
        case Wireframe.IMAGE_BOX:
            node.css({
                backgroundImage : "none",
                backgroundColor : Wireframe.GRAY_IMAGE
            });
            break;
        case Wireframe.IMAGE_BLUR:
            node.css("-webkit-filter","blur(10px)");
            break;
        case Wireframe.IMAGE_REMOVE:
            node.css({
                backgroundImage : "none",
                backgroundColor : "white"
            });
            break;
    }

    return {walkChilds:false};
};

// image
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img");
};

Wireframe.processImage = function(img){
    img.css("border","none");
    switch (Wireframe.wireframeOptions.imageMode){
        case Wireframe.IMAGE_BOX:
            img.css({
                display : "inline-block",
                backgroundColor : Wireframe.GRAY_IMAGE,
                backgroundImage : "none",
                color : Wireframe.GRAY_IMAGE,
                width : img.width() + "px",
                height : img.height() + "px"
            });
            img.removeAttr("src alt title");
            break;
        case Wireframe.IMAGE_BLUR:
            img.css("-webkit-filter","blur(10px)");
            break;
        case Wireframe.IMAGE_REMOVE:
            img.css({
                opacity : 0,
                backgroundImage : "none"
            });
            break;
    }

    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isText = function(elem) {
    return $(elem).is(":hasText")/* && isElement($(elem),["span","a","p","li","div","h1","h2","h3","h4","h5","h6","em","strong","b","u","i","s"])*/;
};

jQuery.expr[":"].hasText = function(node){
    var hasText = false;
    $(node).contents().each(function(i,v){
       if(v.nodeType === 3 && v.nodeValue.trim().length > 0){
           hasText = true;
       }
    });
    return hasText;
};

Wireframe.processText = function(node){
    var walkChilds = false;
    node.contents().each(function(i,v){
        if(v.nodeType === 3 && v.nodeValue.trim().length > 0){
            var text = this.nodeValue;

            switch (Wireframe.wireframeOptions.textMode){
                case Wireframe.TEXT_LOREM:
                    v.nodeValue = lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions: text.getAllOccurrences(" ")}]});
                    break;
                case Wireframe.TEXT_BOX:
                    $(v).replaceWith(
                        $("<span></span>")
                            .text(v.nodeValue)
                            .css({
                                color : Wireframe.GRAY_TEXT,
                                backgroundColor : Wireframe.GRAY_TEXT,
                                textDecoration : "none"
                            })
                        );
                    break;
            }

        }else if(v.nodeType === 1){
            walkChilds = true;
        }
    });

    Wireframe.doBaseFormat(node);
    return {walkChilds:walkChilds};
};

jQuery.expr[":"].isFormInputText = function(node){
  return $(node).is("input") && !$(node).is("[type=submit]") && !$(node).is("[type=image]") && !$(node).is("[type=search]");
};

Wireframe.processFormInputText = function(node){

    Wireframe.doBaseFormat(node);

    node.css({
        backgroundColor : "white",
        border : "1px solid "+Wireframe.GRAY_INPUT
    });

    switch (Wireframe.wireframeOptions.textMode){
      case Wireframe.TEXT_LOREM:
          var placeholder = node.attr("placeholder");
          if(placeholder !== undefined && placeholder.length > 0){
              node.attr("placeholder",lorem_ipsum_generator({length : placeholder.length, remove : true, addChars : [{char : " ", positions : placeholder.getAllOccurrences(" ")}]}));
          }

          var value = node.val();
          if(value !== undefined && value.length > 0){
              node.val(lorem_ipsum_generator({length : value.length, remove : true, addChars : [{char : " ", positions : value.getAllOccurrences(" ")}]}))
          }
          break;
      case Wireframe.TEXT_BOX:
        node.removeAttr("placeholder");
        node.removeAttr("value");
        node.css("color",Wireframe.GRAY_INPUT);
        break;
    }

    return {walkChilds : false};
};

jQuery.expr[":"].isFormInputSubmit = function (node) {
    return $(node).is("input[type=submit]") || $(node).is("input[type=image]") || $(node).is("input[type=search]") || $(node).is("button");
};

Wireframe.processFormInputSubmit = function(node){
    Wireframe.doBaseFormat(node);
    node.removeAttr("src");
    node.css("background-color",Wireframe.GRAY_INPUT);

    switch (Wireframe.wireframeOptions.textMode){
        case Wireframe.TEXT_LOREM:
            var value = node.val();
            if(value !== undefined && value.length > 0){
                node.val(lorem_ipsum_generator({length : value.length, remove : true, addChars : [{char : " ", positions : value.getAllOccurrences(" ")}]}));
            }

            node.contents().each(function(i,v){
                if(v.nodeType === 3 && v.nodeValue.trim().length > 0){
                    var text = this.nodeValue;
                    v.nodeValue = lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions: text.getAllOccurrences(" ")}]});
                }
            });

            break;
        case Wireframe.TEXT_BOX:
            node.css("color",Wireframe.GRAY_INPUT);
            break;
    }

    return {walkChilds : true};
};

jQuery.expr[":"].isFormTextarea = function(node){
    return $(node).is("textarea");
};

Wireframe.processFormTextarea = function(node){
    Wireframe.doBaseFormat(node);

    switch (Wireframe.wireframeOptions.textMode){
        case Wireframe.TEXT_LOREM:
            var text = node.text();
            if(text !== undefined && text.length > 0){
                node.text(lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions : text.getAllOccurrences(" ")}]}));
            }
            text = node.attr("placeholder");
            if(text !== undefined && text.length > 0){
                node.attr("placeholder",lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions : text.getAllOccurrences(" ")}]}));
            }
            break;
        case Wireframe.TEXT_BOX:
            node.css("color","white");
            node.removeAttr("placeholder");
    }

    node.css("border","1px solid "+Wireframe.GRAY_INPUT);

    return {walkChilds : false};
};

jQuery.expr[":"].isFormSelect = function(node){
    return $(node).is("select");
};

Wireframe.processFormSelect = function(node){
    Wireframe.doBaseFormat(node);

    node.css("border","1px solid "+Wireframe.GRAY_INPUT);

    switch(Wireframe.wireframeOptions.textMode){
        case Wireframe.TEXT_LOREM:

            node.find("option").each(function(i,v){
                var option = $(v);
                var text = option.text();
                option.text(lorem_ipsum_generator({length : text.length, remove : true, addChars : [{char : " ", positions : text.getAllOccurrences(" ")}]}));
            });

            break;
        case Wireframe.TEXT_BOX:
            node.css("color","white");
            break;
    }


};

jQuery.expr[":"].isSvg = function(node){
    return $(node).is("svg");
};

Wireframe.processSvg = function(node){

    switch(Wireframe.wireframeOptions.imageMode){
        case Wireframe.IMAGE_BOX:
            var $node_wf = $("<div></div>").css({
                width : node.width()+"px",
                height : node.height()+"px",
                backgroundColor : Wireframe.GRAY_OTHER
            });
            node.replaceWith($node_wf);
            break;
        case Wireframe.IMAGE_BLUR:
            node.css("-webkit-filter","blur(10px)");
            break;
        case Wireframe.IMAGE_REMOVE:
            node.css({
                opacity : 0
            });
            break;
    }

    return {walkChilds : false};
};

jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};