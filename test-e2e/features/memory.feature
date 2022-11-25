Feature: Memory

  Scenario: math expression
    When I save result of math expression '32 + 1' as 'result'
    Then I expect '$result' to be equal '33'
