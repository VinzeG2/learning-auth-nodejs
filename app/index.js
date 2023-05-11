const loadInitialTemplate = () => {
    const template = `
        <h1>Spells<h1>
        <form id="spell-form">
            <div>
                <label> Name </label>
                <input name="name" />
            </div>
            <div>
                <label> Type </label>
                <input name="type" />
            </div>
            <button type="submit"> Submit </button>
        </form>
        <ul id="spells-list"></ul>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const getSpells = async () => {
    const result = await fetch('/spells',
    {
        headers: {
            Authorization: localStorage.getItem('jwt')
        }
    })
    const spells = await result.json();
    const template = (spell) => `<li> ${spell.name} ${spell.type} <button data-id="${spell._id}"> ELIMINAR </button> </li>`
    const spellsList = document.getElementById('spells-list')
    spellsList.innerHTML = spells.map( (spell) => template(spell) ).join('')
    
    spells.forEach((spell) => {
        const userNode = document.querySelector(`[data-id="${spell._id}"]`)
        userNode.onclick = async e => {
            userNode.parentNode.remove();
            alert("REMOVED")
            await fetch(`/spells/${spell._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: localStorage.getItem('jwt')
                }
            })
            
        }
    });
}

const addFormListener = () => {
    const spellForm = document.getElementById('spell-form')
    spellForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(spellForm)
        
        const data = Object.fromEntries(formData.entries())
        console.log({data});
        await fetch('/spells', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('jwt')
            }
        })
        spellForm.reset()
        getSpells()
    }
}

const loadSpellsForm = () => {
    loadInitialTemplate()
    addFormListener()
    getSpells()
}

const checkLoggedIn = () => localStorage.getItem('jwt')


const loadLoginTemplate = () => {
    const template = `
        <h1>Login<h1>
        <form id="login-form">
            <div>
                <label> username </label>
                <input name="username" />
            </div>
            <div>
                <label> Password </label>
                <input name="password" />
            </div>
            <button type="submit"> Submit </button>
        </form>
        <div id="error"></div>
        <a href="#" id="gotoregister">Registrarse</a>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const authListener = action => () => {
    const form = document.getElementById(`${action}-form`)
    form.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch(`/${action}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseData = await response.text()
        if (response.status >= 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            loadSpellsForm()
        }
    }
}


const addLoginListener = authListener('login')

const loadRegisterTemplate = () => {
    const template = `
        <h1>Register<h1>
        <form id="register-form">
            <div>
                <label> username </label>
                <input name="username" />
            </div>
            <div>
                <label> Password </label>
                <input name="password" />
            </div>
            <button type="submit"> Submit </button>
        </form>
        <div id="error"></div>
        <a href="#" id="gotologin">Already have an account</a>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const addRegisterListener = authListener('register')

const gotoLoginListener = () => {
    const gotoLogin = document.getElementById('gotologin')
    gotoLogin.onclick = (e) => {
        e.preventDefault()
        console.log("Login Page");
        loadLoginForm()
    }
}

const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
}

const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById('gotoregister')
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        console.log("Register Page");
        registerPage()
    }

}

const loadLoginForm = () => {
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}

window.onload = () => {
    const loggedIn = checkLoggedIn()
    if (loggedIn) {
        loadSpellsForm()
    } else {
        loadLoginForm()
    }
}