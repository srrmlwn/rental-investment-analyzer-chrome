# User Configuration Parameters

This document defines all user-configurable parameters for the Rental Investment Analyzer, including their constraints, defaults, and business logic.

## Configuration Parameters

| Category | ID | Label | Type | Min | Max | Step | Unit | Default | Advanced | Slider | Description |
|----------|-----|-------|------|-----|-----|------|------|---------|----------|---------|-------------|
| **Purchase** |
| | purchasePrice | Purchase Price | currency | 0.25 | 2 | 1000 | $ | 0 | ❌ | ✅ | Offer price for the property (as % of list price) |
| | closingCosts | Closing Costs | percentage | 0 | 100 | 0.1 | % | 3 | ✅ | ✅ | Closing costs as percentage of purchase price |
| | rehabCosts | Rehab Costs | currency | 0 | 1 | 100 | $ | 0 | ✅ | ✅ | Estimated renovation costs (as % of purchase price) |
| | afterRepairValue | After Repair Value | currency | 1 | 2 | 1000 | $ | 0 | ✅ | ✅ | Estimated value after renovations (as % of purchase price) |
| **Loan** |
| | downPaymentPercentage | Down Payment | percentage | 5 | 100 | 1 | % | 20 | ❌ | ✅ | Percentage of property price paid as down payment |
| | interestRate | Interest Rate | percentage | 3 | 12 | 0.25 | % | 7.5 | ❌ | ✅ | Annual mortgage interest rate |
| | loanTerm | Loan Term | number | 10 | 40 | 5 | - | 30 | ❌ | ✅ | Length of mortgage in years (10,15,20,30,40) |
| **Rental Income** |
| | rentEstimate | Monthly Rent | currency | 0 | 2 | 100 | $ | 0 | ❌ | ✅ | Expected monthly rental income (as % of Zestimate) |
| | vacancyRate | Vacancy Rate | percentage | 0 | 20 | 0.5 | % | 5 | ✅ | ✅ | Expected vacancy rate as percentage of annual rent |
| | otherIncome | Other Income | currency | 0 | 2 | 100 | $ | 0 | ✅ | ✅ | Additional monthly income (parking, storage, etc.) |
| **Operating Expenses** |
| | managementRate | Property Management | percentage | 0 | 30 | 0.5 | % | 8 | ❌ | ✅ | Percentage of rent paid to property manager |
| | maintenanceRate | Maintenance | percentage | 0.5 | 5 | 0.1 | % | 1 | ✅ | ✅ | Annual maintenance as percentage of property value |
| | insuranceRate | Insurance Rate | percentage | 0.1 | 2 | 0.1 | % | 0.5 | ❌ | ✅ | Annual insurance rate as percentage of property value |
| | propertyTaxes | Annual Property Taxes | currency | 0 | 100000 | 100 | $ | 0 | ✅ | ✅ | Annual property taxes (actual amount) |
| | hoaFees | Monthly HOA Fees | currency | 0 | 1000 | 10 | $ | 0 | ✅ | ✅ | Monthly HOA fees |

## Business Logic Documentation

### Basic Investment Metrics

1. **Monthly Mortgage**
   - Formula: Standard amortization formula
   - Inputs: Loan amount, interest rate, loan term
   - Purpose: Principal and interest payment

2. **Monthly Cash Flow**
   - Formula: Effective Gross Income - Total Monthly Expenses
   - Components:
     - Effective Gross Income = (Rent * (1 - Vacancy Rate)) + Other Income
     - Total Expenses = Mortgage + Property Tax + Insurance + Maintenance + Management + HOA
   - Purpose: Net monthly income after all expenses

3. **Annual Cash Flow**
   - Formula: Monthly Cash Flow * 12
   - Purpose: Annual net income

4. **Cash on Cash Return**
   - Formula: Annual Cash Flow / Total Investment
   - Total Investment = Down Payment + Closing Costs + Rehab Costs
   - Purpose: Return on actual cash invested

5. **Cap Rate**
   - Formula: NOI / Property Value
   - NOI = Effective Annual Income - Operating Expenses
   - Property Value = After Repair Value (if available) or Purchase Price
   - Purpose: Property's return independent of financing

### Advanced Investment Metrics

1. **Total Investment**
   - Formula: Down Payment + Closing Costs + Rehab Costs
   - Purpose: Total cash required for investment

2. **Net Operating Income (NOI)**
   - Formula: Effective Annual Income - Operating Expenses
   - Purpose: Property's income before financing

3. **Debt Service Coverage Ratio (DSCR)**
   - Formula: NOI / Annual Debt Service
   - Purpose: Ability to cover mortgage payments

4. **Return on Investment (ROI)**
   - Formula: (Annual Cash Flow + Appreciation) / Total Investment
   - Appreciation = After Repair Value - Purchase Price
   - Purpose: Total return including appreciation

5. **Break Even Years**
   - Formula: Total Investment / Annual Cash Flow
   - Purpose: Years to recoup initial investment

6. **Effective Gross Income**
   - Formula: (Monthly Rent * (1 - Vacancy Rate) + Other Income) * 12
   - Purpose: Total potential annual income

7. **Operating Expense Ratio**
   - Formula: (Total Operating Expenses / Effective Gross Income) * 100
   - Purpose: Efficiency of property operations

## Notes

1. **Listing-Specific Values**
   - purchasePrice: Defaults to 0, populated from listing
   - rentEstimate: Defaults to 0, populated from Zestimate
   - propertyTaxes: Defaults to 0, populated from listing
   - hoaFees: Defaults to 0, populated from listing
   - afterRepairValue: Defaults to purchase price

2. **Percentage-Based Limits**
   - Most percentage inputs have reasonable limits based on industry standards
   - Currency inputs that are multipliers of other values (e.g., purchase price) are expressed as ratios

3. **Advanced Parameters**
   - Advanced parameters are hidden by default
   - Can be accessed through the "Advanced Settings" panel
   - Include more specialized metrics and inputs

4. **Input Validation**
   - All inputs are validated against min/max constraints
   - Currency inputs are rounded to nearest step value
   - Percentage inputs are validated to ensure reasonable ranges