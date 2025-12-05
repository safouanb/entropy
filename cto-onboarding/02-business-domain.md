# Business Domain Guide

## The Problem Space

### Waste Heat Challenge

**Data Centers Generate Massive Heat:**
- A typical 10MW data center produces ~10,000 kW of waste heat
- 30-40% of total power consumption becomes heat
- Currently expelled to atmosphere via cooling towers
- Represents enormous energy waste

**Cities Need Heat:**
- Residential/commercial buildings require heating
- Typically supplied by natural gas boilers (fossil fuels)
- District heating networks exist but need heat sources
- Growing demand for renewable heat solutions

**The Gap:**
- No easy way to analyze feasibility of connecting them
- Complex calculations involving energy, finance, carbon
- Geographic optimization required
- Multi-stakeholder coordination needed

### Market Opportunity

**Regulatory Drivers:**
- Carbon reduction mandates
- Renewable energy targets
- Data center sustainability requirements
- Carbon pricing mechanisms

**Economic Drivers:**
- Rising natural gas prices
- Carbon credit value
- Data center cooling costs (waste heat = free cooling)
- Infrastructure investment opportunities

**Examples of Existing District Heating:**
- Denmark: 64% of households use district heating
- Iceland: 90% geothermal district heating
- Paris: Large network expanding
- San Francisco: Small networks, growth potential

## User Personas

### 1. Infrastructure Investor

**Goals:**
- Identify profitable waste heat recovery projects
- Calculate ROI and payback period
- Assess risk vs. return

**Key Metrics:**
- Net Present Value (NPV)
- Internal Rate of Return (IRR)
- Payback period
- CAPEX requirements

**Workflow:**
1. Browse data centers in target geography
2. Analyze waste heat potential
3. Review nearby heat consumers
4. Run financial scenarios
5. Generate investment thesis

### 2. Data Center Operator

**Goals:**
- Monetize waste heat
- Reduce cooling costs
- Improve sustainability metrics

**Key Metrics:**
- Heat sales revenue
- Cooling cost reduction
- CO2 reduction for ESG reporting
- Temperature impact on operations

**Workflow:**
1. Input data center specifications
2. Discover nearby heat sinks
3. Evaluate heat sale opportunities
4. Assess operational impact

### 3. District Heating Company

**Goals:**
- Find new heat sources
- Reduce fossil fuel dependency
- Expand service area

**Key Metrics:**
- Heat supply reliability
- Pipeline routing costs
- Temperature compatibility
- Seasonal availability

**Workflow:**
1. Map existing heat network
2. Identify data center heat sources
3. Calculate integration costs
4. Plan expansion routes

### 4. City Planner / Government

**Goals:**
- Reduce carbon emissions
- Energy independence
- Sustainable infrastructure

**Key Metrics:**
- Total CO2 reduction
- Renewable energy percentage
- Jobs created
- Public health impact

**Workflow:**
1. View system-wide analysis
2. Identify priority projects
3. Evaluate policy incentives
4. Track progress toward climate goals

### 5. Carbon Credit Trader

**Goals:**
- Quantify carbon reduction
- Value carbon credits
- Verify additionality

**Key Metrics:**
- Annual CO2 reduction (tons)
- Carbon credit value ($)
- Verification standards
- Project lifecycle

**Workflow:**
1. Review heat recovery projects
2. Calculate carbon impact
3. Estimate credit value
4. Structure carbon finance deals

## Core Concepts

### Energy Model

**Power Consumption Chain:**
```
IT Equipment Power (kW)
    × PUE (Power Usage Effectiveness)
    = Total Facility Power

Total Facility Power
    - IT Equipment Power
    = Waste Heat Available

Waste Heat Available
    × Capture Efficiency
    = Recoverable Heat
```

**Key Parameters:**
- **IT Load:** Computing equipment power draw
- **PUE:** Industry standard efficiency metric (typical: 1.2-1.8)
- **Utilization Factor:** % of rated capacity in use
- **Capture Efficiency:** % of waste heat recoverable (typical: 60-80%)

### Heat Distribution Model

**Transmission Losses:**
```
Heat Generated at Source
    - Pipeline Heat Loss (distance-dependent)
    = Heat Delivered to Consumer
```

**Loss Factors:**
- Pipeline insulation quality
- Ambient temperature
- Distance traveled
- Flow rate

**Temperature Requirements:**
- Data center cooling: 15-25°C outlet
- District heating network: 70-90°C required
- Heat pump may be needed to boost temperature
- Seasonal variation in demand

### Financial Model

**CAPEX (Capital Expenditure):**
- Pipeline construction: $1,000-$3,000 per meter
- Heat exchanger installation: $100,000-$500,000
- Pumping stations: $50,000-$200,000
- Control systems: $20,000-$100,000
- Permits and planning: 10-20% of construction

**OPEX (Operating Expenditure):**
- Pumping energy: $0.05-$0.10 per kWh
- Maintenance: 2-5% of CAPEX annually
- Monitoring and control: $10,000-$50,000/year
- Insurance: Variable

**Revenue:**
- Heat sales: $20-$60 per MWh (market-dependent)
- Carbon credit sales: $10-$100 per ton CO2 (market-dependent)
- Cooling cost savings: $10-$30 per MWh

**NPV Calculation:**
```
NPV = Σ [(Revenue - OPEX) / (1 + discount_rate)^year] - CAPEX

Where:
- Revenue: Annual heat sales + carbon credits
- OPEX: Annual operating costs
- Discount rate: Cost of capital (typically 5-10%)
- Year: 1 to project lifetime (typically 20-30 years)
```

**IRR (Internal Rate of Return):**
The discount rate that makes NPV = 0
- Good project: IRR > 12%
- Acceptable: IRR > 8%
- Marginal: IRR 5-8%

**Payback Period:**
Number of years until cumulative cash flow becomes positive

### Carbon Model

**CO2 Reduction Calculation:**
```
Heat Delivered (MWh/year)
    × Natural Gas Carbon Intensity (kg CO2 / MWh)
    × Displacement Factor
    = Annual CO2 Reduction (kg/year)
```

**Displacement Factor:**
- 100% if replacing natural gas boiler
- 70-90% if replacing heat pump
- 50-70% if replacing combined heat & power

**Carbon Credit Value:**
- EU ETS: €50-€100 per ton CO2 (2024)
- California: $30-$40 per ton CO2
- Voluntary market: $10-$50 per ton CO2
- Varies by verification standard

### Geospatial Model

**Distance Calculation (Haversine Formula):**
```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c

Where R = Earth's radius (6371 km)
```

**Proximity Scoring:**
- Distance < 1 km: Excellent (low CAPEX)
- Distance 1-3 km: Good (moderate CAPEX)
- Distance 3-5 km: Fair (higher CAPEX)
- Distance > 5 km: Poor (may not be economical)

**Route Optimization:**
- Minimize total pipeline length
- Avoid obstacles (rivers, highways, restricted zones)
- Consider existing infrastructure
- Account for elevation changes

## Key Workflows

### Workflow 1: New Project Feasibility Analysis

**Actor:** Infrastructure Investor

**Steps:**
1. **Select Geography**
   - Choose city/region of interest
   - View map of data centers and heat consumers

2. **Input Data Center Details**
   - IT load capacity (MW)
   - PUE rating
   - Current cooling system
   - Operating schedule (24/7, seasonal)
   - Geographic coordinates

3. **Discover Heat Sinks**
   - System finds nearby consumers within radius (e.g., 5 km)
   - Ranks by compatibility score
   - Shows demand profiles

4. **Configure Scenario**
   - Heat price ($/MWh)
   - Pipeline cost ($/meter)
   - Discount rate (%)
   - Project lifetime (years)
   - Carbon credit price ($/ton)

5. **Review Analysis**
   - NPV calculation
   - IRR percentage
   - Payback period
   - Annual CO2 reduction
   - Sensitivity analysis (what-if scenarios)

6. **Generate Report**
   - Executive summary
   - Financial projections
   - Carbon impact
   - Risk assessment

**Expected Output:**
- Investment decision (go/no-go)
- Funding requirements
- Expected returns
- Risk factors

### Workflow 2: Optimize Existing Network

**Actor:** District Heating Company

**Steps:**
1. **Map Current Network**
   - Input existing heat centers
   - Input current demand sites
   - Define existing routes

2. **Add New Heat Source (Data Center)**
   - Identify candidate data centers
   - Input specifications
   - Calculate integration costs

3. **Evaluate Impact**
   - Increased capacity
   - Reduced fossil fuel use
   - Distribution optimization
   - System efficiency gains

4. **Plan Expansion**
   - Route new pipelines
   - Size heat exchangers
   - Schedule construction
   - Budget allocation

**Expected Output:**
- Network expansion plan
- Budget requirements
- Timeline
- Performance improvements

### Workflow 3: ESG Reporting

**Actor:** Data Center Operator

**Steps:**
1. **Input Current Operations**
   - Energy consumption
   - Cooling systems
   - Current carbon footprint

2. **Model Heat Recovery Project**
   - Heat sales to district network
   - Waste heat captured
   - Carbon credits generated

3. **Calculate ESG Metrics**
   - Scope 2 emissions reduction
   - Renewable energy percentage
   - Circular economy contribution
   - Community impact

4. **Generate ESG Report**
   - Carbon reduction (tons CO2/year)
   - Energy efficiency improvement
   - Sustainability narrative
   - Verification documentation

**Expected Output:**
- ESG report sections
- Carbon accounting
- Verification data
- Marketing materials

## Domain-Specific Terminology

**Energy Terms:**
- **PUE (Power Usage Effectiveness):** Ratio of total facility power to IT equipment power
- **IT Load:** Computing equipment power consumption
- **Waste Heat:** Excess heat from IT equipment
- **COP (Coefficient of Performance):** Heat pump efficiency metric

**District Heating Terms:**
- **Heat Center:** Central heat generation facility
- **Demand Site:** Heat consumer (building, neighborhood)
- **Route:** Pipeline connecting source to consumer
- **Supply Temperature:** Hot water temperature leaving heat center
- **Return Temperature:** Cooler water temperature returning to heat center
- **Heat Loss:** Energy lost during transmission

**Financial Terms:**
- **NPV (Net Present Value):** Present value of future cash flows minus investment
- **IRR (Internal Rate of Return):** Discount rate that makes NPV = 0
- **Discount Rate:** Time value of money (opportunity cost)
- **CAPEX:** Capital expenditure (upfront costs)
- **OPEX:** Operating expenditure (recurring costs)
- **Payback Period:** Time to recover initial investment

**Carbon Terms:**
- **Carbon Intensity:** kg CO2 per unit energy
- **Displacement Factor:** % of fossil fuel replaced
- **Additionality:** Proof that carbon reduction wouldn't happen otherwise
- **Verification Standard:** Carbon credit quality certification (Gold Standard, VCS, etc.)

## Industry Standards & Regulations

**Energy Efficiency:**
- EU Code of Conduct for Data Centres
- ASHRAE TC 9.9 (thermal guidelines)
- ISO 50001 (energy management)

**District Heating:**
- EN 13941 (district heating design standards)
- ISO 13600 (technical specifications)

**Carbon Accounting:**
- GHG Protocol (Scope 1/2/3 emissions)
- ISO 14064 (carbon accounting)
- Carbon credit standards (Gold Standard, VCS, ACR)

**Data Center Operations:**
- Uptime Institute Tier Standards
- EU Energy Efficiency Directive
- Local environmental regulations

## Business Rules

### Feasibility Thresholds

**Minimum Viable Project:**
- Heat available: > 1 MW continuous
- Distance to consumer: < 5 km
- Demand site capacity: > 500 kW
- Project IRR: > 8%
- Payback period: < 15 years

**Preferred Project:**
- Heat available: > 5 MW continuous
- Distance to consumer: < 2 km
- Demand site capacity: > 2 MW
- Project IRR: > 12%
- Payback period: < 10 years

### Compatibility Rules

**Temperature Compatibility:**
- Data center outlet: 15-25°C
- District heating requirement: 70-90°C
- Heat pump required if ΔT > 30°C
- COP consideration: Higher COP = better economics

**Temporal Compatibility:**
- Data center availability: 24/7 preferred
- Seasonal demand: Match summer/winter profiles
- Peak demand alignment: Critical for sizing
- Base load vs. peak load applications

**Geographic Compatibility:**
- Distance: Primary cost driver
- Elevation: Pumping costs increase with height difference
- Urban density: Higher density = more consumers
- Zoning: Permits and right-of-way

## Data Sources

**Geographic Data:**
- OpenStreetMap (building locations)
- Google Maps API (geocoding)
- City GIS databases (infrastructure)

**Energy Data:**
- Data center PUE databases
- Utility rate schedules
- Energy demand profiles

**Financial Data:**
- Construction cost databases (RSMeans, etc.)
- Energy market prices
- Carbon credit market prices

**Climate Data:**
- Heating degree days
- Seasonal temperature profiles
- Climate zone classification

---

**Next Document:** [03-technology-stack.md](03-technology-stack.md) - Deep dive into the technology choices
