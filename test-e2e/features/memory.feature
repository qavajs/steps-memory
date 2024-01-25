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

  Scenario: save multiline string to memory
    When I save multiline string to memory as 'multilineString':
    """
    Carriage
    return
    """
    Then I expect '$multilineString' to equal '$multilineMemoryValue'

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
      | $js(1) |
      | $js(2) |
      | $js(3) |

  Scenario: at least validation
    When I save '$js([1,2,3,4,5])' to memory as 'arr'
    Then I expect at least 1 element in '$arr' array to equal '1'
    And I expect at least 2 elements in '$arr' array to be above '2'

  Scenario: at least one of validation
    When I save '$js([1,2,3,4,5])' to memory as 'expected'
    Then I expect '1' to equal at least one of '$expected'

  Scenario: at least one of validation data table
    When I save '2' to memory as 'two'
    Then I expect '2' to equal at least one of:
      | 1    |
      | $two |

  Scenario: all of validation
    When I save '$js([2,3,4,5])' to memory as 'expected'
    Then I expect '$js(6)' to be greater than all of '$expected'

  Scenario: all of validation
    When I save '2' to memory as 'two'
    Then I expect '3' not to equal all of:
      | 1    |
      | $two |
