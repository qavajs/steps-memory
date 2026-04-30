# @qavajs/steps-memory
Step library to work with the memory module

## Installation

```
npm install @qavajs/steps-memory
```

## Configuration

```typescript
export default {
    require: ['@qavajs/steps-memory/index.js']
}
```

---

## Steps

### Save / Set

#### Save value to memory
```gherkin
When I save 'value' to memory as 'key'
When I save '$getRandomUser()' to memory as 'user'
```

#### Set value (alternative syntax)
```gherkin
When I set 'key' = 'value'
```

#### Save result of math expression
Evaluates a JavaScript math expression and saves the result.
```gherkin
When I save result of math expression '{$variable} + 42' as 'result'
When I save result of math expression '{$random()} * 100' as 'result'
```

#### Save multiline string
```gherkin
When I save multiline string to memory as 'key':
  """
  some multiline
  string value
  """
```

#### Save JSON object
Parses and stores a JSON string as an object.
```gherkin
When I save json to memory as 'key':
  """
  {
      "someKey": "someValue"
  }
  """
```

#### Save key-value pairs as object
Builds an object from a two-column DataTable and saves it to memory.
```gherkin
When I save key-value pairs to memory as 'key':
  | someKey      | 42               |
  | someOtherKey | $valueFromMemory |
```

---

### Validate

#### Expect value to satisfy validation
```gherkin
Then I expect '$value' equals to '$anotherValue'
Then I expect '$value' does not contain '56'
```

#### Expect every element in array to satisfy validation
```gherkin
Then I expect every element in '$arr' array to be above '50'
Then I expect every element in '$arr' array to be above '$expectedValue'
```

#### Expect at least N elements in array to satisfy validation
```gherkin
Then I expect at least 1 element in '$arr' array to be above '$expectedValue'
Then I expect at least 2 elements in '$arr' array to be above '50'
```

#### Expect array to be sorted
The comparator must be a function stored in memory that follows the [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description) contract.
```gherkin
Then I expect '$arr' array to be sorted by '$ascending'
```

#### Expect array to match members (DataTable)
```gherkin
Then I expect '$arr' array to have members:
  | uno  |
  | dos  |
  | tres |
```

#### Expect value to satisfy validation against at least one value in array
```gherkin
Then I expect '$text' to equal at least one of '$js(["free", "11.99"])'
```
Or using a DataTable:
```gherkin
Then I expect '$text' to equal at least one of:
  | free  |
  | 11.99 |
```

#### Expect value to satisfy validation against all values in array
```gherkin
Then I expect '$text' not to equal all of '$js(["free", "10.00"])'
```
Or using a DataTable:
```gherkin
Then I expect '$text' not to equal all of:
  | free  |
  | 10.00 |
```
