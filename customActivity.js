// Simple custom activity config using Postmonger

var connection = new Postmonger.Session();
var payload = {};
var hasInitialized = false;

window.onload = function () {
    // Tell Journey Builder we’re ready
    connection.trigger('ready');

    // Receive initial payload
    connection.on('initActivity', function (data) {
        if (hasInitialized) return;
        hasInitialized = true;

        if (data) {
            payload = data;
        }

        // Prefill from previously saved value, if any
        try {
            var inArgs = payload.arguments &&
                         payload.arguments.execute &&
                         payload.arguments.execute.inArguments;
            if (Array.isArray(inArgs)) {
                inArgs.forEach(function (arg) {
                    if (arg && arg.staticEmail) {
                        document.getElementById('emailInput').value = arg.staticEmail;
                    }
                });
            }
        } catch (e) {
            console.error('Error reading inArguments:', e);
        }
    });

    document.getElementById('btnNext').addEventListener('click', onClickedNext);
};

function onClickedNext() {
    var email = document.getElementById('emailInput').value || '';

    if (!payload.arguments) {
        payload.arguments = {};
    }
    if (!payload.arguments.execute) {
        payload.arguments.execute = {};
    }

    payload.arguments.execute.inArguments = [];
    payload.arguments.execute.inArguments.push({
        staticEmail: email
    });

    if (!payload.metaData) {
        payload.metaData = {};
    }
    payload.metaData.isConfigured = true;

    connection.trigger('updateActivity', payload);
}
