const assert = require('assert')
const Validator = require('../index')

describe('测试 required()', function () {
    const MESSAGE = '手机号码不能为空'
    let rule = [{
        prop: 'prop',
        msg: MESSAGE,
        assert: 'required'
    }]

    
    it('测试 0 和 false', function () {
        assert(!Validator({ prop: 0 }, rule), '0 应通过校验')
        assert(!Validator({ prop: false }, rule), 'false 应通过校验')
    })
})