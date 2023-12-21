const accessKey = "LX9B7YwViHQT1SjbbjR4z6JTG7VBg445RaGiF23eilc";

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");


let inputData = "";
let page = 1;


async function searchImages() {
  inputData = inputEl.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
  const response = await fetch(url);
  const data = await response.json();

  const results = data.results;


  if(page === 1) {
    searchResults.innerHTML = "";
  }

  results.map((result) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("search-result");
    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;
    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";
    imageLink.textContent = result.alt_description;
    const buttonLink = document.createElement("button");
    buttonLink.textContent = "download";
    buttonLink.classList.add("button-85");
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-download");
    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    imageWrapper.appendChild(buttonLink);
    buttonLink.appendChild(icon);
    searchResults.appendChild(imageWrapper);
    buttonLink.addEventListener("click", () => {
      downloadImage(result.urls.small) 
      .then(() => {
        console.log('img download');
      })
      .catch((error) => {
        console.log('error', error);
      });
    });

  });

  page++;
  if(page > 1) {
    showMore.style.display = "block";
  }
}

async function downloadImage(imageUrl) {
  const nameOfDownload = "my-image.png";
  const response = await fetch(imageUrl);
  const blobImg = await response.blob();
  const href = URL.createObjectURL(blobImg);

  const anchorElement = document.createElement("a");
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;
  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
}

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
} );

showMore.addEventListener('click', (event) => {
  searchImages();
});