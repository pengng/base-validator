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