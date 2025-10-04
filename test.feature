Feature: Cart icon and page
  As a customer
  I want to add a SKU to my cart
  So that I can buy it

  Scenario: Cart icon reflects the added SKU
    Given a customer is browsing a SKU on the storefront
    When the customer adds the SKU to the cart
    Then the cart icon displays a count of 1
    And the cart icon tooltip lists the SKU

  Scenario: Cart page shows the added SKU
    Given a customer has added a SKU to the cart
    When the customer opens the cart page
    Then the cart page lists the SKU with quantity 1
    And the cart page shows the checkout button is enabled