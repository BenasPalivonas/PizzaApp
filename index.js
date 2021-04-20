var pizzaName = document.getElementById("pizzaName");
var price = document.getElementById("price");
var chiliOne = document.getElementById("oneChili");
var chiliTwo = document.getElementById("twoChili");
var chiliThree = document.getElementById("threeChili");
var clearButton = document.getElementById("clearButton");
var topping = document.getElementById("topping");
var toppings = document.getElementById("toppings");
var addToppingsButton = document.getElementById("addToppingButton");
var pizzaPicture = document.getElementById("pizzaPicture");
var backButton = document.getElementById("backButton");
var nextButton = document.getElementById("nextButton");
var submitPizza = document.getElementById("addPizzaButton");
var modal = document.getElementById("modal");
var modalOpenButton = document.getElementById("modalOpenButton");
var modalCloseButton = document.getElementById("modalCloseButton");
var pizzaMenuModal = document.getElementById("pizzaMenuModal");

let selectedChiliLevel = null;
let pictureSource = "./photos/pizzas/1.jpg";

//handeling submit pizza
const onClickSubmit = () => {
    if (pizzaName.value == '') {
        alert("Enter a name");
        return;
    }
    if (price.value == '') {
        alert("Enter price");
        return;
    }
    let createdToppings = document.querySelectorAll('li');
    let allTopings = []
    createdToppings.forEach(item => {
        allTopings.push(item.textContent);
    })
    const pizza = {
        name: pizzaName.value,
        price: price.value,
        hotLevel: selectedChiliLevel,
        toppings: allTopings,
        img: pictureSource,
    }
    const currentStorage = JSON.parse(sessionStorage.getItem("pizza"));
    if (currentStorage !== null) {
        let alreadyInMenu = false;
        currentStorage.map(item => {
            if (item.name === pizza.name) {
                alreadyInMenu = true;
                alert(`${pizza.name} already exsists`)
            }
        })
        if (!alreadyInMenu) {
            sessionStorage.setItem("pizza", JSON.stringify(([...currentStorage, pizza])));
        }
    }
    else if (currentStorage == null) {
        sessionStorage.setItem("pizza", JSON.stringify([pizza]));
    }

}
submitPizza.addEventListener('click', onClickSubmit)


//clicking chili
const chiliClicked = (chiliClicked) => {
    if (chiliClicked == 1) {
        selectedChiliLevel = 1;
        chiliOne.style.outline = '3px solid white';
        chiliTwo.style.outline = 'none';
        chiliThree.style.outline = 'none';
    }
    else if (chiliClicked == 2) {
        selectedChiliLevel = 2;
        chiliOne.style.outline = 'none';
        chiliTwo.style.outline = '3px solid white';
        chiliThree.style.outline = 'none';
    }
    else if (chiliClicked == 3) {
        selectedChiliLevel = 3;
        chiliOne.style.outline = 'none';
        chiliTwo.style.outline = 'none';
        chiliThree.style.outline = '3px solid white';
    }
}
chiliOne.addEventListener('click', () => chiliClicked(1));
chiliTwo.addEventListener('click', () => chiliClicked(2))
chiliThree.addEventListener('click', () => chiliClicked(3))

//clearing chili
clearButton.addEventListener('click', () => {
    chiliOne.style.outline = 'none';
    chiliTwo.style.outline = 'none';
    chiliThree.style.outline = 'none';
    selectedChiliLevel = null;
})

//adding toppings to ul
addToppingsButton.addEventListener('click', () => {
    let checkingForOverlapData = false;
    let createdToppings = document.querySelectorAll('li');
    createdToppings.forEach(item => {
        if (item.outerText == topping.value.toLowerCase()) {
            checkingForOverlapData = true;
        }
    })
    if (!checkingForOverlapData) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(topping.value.toLowerCase()));
        li.addEventListener('click', () => {
            toppings.removeChild(li);
        })
        toppings.appendChild(li);
    }
})

//chaning picture
let currentPicture = 1;
const setPizzaPhoto = (currentPhoto) = () => {
    pictureSource = `./photos/pizzas/${currentPicture}.jpg`;
    pizzaPicture.src = `./photos/pizzas/${currentPicture}.jpg`;
}
backButton.addEventListener('click', () => {
    if (currentPicture > 1) {
        currentPicture--;
        setPizzaPhoto(currentPicture);
    }
    else {
        currentPicture = 8;
        setPizzaPhoto(currentPicture);
    }
})
nextButton.addEventListener('click', () => {
    if (currentPicture < 8) {
        currentPicture++;
        setPizzaPhoto(currentPicture);
    }
    else {
        currentPicture = 1;
        setPizzaPhoto(currentPicture);
    }

})

//modal logic
modal.onclick = (event) => {
    event.stopPropagation();
}
const openModal = () => {
    modal.classList.add('modalOpen');
    let menu = JSON.parse(sessionStorage.getItem("pizza"));
    if (menu !== null) {
        menu.forEach(item => {
            let div = document.createElement('div');
            let divText = document.createElement('div');
            divText.appendChild(document.createTextNode(`Name: ${item.name}`));
            divText.appendChild(document.createElement('br'));
            divText.appendChild(document.createTextNode(`Price: ${item.price}$`));
            divText.appendChild(document.createElement('br'));
            let toppingsText = 'Toppings: ';
            item.toppings.forEach(topping => {
                toppingsText = toppingsText + ' ' + topping + ',';
            })
            toppingsText = toppingsText.substring(0, toppingsText.length - 1);
            divText.appendChild(document.createTextNode(toppingsText));
            divText.appendChild(document.createElement('br'));
            divText.classList.add("pizzaMenuModalItemText");
            div.appendChild(divText);
            console.log(item.img);
            let img = document.createElement('img');
            img.src = item.img;
            img.classList.add("pizzaMenuModalImage")
            div.appendChild(img);
            div.appendChild(document.createElement('br'));
            let hotLevel = document.createElement('img');
            hotLevel.src = `./photos/chili${item.hotLevel}.png`
            hotLevel.classList.add("pizzaMenuModalSpice")
            div.appendChild(hotLevel);
            div.classList.add("pizzaMenuModalItem");
            modal.appendChild(div);
        })
    }
}
const closeModal = () => {
    modal.classList.remove('modalOpen');
}
modalOpenButton.addEventListener("click", (event) => {
    openModal();
    event.stopPropagation();
    window.addEventListener('click', closeModal);
})
modalCloseButton.addEventListener("click", () => {
    closeModal();
    window.removeEventListener('click', closeModal);
})