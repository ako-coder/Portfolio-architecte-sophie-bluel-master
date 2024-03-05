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
        .then(response => {
            let reponseServeur = response.json()
            console.log(response.status)
            if (response.status === 200) {
                reponseServeur.then(data => {
                    console.log(data);
                    localStorage.setItem("token", JSON.stringify(data.token));                
                })
            } else {                
               let messageErreur = document.getElementById("error_message");
               messageErreur.innerText = "Nom utilisateur ou mot de passe eronné.";                   
            }
        })
        
        
};

let token = localStorage.getItem("token");

document.getElementById("login_form").addEventListener("submit", function (event) {
    event.preventDefault();
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    login(username, password);
})