let postForm = () => {
    let email = document.getElementById('emailInput')
    let password = document.getElementById('passwordInput')

    let request = {
        email: email.value,
        password: password.value
    }
    
    let xhttp = new XMLHttpRequest();
    
    xhttp.open("POST", "http://127.0.0.1:3000/auth", true);
    
    xhttp.setRequestHeader("Content-type","application/json")

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            var status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
              console.log(xhr.responseText);
            }
        }
    }

    xhttp.send(JSON.stringify(request));
}

document.getElementById('formSubmit').addEventListener('click', (e) => {
    e.preventDefault()
    postForm()
})