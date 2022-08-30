describe("Initial layout", () => {
  before(() => {
    cy.intercept("GET", "https://wttr.in", {}).as("fetchWeather");
    cy.visit("/");
  });

  it("has a text heading with the project title", () => {
    cy.get("h1:first-of-type").should("have.text", "Weather App");
  });

  it("has a search form with a label, text input, submit input", () => {
    cy.get("header form")
      .should("exist")
      .get("form input[type='text']")
      .should("exist")
      .get("form input[type='submit']")
      .should("exist");
  });

  it("has a main section of the page that requests the user to choose a location", () => {
    cy.get("main")
      .should("exist")
      .within(() => {
        cy.contains("Choose a location to view the weather");
      });
  });

  it("has a sidebar section of the page that includes a 'Previous Searches' section", () => {
    cy.get("aside section")
      .should("exist")
      .should("contain.text", "Previous Searches");
  });
  it("If there are no previous searches, there is text that reads `No previous searches", () => {
    cy.get("aside section").within(() => {
      cy.get("p")
        .should("exist")
        .should("contain.text", "No previous searches");
    });
  });
});

describe("Get details from text input", () => {
  before(() => {
    cy.intercept("GET", "https://wttr.in/Melbourne*", {
      fixture: "melbourne.json",
    }).as("fetchMelbourne");
  });
  it("should allow the user to search for a location and show them current weather information", () => {
    cy.get("header form input[type='text']")
      .type("Melbourne")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchMelbourne");
    cy.get("main")
      .should("contain.text", "Melbourne")
      .should("contain.text", "Victoria")
      .should("contain.text", "Australia")
      .should("contain.text", "47");
  });
});

describe("Get 3 forecast days", () => {
  it("should also show the user information for current and the next few days", () => {
    cy.get("main")
      .should("contain.text", "49")
      .should("contain.text", "51")
      .should("contain.text", "52")
      .should("contain.text", "53")
      .should("contain.text", "54")
      .should("contain.text", "55")
      .should("contain.text", "57");
  });
});

describe("Keep track of previous searches", () => {
  it("should also store searches with the name and current 'feels like' temperature in the sidebar", () => {
    cy.get("aside section")
      .should("contain.text", "Melbourne")
      .should("contain.text", "47")
      .not("contain.text", "No previous searches");
  });

  it("if the sidebar link is clicked, the main section should be populated with that weather information", () => {
    cy.intercept("GET", "https://wttr.in/Melbourne*", {
      fixture: "melbourne.json",
    }).as("fetchMelbourne");

    cy.get("aside section a").first().click();

    cy.get("main")
      .should("contain.text", "Melbourne")
      .should("contain.text", "Victoria")
      .should("contain.text", "Australia")
      .should("contain.text", "47");
    cy.get("main")
      .should("contain.text", "49")
      .should("contain.text", "51")
      .should("contain.text", "52")
      .should("contain.text", "53")
      .should("contain.text", "54")
      .should("contain.text", "55")
      .should("contain.text", "57");
  });
  it("should update both the main section of the page and the sidebar if another search is made", () => {
    cy.intercept("GET", "https://wttr.in/Seattle*", {
      fixture: "seattle.json",
    }).as("fetchSeattle");

    cy.get("header form input[type='text']")
      .type("Seattle")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchSeattle");

    cy.get("main article")
      .should("contain.text", "Seattle")
      .should("contain.text", "Washington")
      .should("contain.text", "United States of America")
      .should("contain.text", "56")
      .should("contain.text", "61")
      .should("contain.text", "64")
      .should("contain.text", "65")
      .should("contain.text", "67")
      .should("contain.text", "74")
      .should("contain.text", "78")
      .should("contain.text", "90");

    cy.get("aside section")
      .children()
      .should("contain.text", "Melbourne")
      .should("contain.text", "Seattle");
  });
  it("after clicking the sidebar link, another entry for the same location should not be made", () => {
    cy.get("ul li a").contains("Melbourne").click();
    cy.get("aside section")
      .children()
      .should("contain.text", "Melbourne")
      .should("contain.text", "Seattle")
      .should("have.length", 2);
  });
});

describe("Add message handling for imperfect location matching", () => {
  it("Can have the same entry name and area name", () => {
    cy.intercept("GET", "https://wttr.in/Seattle*", {
      fixture: "seattle.json",
    }).as("fetchSeattle");

    cy.get("header form input[type='text']")
      .type("Seattle")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchSeattle");
    cy.get(`main article h2`).contains("Seattle");
    cy.get(`main article  p`).contains("Area");
    cy.get(`main article  p`).contains("Seattle");
  });
  it("Can have the different entry name and area name", () => {
    cy.intercept("GET", "https://wttr.in/mamaroneck*", {
      fixture: "mamaroneck.json",
    }).as("fetchMamaroneck");

    cy.get("header form input[type='text']")
      .type("mamaroneck")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchMamaroneck");

    cy.get(`main article  h2`).contains("mamaroneck");
    cy.get(`main article  p`).contains("Nearest Area");
    cy.get(`main article  p`).contains("Orienta");
  });
});

describe("Add icon based on chance data", () => {
  // include more data in current
  it("Has a Chance of Sunshine p tag with appropriate data", () => {
    cy.intercept("GET", "https://wttr.in/mamaroneck*", {
      fixture: "mamaroneck.json",
    }).as("fetchMamaroneck");
    cy.get("header form input[type='text']")
      .type("mamaroneck")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchMamaroneck");
    cy.get(`main article p`).contains("Chance of Sunshine");
    cy.get(`main article  p`).contains("53");
  });
  it("Has a Chance of Rain p tag with appropriate data", () => {
    cy.get(`main article  p`).contains("Chance of Rain");
    cy.get(`main article  p`).contains("0");
  });
  it("Has a Chance of Snow p tag with appropriate data", () => {
    cy.get(`main article  p`).contains("Chance of Snow");
  });

  // sunny icon
  it("Will have a sunny icon if there is more than a 50% chance of sunshine", () => {
    cy.intercept("GET", "https://wttr.in/Seattle*", {
      fixture: "seattle.json",
    }).as("fetchSeattle");

    cy.get("header form input[type='text']")
      .type("Seattle")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchSeattle");
    cy.get(`img`).invoke("attr", "alt").should("eq", "sun");
    cy.get(`img`)
      .invoke("attr", "src")
      .should("eq", "./assets/icons8-summer.gif");
  });

  it("Will have a torrential-rain icon if there is more than a 50% chance of rain", () => {
    cy.intercept("GET", "https://wttr.in/Melbourne*", {
      fixture: "melbourne.json",
    }).as("fetchMelbourne");
    cy.get("header form input[type='text']")
      .type("Melbourne")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchMelbourne");
    cy.get(`img`).invoke("attr", "alt").should("eq", "rain");
    cy.get(`img`)
      .invoke("attr", "src")
      .should("eq", "./assets/icons8-torrential-rain.gif");
  });

  it("Will have a light-snow icon if there is more than a 50% chance of sunshine", () => {
    cy.intercept("GET", "https://wttr.in/Kenai*", {
      fixture: "kenai.json",
    }).as("fetchKenai");

    cy.get("header form input[type='text']")
      .type("Kenai")
      .get("header form input[type='submit']")
      .click();
    cy.wait("@fetchKenai");
    cy.get(`img`).invoke("attr", "alt").should("eq", "snow");
    cy.get(`img`)
      .invoke("attr", "src")
      .should("eq", "./assets/icons8-light-snow.gif");
  });
});

describe("It has a widget that allows users to convert C to F or F to C", () => {
  it("has a form, with one number input, two radio buttons and a submit", () => {
    cy.get("aside form").should("exist");
    cy.get("#to-c")
      .should("exist")
      .invoke("attr", "type")
      .should("eq", "radio");
    cy.get("#to-f")
      .should("exist")
      .invoke("attr", "type")
      .should("eq", "radio");
    cy.get("aside form").within(() => {
      cy.get("input[type='submit']").should("exist");
    });
  });

  it("can convert to Celsius", () => {
    cy.get("#temp-to-convert").clear().type("100");
    cy.get("#to-c").click();
    cy.get("aside form").submit();
    cy.get("aside h4").contains("37.78");
  });
  it("can convert to Fahrenheit", () => {
    cy.get("#temp-to-convert").clear().type("100");
    cy.get("#to-f").click();
    cy.get("aside form").submit();
    cy.get("aside h4").contains("212");
  });
});
