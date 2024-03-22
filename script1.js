let start_date = new Date();
start_date.setDate(start_date.getDate() - 16);
let end_date = new Date();

let [end_year, end_month, end_day, start_year, start_month, start_day] = [
  end_date.getFullYear(),
  end_date.getMonth() + 1,
  end_date.getDate(),
  start_date.getFullYear(),
  start_date.getMonth() + 1,
  start_date.getDate(),
];

if (end_month < 10) end_month = `0${end_month}`;
if (start_month < 10) start_month = `0${start_month}`;
if (start_day < 10) start_day = `0${start_day}`;
if (end_day < 10) end_day = `0${end_day}`;

start_date = `${start_year}-${start_month}-${start_day}`;
end_date = `${end_year}-${end_month}-${end_day}`;

let apiKey = "SKfCZ5CroSLBId5M7jYTxenqTsu76K3wjWgKoUKZ";
let mainPicture = document.querySelector("#main-picture");
let textContainer = document.querySelector(".text-container");
let pictures_container = document.querySelector(".pictures-container");
let previousImagesContainer = document.querySelector(".previous-image");
let picture_details_container = document.querySelector(
  ".picture-details-container"
);
let picture_details = document.querySelector(".picture-details");
let astronomyPicturesUrl = `https://api.nasa.gov/planetary/apod?start_date=${start_date}&end_date=${end_date}&api_key=${apiKey}&thumbs=true`;

let fetchPictures = () => {
  let pictures = fetch(astronomyPicturesUrl)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    })
    .catch((error) => {
      console.log(error);

      mainPicture.textContent = error;
    })
    .finally(() => console.log("io vengo sempre eseguito"));
  return pictures;
};

function createMainImage(url, thumbnail_url) {
  mainPicture.innerHTML = "";
  let image = document.createElement("img");
  if (url) {
    image.src = url;
  } else {
    image.src = thumbnail_url;
  }

  mainPicture.append(image);
}
function createMainText(explanation, data) {
  let description = document.createElement("div");
  description.textContent = explanation;
  let title = document.createElement("h3");
  title.textContent = data;
  description.prepend(title);
  mainPicture.append(description);
}
function createPreviousImage(element, index) {
  console.log(index);
  let picture_container = document.createElement("div");
  pictures_container.append(picture_container);
  picture_container.classList.add("picture-container");
  let previousImage = document.createElement("img");
  if (element.media_type === "image") {
    previousImage.src = element.url;
  } else {
    previousImage.src = element.thumbnail_url;
  }
  picture_container.append(previousImage);

  picture_container.addEventListener("click", () => {
    showDetails(index);
    console.log(index);
  });
}

let previouseImagesArray = [];

function showDetails(index) {
  let element = previouseImagesArray[index];

  make(element, index);
}
let fetchedPictures = fetchPictures().then((data) => {
  pictures_container.innerHTML = "";
  let newArray = data.reverse();
  let previouseImages = newArray.slice(1, 17);
  previouseImagesArray = previouseImages;
  let url = newArray[0].url;
  if (newArray[0].media_type === "image") {
    createMainImage(url);
  } else {
    createMainImage("", newArray[0].thumbnail_url);
  }
  createMainText(data[0].explanation, data[0].title);

  for (let i = 0; i < previouseImages.length; i++) {
    // console.log(i)
    createPreviousImage(previouseImages[i], i);
  }
});

function make(element, index) {
  picture_details.innerHTML = "";

  picture_details_container.style.display = "flex";
  picture_details.style.display = "flex";

  let leftArrow = document.createElement("i");
  leftArrow.classList.add("arrowLeft");
  let rigthArrow = document.createElement("i");
  rigthArrow.classList.add("arrowRight");
  rigthArrow.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
  leftArrow.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  console.log(index);
  if (index === 0) {
    leftArrow.style.display = "none";
  }
  if (index === previouseImagesArray.length - 1) {
    rigthArrow.style.display = "none";
  }

  leftArrow.addEventListener("click", () => {
    showDetails(index - 1);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      showDetails(index - 1);
    }
    if (e.key === "ArrowRight") {
      showDetails(index + 1);
    }
  });
  rigthArrow.addEventListener("click", () => {
    showDetails(index + 1);
  });
  let image = document.createElement("img");
  if (element.media_type === "image") {
    image.src = element.url;
  } else {
    image.src = element.thumbnail_url;
  }

  let titleImage = document.createElement("h2");
  titleImage.textContent = element.title;
  let descriptionImage = document.createElement("p");
  descriptionImage.textContent = element.explanation;
  let copyright = document.createElement("p");
  if (element.copyright) {
    let copyrightText = element.copyright;
    copyright.textContent = `Copyright:${copyrightText}`;
  }
  descriptionImage.classList.add("description-image");
  let escSpan = document.createElement("span");
  escSpan.textContent = "BACK";
  escSpan.classList.add("escSpan");
  escSpan.addEventListener("click", close);
  picture_details.append(image);
  picture_details.append(titleImage);
  picture_details.append(descriptionImage);
  picture_details.append(copyright);
  picture_details.append(escSpan);
  picture_details.append(rigthArrow);
  picture_details.append(leftArrow);
}

window.addEventListener("click", (e) => {
  if (e.target.className === "picture-details-container") {
    close();
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    close();
  }
});
function close() {
  picture_details.classList.add("display-none");
  picture_details_container.style.display = "none";
}
