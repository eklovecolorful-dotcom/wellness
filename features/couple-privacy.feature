Feature: Couple mode shares completion only 伴侶模式只分享完成狀態
  Scenario: Partner views my progress
    Given I am paired with my partner
    And I logged a "coffee" practice with mood 2 and a private note
    When my partner opens couple mode
    Then they see that I completed "咖啡冥想" today
    And they cannot see my mood scores or note
