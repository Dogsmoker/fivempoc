/*
 "Intercepts" screenshot basic and returns a successful response when the screenshot is created.
 This is really easy to detect, but just poc remember!!!
*/
const frameHandle = document.getElementsByName('screenshot-basic')[0];

if (!frameHandle) {
    return;
};

frameHandle.contentWindow.fetch = function(url, options) {
    if (url.includes('screenshot_created')) {
        return Promise.resolve(new Response(null, {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    return fetch(url, options);
};
