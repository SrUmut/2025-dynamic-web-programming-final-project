#### Technologies Used

-   Javascript
-   Node.js
-   Vue.js
-   Express
-   PostgreSQL
-   Bootstrap

### Admin credentials:

-   Username: `admin`

-   Password: `admin123`

### Web UI Endpoints

-   For users:
    -   `/` see all flights, filter flights
    -   `/flight/:id` see detailed flight information and book a ticket
-   Fot admin:
    -   `/admin/login` admin login page
    -   `/admin/dashboard` see all flights, filter flights
    -   `/admin/flight/:id` see detailed flight information, tickets booked for that flight, update and delete the flight

### API Endpoints

-   city
    -   `GET /api/v1/city` get all cities
-   flight
    -   `GET /api/v1/flight` get all flights, can be filtered with query parameters
    -   `GET /api/v1/flight/:id` get detailed flight information for flight with the given id
    -   `POST /api/v1/flight` add a new flight (**JWT protected**)
    -   `DELETE /api/v1/flight` delete a flight (**JWT protected**)
    -   `PUT /api/v1/flight` update a flight (**JWT protected**)
-   ticket
    -   `GET /api/v1/ticket` get all tickets can be filter with flight_id query parameter
    -   `POST /api/v1/ticket` add a new ticket
-   admin
    -   `POST /api/v1/admin` add a new admin (not JWT protected for testing)
    -   `POST /api/v1/admin/login` login as admin

app.use("/api/v1/city", cityRouter);
app.use("/api/v1/flight", flightRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/admin", adminRouter);

# Guideline

1. [Clone The Repository](#1-clone-the-repository)
2. [Build Frontend](#2-build-frontend)
3. [Setup Postgres Database](#3-setup-postgres-database)
4. [Insert Flight Data to Test](#4-insert-flight-data-to-test)
5. [Run The Project](#5-run-the-project)

## 1. Clone The Repository

Clone the repository and get to the project root directory.

```
git clone "git@github.com:srumut/2025-dynamic-web-programming-final-project.git" umut_ozkan
cd umut_ozkan
```

## 2. Build Frontend

Install necessary modules and build the frontend.

```
cd backend
npm i
cd ../frontend
npm i
npm run build
cd ..
```

## 3. Setup Postgres Database

Easiest way is to create a postgres docker container. If you leave the password as down below project works by default. But if you change password, username or etc. you can enter the credentials into the .env file in the project root.

```
docker pull postgres
docker create -it -p 5432:5432 --name flight-booking-umut-ozkan -e POSTGRES_PASSWORD=mysecretpassword postgres
```

After you are done with the project you can delete the container,

```
docker rm light-booking-umut-ozkan
```

## 4. Insert Flight Data to Test

Get into the backend folder and run

```
cd backend
npm run insert_test_data
```

this will add 1000 flight record for test purposes.

## 5. Run The Project

While inside the backend folder

```
npm run start
```
