console.log('hello trifid');
$(document).ready(()=>{
  console.log('JQ');
  clickHandler();
  getListings();
});

// global declarations
let listings = [];
let showing = 'all';
let rentCount = 0;
let saleCount = 0;

function clickHandler() {
  $('#showAllBtn').on('click', showAll);
  $('#showSaleBtn').on('click', ()=>appendType('sale'));
  $('#showRentBtn').on('click', ()=>appendType('rent'));
  // submit button
  $('#submitBtn').on('click', submitListing);
  // delete button
  $('#outputSec').on('click', '.delete', deleteListing);
}// end clickHandlers

function showAll () {
  showing = 'all';
  getListings();
}

function resetCount () {
  rentCount = 0;
  saleCount = 0;
}

function getListings() {
  // Make GET request for listings
  $.ajax({
    method: 'GET',
    url: '/listings'
  }).then( function(response){
    // console.log("response from server:", response);
    // Saves the response into the global listings array
    resetCount();
    listings = response;
    // Appending listings depending on what we are currently viewing
    if (showing === 'all') {
      appendListings();
    } else {
      appendType(showing);
    }
  }).catch(function(error) {
    console.log('Error in GET client side', error)
    alert('Unable to getListings at this time. Please try again later.');
  });
}// end showAllListings

function appendListings(type) {
  let el = $('#outputSec');
  el.empty();
  let saleSec = $(`
    <div>
      <h2>For Sale</h2>
    </div>
  `);
  let rentSec = $(`
    <div>
      <h2>For Rent</h2>
    </div>
  `);
  console.log("full list to append:",listings);
  // looping through response
  for(let i=0; i < listings.length; i++){
    let house = listings[i];
    appendHouse(house, el, saleSec, rentSec);
  }// end for
  el.append(saleSec);
  el.append(rentSec);
}// end

function appendType(type) {
  showing = type;
  resetCount();
  let el = $('#outputSec');
  el.empty();
  
  // Create the section div
  let onlySec = $(`<div></div>`);
  // Create the header...
  let secHeader = $(`<div><h2>For ${showing}</h2></div>`);
  // ...and append it to the top of the section
  onlySec.append(secHeader);

  // looping through response
  for(let i=0; i < listings.length; i++) {
    let house = listings[i];
    if (house.type === type) {
      appendHouse(house,el,onlySec,onlySec);
    }// end if statement  
  }// end for

  // Getting the count of houses to display
  let value = 0;
  if (showing==='rent') {
    value = rentCount;
  } else {
    value = saleCount;
  }
  // Append the count to the header
  secHeader.append(`<p>Total Listings: ${value}</p>`);
  console.log("full list to append:", listings);
  el.append(onlySec);
}// end appendType








function appendHouse(house, el, saleSec, rentSec) {
  let $div = $(`<div class="card"></div>`);
  $div.data('id',house.id);
  let cardImg = $(`<div class="card-img"></div>`);
  cardImg.css('background',`url(images/${house.image_path}`);
  cardImg.css('background-size',`cover`);
  $div.append(cardImg);
  $div.append(`<p class="info-cost">$${numberWithCommas(house.cost)}<p>
              <p>${house.city}<p>
              <p>${numberWithCommas(house.sqft)} sq ft<p>
              <button class="delete">Delete</button>`);
  if (house.type === 'sale') {
    saleCount++;
    saleSec.append($div);
  } else {
    rentCount++;
    rentSec.append($div);
  }
};


function submitListing() {
  console.log('Submit btn working');
  console.log('validation:',inputValidation());
  if (inputValidation()) {
    let listingObj = {
      sqft: $('#squareFootIn').val(),
      cost: $('#costIn').val(),
      type: $('#typeSel').val(),
      city: $('#cityIn').val(),
      image_path: $('#imageSel').val()
    };
    $.ajax({
      method: 'POST',
      url: '/listings',
      data: listingObj
    }).then( function(response){
      console.log('back from POST with', response);
      getListings();
      $('.house-input').val('');
    }).catch(function(error) {
      console.log('Error in POST client side', error)
      alert('Unable to submitListing at this time. Please try again later.');
    });
  } else {
    alert('Please fill out the house information!');
  }
}

function inputValidation () {
  return ($('#squareFootIn').val()!='' && $('#costIn').val()!='' && $('#typeSel').val()!='' && $('#cityIn').val()!='' && $('#imageSel').val()!='');
}



function deleteListing () {
  console.log('Delete btn works');
  const id = $(this).closest('.card').data('id');
  $.ajax({
    method: 'DELETE',
    url: '/listings/' + id
  }).then(response=>{
    getListings();
  }).catch(function(error) {
    console.log('Error in DELETE client side', error)
    alert('Unable to deleteListing at this time. Please try again later.');
  });
}// end deleteListing

// For commmas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
