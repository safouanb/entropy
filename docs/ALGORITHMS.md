# Algorithms & Modeling Assumptions

This document details the scientific, engineering, and financial models used by **PyRecycleHeat** to estimate the feasibility of Data Center heat reuse networks.

## 1. Heat Recovery Model

We calculate the thermal energy available for recovery based on thermodynamics and typical data center operations.

### Formula
$$ Q_{\text{recoverable}} = P_{\text{IT}} \times U \times \eta_{\text{capture}} \times \eta_{\text{transmission}} $$

Where:
- **$P_{\text{IT}}$ (Total IT Load)**: The simplified maximum power capacity of the data center (kW).
- **$U$ (Utilization)**: Percentage of capacity in active use (default: **70%**).
- **$\eta_{\text{capture}}$ (Capture Efficiency)**: Efficiency of heat exchangers extracting heat from cooling loops (assumed **95%** for modern liquid/air systems).
- **$\eta_{\text{transmission}}$ (Transmission Efficiency)**: Efficiency after pipeline heat loss (see Section 2).

### Variables
- **Operating Hours**: Defaults to **8,760 hours/year** (24/7 operation).
- **Waste Heat Factor**: We assume **100%** of IT electrical load is converted to heat (First Law of Thermodynamics).

---

## 2. Geospatial Transmission Model

Transporting hot water over distances results in thermal energy loss. We utilize a linear loss model based on distance.

### Distance Calculation
We use the **Haversine Formula** to calculate the Great Circle distance ($d$) between the Data Center (Lat1, Lon1) and Heat Sink (Lat2, Lon2).

### Efficiency Formula
$$ \eta_{\text{transmission}} = 1 - (d \times \text{LossFactor}) $$

- **Loss Factor**: **5% per km** ($0.05/km$).
- **Minimum Efficiency Floor**: We cap max loss at **50%** (efficiency $\ge 0.5$) to prevent negative energy values in edge cases, though projects >10km are rarely feasible.

---

## 3. Financial Model

We estimate the return on investment (ROI) for building the district heating network connection.

### CAPEX (Capital Expenditure)
Construction costs are the primary driver of feasibility.
- **Pipeline Cost**: **€1,500,000 per km**.
    - *Source*: Pipe material for DN300-DN400 is approx. €600k-€900k/km [[NPro Energy](https://npro.energy/ex/district_heating_pipes)].
    - *Installation*: Urban/Peri-urban civil works ("Hard Dig") typically add 50-100% to material costs [[SEAI](https://www.seai.ie/publications/District-Heating-Guide.pdf)].
    - *Note*: Dense city center distribution networks can exceed €5M/km [[Eurostat/JRC](https://publications.jrc.ec.europa.eu/repository/handle/JRC118823)], but we model a point-to-point transmission line.
- **Connection Cost**: **€500,000 (Fixed)**. Covers district heating substation interface (HEX, pumps, local grid integration) excluding heat generation plant.

$$ \text{Total CAPEX} = \text{Fixed Cost} + (d \times \text{Cost}_{\text{pipe/km}}) $$

### OPEX & Revenue
- **Revenue**: Derived from **Natural Gas Savings**.
  - We convert recovered heat (kWh) to equivalent Gas Terms.
  - **Gas Price**: Assumed **€1.20 per Therm** (approx. €0.04/kWh gas equivalent).
- **Carbon Credits**: Revenue from selling verified emission reductions (not included in reduced quick analysis, added in full scenarios).

### Financial Metrics
- **NPV (Net Present Value)**: Sum of discounted future cash flows over the **Analysis Period** (default 10 years) at a **Discount Rate** (default 8%).
- **IRR (Internal Rate of Return)**: The discount rate at which NPV equals zero.
- **Payback Period**: $\frac{\text{Total CAPEX}}{\text{Annual Net Savings}}$.

---

## 4. Environmental Impact

### Carbon Avoidance
We calculate $\text{CO}_2$ avoided by displacing natural gas boiler usage.

- **Grid Emission Factor**: **0.4 kg $\text{CO}_2$/kWh** (Average conservative boiler efficiency & gas carbon intensity).
- **Displacement Ratio**: 1 kWh of Waste Heat = 1 kWh of Gas Heat (simplified).

$$ \text{Annual CO}_2 \text{ Saved (kg)} = \text{Recoverable Heat (kWh)} \times 0.2 \text{ (avg gas intensity)} $$
*(Note: Engine uses specific Therm-to-CO2 conversion factor of ~5.3 kg/Therm).*
