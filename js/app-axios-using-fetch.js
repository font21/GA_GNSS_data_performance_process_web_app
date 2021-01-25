//////////////////////////
//  HeadLibrary
//  Random User Api Link: https://randomuser.me/api/?results=10
//  API Documentation: https://randomuser.me/documentation#format
//////////////////////////
//Psuedo Code:
//Pull Data from API
//Render user data to article element
//Make clicking on a user trigger a click event
//when event trigger user details populate in aside element
//Pulling the Data

axios('https://randomuser.me/api/?results=10')
	.then((response) => {
		// Test
		response = response.data;
		console.log(response);
		
		// storing main containers in variables
        const $userDisplay = $('article');
		const $aside = $('aside div');

        //looping over the array of users
        for (user of response.results) {
            //creates the user
            const $div = $('<div>').html(`<img src=${user.picture.large}>
            <h3>${user.name.first} ${user.name.last}</h3>`);
			const testString = `it works! ${user.name.first} ${user.name.last}`;
			
            //interpolate string with user data to rendering user detail
            const renderString = `<h1>${user.name.first} ${user.name.last}</h1>
            <img src="${user.picture.large}">
            <h3>${user.cell}</h3>
            <h3>${user.email}</h3>
            <h3>${user.location.country}</h3>`;
            //make the user clickable
            $div.on('click', (event) => {
                //replace html in the div with the renderString
                $aside.html(renderString);
            });
            //append the user
            $userDisplay.append($div);
        }
    })
    .catch((error) => {
        console.log(error);
    });
