Feature: Memory

  Scenario: math expression
    When I save result of math expression '32 + 1' as 'result'
    Then I expect '$result' to be equal '33'

  Scenario: save result of sync computed to memory
    When I save "$getString()" to memory as 'string1'
    Then I expect '$string1' to be equal 'I was computed'

	Scenario: save result of async computed to memory
    When I save "$getStringAsync()" to memory as 'string1'
    Then I expect '$string1' to be equal 'I was computed async'
