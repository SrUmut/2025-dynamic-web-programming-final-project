<script setup>
    function handleSubmit() {
        let url = "/admin/dashboard?";
        const from_city_name = document.getElementById("from-city").value;
        if (from_city_name !== "") {
            url += `from_city=${from_city_name}&`;
        }
        const to_city_name = document.getElementById("to-city").value;
        if (to_city_name !== "") {
            url += `to_city=${to_city_name}&`;
        }
        const date  = document.getElementById("flight-date").value;
        if (date !== "") {
            url += `date=${date}`;
        }
        window.location.href = url;
    }
</script>

<template>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="/admin/dashboard">Flight Booking: Admin Dashboard</a>
            <!-- Left side: Filter button -->
            <button class="btn btn-primary ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#searchOffcanvas">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50" style="fill: white;">
                    <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
                </svg>
            </button>
        </div>
    </nav>

    <!-- Offcanvas Sidebar (Filter Panel) -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="searchOffcanvas">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">Search Filters</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <form id="search-form" @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="from-city" class="form-label">From</label>
                    <select class="form-control" id="from-city" name="from-city">
                        <option value="" selected disabled>Departure City</option>
                        <option v-for="city in cities" :key="city.id" :value="city.city_name" :id="'from-'+city.id"> {{ city.city_name  }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="to-city" class="form-label">To</label>
                    <select class="form-control" id="to-city" name="to-city">
                        <option value="" selected disabled>Arrival City</option>
                        <option v-for="city in cities" :key="city.id" :value="city.city_name" :id="'to-'+city.id"> {{ city.city_name  }}</option>
                    </select>
                </div>
                <div class="mb-3">
                <label for="flight-date" class="form-label">Flight Date</label>
                <input
                    type="date"
                    class="form-control"
                    id="flight-date"
                    name="flight-date"
                />
                </div>
                <button type="submit" class="btn btn-primary mt-2">Search</button>
            </form>
        </div>
    </div>
</template>