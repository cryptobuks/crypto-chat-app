var expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () =>
    {
        it("should generate the correct message object", () =>
            {
                var from = "admin";
                var text = "test text";
                var res = generateMessage(from,text);

                expect(res.from).toBe(from);
                expect(res.text).toBe(text);
                expect(res.createdAt).toBeA("number");
            });
    });

describe("generateLocationMessage", ()=>
    {
        it("should generate correct location message", () =>
            {
                var from = "admin";
                var latitude=100;
                var longitude= -100;
                var res = generateLocationMessage(from, latitude, longitude);

                expect(res.from).toBe(from);
                expect(res.url).toBe("https://www.google.com/maps?q=" + latitude + "," + longitude);
                expect(res.createdAt).toBeA("number");
            });
    });
