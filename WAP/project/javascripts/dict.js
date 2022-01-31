$(document).ready(function() {
    $("#submit").click(function() {
        $.post("http://localhost:8000/check-term", 
        {
            word: $("#term").val() 
        },
        function(data) {
            $("div p").each(function() {
                $(this).remove();
            });
            var i = 1;
            data.forEach(element => {
                $("#result").append("<p>" + i++ + ". <strong>(" + element.wordtype + ")</strong> :: " + element.definition);
            });
        });
    });
});