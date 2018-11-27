const dbName = "PersonsDB";
const dbVersion = "0.1";
const dbDisplayName = "PersonsDB";
const dbMaxSize = 256;

const db = openDatabase(dbName, dbVersion, dbDisplayName, dbMaxSize);

db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS persons " +
    "(id INTEGER NOT NULL PRIMARY KEY, " +
    "firstName TEXT NOT NULL, " +
    "lastName TEXT NOT NULL, " +
    "age INTEGER NOT NULL);")
});

const indexDB = new Dexie('PersonsDB');

indexDB.version(1).stores({
    persons: 'id, person'
});


let personDAO = null;
let personList = {};

function setWindowStorage() {
    personDAO = new PersonDAOWindow;
    personDAO.getPersonList((persons)=>{
        renderPersonList(persons);
    })
}

function setLocalStorage() {
    personDAO = new PersonDAOLocal;
    personDAO.getPersonList((persons)=>{
        renderPersonList(persons);
    })
}

function setServerStorage() {
    personDAO = new PersonDAOServer;
    personDAO.getPersonList((persons)=>{
        renderPersonList(persons);
    })
}

function setIndexStorage() {
    personDAO = new PersonDAOIndex;
    personDAO.getPersonList((persons)=>{
        renderPersonList(persons);
    })
}


class PersonDAOWindow{
    constructor(){
        if (PersonDAOWindow.instance){
            return PersonDAOWindow.instance
        } else {
            PersonDAOWindow.instance = this;
            personList = {};
        }
    }

    getPersonList(render) {
        render(personList);
    }

    createPerson(person){
        if(!personList[person.id]) personList[person.id] = person;
    }

    getPerson(id, render){
        render(personList[id]);
    }

    updatePerson(person){
        personList[person.id] = person;
    }

    deletePerson(id){
        delete personList[id];
    }
}


class PersonDAOLocal{
    constructor(){
        if (PersonDAOLocal.instance){
            return PersonDAOLocal.instance
        } else {
            PersonDAOLocal.instance = this;
        }
    }

    getPersonList(render) {
        const personList = JSON.parse(localStorage.getItem("persons"));
        if (personList){
            render(personList)
        } else {
            render({})
        }
    }

    createPerson(person){
        let personList = JSON.parse(localStorage.getItem("persons"));
        if (!personList) {
            personList = {};
        }
        personList[person.id] = person;
        localStorage.setItem("persons", JSON.stringify(personList))
    }

    getPerson(id, render){
        const personList = JSON.parse(localStorage.getItem("persons"));
        if (personList) {
            render(personList[id]);
        }
    }

    updatePerson(person){
        const personList = JSON.parse(localStorage.getItem("persons"));
        if(personList) {
            personList[person.id] = person;
            localStorage.setItem("persons", JSON.stringify(personList));
        }
    }

    deletePerson(id){
        const personList = JSON.parse(localStorage.getItem("persons"));
        if (personList) {
            delete personList[id];
            localStorage.setItem("persons", JSON.stringify(personList));
        }
    }
}


class PersonDAOServer{
    constructor(){
        if (PersonDAOServer.instance){
            return PersonDAOServer.instance
        } else {
            PersonDAOServer.instance = this;
        }
    }

    static errorHandler(transaction, error){
        console.log("Error: " + error.message + " (Code: " + error.code + ")");
        return true;
    }

    getPersonList(render) {
        const persons = {};

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM persons",
                [],
                (tx, result) => {
                    for (let i = 0; i < result.rows.length; i++){
                        persons[result.rows.item(i)['id']] = {
                            "id": result.rows.item(i)['id'],
                            "firstName": result.rows.item(i)["firstName"],
                            "lastName": result.rows.item(i)["lastName"],
                            "age": result.rows.item(i)["age"]
                        }
                    }
                    render(persons);
                },
                PersonDAOServer.errorHandler
            )
        });
    }

    createPerson(person){
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO persons (id, firstName, lastName, age) VALUES (?, ?, ?, ?);",
                [person.id, person.firstName, person.lastName, person.age],
                null,
                PersonDAOServer.errorHandler)
        })
    }

    getPerson(id, render){
        const person = {};

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM persons WHERE id=?",
                [id],
                (tx, result) => {
                    if(result.rows.length === 1) {
                        person.firstName = result.rows.item(0)["firstName"];
                        person.lastName = result.rows.item(0)["lastName"];
                        person.age = result.rows.item(0)["age"];
                        render(person);
                    } else {
                        raiseError("No such person")
                    }
                },
                PersonDAOServer.errorHandler
            )
        });
    }

    updatePerson(person){
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE persons SET firstName=?, lastName=?, age=? WHERE id=?;",
                [person.firstName, person.lastName, person.age, person.id,],
                null,
                PersonDAOServer.errorHandler)
        })
    }

    deletePerson(id){
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM persons WHERE id=?;",
                [id],
                null,
                PersonDAOServer.errorHandler)
        })
    }
}


class PersonDAOIndex{
    constructor(){
        if (PersonDAOIndex.instance){
            return PersonDAOIndex.instance
        } else {
            PersonDAOIndex.instance = this;
        }
    }

    getPersonList(render) {
        indexDB.persons.toArray().then(persons => {
            let personsObj = {};
            persons.forEach((person) => {
                personsObj[person.id] =JSON.parse(person.person);
            });
            render(personsObj);
        })
    }

    createPerson(person){
        return indexDB.persons.add({id: person.id, person: JSON.stringify({id: person.id,
                                                       firstName: person.firstName,
                                                       lastName: person.lastName,
                                                       age: person.age})
        });
    };

    getPerson(id, render){
        indexDB.persons.where("id").equals(id).toArray().then(persons =>{
            if(persons.length === 1){
                const person = JSON.parse(persons[0].person);
                render(person)
            } else {
                raiseError("No such person")
            }
        })
    }

    updatePerson(person){
        indexDB.persons.put({id: person.id, person: JSON.stringify(person)});
    }

    deletePerson(id){
        indexDB.persons.where("id").equals(id).delete();
    }
}


onload = function () {
    init();
};

function init() {
    window.idFld = document.getElementById("inputId");
    window.firstNameFld = document.getElementById("inputFirstName");
    window.lastNameFld = document.getElementById("inputLastName");
    window.ageFld = document.getElementById("inputAge");

    window.errorField = document.getElementById("error");

    addEventListeners();
}

function addEventListeners() {
    let createBtn = document.getElementById("createBtn");
    let readBtn = document.getElementById("readBtn");
    let updateBtn = document.getElementById("updateBtn");
    let deleteBtn = document.getElementById("deleteBtn");

    let indexBtn = document.getElementById("indexBtn");
    let webBtn = document.getElementById("webBtn");
    let lsBtn = document.getElementById("lsBtn");
    let wsBtn = document.getElementById("wsBtn");

    createBtn.onclick = createPerson;
    readBtn.onclick = readPerson;
    updateBtn.onclick = updatePerson;
    deleteBtn.onclick = deletePerson;

    indexBtn.onclick = setIndexStorage;
    webBtn.onclick = setServerStorage;
    lsBtn.onclick = setLocalStorage;
    wsBtn.onclick = setWindowStorage;
}

function renderPersonList(personListObj) {
    const tableBody = document.getElementById("tableBody");

    while (tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild)
    }

    for(let keyId in personListObj) {
        let raw = document.createElement("DIV");
        let id = document.createElement("DIV");
        let firstName = document.createElement("DIV");
        let lastName = document.createElement("DIV");
        let age = document.createElement("DIV");

        id.innerText = personListObj[keyId]["id"];
        firstName.innerText = personListObj[keyId]["firstName"];
        lastName.innerText = personListObj[keyId]["lastName"];
        age.innerText = personListObj[keyId]["age"];

        raw.className = "table-block__raw";
        id.className = "table-block__raw-id";
        firstName.className = "table-block__raw-first-name";
        lastName.className = "table-block__raw-last-name";
        age.className ="table-block__raw-age";

        raw.appendChild(id);
        raw.appendChild(firstName);
        raw.appendChild(lastName);
        raw.appendChild(age);

        tableBody.appendChild(raw);
    }
}

function containsUndefined(obj) {
    for(let key in obj) {
        if (!obj[key]) return true;
    }
    return false
}

function raiseError(text) {
    errorField.innerText = text;
}

function createPerson() {
    if (personDAO) {
        const id = idFld.value;
        const firstName = firstNameFld.value;
        const lastName = lastNameFld.value;
        const age = ageFld.value;

        const person = {
            id,
            firstName,
            lastName,
            age
        };

        if (!containsUndefined(person)) {
            personDAO.createPerson(person);
        } else {
            raiseError("Include empty field!");
        }

        personDAO.getPersonList((persons)=>{
            renderPersonList(persons);
        })
    } else {
        raiseError("Storage is not chosen")
    }
}

function readPerson() {
    const id = idFld.value;
    if (!id) raiseError("Id field is invalid");

    if (personDAO) {
        personDAO.getPerson(id, (person) => {
            if (person) {
                firstNameFld.value = person.firstName;
                lastNameFld.value = person.lastName;
                ageFld.value = person.age;
            } else {
                raiseError("No such person")
            }
        })
    } else {
        raiseError("Storage is not chosen")
    }
}

function updatePerson(){
    if (personDAO) {

    const person = {
        id: idFld.value,
        firstName: firstNameFld.value,
        lastName: lastNameFld.value,
        age: ageFld.value
    };

    if (!containsUndefined(person)) {
        personDAO.updatePerson(person);
    } else {
        raiseError("Include empty field!");
    }

    personDAO.getPersonList((persons)=>{
        renderPersonList(persons);
    });

    } else {
        raiseError("Storage is not chosen")
    }
}

function deletePerson() {
    const id = idFld.value;

    if (personDAO) {
        personDAO.deletePerson(id);
        personDAO.getPersonList((persons)=>{
            renderPersonList(persons);
        })
    } else {
        raiseError("Choose storage")
    }
}


