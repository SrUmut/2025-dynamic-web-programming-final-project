<script setup>
    import Navbar from "./components/Navbar.vue";
    import { ref, onMounted } from 'vue'

    const flight = ref({});

    onMounted(() => {
        const id = window.location.pathname.replace("/flight/", "").split("/")[0];
        fetch("/api/v1/flight/" + id)
            .then(response => response.json())
            .then(data => {
                flight.value = data;
            })
            .catch(async error => {
                alert("Something went wrong. Please try again later.");
            });
    })

    function handleSubmit() {
        const confirmed = confirm("Are you certain your information is correct? You cannot change it later.");
        if (!confirmed) return;
        fetch("/api/v1/ticket", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                flight_id : flight.value.id,
                passenger_name: document.getElementById("passenger_name").value,
                passenger_surname: document.getElementById("passenger_surname").value,
                passenger_email: document.getElementById("email").value,
            })

        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    alert(`Error ${data.error}`);
                    return;
                }
                alert(data.message);
                window.location.href = window.location.href;

            })
            .catch(async error => {
                console.error('Error:', error);s
                alert("Something went wrong. Please try again later.");
            });
    }

    function formatDateTime(timestamp) {
        console.log(timestamp);
        const date = new Date(timestamp);
        return date.toLocaleString("tr-TR",{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
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
</script>

<template>
    <Navbar />
     <div class="container-lg">
        <table class="table table-hover table-sm table-borderless">
            <tbody>
                <tr>
                    <th scope="row" class="w-25">From</th>
                    <td>{{ flight.from_city }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">To</th>
                    <td>{{ flight.to_city }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">Price</th>
                    <td>{{ flight.price }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">Remaining Seats</th>
                    <td>{{ flight.seats_available }} out of {{ flight.seats_total }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">Departure Time</th>
                    <td>{{ formatDateTime(flight.departure_time) }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">Arrival Time</th>
                    <td>{{ formatDateTime(flight.arrival_time) }}</td>
                </tr>
                <tr>
                    <th scope="row" class="w-25">Duration</th>
                    <td>{{ dateTimeDiff(flight.departure_time, flight.arrival_time) }}</td>
                </tr>
            </tbody>
        </table>
        <div class="w-50 mx-auto">
            <form  @submit.prevent="handleSubmit">
                <div class="form-group mb-3">
                    <label for="passenger_name">Name</label>
                    <input type="text" class="form-control" id="passenger_name" name="passenger_name" placeholder="Thomas" required>
                </div>
                <div class="form-group mb-3">
                    <label for="passenger_surname">Surname</label>
                    <input type="text" class="form-control" id="passenger_surname" name="passenger_surname" placeholder="Anderson" required>
                </div>
                <div class="form-group mb-3">
                    <label for="email">Email address</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Enter email" required>
                </div>
                <button type="submit" class="btn btn-primary">Book Flight</button>
            </form>
        </div>
     </div>
    
</template>
