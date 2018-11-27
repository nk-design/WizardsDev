let xhr = null;
window.onload = function() {
    xhr = new XMLHttpRequest()
}

const btn = document.getElementById('myButton');
const div = document.getElementById('container');
console.log(btn)
btn.addEventListener('click', read);

function read() {
    xhr.open( 'GET', './data.json');
    xhr.onreadystatechange = readyState;
    xhr.send(null)
}

function readyState() {
    if ( xhr.readyState === 4 ) {
        div.innerHTML = xhr.responseText;
        let jsonObj = JSON.parse(xhr.responseText);
        console.log(jsonObj);
        let arr = jsonObj.file.filter(function(elem){
        	return elem.sex==="m";
        	div.innerHTML=arr;
        });
        console.log(arr);
    }
}

