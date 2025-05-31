<script setup>
    import AdminNavbar from './components/AdminNavbar.vue';
    import { ref } from 'vue'

    const from_city = ref(0);
    const to_city = ref(0);
    const price = ref(0);
    const departure_time = ref("");
    const arrival_time = ref("");
    const cities = ref([]);

    const seats_available = ref(0);
    const seats_total = ref(0);

    const tickets = ref([]);

    const id = window.location.pathname.replace("/admin/flight/", "").split("/")[0];
    fetch("/api/v1/flight/" + id)
        .then(response => response.json())
        .then(data => {
            from_city.value = data.from_city;
            to_city.value = data.to_city;
            price.value = data.price;
            departure_time.value = formatDateTime(data.departure_time);
            arrival_time.value = formatDateTime(data.arrival_time);
            seats_available.value = data.seats_available;
            seats_total.value = data.seats_total;
        })
        .catch(async error => {
            alert("Something went wrong. Please try again later.");
        });
    
    fetch("/api/v1/city/")
        .then(response => response.json())
        .then(data => {
            cities.value = data;
        });
    
    fetch(`/api/v1/ticket?flight_id=${id}`)
        .then(response => response.json())
        .then(data => {
            tickets.value = data;
        });

    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hour}:${minute}`
    }

    function dateTimeDiff(timestamp1, timestamp2) {
        const date1 = new Date(timestamp1);
        const date2 = new Date(timestamp2);
        const diff = date2 - date1;
        const seconds = Math.floor(diff / 1000);
        let minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60; 
        return `${hours} hours ${minutes} minutes`;
    }

    function handleSubmit() {
        fetch("/api/v1/flight", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                from_city: from_city.value,
                to_city: to_city.value,
                price: price.value,
                departure_time: new Date(departure_time.value).toISOString(),
                arrival_time: new Date(arrival_time.value).toISOString(),
            }),
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    alert(`Error: ${data.error}`)
                    return;
                }
                alert(data.message);
            })
            .catch(error => {
                connsole.log(error);
                alert("Something went wrong");
            });
    }

    function deleteFlight() {
        const confirmed = confirm("Are you sure you want to delete this flight? This action cannot be undone.")
        if (!confirmed) return;
        fetch("/api/v1/flight", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            }),
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    alert(`Error: ${data.error}`)
                    return;
                }
                alert(data.message);
                window.location.href = "/admin/dashboard";
            })
            .catch(error => {
                connsole.log(error);
                alert("Something went wrong");
            });
    }
</script>

<template>
    <AdminNavbar />
     <div class="container-lg">
        <form @submit.prevent="handleSubmit">
            <table class="table table-hover table-sm table-borderless">
                <tbody>
                    <tr class="align-middle">
                        <th scope="row" class="w-25">From</th>
                        <td>
                            <select class="form-control border" id="from-city" name="from-city" v-model="from_city" required>
                                <option v-for="city in cities" :key="city.id" :value="city.id"> {{ city.city_name  }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="align-middle">
                        <th scope="row" class="w-25">To</th>
                        <td>
                            <select class="form-control border" id="to-city" name="to-city" v-model="to_city" required>
                                <option v-for="city in cities" :key="city.id" :value="city.id"> {{ city.city_name  }}</option>
                            </select>
                        </td>
                    </tr>
                    <tr class="align-middle">
                        <th scope="row" class="w-25">Price</th>
                        <td>
                            <input type="number" class="form-control" id="price" name="price" step="0.01" min="0" v-model="price" required>
                        </td>
                    </tr>
                     <tr class="align-middle">
                        <th scope="row" class="w-25">Remaining Seats</th>
                        <td>
                            {{seats_available}} out of {{ seats_total }}
                        </td>
                    </tr>
                     <tr class="align-middle">
                        <th scope="row" class="w-25">Departure Time</th>
                        <td>
                            <input type="datetime-local" class="form-control" id="departure-time" name="departure-time" v-model="departure_time" required>
                        </td>
                    </tr>
                     <tr class="align-middle">
                        <th scope="row" class="w-25">Arrival Time</th>
                        <td>
                            <input type="datetime-local" class="form-control" id="arrival-time" name="arrival-time" v-model="arrival_time" required>
                        </td>
                    </tr>
                     <tr class="align-middle">
                        <th scope="row" class="w-25">Duration</th>
                        <td>{{ dateTimeDiff(departure_time, arrival_time) }}</td>
                    </tr>
                </tbody>
            </table>
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-danger" :onclick="deleteFlight">Delete Flight</button>
        </form>
        <h3>Tickets</h3>
        <table class="table table-hover table-sm table-borderless text-center">
        <thead>
            <tr>
                <th scope="co text-success">Passenger Name</th>
                <th scope="col">Surname</th>
                <th scope="col">Email Address</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="ticket in tickets" :key="ticket.id" :id="ticket.id">
                <td>{{ ticket.passenger_name }}</td>
                <td>{{ ticket.passenger_surname }}</td>
                <td>{{ ticket.passenger_email }}</td>
            </tr>
        </tbody>
        </table>
     </div>
</template>