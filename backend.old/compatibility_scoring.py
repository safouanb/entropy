import math

#constants
hours_in_a_year = 8760
price_scale = 50
radius_earth = 6378
dmax = 20 # maximum distance between 2 facilities that will still be profitable
k = 5 # controls how fast temperature affects score_temp

## turn inputs into floats
def get_float(prompt):
    while True: 
        try: 
            s = input(prompt) 
            return float(s)
        except ValueError: 
            print("Please enter a valid number (e.g., 42 or 3.14).")


def haversine_km(lat1, lon1, lat2, lon2): ## kinda unnecessary cus distance is so short curvature of earth is p much negligible
    """Return thedistance between two points in km factring in earth curvature."""
    # convert degrees -> radians
    psi1, psi2 = math.radians(lat1), math.radians(lat2)
    delta_psi = math.radians(lat2 - lat1)
    del_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_psi/2)**2 + math.cos(psi1) * math.cos(psi2) * math.sin(delta_psi/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    R = 6371.0  
    return R * c

## source data
source_id = input("Name of data center: ")
source_temp = get_float("Please enter the source temperature in Celsius: ")
source_capacity = get_float("Please enter the source heat capacity in Watts: ")
source_availability = get_float("Please input how many hours a year the data center operates: ")
source_price = get_float("Please enter your desired price of heat in USD: ")

source_lat = get_float("Latitude of your data center: ") #location
source_lon = get_float("Longitude of your data center: ") #location

## sink data
sink_id = input("Name of your facility: ")
sink_temp = get_float("Please enter the sink temperature in Celsius: ")
sink_capacity = get_float("Please enter the sink heat capacity in Watts: ")
sink_price = get_float("Please enter your desired price of heat in USD: ")

sink_lat = get_float("Latitude of your facility: ") #location
sink_lon = get_float("Longitude of your facility: ") #location


## calculations
delta_T = sink_temp - source_temp 
distance = haversine_km(source_lat, source_lon, sink_lat, sink_lon)
# calculating the 5 different score factors:
score_temp = 1/(1+ math.exp((-1/k)* delta_T)) 
score_capacity = min(1, source_capacity/sink_capacity)
score_availability = (source_availability/hours_in_a_year)
score_price = 1/(1 + (source_price - sink_price)/price_scale)

if distance > dmax:
    score_distance = 0 
else: 
    score_distance = math.exp(-(distance/ 20.0))


## Score weights
w_distance = 0.50
w_capacity = 0.15
w_temp = 0.10
w_availability = 0.15
w_price = 0.10

score = (score_distance*w_distance) + (score_capacity*w_capacity) + (score_temp*w_temp) + (score_availability*w_availability)+ (score_price*w_price) 


## Score reporting
print("\n---Scores---")
print(f"Temperature Score: {score_temp: .2f}")
print(f"Capacity Score: {score_capacity: .2f}")
print(f"Distance Score: {score_distance: .2f}")
print(f"Availability Score: {score_availability: .2f}")
print(f"Price Score: {score_price: .2f}")
print(f"Compatibility Score: {score: .2f}")

if score< 0.4:
    print(f" Your score of {score : .2f} is very low. This match is incompatible")

if 0.4 <= score < 0.7:
    print(f" Your score of {score: .2f} is low. This match is not recommended. ")

if 0.7<= score <0.85:
    print(f" Your score of {score: .2f} is good. This match is acceptable. ")

if 0.85<= score< 1:
    print(f" Your score of {score: .2f} is very good. This match is recommended. ")
