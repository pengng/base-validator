const Validtor = require('../lib/validator')

const EXPECTED = [
    {
        prop: 'phone',
        msg: '手机号码不能为空',
        assert: 'required'
    },
    {
        prop: 'phone',
        msg: '手机号码长度应为11位',
        assert: 'betweenLength',
        expected: [11, 11]
    },
    {
        prop: 'phone',
        msg: '手机号码不正确',
        assert: 'tel'
    },
    {
        prop: 'code',
        msg: '验证码不能为空',
        assert: 'required'
    },
    {
        prop: 'code',
        msg: '验证码应为6位',
        assert: 'betweenLength',
        expected: [6, 6]
    },
    {
        prop: 'code',
        msg: '验证码不正确',
        assert: 'regular',
        expected: '/^\\d{6}$/'
    }
]

const ACTUAL = {
    phone: '        ',
    code: '232342'
}

const msg = Validtor(ACTUAL, EXPECTED)
console.log(msg)