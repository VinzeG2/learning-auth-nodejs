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
    const result = await fetch('/spells')
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
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addLoginListener = () => {
    const loginForm = document.getElementById('login-form')
    loginForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())
        const response = await fetch('/login', {
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
            console.log(responseData);
        }
    }
}

const loadLoginForm = () => {
    loadLoginTemplate()
    addLoginListener()
}

window.onload = () => {
    const loggedIn = checkLoggedIn()
    if (loggedIn) {
        loadSpellsForm()
    } else {
        loadLoginForm()
    }
}