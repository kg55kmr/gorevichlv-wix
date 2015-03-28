(function ($) {
    var localApiKey;
    var localUserId;

    //noinspection JSUnusedGlobalSymbols
    $.extend({
        getPhotosFromSet: function (apiKey, userId, photosetId) {
            localApiKey = apiKey;
            localUserId = userId;

            return getPhotosIdFromSet(photosetId).then(getPhotosSizes);
        }
    });

    function flickrREST(localApikey, method, request) {
        var deferred = $.Deferred();

        $.getJSON("http://api.flickr.com/services/rest/?method=" + method + "&api_key=" + localApikey +
        request + "&format=json&jsoncallback=?", function (data) {
            deferred.resolve(data);
        });

        return deferred;
    }

    function getPhotosIdFromSet(photosetId) {
        var deferred = $.Deferred();

        flickrREST(localApiKey, "flickr.photosets.getPhotos", "&user_id=" + localUserId + "&photoset_id=" + photosetId)
            .done(function (data) {
                if (data.hasOwnProperty("message")) {
                    alert(data.message);
                    return deferred;
                }
                var photos = [];
                //noinspection JSUnresolvedVariable
                $.each(data.photoset.photo, function (_, value) {
                    photos.push(value.id);
                });
                deferred.resolve(photos);
            });
        return deferred;
    }
    function getPhotosSizes(photosId) {
        var deferred = $.Deferred();
        var defferedObjects = [];

        var photos = [];
        var photo = {};

        for (var i in photosId) {
            //noinspection JSUnfilteredForInLoop
            defferedObjects.push(flickrREST(localApiKey, "flickr.photos.getSizes", "&photo_id=" + photosId[i]));
        }
        $.when.apply($, defferedObjects).done(function () {
            $.each(arguments, function (_, value) {
                photo = {};
                //noinspection JSUnresolvedVariable
                $.each(value.sizes.size, function (_, item) {
                    photo[item.label] = {};
                    photo[item.label].width = item.width;
                    photo[item.label].width = item.width;
                    photo[item.label].height = item.height;
                    photo[item.label].source = item.source;

                });
                photos.push(photo);
            });
            deferred.resolve(photos);
        });

        return deferred;
    }
})(jQuery);