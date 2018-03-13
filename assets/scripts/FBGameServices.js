// These services are based on the Facebook SDK for JavaScript.
// You should load https://connect.facebook.net/en_US/all.js before using the FB API.
 
cc.Class({
    extends: cc.Component,

    properties: {
        outTips: cc.Label
    },

    start () {
        if (typeof FB === 'undefined') {
            cc.error('These services are based on the Facebook SDK for JavaScript. ' + 
                    'You should load https://connect.facebook.net/en_US/all.js before using the FB API.');
        };
        FB.init({
            appId            : '1901989576734054',
            autoLogAppEvents : true,
            status           : true,
            xfbml            : true,
            version          : 'v2.9'
        });
    },

    onLogin () {
        if (typeof FB === 'undefined') return;
        FB.login((response) => {
            if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', (response) => {
                this.outTips.string = 'Good to see you, ' + response.name + '.' + response.id;
        });
        }
    else {
            this.outTips.string = 'User cancelled login or did not fully authorize.';
        }
    });
    },

    onLogout () {
        if (typeof FB === 'undefined') return;
        FB.logout((response) => {
            this.outTips.string = 'logout';
        console.log(response);
    });
    },

    onShare () {
        if (typeof FB === 'undefined') return;
        FB.ui({
            method: 'share',
            href: 'https://developers.facebook.com/docs/',
        }, (response) => {
            console.log(response);
        });
    },

    onAppRequests () {
        if (typeof FB === 'undefined') return;
        FB.ui({
            method: 'apprequests',
            message: 'Hello !!!',
        }, (response) => {
            this.outTips.string = JSON.stringify(response);
    });
    }

});
