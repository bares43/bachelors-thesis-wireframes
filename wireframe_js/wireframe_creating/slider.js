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

WireframeCreating.processSlider = function(slider, nodeOptions){
    var sliderWf = $("<div />");

    sliderWf.css("background-color","#d7d7d7");

    //var img = slider.find("img");
    //sliderWf.css("background-image","url('"+img.attr("src")+"')");


    if(nodeOptions.position){
        WireframeCreating.basePosition(sliderWf, slider, nodeOptions);
    }
    sliderWf.css("height",slider.find("li").height()+"px");
    sliderWf.css("width",slider.find("li").width()+"px");
    WireframeCreating.append(sliderWf);

    return {walkChilds:false};
};