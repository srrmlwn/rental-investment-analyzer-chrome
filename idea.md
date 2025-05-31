# Rental Investment Analyzer Chrome Plugin

## Idea
I want to build a browser plug in, to help me analyze cash flow, cap rate, cash-on-cash return, etc on rental investment properties. 

I want the plug in to support configurations of key inputs, such as down payment %age, mortgage rate, operational expenses etc. Assume meaningful defaults, so the user doesn't need to manually input a lot of configurations.

To begin with, lets assume the plugin will work on Zillow Listing Page. Eventually, I want to expand to zillow search page, and other real estate websites, such as Redfin.

Lets start on the project incrementally - 
1. Create a product specifications document for this idea under product-specs.md
2. Create a high level technical architecutre based on the product specs. Call this tech-architecture.md
3. Create a task break down structure under task-breakdown.md. SPlit the implementation in to phases.
4. Create a cursor rules file before starting any code.
5. Start implementing phase by phase, and commit to github as we make progress. 

----

## Questions to Refine the Idea

### User Experience & Interface
1. What specific metrics should be displayed prominently on the Zillow listing page? (e.g., cash flow, cap rate, cash-on-cash return)
COMMENT: Lets start with just cash flow. Eventually I want to support cap rate, cash on cash, NRR, etc.

2. Should the plugin show a summary card/overlay on the listing page, or should it open in a separate panel/sidebar?
COMMENT: Oh good question. What would you recommend. I prefer minimal, yet sleek CX?

3. How should the plugin handle cases where some required data is missing from the listing?
COMMENT: Good question. I expect listing price, # of bed rooms, # of bathrooms etc to be mandatorily present - if not, show an error message, as the lising is invalid. For rental estimate, use Zestimate where available. If not, can youo suggest back up data sets/APIs we could invoke? I am thinking HUD data by zip code is a poential option?


4. Should users be able to save/compare multiple properties they're analyzing?
COMMENT: Nah, I am not worried about user saving analysis now. Lets keep the plugin simple, and stateless for the most part.

### Configuration & Customization
1. What are the essential default values we should set for:
   - Down payment percentage
   - Mortgage rate
   - Property tax rate
   - Insurance costs
   - Property management fees
   - Maintenance reserves
   - Vacancy rate
COMMENT: Yep sounds good.


2. Should users be able to save their own default configurations?
COMMENT: Yeah lets assume user can update default configurations. And they can override the values for individual properties as they do their analysis.

3. How should we handle location-specific variables (e.g., property tax rates that vary by state/county)?
COMMENT: Can we use any publicly available data sets for this?

### Data & Calculations
1. What specific data points do we need to extract from Zillow listings?
COMMENT: all the required data - listing price, bedrooms, bathrooms, etc. property tax if available, rent zestimate if available, etc. Use meaningful data sets as fallback where certain data points are not available.

2. Are there any assumptions we should make for data points not provided in the listing?
COMMENT: already answered above.


3. Should we include any market-level data in our calculations (e.g., average rental rates for the area)?
COMMENT: yes absolutely. If zestimate is not available, lets use a meaningful data set, like HUD.


4. How should we handle different property types (single-family, multi-family, condos)?
COMMENT: i dont think there is a difference in how we handle them, is there?

### Future Expansion
1. What specific features should we prioritize for the Zillow search page integration?
2. What other real estate websites should we target after Zillow, and in what order?
3. Should we consider adding features like:
   - Historical property data analysis
   - Market trend comparisons
   - Rental rate analysis for the area
   - Property value appreciation projections

### Technical Considerations
1. Should the plugin store any user data locally or in the cloud?
2. Do we need to implement any rate limiting or API usage restrictions?
3. Should we consider adding export functionality for the analysis results?
4. How should we handle updates to Zillow's website structure that might break our data extraction?

Please provide your thoughts on these questions to help us create a more detailed product specification document. 

### Follow-up Questions for MVP

1. **UI/UX Decisions**:
   - For the minimal yet sleek UX, would you prefer:
     a) A small floating button that expands into a card when clicked
     b) A fixed sidebar that slides in from the right
     c) A small overlay card that appears below the property details
   - Should the plugin automatically analyze the property when the page loads, or should it wait for user interaction?
COMMENT: Fixed side bar from the right   

2. **Default Configuration Values**:
   - What should be our initial default values for:
     - Down payment percentage (e.g., 20%?) 
COMMENT: yes 20%
     - Mortgage rate (should we fetch current rates from an API?)
COMMENT: Assume 6.5%
     - Property management fees (e.g., 8-10% of rent?)
COMMEN: 10% of rent
     - Maintenance reserves (e.g., 1% of property value annually?)
COMMENT: yes sounds good     
     - Vacancy rate (e.g., 5%?)
COMMENT: lets assume 10%     

3. **Data Extraction**:
   - Should we show a loading state while fetching Zestimate data?
COMMENT: Sure - but i expect this to be a low latency operation
   - How should we display the confidence level of our rental estimates (when using Zestimate or HUD data)?
COMMENT: More than confidence level - which is hard to evaluate, lets just show the source of our data (e.g., Zestimate or HUD)   
   - Should we show the source of the rental estimate (Zestimate vs HUD data) to the user?
COMMENT: Oh yes :)

4. **Error Handling**:
   - What should be the exact error message when mandatory data is missing?
COMMENT: Make up something meaningful
   - Should we provide any guidance to users when they see an error (e.g., "Try refreshing the page" or "This listing might be incomplete")?
COMMENT: Yeah listing might be incomplete.

These questions will help us create a more detailed product specification for the MVP. Once we have these answers, we can move forward with creating the product-specs.md document. 