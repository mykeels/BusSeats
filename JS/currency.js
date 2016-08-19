function addCommas(nStr) {
    nStr = nStr.toString();
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    //return x2.length;
    if (x2.length == 1 || x2.length == 0) {
        return x1;
    }
    else if (x2.length == 2) {
        return x1 + x2;
    }
    else {
        return x1 + x2;
    }
}

function tryAdd(arr, obj, prop) {
    if (!arr.contains(obj, prop)) {
        arr.add(obj);
    }
    else {
        arr.selectWhere(prop, obj[prop])[0] = obj;
    }
}

function def(val, default_val, comparator) {
    if (comparator == undefined) comparator = null;
    if (default_val == undefined) default_val = "";
    if (val == undefined || val == comparator) return default_val;
    return val;
}

var bill = {
    currency: function (c, i, b, r, n, d) {
        this.code = def(c, "");
        this.icon = def(i, "");
        this.base = def(b, false);
        this.rate = def(r, 0.00);
        this.name = def(n, "");
        this.default = d || false;
    },
    currencies: stor.get("currencies") || [],
    base_code: "NGN",
    default_code: stor.get("currencies") ? stor.get("currencies").selectWhere("default", true).first().code : "NGN",
    server_code: "NGN",
    getIcon: function (code) {
        return this.currencies.selectWhere("code", code).first().icon;
    },
    getBaseCurrency: function () {
        return this.currencies.selectWhere("base", true).first();
    },
    getBaseCurrencyCode: function () {
        return this.currencies.selectWhere("base", true).first().code;
    },
    setDefaultCurrency: function (code) {
        bill.default_code = code;
        bill.currencies.each(function (currency) {
            currency.default = false;
        });
        bill.currencies.selectWhere("code", code).first().default = true;
        stor.add("currencies", bill.currencies);
    },
    getDefaultCurrencyCode: function () {
        return this.currencies.selectWhere("code", this.default_code).first().code;
    },
    getDefaultCurrencyIcon: function () {
        return this.currencies.selectWhere("code", this.default_code).first().icon;
    },
    getCurrencyCodeByIcon: function (icon) {
        return this.currencies.selectWhere("icon", icon).first().code;
    },
    setRate: function (code, rate) {
        this.currencies.selectWhere("code", code).first().rate = rate;
    },
    getRate: function (code) {
        return this.currencies.selectWhere("code", code).first().rate;
    },
    convertFromBase: function (base_amount, code) {
        if (code == this.base_code) return base_amount;
        return Number(Number(base_amount) * Number(this.getRate(code))).toFixed(2);
    },
    convertToBase: function (amount, code) {
        if (code == this.base_code) return amount;
        return Number(Number(amount) / Number(this.getRate(code))).toFixed(2);
    },
    convertBtwCurrencies: function (amount1, code1, code2) {
        var amount_in_base = this.convertToBase(amount1, code1);
        return this.convertFromBase(amount_in_base, code2);
    },
    displayMoney: function (amount, code) {
        return this.getIcon(code) + " " + Number(amount).toFixed(2);
    },
    init: function () {
        var str = "";
        for (var i = 0; i < bill.currencies.length; i++) {
            var cur = bill.currencies[i];
            str += cur.code;
            if (i < bill.currencies.length - 1) str += ",";
        }
        doc.GET("http://beta.wakanow.com/activities/CurrencyService.aspx?method=GetExchangeRates&from=NGN&to=" + str, function (result) {
            result = JSON.parse(result);
            for (var i = 0; i < result.length; i++) {
                var cur = result[i];
                bill.setRate(cur.code, cur.amount);
            }
            stor.add("currencies", bill.currencies);
        });
    },
    convert: function (amount) {
        return Number(this.convertBtwCurrencies(amount, "NGN", this.default_code)).toFixed(2);
    },
    convertd: function (amount) {
        return this.getDefaultCurrencyIcon() + addCommas(Number(this.convertBtwCurrencies(amount, "NGN", this.default_code)));
    },
    reset: function () {
        try {
            $("[data-currency]").each(function () {
                $(this).html(bill.convertd(Number($(this).attr("data-amt"))));
                $(this).attr("data-currency", bill.getDefaultCurrencyCode());
            });
        }
        catch (ex) {

        }
    }
}

function addCurrencies() {
    bill.currencies = def(stor.get("currencies"), []);
    if (bill.currencies.count() > 5) {
        bill.currencies = [];
        stor.add("currencies", bill.currencies);
    }
    if (bill.currencies.length == 0) {
        tryAdd(bill.currencies, new bill.currency("NGN", "\u20a6", true, bill.getRate("NGN") || 199.20, "Nigerian Naira", true), "code");
        tryAdd(bill.currencies, new bill.currency("USD", "\u0024", false, bill.getRate("USD") || 1, "US Dollar", false), "code");
        tryAdd(bill.currencies, new bill.currency("AED", "\u062f\u002e\u0625", false, bill.getRate("AED") || 0.27, "Arab Emirate Dirham", false), "code");
        tryAdd(bill.currencies, new bill.currency("GHS", "\u0047\u0048\u20b5", false, bill.getRate("GHS") || 0.26, "Ghanaian Cedi", false), "code");
        tryAdd(bill.currencies, new bill.currency("GBP", "\u00a3", false, bill.getRate("GBP") || 1.54, "Great British Pound", false), "code");
    }
    for (var i = 0; i < bill.currencies.length; i++) {
        var currency = bill.currencies[i];
        if (currency.base) bill.default_code = currency.code;
    }
    bill.init();
}
addCurrencies();

