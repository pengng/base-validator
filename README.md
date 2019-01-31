# base-validtor
基础的表单验证器。用于 browser 和 nodejs 环境下校验用户提交的数据。



### Usage

```shell
npm i -S base-validtor
```

```javascript
const Validtor = require('base-validtor')

const assert = [
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

const form = {
    phone: ' ',
    code: '23342'
}

const msg = Validator(assert, form)
console(msg)
```



### Assert

| assert        | 描述                         |
| ------------- | ---------------------------- |
| tel           | 手机号码                     |
| email         | 电子邮箱                     |
| idcard        | 居民身份证                   |
| url           | url                          |
| min           | 最小值                       |
| max           | 最大值                       |
| minlength     | 最小长度值                   |
| maxlength     | 最大长度值                   |
| number        | 数字                         |
| digits        | 整数                         |
| between       | 在最小值和最大值之间         |
| betweenLength | 在最小长度值和最大长度值之间 |
| equalTo       | 值相等                       |
| contains      | 包含给定值                   |
| in            | 在给定值内存在               |
| regular       | 正则校验                     |
| required      | 必填                         |
|               |                              |
|               |                              |
|               |                              |
|               |                              |

