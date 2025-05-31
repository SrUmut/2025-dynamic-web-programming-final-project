<script setup>
    import { ref, onMounted } from 'vue'
    import AdminNavbar  from './components/AdminNavbar.vue';
    
    const flights = ref([]);

    onMounted(() => {
        fetch("/api/v1/flight/" + window.location.search)
            .then(response => response.json())
            .then(data => {
                flights.value = data;
            })
    })

    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString("tr-TR",{
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
        return `${hours}h ${minutes}m`;
    }

    function goToFlight(id) {
        window.location.href = `/admin/flight/${id}`;
    }
</script>

<template>
    <AdminNavbar />
    <div class="container-lg">
        <table class="table table-hover table-sm table-borderless text-center">
        <thead>
            <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Departure</th>
                <th scope="col">Arrival</th>
                <th scope="col">Duration</th>
                <th scope="col">Price</th>
                <th scope="col">Seats Available</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="flight in flights" :key="flight.id" :id="flight.id" @click="goToFlight(flight.id)">
                <td>{{ flight.from_city }}</td>
                <td>{{ flight.to_city }}</td>
                <td>{{ formatDateTime(flight.departure_time) }}</td>
                <td>{{ formatDateTime(flight.arrival_time )}}</td>
                <td>{{ dateTimeDiff(flight.departure_time, flight.arrival_time) }}</td>
                <td>{{ flight.price }}</td>
                <td>{{ flight.seats_available }}</td>
            </tr>
        </tbody>
        </table>
    </div>
</template>
