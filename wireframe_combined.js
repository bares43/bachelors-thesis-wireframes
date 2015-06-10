var Wireframe = {

    elementTypes: ["DoNothing","List","ListItemInline","ListItemChildrens", "FormSelect", "FormTextarea", "FormRadio", "FormCheckbox", "FormFile", "FormButton", "FormRange", "FormInput", "Slider", "Iframe", "Image", "OneLineText"],

    wireframeContainer:[],

    popWireframeContainer:[],

    defaultNodeOptions:{
        position:true,
        positionTopAdd:0,
        positionLeftAdd:0
    },


    walk: function (node, nodeOptions) {
        var $node = $(node);
        var walkChilds = true;
        Wireframe.popWireframeContainer.push(false);
        nodeOptions = $.extend({},Wireframe.defaultNodeOptions, nodeOptions);

        var length = Wireframe.elementTypes.length;
        for(var i = 0;i<length;++i){
            var type = Wireframe.elementTypes[i];
            if($node.is(":is"+type)){
                var result = Wireframe["process"+type]($node, nodeOptions);
                walkChilds = result.walkChilds;
                if(result.nodeOptions){
                    nodeOptions = result.nodeOptions;
                }
                console.log(JSON.stringify(nodeOptions));
                break;
            }
        }

        if (walkChilds) {
            var childrens = $node.children();
            childrens.each(function (i, v) {
                Wireframe.walk(v, nodeOptions);
            });
        }

        if(Wireframe.popWireframeContainer.pop()){
            Wireframe.append(Wireframe.wireframeContainer.pop());
        }

    },

    copyCss: function(from, to, rule){
        to.css(rule,from.css(rule));
    },

    basePosition: function(el, original,nodeOptions){
        console.log("top budu pricitat "+nodeOptions.positionTopAdd);
        console.log("left budu pricitat "+nodeOptions.positionLeftAdd);
        el.css("position", "absolute");
        el.css("top", (original.offset().top + nodeOptions.positionTopAdd) + "px");
        el.css("left", (original.offset().left + nodeOptions.positionLeftAdd) + "px");
        el.css("width", original.width() + "px");
        el.css("height", original.height() + "px");
    },

    append : function(element){
        Wireframe.getCurrentWireframeContainer().append(element);
    },

    getCurrentWireframeContainer : function(){
        return Wireframe.wireframeContainer[Wireframe.wireframeContainer.length-1];
    },

    run: function (element, options) {

        var container = $(element);
        if (container.is(document)) {

            Wireframe.wireframeContainer.push($("<div />").css("position", "relative"));


            this.walk(container.find("body"),{});


            container.find("html").css("background", "none");
            container.find("html").css("background-color", "white");

            container.find("body").replaceWith($("<body />"));

            container.find("body").append(Wireframe.wireframeContainer[0]);

        }

        return container;
    }
};/*
 isVisible, v1.0.0
 by Riki Fridrich <riki@fczbkk.com> (https://github.com/fczbkk)
 https://github.com/fczbkk/isvisible
 */
(function() {
    var checkVisibility, getStyle, isVisible;
    getStyle = function(element, property) {
        if (element.currentStyle) {
            return element.currentStyle[property];
        } else if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
        } else {
            return null;
        }
    };
    checkVisibility = function(element) {
        var is_displayed, is_visible;
        is_displayed = getStyle(element, "display") !== "none";
        is_visible = getStyle(element, "visibility") !== "hidden";
        return is_displayed && is_visible;
    };
    isVisible = function(element) {
        if (!document.body.contains(element)) {
            return false;
        }
        while (element != null && element !== document.body) {
            if (!checkVisibility(element)) {
                return false;
            }
            element = element.parentNode;
        }
        return true;
    };
    window.isVisible = isVisible;
}).call(this);

jQuery.expr[":"].visibleElement = function(elem) {
    return isVisible(elem);
};

jQuery.expr[":"].noChild = function(elem) {
    return jQuery(elem).children().length == 0 && $(elem).is(":visibleElement");
};
jQuery.expr[":"].block = function(elem) {
    return $(elem).css("display") === "block";
};
jQuery.expr[":"].displayNone = function(elem) {
    return $(elem).css("display") === "none";
};
jQuery.expr[":"].toSmall = function(elem) {
    return $(elem).width() < 2 && $(elem).height() < 2;
};

// dont process
jQuery.expr[":"].isDoNothing = function(elem){
    return $(elem).is(":displayNone") || $(elem).is(":toSmall") || $(elem).is("script");
};

Wireframe.processDoNothing = function(){
    // dont walk childs
    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isImage = function(elem) {
    return $(elem).is("img:visibleElement");
};

Wireframe.processImage = function(img, nodeOptions){
    var imgWF = $("<div />");

    //imgWF.css("display","block");
    imgWF.css("position","absolute");

    imgWF.css("background-color","#d7d7d7");

    //imgWF.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        Wireframe.basePosition(imgWF, img, nodeOptions);
    }
    Wireframe.append(imgWF);

    return {walkChilds:false};
};

// one line text
jQuery.expr[":"].isOneLineText = function(elem) {
    return $(elem).is("span:noChild") || $(elem).is("a:noChild");
};

Wireframe.processOneLineText = function(elm, nodeOptions){
    //dump(elm);

    var spanWF = $("<div />");

    spanWF.css("display","block");

    spanWF.css("font-size",elm.css("font-size"));
    spanWF.css("font-family",elm.css("font-family"));
    spanWF.css("font-weight",elm.css("font-weight"));
    spanWF.css("line-height",elm.css("line-height"));

    Wireframe.copyCss(elm,spanWF,"font-size");
    Wireframe.copyCss(elm,spanWF,"font-family");
    Wireframe.copyCss(elm,spanWF,"font-weight");
    Wireframe.copyCss(elm,spanWF,"line-height");
    Wireframe.copyCss(elm,spanWF,"text-align");

    spanWF.css("word-wrap","break-word");
    //console.log(elm.css("font-size"));


    //console.log(elm.text().length);
    var trim = elm.text().length <= 10;
    spanWF.lorem({type:"characters",amount:elm.text().length,trim:trim});

    //spanWF.text(elm.text().length);

    //spanWF.text(elm.text()/*+" "+elm.css("font-size")*/);

    if(nodeOptions.position){
        Wireframe.basePosition(spanWF, elm, nodeOptions);
    }
    Wireframe.append(spanWF);

    return {walkChilds:false,node:spanWF};
};

// iframe
jQuery.expr[":"].isIframe = function(elem) {
    return $(elem).is("iframe");
};

Wireframe.processIframe = function(iframe, nodeOptions){
    var iframeWf = $("<div />");


    iframeWf.css("background-color","#d7d7d7");

    //var src = iframe.attr("src");
    //if(/youtube.com/.test(src) || /youtu.be/.test(src)){
    //}

    if(nodeOptions.position){
        Wireframe.basePosition(iframeWf, iframe, nodeOptions);
    }
    Wireframe.append(iframeWf);

    return {walkChilds:false};
};
// try do detect if element is a slider
jQuery.expr[":"].isSlider = function(elem) {
    elem = $(elem);
    var isSlider = false;
    if(elem.is("ul") || elem.is("ol")){
        $("li", elem).each(function(i,v){
            if(($(v).css("position") == "absolute" || $(v).css("float") == "left" || $(v).css("float") == "right") &&
                ($(v).find("img").length > 0 || $(v).find("div:block").length > 0/* || $(v).find("a:block").length > 0)*/)){
                isSlider = true;
            }
        });
    }else{
        isSlider = false;
    }
    return isSlider;
};

Wireframe.processSlider = function(slider, nodeOptions){
    var sliderWf = $("<div />");

    sliderWf.css("background-color","#d7d7d7");

    //var img = slider.find("img");
    //sliderWf.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        Wireframe.basePosition(sliderWf, slider, nodeOptions);
    }
    sliderWf.css("height",slider.find("li").height()+"px");
    sliderWf.css("width",slider.find("li").width()+"px");
    Wireframe.append(sliderWf);

    return {walkChilds:false};
};// ol/ul
jQuery.expr[":"].isList = function (elem) {
    console.log("expression list");
    var r = ($(elem).is(":visibleElement") && ($(elem).is("ol") || $(elem).is("ul")));
    //console.log(r);
    return r;
};

Wireframe.processList = function (list, nodeOptions) {
    if (list.is("ul")) {
        var listWf = $("<ul></ul>");
        //console.log("procesuji ul");
    }
    else if (list.is("ol")) {
        var listWf = $("<ol></ol>");
        //console.log("procesuji ol");
    }
    console.log("procesuji list "+$(list).attr("id"));
    Wireframe.copyCss(list, listWf, "list-style-type");

    if (nodeOptions.position) {
        //Wireframe.basePosition(listWf, list);

    }
    Wireframe.wireframeContainer.push(listWf);
    Wireframe.popWireframeContainer.pop();
    Wireframe.popWireframeContainer.push(true);

    return {walkChilds: true, nodeOptions: nodeOptions};
};

// li inline
jQuery.expr[":"].isListItemInline = function (elem) {
    var isInline = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        console.log("id: "+$(elem).attr("id"));
        console.log("deti: "+childrens.length);
        if (childrens.length == 0) return isInline;
        childrens.each(function (i, v) {
            console.log($(v).attr("id"));
            if (!$(v).is(":isOneLineText")) {
                isInline = false;
            }
        });
        console.log("je inline");
        return isInline;
    }
    return false;
};

Wireframe.processListItemInline = function (listItem, nodeOptions) {
    console.log("inline li");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    var result = Wireframe.processOneLineText(listItem, $.extend({},nodeOptions, {position: false}));
    li.html(result.node);
    Wireframe.append(li);
    return {walkChilds: false, nodeOptions:nodeOptions };
};

// li with childrens
jQuery.expr[":"].isListItemChildrens = function (elem) {
    var r = true;
    if ($(elem).is(":visibleElement") && $(elem).is("li")) {
        var childrens = $(elem).children();
        if (childrens.length == 0) r = false;
        return r;
    }
    return false;
};

Wireframe.processListItemChildrens = function (listItem, nodeOptions) {
    console.log("li s potomky");
    var li = $("<li></li>");
    if (nodeOptions.position) {
        Wireframe.basePosition(li, listItem, nodeOptions);
    }
    Wireframe.wireframeContainer.push(li);
    Wireframe.popWireframeContainer.pop();
    Wireframe.popWireframeContainer.push(true);
    nodeOptions.positionLeftAdd = -$(listItem).offset().left;
    nodeOptions.positionTopAdd = -$(listItem).offset().top;
    console.log("odecitam top "+$(listItem).offset().top);
    console.log("top je "+nodeOptions.positionTopAdd);
    console.log("odecitam left "+$(listItem).offset().left);
    console.log("left je "+nodeOptions.positionLeftAdd);
    nodeOptions.position = true;
    return {walkChilds: true, nodeOptions: nodeOptions};
};// input type radio
jQuery.expr[":"].isFormRadio = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=radio]"));
};

Wireframe.processFormRadio = function (radio, nodeOptions) {
    var radioWf = $("<input />");
    radioWf.attr("type", "radio");
    if (radio.is(":checked")) {
        radioWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(radioWf, radio, nodeOptions);

    }
    Wireframe.append(radioWf);

    return {walkChilds: false};
};

// input type checkbox
jQuery.expr[":"].isFormCheckbox = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=checkbox]"));
};

Wireframe.processFormCheckbox = function (checkbox, nodeOptions) {
    var checkboxWf = $("<input />");
    checkboxWf.attr("type", "checkbox");
    if (checkbox.is(":checked")) {
        checkboxWf.attr("checked", "checked");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(checkboxWf, checkbox, nodeOptions);

    }
    Wireframe.append(checkboxWf);

    return {walkChilds: false};
};

// input type file
jQuery.expr[":"].isFormFile = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=file]"));
};

Wireframe.processFormFile = function (file, nodeOptions) {
    var fileWf = $("<input />");
    fileWf.attr("type", "file");

    if (nodeOptions.position) {
        Wireframe.basePosition(fileWf, file, nodeOptions);

    }
    Wireframe.append(fileWf);

    return {walkChilds: false};
};

// input type submit/reset/image or button
jQuery.expr[":"].isFormButton = function (elem) {
    return ($(elem).is(":visibleElement") && ($(elem).is("[type=submit]") || $(elem).is("[type=reset]") || $(elem).is("[type=image]") || $(elem).is("button")));
};

Wireframe.processFormButton = function (button, nodeOptions) {
    var buttonWf = $("<input />");
    buttonWf.attr("type", "submit");

    buttonWf.attr("value", "");

    if (nodeOptions.position) {
        Wireframe.basePosition(buttonWf, button, nodeOptions);

    }
    Wireframe.append(buttonWf);

    return {walkChilds: false};
};

// input type range
jQuery.expr[":"].isFormRange = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("[type=range]"));
};

Wireframe.processFormRange = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "range");

    if (nodeOptions.position) {
        Wireframe.basePosition(inputWf, input, nodeOptions);

    }
    Wireframe.append(inputWf);

    return {walkChilds: false};
};

// input type text
jQuery.expr[":"].isFormInput = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("input") && !$(elem).is("[type=hidden]") && !$(elem).is(":isFormRadio") && !$(elem).is(":isFormCheckbox") && !$(elem).is(":isFormFile") && !$(elem).is(":isFormButton") && !$(elem).is(":isFormRange"));
};

Wireframe.processFormInput = function (input, nodeOptions) {
    var inputWf = $("<input />");
    inputWf.attr("type", "text");

    if (nodeOptions.position) {
        Wireframe.basePosition(inputWf, input, nodeOptions);

    }
    Wireframe.append(inputWf);

    return {walkChilds: false};
};

// select
jQuery.expr[":"].isFormSelect = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("select"));
};

Wireframe.processFormSelect = function (select, nodeOptions) {
    var selectWf = $("<select />");

    if (select.is("[multiple]")) {
        selectWf.attr("multiple", "multiple");
    }

    if (nodeOptions.position) {
        Wireframe.basePosition(selectWf, select, nodeOptions);

    }
    Wireframe.append(selectWf);

    return {walkChilds: false};
};

// textarea
jQuery.expr[":"].isFormTextarea = function (elem) {
    return ($(elem).is(":visibleElement") && $(elem).is("textarea"));
};

Wireframe.processFormTextarea = function (textarea, nodeOptions) {
    var textareaWf = $("<textarea />");

    if (nodeOptions.position) {
        Wireframe.basePosition(textareaWf, textarea, nodeOptions);

    }
    Wireframe.append(textareaWf);

    return {walkChilds: false};
};(function ($) {
    $.fn.wireframe = function (options, fn) {

        var defaults = {
            srvUrl: ""
        };
        var options = $.extend(defaults, options);

        return Wireframe.run(this, options);
    };
})(jQuery);