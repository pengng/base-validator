# base-validator
基础的表单验证器。用于 Browser 和 Node.js 环境下校验用户提交的数据。



在确保校验准确度的前提下，尽可能放宽规则。例：

- 符合数字格式的字符串或`Number`类型均可以通过 **number** 校验。

- 允许数据前后包含空白字符，用户可能不会注意到输入了空白字符。
- **0** 和 **false** 出现在表单内，常作为 `<input type="number" />` 和 `<input type="checkbox" />` 的结果值。应当作有效值，可以通过 **required** 校验。
- 包含一个或多个空白字符的字符串，不包含任何可见字符，可能是用户无意中输入，但发现不到，这应当被 **required** 校验阻止。



### Usage

```shell
npm i -S base-validator
```

```javascript
const Validator = require('base-validator')

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

| assert        | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| tel           | 手机号码                                                     |
| email         | 电子邮箱                                                     |
| idcard        | 居民身份证                                                   |
| url           | url                                                          |
| min           | 最小值                                                       |
| max           | 最大值                                                       |
| minlength     | 最小长度值                                                   |
| maxlength     | 最大长度值                                                   |
| number        | 允许 Number 类型或符合数字格式的字符串（前后可包含一个或多个空白字符，可以是小数和负数） |
| digits        | 整数                                                         |
| between       | 在最小值和最大值之间                                         |
| betweenLength | 在最小长度值和最大长度值之间                                 |
| equalTo       | 值相等                                                       |
| contains      | 包含给定值                                                   |
| in            | 在给定值内存在                                               |
| regular       | 正则校验                                                     |
| required      | 必填                                                         |

