$(document).ready(function(){
    $("#form-model-writer").on('submit', function(e){
        e.preventDefault();
        /*
        $.ajax({
            url: 'model-writer-ajax.php', 
            method: 'post',
            data: $("#form-model-writer").serialize(),
            success: function(result){
                $("#result").html(result);
            }
        });
        */
        $("#result").html(ModelWriter.write());
    });
    
    $("#btn-add-model-property").on('click', function(){
        var ele = $(".args").first().clone();
        $(".args-container").append(ele);
    });
    $("#language").on("change", function() {
        switch ($(this).val()) {
            case "php":
                ModelWriter.defaultPropertyTypes = 
                    ["int","bool","number","string","array","object"];
            break;
        }
    }).trigger("change");
    $("#types").on("change", function () {
        $("input#add-type").val($(this).val());
    });
    $("#form-model-writer").on("change", "select[name='arg_type[]']", function () {
        if ($(this).val() != "") return;
        if ($(".args").length > 1){
            $(this).parent().remove();
        } else {
            modal_errors('You must have at least one model property!');
        }
    });
    ModelWriter.populatePropertyTypes();
});
var ModelWriter = {};
ModelWriter.defaultPropertyTypes = ["int"
                                   ,"bool"
                                   ,"number"
                                   ,"string"
                                   ,"array"
                                   ,"object"];
ModelWriter.customPropertyTypes = [];
ModelWriter.addPropertyType = function() {
    var cTypes = ModelWriter.customPropertyTypes;
    var dTypes = ModelWriter.defaultPropertyTypes;
    var name = $("input#add-type").val();
    if (cTypes.indexOf(name) != -1 || dTypes.indexOf(name) != -1) {
        modal_errors("This property type already exists!");
        return;
    }
    cTypes.push(name);
    ModelWriter.populatePropertyTypes();
}
ModelWriter.removePropertyType = function() {
    var cTypes = ModelWriter.customPropertyTypes;
    var dTypes = ModelWriter.defaultPropertyTypes;
    var name = $("input#add-type").val();
    if (dTypes.indexOf(name) != -1) {
        modal_errors("Cannot remove default property type!");
        return;
    }
    if (cTypes.indexOf(name) == -1) {
        modal_errors("Cannot remove property type that does not exist.");
        return;
    }
    cTypes.splice(cTypes.indexOf(name),1);
    ModelWriter.populatePropertyTypes();
}
ModelWriter.populatePropertyTypes = function() {
    var selects = $("select[name='types'], select[name='arg_type[]']");
    var mainOption1 = "<option value='' disabled selected>Property Types</option>";
    var otherOption1 = "<option value='' disabled selected>Property Type</option>";
    var typeList = "";
    for (var type of ModelWriter.defaultPropertyTypes) {
        typeList += "<option value='"+type+"'>"+type+"</option>";
    }
    typeList += "<option value='' disabled>-------</option>";
    for (var type of ModelWriter.customPropertyTypes) {
        typeList += "<option value='"+type+"'>"+type+"</option>";
    }
    selects.empty();
    $("select[name='types']").append(mainOption1);
    $("select[name='arg_type[]']").append(otherOption1);
    selects.append(typeList);
    var removeProperty = "<option value='' disabled>-------</option>";
    removeProperty += "<option value=''>Remove Model Property</option>";
    $("select[name='arg_type[]']").append(removeProperty);
}
ModelWriter.ucfirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
ModelWriter.readForm = function() {
    var formArray = $("#form-model-writer").serialize().split("&");
    var formObject = {};
    var args = {};
    for (var i in formArray) {
        i = parseInt(i);
        var name = formArray[i].match(/^[^=]*/)[0]; //regex finds everything before the =.
        var value = formArray[i].match(/[^=]*$/)[0]; //regex finds everything after the =.
        if (name == "arg_name%5B%5D") {
            args[value] = {"type":formArray[i+1].match(/[^=]*$/)[0]};
            i++;
            continue;
        }
        formObject[name] = value;
    }
    var returnObject = {};
    returnObject.language = formObject.language;
    returnObject.company = formObject.company;
    returnObject.model = formObject.namespace;
    returnObject.namespace = formObject.model;
    returnObject.args = args;
    return returnObject;
}
ModelWriter.write = function(isPlainText) {
    var formData = ModelWriter.readForm();
    var language = formData.language;
    var company = formData.company;
    var model = formData.model;
    var namespace = formData.namespace;
    var args = formData.args;
    var output = "";
    var nl = "<br>";
    var sp = "&nbsp;";
    var tab = sp + sp + sp + sp;
    if (isPlainText) {
        nl = "\n\r";
        sp = " ";
        tab = "    ";
    }
    switch (language) {
        case "php":
            output = "/*" + nl
                   + " * (c) " + company + nl
                   + " *" + nl
                   + " * For the full copyright and license information, please view the LICENSE" + nl
                   + " * file that was distributed with this source code." + nl
                   + " */<br>" + nl
                   + "namespace " + namespace + nl
                   + nl
                   + "/**" + nl
                   + " * @author Marie Kauth <marie.kauth@gmail.com>" + nl
                   + " */" + nl
                   + "class " + model + nl
		           + "{" + nl
            for (arg in args) {
                var type = args[arg].type;
                output += nl
                        + tab + "/** @param " + type + " $" + arg + "*/" + nl
                        + tab + "private $" + arg + ";" + nl
            }
            for (arg in args) {
                var type = args[arg].type;
                output += nl
                        + tab + "/**" + nl
                        + tab + " * @return " + type + nl
                        + tab + " */" + nl;
                output += tab + "public function"
                        + ((type === 'bool' || type === 'boolean') ? " is" : " get")
                        + ModelWriter.ucfirst(arg) + "()" + nl;
                output += tab + "{" + nl
                        + tab + tab + "return $this->" + arg + ";" + nl
                        + tab + "}" + nl
                        + nl
                        + tab + "/**" + nl
                        + tab + " * @param " + type + " $" + arg + nl
                        + tab + " */" + nl;
                output += tab + "public function"
                        + " set" 
                        + ModelWriter.ucfirst(arg) + "($" + arg + ")" + nl;
                output += tab + "{" + nl
                        + tab + tab + "$this->" + arg + " = $" + arg + nl
                        + tab + "}" + nl;
            }
            output += "}" + nl 
                    + nl;
        break;
        case "js":
        
        break;
        default:
            output = "Language Not Available!";
    }
    return output;
}

function modal_errors(html){
    var modal_width = 340;
    if($(window).width() > 650){
        modal_width = 600;
    }
    $("#modal_errors").html(html).dialog({
        modal: true,
        title: 'Errors',
        width: modal_width,
        buttons: {
            Ok: function(){
                $(this).dialog("close");
            }
        }
    });
}