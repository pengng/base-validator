const assert = require('assert')
const Validator = require('../index')
const MESSAGE = 'test msg'

describe('测试 required()', function () {
    let rule = [{
        prop: 'keyname',
        msg: MESSAGE,
        assert: 'required'
    }]

    
    it('测试 0 和 false', function () {
        assert(!Validator({ keyname: 0 }, rule), '0 应通过校验')
        assert(!Validator({ keyname: false }, rule), 'false 应通过校验')
    })

    it('测试空白字符串', function () {
        assert(Validator({ keyname: '          ' }, rule) === MESSAGE, '空白字符串不应该通过校验')
    })

    it('测试其他数据类型', function () {
        assert(!Validator({ keyname: true }, rule), '应通过校验')
        assert(!Validator({ keyname: 'test' }, rule), '应通过校验')
        assert(!Validator({ keyname: [] }, rule), '应通过校验')
        assert(!Validator({ keyname: {} }, rule), '应通过校验')
    })
})

describe('测试 number()', function () {
    let rule = [{
        prop: 'keyname',
        msg: MESSAGE,
        assert: 'number'
    }]

    it('测试布尔值', function () {
        assert(Validator({ keyname: false }, rule) === MESSAGE, '布尔值不应通过校验')        
        assert(Validator({ keyname: true }, rule) === MESSAGE, '布尔值不应通过校验')        
    })

    it('测试各种格式的数字', function () {
        assert(!Validator({ keyname: '-9' }, rule), '数字格式的字符串应能通过校验')        
        assert(!Validator({ keyname: '-0.03' }, rule), '数字格式的字符串应能通过校验')        
        assert(!Validator({ keyname: '-4.0002' }, rule), '数字格式的字符串应能通过校验')        
        assert(!Validator({ keyname: '+10.01201' }, rule), '数字格式的字符串应能通过校验')        
        assert(!Validator({ keyname: '-9100000.1' }, rule), '数字格式的字符串应能通过校验')        
    })

    it('测试错误数字格式的字符串', function () {
        assert(Validator({ keyname: '09' }, rule) === MESSAGE, '错误数字格式的字符串应被阻止')        
        assert(Validator({ keyname: '-.9' }, rule) === MESSAGE, '错误数字格式的字符串应被阻止')        
        assert(Validator({ keyname: '.91' }, rule) === MESSAGE, '错误数字格式的字符串应被阻止')        
        assert(Validator({ keyname: '1.10' }, rule) === MESSAGE, '错误数字格式的字符串应被阻止')        
    })
})

describe('测试 digits()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'digits',
            msg: MESSAGE
        }
    ]

    it('测试整数', function () {
        assert(Validator({ keyname: 11 }, rule) === undefined, '整数可通过校验')
        assert(Validator({ keyname: '+430' }, rule) === undefined, '整数可通过校验')
        assert(Validator({ keyname: '-239' }, rule) === undefined, '整数可通过校验')
    })

    it('测试非整数', function () {
        assert(Validator({ keyname: 11.1 }, rule) === MESSAGE, '非整数不应通过校验')
        assert(Validator({ keyname: "-3.01" }, rule) === MESSAGE, '非整数不应通过校验')
    })
})

describe('测试 min()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'min',
            expected: 10,
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: 10 }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "+10" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "+109.999" }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: 9.999 }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "-10.0001" }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "+0.10001" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 max()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'max',
            expected: 10,
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: 10 }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "+10" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "+9.999" }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: 10.0000001 }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "+100.0001" }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "10000.99" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 between()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'between',
            expected: [0, 10],
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: 10 }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "0.0001" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "+9.999" }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: 10.0000001 }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "-0.01" }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "+111" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 minlength()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'minlength',
            expected: 5,
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "Hello" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: [1, 2, 3, 4, 5] }, rule) === undefined, '合法范围应通过校验')
    })
    
    it('测试非法范围', function () {
        assert(Validator({ keyname: "" }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "                       " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [] }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "abc" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 maxlength()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'maxlength',
            expected: 5,
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "Hello" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "                         " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: [1, 2, 3, 4, 5] }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "Hello world" }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [1, 2, 3, 4, 5, 6] }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "abc def" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 lengthBetween()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'lengthBetween',
            expected: [3, 6],
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "Hel" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "Hel lo     " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: [1, 2, 3, 4, 5, 6] }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "        " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [1, 2, 3, 4, 5, 6, 7] }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "abc  def" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 tel()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'tel',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "   13639988883   " }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "         2233  " }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 email()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'email',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "   abc@de.com   " }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "         @3.com  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "      3   @ .com  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "        3 @3.  " }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 url()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'url',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "   http://url.cn:443/path?query=val#hash   " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "   ftp://1.cn/path#hash   " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "   https://url.cn/#a " }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "         abc://ie.cn  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "ftp://cn  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "opp//cn.cn#aa" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 idcard()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'idcard',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "   440392193202029399   " }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "   440392193222029399  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: " 1403921932002939  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "4403921 3202029399 " }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 regular()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'regular',
            expected: '/^a$/i',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "a" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "A" }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "   A  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: " " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "" }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 equalTo()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'equalTo',
            expected: " a ",
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function (done) {
        assert(Validator({ keyname: "       a" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "   a      " }, rule) === undefined, '合法范围应通过校验')
        done()
    })

    it('测试非法范围', function (done) {
        assert(Validator({ keyname: "   A  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: " " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "           " }, rule) === MESSAGE, '非法范围应被阻止')
        done()
    })

    let rule2 = [
        {
            prop: 'keyname',
            assert: 'equalTo',
            expected: {
                keyA: 1,
                keyB: false
            },
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: { keyA: 1, keyB: false } }, rule2) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: { keyA: true, keyB: 0 } }, rule2) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: { keyA: 1 } }, rule2) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: { keyA: 1, keyB: false, keyC: "" } }, rule2) === MESSAGE, '非法范围应被阻止')
    })

    let rule3 = [
        {
            prop: 'keyname',
            assert: 'equalTo',
            expected: [1, {keyA: true}],
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: [1, { keyA: true }] }, rule3) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: ["1", { keyA: true }] }, rule3) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: [1, { keyA: 1 }] }, rule3) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [true, { keyA: 1 }] }, rule3) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [1, { keyA: 1 }, 1] }, rule3) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [1] }, rule3) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [1, { keyA: true, keyB: 1 }] }, rule3) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 includes()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'includes',
            expected: 'abc',
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: " abc   " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: ["abc"] }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "   ABC  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: "           " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: ["ab c"] }, rule) === MESSAGE, '非法范围应被阻止')
    })
})

describe('测试 in()', function () {
    let rule = [
        {
            prop: 'keyname',
            assert: 'in',
            expected: "abcd",
            msg: MESSAGE
        }
    ]

    it('测试合法范围', function () {
        assert(Validator({ keyname: "abc" }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "       ab  " }, rule) === undefined, '合法范围应通过校验')
        assert(Validator({ keyname: "           " }, rule) === undefined, '合法范围应通过校验')
    })

    it('测试非法范围', function () {
        assert(Validator({ keyname: "   ABC  " }, rule) === MESSAGE, '非法范围应被阻止')
        assert(Validator({ keyname: [" abb"] }, rule) === MESSAGE, '非法范围应被阻止')
    })
})