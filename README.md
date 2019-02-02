# base-validator
基础的表单验证器。用于 Browser 和 Node.js 环境下校验用户提交的数据。



### Usage

```shell
npm i -S base-validator
```

```javascript
const Validator = require('base-validator')
// 定义校验规则
const rule = [
    {
        prop: 'phone',
        msg: '手机号码不能为空',
        assert: 'required'
    }
]
// 待校验的数据
const form = {
    phone: ' 	' // 该值只包含空格和制表符，无法通过 required 校验
}

const msg = Validator(form, rule)
console(msg) // 手机号码不能为空
```



### Validator(data, rule)

校验数据是否符合期望值。返回第一项不通过的项目的错误提示语 \<string\>。全部通过时返回 **undefined**

- `data` \<object\> 待校验的数据对象
- `rule` \<Array[object]\> 校验的规则，对象数组。
  - `property` \<string\> 校验的字段名。**Alias：prop、key**
  - `message` \<string\> 校验不通过时的提示语。**Alias：msg**
  - `assert` \<string\> 校验的策略，支持的列表参考 [**Assert**](#Assert) 表。
  - `expected` \<any\> 期望值。**部分校验策略需要带期望值**。



### Validator.all(data, rule)

同 [**Validator(data, rule)**](#validatordata-rule) ，但返回全部不通过的项目。



### Assert

| assert        | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| tel           | 手机号码。别名：**mobile**、**phone**                        |
| email         | 电子邮箱。别名：**mail**                                     |
| idcard        | 居民身份证。                                                 |
| url           | url。别名：**URL**                                           |
| min           | 最小值。仅允许数字类型和数字格式字符串，不允许布尔值。别名：**gte** |
| max           | 最大值。仅允许数字类型和数字格式字符串，不允许布尔值。别名：**lte** |
| minlength     | 最小长度值。对于数组，元素的个数应大于等于期望值；对于字符串，则是字符的个数。期望值描述的是长度，应为整数类型 |
| maxlength     | 最大长度值。对于数组，元素的个数应小于等于期望值；对于字符串，则是字符的个数。期望值描述的是长度，应为整数类型 |
| number        | 数字类型。允许 Number 类型或符合数字格式的字符串（前后可包含一个或多个空白字符，可以是小数和负数） |
| digits        | 整数类型。允许整数或整数格式的字符串（前后可包含一个或多个空白字符，可以是负数） |
| between       | 实际值应该在期望的上限和下限之间，包含上限和下限。期望值可以是单个元素的数组或数字类型，则上限值和下限值相等。上限值和下限值不区分顺序，小的值为下限，大的值为上限。 |
| lengthBetween | 实际值的长度应该在期望的上限和下限之间，包含上限和下限。期望值可以是单个元素的数组或数字类型，则上限值和下限值相等。上限值和下限值不区分顺序，小的值为下限，大的值为上限。别名：**length** |
| equalTo       | 值相等。对于复合类型（数组和对象），进行递归对比。对于基本类型，进行全等对比（即对比类型和值）。别名：**eq** |
| contains      | 包含期望值。对于数组，对比的是单项；对于字符串，对比的是字串。 |
| in            | 在期望值中存在。对于数组，对比的是单项；对于字符串，对比的是字串。 |
| regular       | 正则校验。期望值是 **RegExp** 类型或 **string** 类型（正则字面量格式） |
| required      | 必填。**0** 和 **false** 属于有效值，仅包含一个或多个空白字符的字符串属于无效值 |



### Tips

在确保校验准确度的前提下，尽可能放宽规则。例：

- 符合数字格式的字符串或`Number`类型均可以通过 **number** 校验。

- 允许数据前后包含空白字符，用户可能不会注意到输入了空白字符。
- **0** 和 **false** 出现在表单内，常作为 `<input type="number" />` 和 `<input type="checkbox" />` 的结果值。应当作有效值，可以通过 **required** 校验。
- 包含一个或多个空白字符的字符串，不包含任何可见字符，可能是用户无意中输入，但发现不到，这应当被 **required** 校验阻止。