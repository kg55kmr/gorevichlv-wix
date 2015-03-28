$(window).ready(function () {
    $("ul li").click(function (e) {
        var children = $(this).children();
        if (children.prop("tagName").toLocaleLowerCase() != "a") children.slideToggle("normal");
        e.stopPropagation();
    });
});