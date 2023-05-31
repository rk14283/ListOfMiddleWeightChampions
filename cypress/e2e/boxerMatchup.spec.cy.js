const GREEN = "rgb(0, 128, 0)";
const RED = "rgb(255, 0, 0)";
const YELLOW = "rgb(255, 255, 0)";
const NO_COLOR = "rgba(0, 0, 0, 0)";

describe("Boxing Middleweight Fantasy Matchup", () => {
  it("The Home Page loads successfully", () => {
    cy.visit("http://localhost:3000/");
  });

  it("The user can select a boxer and an opponent, simulate a fight and see him win", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Alan Minter"]);

    cy.get("#opponents").select(["Thomas Hearns"]);
    cy.contains("button", "Box").click();
    cy.contains("#winnerIs", "Alan Minter won");

    cy.get("#imageOne").should("have.css", "background-color", GREEN);
    cy.get("#imageTwo").should("have.css", "background-color", RED);
  });

  it("The user can select a boxer and an opponent, simulate a fight and see him lose", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Thomas Hearns"]);

    cy.get("#opponents").select(["Sugar Ray Robinson"]);
    cy.contains("button", "Box").click();
    cy.contains("#winnerIs", "Sugar Ray Robinson won");
  });

  it("The user can select a boxer and an opponent, simulate a fight and see them draw.", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Carmen Basilio"]);

    cy.get("#opponents").select(["Dmitry Pirog"]);
    cy.contains("button", "Box").click();

    cy.contains("#winnerIs", "it's a draw");
    cy.get("#imageOne").should("have.css", "background-color", YELLOW);
    cy.get("#imageTwo").should("have.css", "background-color", YELLOW);
  });

  it("Image Div color resets when another boxer is selected", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Marvelous Marvin Hagler"]);

    cy.get("#opponents").select(["Sugar Ray Leonard"]);
    cy.contains("button", "Box").click();
    cy.get("#imageOne").should("have.css", "background-color", RED);
    cy.get("#imageTwo").should("have.css", "background-color", GREEN);

    cy.get("#opponents").select(["Thomas Hearns"]);
    cy.get("#imageOne").should("have.css", "background-color", NO_COLOR);
    cy.get("#imageTwo").should("have.css", "background-color", NO_COLOR);
  });

  it("The app displays to a user when a fight happened in real life", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Marvelous Marvin Hagler"]);

    cy.get("#opponents").select(["Sugar Ray Leonard"]);
    cy.contains("button", "Box").click();

    cy.contains(
      "#times",
      "Marvelous Marvin Hagler & Sugar Ray Leonard fought once in real life"
    );
    cy.contains("#details", "Sugar Ray Leonard won");
  });
  it("If you only select one boxer and click box, the app will show an error", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Marvelous Marvin Hagler"]);
    cy.contains("button", "Box").click();
    //need an h2
    cy.contains("#crashError", "Please select an opponent");
  });
});
