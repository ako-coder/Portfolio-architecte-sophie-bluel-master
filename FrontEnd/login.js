function login(username, password) {
    fetch('http://localhost:5678/api/users/login', {

        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("token", JSON.stringify(data.token));
        })
        .catch(error => {
            const errorMessage = document.getElementById("error_message");           
            errorMessage.innerText = error.message;
            console.error('Erreur lors de la requête fetch :', error)
        });
};

document.getElementById("login_form").addEventListener("submit", function (event) {
    event.preventDefault();
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    login(username, password);
})