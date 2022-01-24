//code fragment 1
$("li").each(function(idx, e) {
    $(e).css("color", "yellow"); 
});

//code fragment 2
$("li").each(function() {
    $(this).css("color", "yellow"); 
});
//code fragment 3
$("li").each(function(idx) {
    $(this).css("color", "yellow"); 
});

All three code fragment are equivalent. 

When we call .each() jQuery function we can pass 
2 arguments that are index and elements.

So, inside the block we can use index and element 
to modify the behavior of that elements.

if we call it with one argument it will be considered as index. 


