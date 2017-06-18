 var socket = io();

function scrollToBottom ()
{
    var messages = jQuery("#messages");
    var newMessage = messages.children("li:last-child");

    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
    {
        messages.scrollTop(scrollHeight);
    }
};

function encrypt_text(text)
{
    var key = _.pick(jQuery.deparam(window.location.search),"password").password;
    var encrypted = CryptoJS.AES.encrypt(text,key).toString();
    var HMAC = CryptoJS.HmacSHA512(encrypted,key).toString();
    return [encrypted,HMAC];
};

function decrypt_text(ciphertext,hmac)
{
    var key = _.pick(jQuery.deparam(window.location.search),"password").password;
    var HMAC= CryptoJS.HmacSHA512(ciphertext,key).toString();
    if(HMAC === hmac)
    {
        return CryptoJS.AES.decrypt(ciphertext,key).toString(CryptoJS.enc.Utf8);
    }
    else
    {
        return ciphertext;
    }
};

socket.on("connect", function ()
    {
        var params = jQuery.deparam(window.location.search);
        var sel_params = _.pick(params,["name","room"])

        socket.emit("join", sel_params, function (err)
            {
                if(err)
                {
                    alert(err);
                    window.location.href = "/";
                } else
                {
                    jQuery("#chat__room-name").text(params.room);
                    console.log("No error");
                }
            });
    });

socket.on("disconnect", function ()
    {
        console.log("Disconnected from server");
    });

socket.on("updateUserList", function (users)
    {
        var ol = jQuery("<ol></ol>");

        users.forEach(function (user)
            {
                ol.append(jQuery("<li></li>").text(user));
            });

        jQuery("#users").html(ol);
    });

socket.on("newMessage", function (message)
    {
        var text;
        if(message.from === "Admin")
        {
            text = message.text;
        }else
        {
            text = decrypt_text(message.text,message.hmac);
        }
        var formattedTime = moment(message.createdAt).format("h:mm a");
        var template = jQuery("#message-template").html();
        var html = Mustache.render(template,
            {
                text,
                from:message.from,
                createdAt:formattedTime
            });

        jQuery("#messages").append(html);
        scrollToBottom();
    });

socket.on("newLocationMessage", function (message)
    {
        var formattedTime = moment(message.createdAt).format("h:mm a");
        var template = jQuery("#location-message-template").html();
        var html = Mustache.render(template,
            {
                url:message.url,
                from:message.from,
                createdAt:formattedTime
            });
        jQuery("#messages").append(html);
        scrollToBottom();
    });

jQuery("#message-form").on("submit", function (e)
    {
        e.preventDefault();

        var messageTextbox = jQuery("[name=message]");
        if(messageTextbox.val().trim().length > 0)
        {
            var encrypted = encrypt_text(messageTextbox.val());
            var text = encrypted[0];
            var hmac = encrypted[1];

            socket.emit("createMessage",
                {
                    text,
                    hmac
                }, function ()
                {
                    messageTextbox.val("");
                });
        };
    });

var locationButton = jQuery("#send-location");
locationButton.on("click", function ()
    {
        if (!navigator.geolocation)
        {
            return alert("Geolocation not supported by your browser.")
        }

        locationButton.attr("disabled", "disabled").text("Sending location...");

        navigator.geolocation.getCurrentPosition(function (position)
            {
                locationButton.removeAttr("disabled").text("Send location");
                socket.emit("createLocationMessage",
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
            }, function ()
            {
                locationButton.removeAttr("disabled").text("Send location");
                alert("Unable to fetch location.");
            });
    });
