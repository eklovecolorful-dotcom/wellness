Feature: Retreat booking with safety screening 靜修預約與安全篩檢
  # Implemented by public.book_retreat (supabase/migrations/0001_wellness.sql)
  # and src/app/retreats/[id]/actions.ts

  Scenario: Participant flags a condition that needs medical clearance
    Given I am booking "Tea Mountain Half-day Retreat" on "2026-12-05"
    When I answer "yes" to "pregnant or recent surgery"
    Then I should see "請先取得醫師同意 Please get medical clearance first"
    And my booking status should be "pending_clearance"
    And no medical advice should be shown

  Scenario: Retreat is full
    Given the retreat has 12 of 12 seats booked
    When I try to book
    Then I should be offered the waitlist
    And I should not be charged

  Scenario: Screening data is purged
    Given a retreat ended 31 days ago
    When the daily purge job runs
    Then no screening rows remain for that retreat
