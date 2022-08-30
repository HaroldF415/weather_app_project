# Weather App Project

For this assignment, you will build a weather application that will make use of the [wttr.in API](https://github.com/chubin/wttr.in) to show the weather in different locations. Your application will also store previous searches.

There are 7 features that need to be created. Each completed feature (passes all the tests) will be worth 1 point.

A minium of 5 points must be attained in order to pass this project.

You may receive partial credit (0.5 points) for code that is close to passing the tests, but does not pass all the tests.

If you have gotten all the tests passing, you are strongly encouraged to work on the CSS/overall appearance of the app and add additional features. A nice weather app project has the potential to be something you could add to your portfolio.

## Project setup

### Getting started

1. Fork and clone this repository.

1. Navigate to the cloned repository's directory on your command line. Then, run the following command:

```
npm install
```

This will install the libraries needed to run the tests.

1. Open up the repository in VSCode. Follow the instructions below to complete the Lab.

### Running your web application

You can run your code by simply opening the `index.html` page provided here. Whenever you make a change, you will need to refresh the page.

Alternatively, you may run the following command which will create a server that runs your site. This will take up your terminal.

```
npm start
```

A page will open in your browser. This page will refresh whenever you save a file in your project.

You can stop the server from running by pressing `Ctrl + C`.

### Tests

To run the tests, you can run the following command from the command line. You will need to be in the root directory of your local directory.

```
npm test
```

This will open the Cypress testing window, where you can click to run an individual suite of tests or all of the tests at once.

## Instructions

### Project Overview

Your web application will allow for users to search for the weather by city. Features and screenshots are included below, however you should first start by running the tests and looking at them to see what is required.

### Design

#### Landing Page

Your web application should look similar to the screenshot below when the page is first loaded.

![Weather App landing page.](./assets/landing.png)

In particular, make sure the following is true:

- [ ] There is a header that includes
  - [ ] The application's title
  - [ ] a search form with a label, text input, and submit input
- [ ] `aside` (will contain a temperature conversion widget), starts empty
- [ ] The `main `section of the page contains placeholder text and contain the following elements:
  - [ ] `article` - this will contain the current weather (starts empty)
  - [ ] `aside` - this will contain 3 `article` elements that will have upcoming weather (starts empty)
- [ ] `aside` (will contain weather history)
  - [ ] `section`
  - [ ] `h4` with the text `Previous Searches`
- [ ] The sidebar includes an empty `ul` and a message inside a `p` element that lets the user know no searches have been made yet
- [ ] CSS Grid should be used to structure the page

#### After Search

After searching, your page should look similar to the screenshot below.

![Weather App after making a single search.](./assets/single-search.png)

In particular, make sure to include the following:

- [ ] The main section of the page should be filled in with relevant information received from the API. (More detailed information below.)
- [ ] Three sections below the main section should show information for the next few days.
- [ ] CSS Grid should be used throughout to structure the page.
- [ ] The sidebar retains a link to the search.

#### Multiple Searches

After multiple searches, the sidebar will continue to fill up with more searches. The most recent search will always be on the bottom.

![Weather App after making multiple searches.](./assets/multiple-searches.png)

The following features are required for your application. These features detail what is needed to pass the tests.

- When a user arrives at the page, they should:
  - [ ] See an `h1` with the text "Weather App" in the header.
  - [ ] See a form in the header that includes both a text and submit input.
  - [ ] See a `main` element on the left side of the page, that suggests that they make a search.
  - [ ] See an `aside` element on the right side of the page, that includes the text "Previous Searches".
- When a user enters text into the search form and presses submit, they should:
  - [ ] See the text disappear from the search bar.
  - [ ] See the name of the city that was searched as well as the area, region, country, and currently "feels like" temperature for that location.
  - [ ] See detailed information for the current day and the next two days below the `main` element.
  - [ ] See the city name and "feels like" temperature show up in the `aside` element.
- If another search is made, the user should:
  - [ ] See the `main` element change to account for the new city, updating all relevant information.
  - [ ] See the new city name appear at the bottom of the list in the `aside` element, with the "feels like" temperature.
- If one of the links in the `aside ul` element is clicked, the user should:
  - [ ] See the main section of the page show weather information about that city.
  - [ ] _Not see_ a new link show up in the `aside ul element.

## Additional Features

You'll be adding more features so your app will look, more or less like so:

![Final version, all features of app](./assets/all-features.png)

### Add message handling for imperfect location matching

Sometimes the town/city searched does not match the area (try `New York`, the area may come up as `Greenwich Village`).

Instead of listing it as `Area`, list it as `Nearest Area`, when there is a mismatch

### Icon based on chance data

In the main article, add three more data points:

- [ ] `Chance of Sunshine`
- [ ] `Chance of Rain`
- [ ] `Chance of Snow`

Find this data in your request object and display it.

Then, write some logic to display the correct icon (see the `assets` folder)

- if there is more than a 50% chance of sunshine, show the `summer` icon with `alt` text `sun`
- if there is more than a 50% chance of rain, show the `torrential-rain` icon with `alt` text `rain`
- if there is more than a 50% chance of snow, show the `light-snow` icon with `alt` text `snow`

**Notice:** there are more icons available to you, you may use them to extend your app, but they are not required for the main part of the project.

### Widget that allows users to convert C to F or F to C

- [ ] In the empty aside, add a form. The form should have
- [ ] A label for `Convert the temperature:`
- [ ] An input `type` `number`, `id` `temp-to-convert`
- [ ] A label for `to-c`
- [ ] An input type `radio` with `id` `to-c`, `name` `convert-temp` ,`value` `c`
- [ ] An input `type` `radio` with `id` `to-f`, `name` `convert-temp`, `value` `f`
- [ ] An input `type` `submit`
- [ ] An `h4` element that will store the result of the calculation

You will need to research the conversion formulas. Limit the results to no more than two decimal places.

### API

The [wttr.in API](https://github.com/chubin/wttr.in) can be used from the command line to display weather information in your terminal. However, you will need to use the JSON format to integrate it into your web application. Read the documentation on the linked GitHub to see how to use the API.

The section below describes specifically how to make a request to the API so that it returns JSON.

- [wttr.in: JSON Output](https://github.com/chubin/wttr.in#json-output)
