<script setup>
    function handleSubmit() {
        fetch("/api/v1/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
            })
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    alert(data.message);
                    return;
                }
                window.location.href = "/admin/dashboard";
            })
            .catch(error => {
                connsole.log(error);
                alert("Something went wrong");
            });
    }
</script>

<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="row w-100">
            <div class="col-12 col-md-6 col-lg-4 mx-auto">
                <h1 class="text-center mb-4">Admin Login</h1>
                <form  @submit.prevent="handleSubmit">
                    <div class="form-group mb-3">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" name="username" placeholder="Enter username" required>
                    </div>
                    <div class="form-group mb-3">
                        <label for="Password">Password</label>
                        <input type="password" class="form-control" id="password" name="password" placeholder="Enter password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>
