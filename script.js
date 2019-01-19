//nav
const hambureger = document.querySelector('.HeaderNav__iconHamburger');
const HeaderNav = document.querySelector('.HeaderNav__List');
hambureger.addEventListener("click", () => {
    HeaderNav.classList.toggle('HeaderNav__List_isVisable');
    hambureger.classList.toggle('open');
});
const NavLinks = document.querySelectorAll('.HeaderNav__List--link');
for (let i = 0, len = NavLinks.length; i < len; i++) {
    NavLinks[i].addEventListener("click", () => {
        HeaderNav.classList.toggle('HeaderNav__List_isVisable')
        hambureger.classList.toggle('open');
    });
}


class Hero {
    constructor(name, description, image, price, isAvaible) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.isAvaible = isAvaible;
    }
}

let characters
const select = document.querySelector('.selectHeroToDelete'); // select in delete
const selectEdit = document.querySelector('.selectToEdit'); // select in delete

class UI {
    static displayCharacters() {
        fetch('http://localhost:3000/heroes')
            .then((r) => r.json())
            .then((r) => {
                 characters = r;
                characters.forEach((character) => UI.addCharacterToList(character));
            }).catch(error => {console.error('Error:', error);heroesList.innerHTML='Nie udało się pobrać superbohaterów z bazy.'; });

    }

    static addCharacterToList(hero) {
        const heroBox = document.createElement('div');
        heroBox.id = hero.name;
        heroBox.className = 'heroesList_hero';
        heroBox.innerHTML = `
        <img src="${hero.image}" alt="${hero.name}" class="heroesList_hero__HeroImage">
                <p class="heroesList_hero--Name">${hero.name}</p>
                <p class="Price">Cena wynajmu:${hero.price} zł/h</p>`;
        const list = document.querySelector('.heroesList');
        list.appendChild(heroBox);
        const optionText = hero.name;
        const optionValue = hero.name;
        const newOption = new Option(optionText, optionValue);
        selectEdit.options[selectEdit.length] = newOption;
        const optionTextD = hero.name;
        const optionValueD = hero.name;
        const newOptionD = new Option(optionText, optionValue);
        select.options[select.length] = newOptionD;

    }

    static displayCart() {
        const products = Store.getCart();
        products.forEach((prodcut) => UI.addProductToCart(prodcut));
        Store.cartSummary();
    }

    static addProductToCart(hero) {
        const shoopingCart = document.querySelector('.basket__Products');
        const product = document.createElement('div');
        product.className = 'basket__Products_product';
        product.innerHTML = `
            <img src="${hero.image}" alt="${hero.name}" class="basket_product__ProductImage">
            <div class="basket_product__infoProduct">
                <span class="infoProduct_element infoProduct_element--ProductName">${hero.name}</span>
                <span class="infoProduct_element">${hero.desciption}</span>
                <button class="infoProduct_element buttonDelete"> Usuń z koszyka | x </button>
            </div> 
                    `;
        product.id = `cart-${hero.name}`;
        hero.isAvaible = false;
        shoopingCart.appendChild(product);
        const deleteButton = document.getElementsByClassName('infoProduct_element buttonDelete');
        deleteButton[deleteButton.length - 1].addEventListener('click', UI.deleteProdcut);
    }

    static deleteProdcut(e) {
        let id = e.target.parentElement.parentElement.id;
        Store.deleteProduct(id);
        document.getElementById(id).remove();
    }


    static modal(id) {
        fetch(`http://localhost:3000/heroes/${id}`)
            .then((r) => r.json())
            .then((r) => {
                let hero = new Hero();
                hero = r;
                document.querySelector('.heroInModal__image').src = hero.image;
                document.querySelector('.heroInModal__image').alt = hero.name;
                document.querySelector('.heroInModal__name').textContent = `I'M THE ${hero.name}!`;
                document.querySelector('.heroInModal__description').textContent = hero.description;
                document.querySelector('.heroInModal__price').textContent = `WYNAJEM: ${hero.price} ZŁ/H`;
                modal.classList.add('active');
            });
    }
}
// otwiernia modala po poklinieciu Bohatera
const heroesList = document.querySelector('.heroesList');
heroesList.addEventListener('click', function (e) {
  const HeroToModalName=e.target.parentElement.id;
    if(e.target.parentElement.className=='heroesList_hero'){ //sprawdzamy czy kilikniety element jest herosem
        UI.modal(HeroToModalName);
    }
});

const modal = document.querySelector('.modal');
//zamkyanie modal po kliklnieciu X
const exitModal = document.querySelector('.heroInModal__exit');
exitModal.addEventListener('click', function () {
    modal.classList.remove('active');
});

//dowanie do koszyka po kliknieciu w modalu
const add = document.querySelector('.heroInModal__add');
add.addEventListener('click', function (e) {
    id=e.target.parentElement.firstChild.nextElementSibling.textContent;
    id=id.toString().substring(8); 
    id= id.slice(0, id.length-1);
    let hero;
    characters.forEach((bohater) => {
        if (bohater.name == id) {        
             hero=bohater;
        };
    });
    const cart = Store.getCart();
    let exists = 0;
    cart.forEach((product) => {
        if (product.name == id) {
            alert("HEROS JEST JUŻ W KOSZYKU!");
            exists = 1;
            return;
        };
    });
    if (exists == 0) {
        const shoopingCart = document.querySelector('.basket__Products');
        const product = document.createElement('div');
        product.className = 'basket__Products_product';
        product.id = `cart-${hero.name}`;
        const desciption=e.target.parentElement.childNodes[3].textContent;
        product.innerHTML = `
                            <img src="${hero.image}" alt="${hero.name}" class="basket_product__ProductImage">
                    <div class="basket_product__infoProduct">
                                <span class="infoProduct_element infoProduct_element--ProductName">${hero.name}</span>
                        <span class="infoProduct_element">${desciption}</span> 
                        <button class="infoProduct_element buttonDelete"> Usuń z koszyka | x </button>
                            </div>    `;
        hero.isAvaible = false;
        shoopingCart.appendChild(product);
        hero.desciption=desciption;
        Store.addProduct(hero);
        modal.classList.remove('active');
        const deleteButton = document.getElementsByClassName('infoProduct_element buttonDelete');
        deleteButton[deleteButton.length - 1].addEventListener('click', UI.deleteProdcut);
    };
});

class Store {
    
    static addCharacter(hero) {
           let url='http://localhost:3000/heroes'
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(hero)
            }).catch(function (error) {  
                console.log('Request failure: ', error);  
              });
    }
 
    static getCart() {
        let cart;
        if (localStorage.getItem('cart') === null) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        return cart;
    }
    static addProduct(product) {
        const cart = Store.getCart();
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        Store.cartSummary();

    }
    static deleteProduct(product) {
        name = product.substring(5);
        const cart = Store.getCart();
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].name == name) {
                cart.splice(i, 1);
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        Store.cartSummary();
    }
    static cartSummary() {
        const cart = Store.getCart();
        let price = 0;
        cart.forEach((prodcut) => {
            price += parseInt(prodcut.price);
        });
        document.querySelector('.priceRed').textContent = `${price} zł`;

    }
}

document.addEventListener('DOMContentLoaded', UI.displayCharacters);
document.addEventListener('DOMContentLoaded', UI.displayCart);

//form ADD,EDIT,DELETE
document.querySelector('.sectionForm.add').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.form__name').value;
    const image = document.querySelector('.form__image').value;
    const price = document.querySelector('.form__price').value;
    const description = document.querySelector('.form__description').value;
    if (repeat(name) == 1) {
        alert("Te bohater jest juz w bazie!");
    } else if (isValidURL(image) != true) {
        alert("Niepoprawny adres URL zdjęcia");
    } else { 
        const hero = new Hero(name, description, image, price, true)
        UI.addCharacterToList(hero);
        document.querySelector('.form__name').value = '';
        document.querySelector('.form__image').value = '';
        document.querySelector('.form__price').value = '';
        document.querySelector('.form__description').value = '';
        document.querySelector('.AddHero__buttonForm').textContent = 'DODANO!';
        setTimeout(function () {
            document.querySelector('.AddHero__buttonForm').textContent = 'Submit';
        }, 3000);
        Store.addCharacter(hero);

    }
});

document.querySelector('.sectionForm.edit').addEventListener('submit', (e) => {
    e.preventDefault();
    const selectValue = selectEdit.options[select.selectedIndex].value;
    const name = document.querySelector('.form__nameEdit').value;
    const image = document.querySelector('.form__imageEdit').value;
    const price = document.querySelector('.form__priceEdit').value;
    const description = document.querySelector('.form__descriptionEdit').value;
    if (repeat(name) == 1) {
        alert("Te bohater jest juz w bazie!");
    } else if (isValidURL(image) != true) {
        alert("Niepoprawny adres URL zdjęcia");
    } else {   

    //     const hero = new Hero(name, description, image, price, true)
    //   let url = `http://localhost:3000/heroes/${selectValue}`
    //     fetch(url, {
    //         method: 'PUT',
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8"
    //         },
    //         body: JSON.stringify(hero)
    //     })
    //     Store.editCharacter(hero,url);

        document.querySelector('.form__nameEdit').value = '';
        document.querySelector('.form__imageEdit').value = '';
        document.querySelector('.form__priceEdit').value = '';
        document.querySelector('.form__descriptionEdit').value = '';
        document.querySelector('.AddHero__buttonForm').textContent = 'Edytowano';
        setTimeout(function () {
            document.querySelector('.AddHero__buttonForm').textContent = 'Edytuj';
        }, 3000);
    }
});

document.querySelector('.sectionForm.delete').addEventListener('submit', (e) => {
    e.preventDefault();
    const selectValue = select.options[select.selectedIndex].value;
    let url = `http://localhost:3000/heroes/${selectValue}`
    fetch(url, {
        method: 'delete',
        body: JSON.stringify(selectValue)

    })

    document.querySelector('.AddHero__buttonForm.delete').textContent = 'Usunieto';
    setTimeout(function () {
        document.querySelector('.AddHero__buttonForm.delete').textContent = 'Usuń';
    }, 3000);


});

//validation forms 
//czy poprawny adres URL
function isValidURL(str) {;
    const patt = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/g;
    return (patt.test(str));
}
//czy heros jest juz w bazie
function repeat(name) {
    const herosToCheck = document.querySelectorAll('.heroesList_hero');
    let znaleziono = 0;
    herosToCheck.forEach(element => {
        if (element.id.toUpperCase() === name.toUpperCase()) {
            znaleziono = 1;
        }
    });
    return znaleziono;
}

//hide sections
document.querySelector('#dodaj').addEventListener('click', function () {
    document.querySelector('.add').classList.remove('off');
    document.querySelector('.delete').classList.add('off');
    document.querySelector('.basket').classList.add('off');
    document.querySelector('.edit').classList.add('off');
    document.querySelector('.heroesList').classList.add('off');
});
document.querySelector('#edytuj').addEventListener('click', function () {
    document.querySelector('.edit').classList.remove('off');
    document.querySelector('.add').classList.add('off');
    document.querySelector('.delete').classList.add('off');
    document.querySelector('.basket').classList.add('off');
    document.querySelector('.heroesList').classList.add('off');
});
document.querySelector('#usun').addEventListener('click', function () {
    document.querySelector('.delete').classList.remove('off');
    document.querySelector('.add').classList.add('off');
    document.querySelector('.basket').classList.add('off');
    document.querySelector('.edit').classList.add('off');
    document.querySelector('.heroesList').classList.add('off');
});
document.querySelector('#usunWszystko').addEventListener('click', function () {
    // let url=`http://localhost:3000/heroes`
    // fetch(url, {
    //     method: 'delete',               
    // }) 
    alert("USUNIĘTO BAZĘ(odkomentowac 353 linia)");
});
document.querySelector('.HeaderNav__LogoHamburgerBox__linkLogo').addEventListener('click', function () {
    document.querySelector('.delete').classList.add('off');
    document.querySelector('.add').classList.add('off');
    document.querySelector('.basket').classList.remove('off');
    document.querySelector('.edit').classList.add('off');
    document.querySelector('.heroesList').classList.remove('off');
});