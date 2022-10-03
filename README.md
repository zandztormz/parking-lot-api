# parking-lot-api
api for manage parking lot an API document example is available [here](https://documenter.getpostman.com/view/1117961/2s83tCLYrt)

## Getting started
Install [Docker](https://github.com/docker) then run `docker-compose up`

## Unit test
```
docker exec -it parking-lot-api sh
> npm run test
```
## API
- POST `/parking` for creating a parking lot and the quantity of slot for each slot size (you can specify a size of slot dynamically).
- GET `/parking/status` for getting the status of parking slots.
- GET `/parking/allocated?size=xl` for getting allocated slots by size (the response includes the floor, slot, and registration plate numbers).
- POST `/car/park` for allocate a nearest available slot (floor, slot number)  when a car is parked by size (s, m, l), floor to enter.
- POST `/car/leave` for releasing a slot (a car leaves the parking slot).
- POST `/ticket?size=xl` for getting registration plate number and total of car parked

