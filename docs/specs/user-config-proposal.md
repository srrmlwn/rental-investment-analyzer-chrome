I want to define a list of user editable configs as part of my product specs. This file tracks the list of configs.

For each config, I want to define the following attributes - 
1. Config Name - UI displayable text
2. Basic or Advanced Config - this determines whether the config shows up under the "Quick Adjustments" secion or the "Advanced" section
3. Default Value - either an absolute value of a calculation
4. Min Value - determines min value we presentt to user on a slider
5. Max Value - dettermines max value we present to the user on a slider.

## Investment Configuration Parameters

### Table Format
| Config Name | Category | Basic/Advanced | Default Value | Min Value | Max Value | Description | Calculation Impact |
|------------|----------|---------------|---------------|-----------|-----------|-------------|-------------------|
| **Purchase Parameters** |
| Down Payment Percentage | Purchase | Basic | 20% | 3.5% | 100% | Initial down payment as percentage of purchase price | Affects loan amount and monthly mortgage |
| Purchase Price | Purchase | Basic | Auto | - | - | Property purchase price (auto-filled from Zillow) | Base for all calculations |
| Closing Costs | Purchase | Advanced | 3% | 1% | 5% | Closing costs as percentage of purchase price | One-time cost added to initial investment |
| **Loan Parameters** |
| Mortgage Rate | Loan | Basic | 6.5% | 3% | 10% | Annual interest rate for mortgage | Affects monthly mortgage payment |
| Loan Term | Loan | Basic | 30 | 15 | 30 | Mortgage term in years | Affects monthly mortgage payment |
| Points | Loan | Advanced | 0 | 0 | 3 | Mortgage points paid at closing | One-time cost, reduces interest rate |
| **Operating Expenses** |
| Property Management Fee | Operating | Basic | 10% | 0% | 30% | Monthly management fee as percentage of rent | Monthly operating expense |
| Maintenance Reserve | Operating | Basic | 1% | 0.5% | 3% | Annual maintenance reserve as percentage of property value | Monthly operating expense |
| Vacancy Rate | Operating | Basic | 10% | 0% | 25% | Expected vacancy rate as percentage | Reduces effective rental income |
| Property Tax Rate | Operating | Advanced | Auto | - | - | Annual property tax rate (auto-filled if available) | Monthly operating expense |
| Insurance Rate | Operating | Advanced | 0.5% | 0.2% | 1% | Annual insurance as percentage of property value | Monthly operating expense |
| HOA Fees | Operating | Advanced | Auto | - | - | Monthly HOA fees (auto-filled if available) | Monthly operating expense |
| **Income Parameters** |
| Rental Income | Income | Basic | Auto | - | - | Monthly rental income (Zestimate/HUD) | Primary income source |
| Other Income | Income | Advanced | $0 | $0 | $1000 | Additional monthly income (e.g., parking, storage) | Additional income source |
| **Growth & Appreciation** |
| Annual Appreciation | Growth | Advanced | 3% | 0% | 10% | Expected annual property value appreciation | Affects long-term returns |
| Annual Rent Growth | Growth | Advanced | 2% | 0% | 5% | Expected annual rental income growth | Affects long-term returns |
| Annual Expense Growth | Growth | Advanced | 2% | 0% | 5% | Expected annual expense growth | Affects long-term returns |
| **Tax Parameters** |
| Marginal Tax Rate | Tax | Advanced | 24% | 10% | 37% | Investor's marginal tax bracket | Affects tax benefits |
| Depreciation Period | Tax | Advanced | 27.5 | 27.5 | 27.5 | Years for depreciation (fixed for residential) | Affects tax benefits |
| **Analysis Parameters** |
| Analysis Period | Analysis | Advanced | 30 | 5 | 30 | Years for investment analysis | Affects long-term metrics |
| Exit Cap Rate | Analysis | Advanced | 5% | 3% | 8% | Expected cap rate at sale | Affects exit value |


### Notes
1. **Auto-filled Values**: Some parameters are automatically populated from Zillow data or public records
2. **Basic vs Advanced**: 
   - Basic parameters appear in "Quick Adjustments" section
   - Advanced parameters are in collapsible "Advanced Settings" section
3. **Calculation Impact**: Each parameter affects specific investment metrics
4. **Validation Rules**:
   - All percentages are stored as decimals (e.g., 20% = 0.20)
   - Currency values are stored in cents to avoid floating-point issues
   - Some parameters have fixed values (e.g., Depreciation Period)
5. **Presets**:
   - Conservative: Higher down payment, lower leverage, higher reserves
   - Moderate: Balanced approach with standard defaults
   - Aggressive: Lower down payment, higher leverage, lower reserves

### Implementation Considerations
1. **Storage**: All configurations will be stored in Chrome's sync storage
2. **Validation**: Each parameter will have client-side validation
3. **Persistence**: Users can save their preferred settings as defaults
4. **Reset**: Factory defaults can be restored at any time
5. **Import/Export**: Future feature to allow configuration sharing
