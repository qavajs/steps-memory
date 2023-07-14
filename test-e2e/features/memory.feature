Feature: Memory

  Scenario: math expression
    When I save result of math expression '32 + 1' as 'result'
    Then I expect '$result' to be equal '33'

  Scenario: save result of sync computed to memory
    When I save "$getComputedString()" to memory as 'string1'
    Then I expect '$string1' to be equal 'I was computed'

  Scenario: save result of async computed to memory
    When I save "$getStringAsync()" to memory as 'string1'
    Then I expect '$string1' to be equal 'I was computed async'

  Scenario: escape $ in expected value
    Then I expect '\\$42' to be equal '\\$42'

  Scenario: set value
    When I set 'someKey' = 'someValue'
    Then I expect '$someKey' to be equal 'someValue'

  Scenario: save json to memory
    When I save json to memory as 'jsonKey':
    """
    {
      "key": 42
    }
    """
    Then I expect '$jsonKey.key' to be equal '42'

  Scenario: save kv to memory
    When I save key-value pairs to memory as 'kv':
      | key        | 42          |
      | anotherKey | stringValue |
    Then I expect '$kv.key' to be equal '42'
    And I expect '$kv.anotherKey' to be equal 'stringValue'

  Scenario Outline: arr expectation (<validation>)
    When I expect every element in '$arr' array <validation> '<expectedValue>'

    Examples:
      | validation   | expectedValue |
      | not to equal | 10            |
      | to be above  | 0             |
      | have type    | number        |

  Scenario Outline: arr expectation (<validation>)
    When I expect '<array>' array to be sorted by '<sort>'

    Examples:
      | array       | sort        |
      | $arr        | $ascending  |
      | $reverseArr | $descending |

  Scenario: match schema
    When I save json to memory as 'schema':
    """
    {
        "type": "object",
        "properties": {
            "foo": {
                "type": "integer"
            },
            "bar": {
                "type": "string"
            }
        },
        "required": [
            "foo"
        ],
        "additionalProperties": false
    }
    """
    When I save json to memory as 'object':
    """
    {
      "foo": 1,
      "bar": "abc"
    }
    """
    Then I expect '$object' to match schema '$schema'

  Scenario: arr expectation
    When I expect '$arr' array to include members:
      | $number(1) |
      | $number(2) |
      | $number(3) |
