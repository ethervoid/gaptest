var search_text = "";
var ean_code = "";
var SuperTruper = SuperTruper || {};

(function () {
    SuperTruper.App = function () {
        this.scanner = new SuperTruper.Scan();
    };

    SuperTruper.App.prototype = {
        init: function () {
            var that = this;
            $("#capture_button").click(function () {
                that.scanner.scan();
            });
            $('#search_form').bind('submit', function () {
                search_text = $('#search_text').val();
                $.mobile.changePage( "search_results.html", {
                    transition: "none",
                    reloadPage: true,
                    showLoadMsg: true
                });
                return false;
            });
        }
    };

    SuperTruper.Scan = function () {
        this.scanner_plugin = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
    };

    SuperTruper.Scan.prototype = {
        scan: function () {
            var that = this;
            console.log('scanning');
            try {
                this.scanner_plugin.scan(
                    function (args) {
                        if (!args.cancelled) {
                            ean_code = args.text;
                            $.mobile.changePage( "product_detail.html", {
                                transition: "none",
                                reloadPage: true,
                                showLoadMsg: true
                            });
                        } else {
                            // TODO Info dialog if ean is not valid
                        }
                    },
                    function (error) {
                        console.error("Error trying to scan", error.message);
                    }
                );
            } catch (ex) {
                console.log(ex.message);
            }
        },
        validate_ean: function (eanCode) {
            // Check if only digits
            var ValidChars = "0123456789";
            for (i = 0; i < eanCode.length; i++) {
                digit = eanCode.charAt(i);
                if (ValidChars.indexOf(digit) == -1) {
                    return false;
                }
            }

            // Add five 0 if the code has only 8 digits
            if (eanCode.length == 8) {
                eanCode = "00000" + eanCode;
            }
            // Check for 13 digits otherwise
            else if (eanCode.length != 13) {
                return false;
            }

            // Get the check number
            originalCheck = eanCode.substring(eanCode.length - 1);
            eanCode = eanCode.substring(0, eanCode.length - 1);

            // Add even numbers together
            even = Number(eanCode.charAt(1)) +
                Number(eanCode.charAt(3)) +
                Number(eanCode.charAt(5)) +
                Number(eanCode.charAt(7)) +
                Number(eanCode.charAt(9)) +
                Number(eanCode.charAt(11));
            // Multiply this result by 3
            even *= 3;

            // Add odd numbers together
            odd = Number(eanCode.charAt(0)) +
                Number(eanCode.charAt(2)) +
                Number(eanCode.charAt(4)) +
                Number(eanCode.charAt(6)) +
                Number(eanCode.charAt(8)) +
                Number(eanCode.charAt(10));

            // Add two totals together
            total = even + odd;

            // Calculate the checksum
            // Divide total by 10 and store the remainder
            checksum = total % 10;
            // If result is not 0 then take away 10
            if (checksum != 0) {
                checksum = 10 - checksum;
            }

            // Return the result
            if (checksum != originalCheck) {
                return false;
            }

            return true;
        }

    };

    SuperTruper.ApiCall = function () {
        this.base_url = "http://m.supertruper.com/api/v1";
    };

    SuperTruper.ApiCall.prototype = {
        search_product_by_barcode: function (callback) {
            console.log(this);
            var url = this.base_url + "/products/findBarCode";
            if (ean_code !== null) {
                var search_url = url + "/" + ean_code
                console.log(search_url);
                $.getJSON(search_url, callback);
            } else {
                console.log("Sin texto");
            }
        },
        search_product_by_id: function (callback) {
            console.log(this);
            var url = this.base_url + "/products/find";
            if (product_id !== null) {
                var search_url = url + "/" + product_id
                console.log(search_url);
                $.getJSON(search_url, callback);
            } else {
                console.log("Sin texto");
            }
        },
        search_products: function (callback) {
            var url = this.base_url + "/products/search";
            if (search_text !== null) {
                var response, response_json;
                var search_url = url + "?q=" + search_text + "&maxResult=10&start=1";
                console.log(search_url);
                $.getJSON(search_url, callback);
            } else {
                console.log("Sin texto");
            }
        }
    };
})();