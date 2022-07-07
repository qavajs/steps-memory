# Steps

---
### I expect {text} {validation} {text} &#9989;

Verify that value from memory satisfies validation against other value

|   param    |   type   |         description          |                example                |
|:----------:|:--------:|:----------------------------:|:-------------------------------------:|
|   value1   |   any    |            value1            |      42, $value, $currentDate()       |
| validation | Function | function to verify condition | to be equal, to be above, to be below |
|   value2   |   any    |            value2            |      42, $value, $currentDate()       |

example:
```gherkin
Then I expect '$value' equals to '$anotherValue'
Then I expect '$value' does not contain '56'
```

---
### I expect every element in {text} array {validation} {text} &#9989;

Verify that every element in array satisfies validation against other value

|     param      |   type   |         description          |                example                |
|:--------------:|:--------:|:----------------------------:|:-------------------------------------:|
|      arr       |   any    |      array to validate       |        $value, $currentDate()         |
|   validation   | Function | function to verify condition | to be equal, to be above, to be below |
| expectedValue  |   any    |        expected value        |      42, $value, $currentDate()       |

example:
```gherkin
Then I expect every element in '$arr' array to be above '$expectedValue'
Then I expect every element in '$arr' array to be above '50'
```

---
### I set {string} = {string} &#9989;

Set memory value

| param |  type  | description | example |
|:-----:|:------:|:-----------:|:-------:|
|  key  | string |     key     |         |
| value | string |    value    |         |

example:
```gherkin
Then I set 'key' = 'value'
```
