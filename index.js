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
let pictureSource = "./photos/pizzas/1.png";

//price input
price.onchange = (event) => {
    event.target.value = parseFloat(event.target.value).toFixed(2);
}
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

    if (allTopings.length < 2) {
        alert(`Enter ${2 - allTopings.length} more toppings`)
        return
    }
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
    pictureSource = `./photos/pizzas/${currentPicture}.png`;
    pizzaPicture.src = `./photos/pizzas/${currentPicture}.png`;
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
const createRadio = (type, inputDiv) => {
    let input = document.createElement('button');
    input.value = type;
    input.name = "sort";
    input.type = 'button';
    inputDiv.appendChild(input);
    input.addEventListener('click', ((e) => {
        const menu = sortBy(type);
        modal.innerHTML = '';
        loadModalItems(menu)
    }))
    input.appendChild(document.createTextNode(`Sort By ${type}`));
}
const sortBy = (sortBy) => {
    let menu = JSON.parse(sessionStorage.getItem("pizza"));
    menu.sort((a, b) => {
        return (a[sortBy] > b[sortBy]) ? 1 : -1;
    })
    return menu;
}
const loadModalItems = (menu) => {
    //close Button
    let closeButton = document.createElement('button');
    closeButton.appendChild(document.createTextNode("Close"));
    closeButton.classList.add("modalCloseButton");
    closeButton.addEventListener('click', closeModal);
    modal.appendChild(closeButton);
    //sort
    let inputDiv = document.createElement('div');
    createRadio("name", inputDiv);
    createRadio("price", inputDiv);
    createRadio("hotLevel", inputDiv);
    inputDiv.classList.add('radio');
    modal.appendChild(inputDiv);
    //Menu Items
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
            let img = document.createElement('img');
            img.src = item.img;
            img.classList.add("pizzaMenuModalImage")
            div.appendChild(img);
            div.appendChild(document.createElement('br'));
            if (item.hotLevel != null) {
                let hotLevel = document.createElement('img');
                hotLevel.src = `./photos/chili${item.hotLevel}.png`
                hotLevel.classList.add("pizzaMenuModalSpice")
                div.appendChild(hotLevel);
            }
            let button = document.createElement('button');
            button.appendChild(document.createTextNode("Delete"));
            button.classList.add("deleteButton")
            button.addEventListener('click', () => {
                if (confirm("are you sure you want to delete")) {
                    const newMenu = removeFromMenu(menu, item);
                    sessionStorage.setItem("pizza", JSON.stringify(newMenu));
                    modal.removeChild(div);
                }
            })
            div.appendChild(document.createElement('br'));
            div.appendChild(button);
            div.classList.add("pizzaMenuModalItem");
            modal.appendChild(div);
        })
    }
}
const openModal = () => {
    modal.classList.add('modalOpen');
    let menu = JSON.parse(sessionStorage.getItem("pizza"));
    loadModalItems(menu);
}

const removeFromMenu = (menu, item) => {
    const newMenu = menu.filter(menuItem => {
        return menuItem != item;
    })
    return newMenu;
}
const closeModal = () => {
    modal.classList.remove('modalOpen');
    modal.innerHTML = '';
}
modalOpenButton.addEventListener("click", (event) => {
    openModal();
    event.stopPropagation();
    window.addEventListener('click', closeModal);
})
