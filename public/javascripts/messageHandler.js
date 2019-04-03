function receiveNostoMessage(event) {
    var settings = {
        iframeId: "nosto_iframe",
        urls: {
            createAccount: '/api/create',
            deleteAccount: '/api/remove'
        }
    };

    // If the message does not start with "[Nosto]", then it is not for us.
    if ((""+event.data).substr(0, 7) !== "[Nosto]") {
        console.log('Not a Nosto event', event);
        return;
    }
    // You might want add validation where the event originates from and only
    // process the ones originating from your platform domain
    // var originRegexp = new RegExp(".*");
    // if (!originRegexp.test(event.origin)) {
    //     console.warn('Requested URL does not matches iframe origin');
    //     return;
    // }

    // Pass the info on to a handler if the data seems sane.
    var json = (""+event.data).substr(7);
    var data = JSON.parse(json);
    if (typeof data === "object" && data.type) {
        Nosto.handlePostMessage(data, settings);
    }
}