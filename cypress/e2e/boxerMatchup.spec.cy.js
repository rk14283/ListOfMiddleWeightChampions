describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/");
  }),
    it("main boxer wins", () => {
      cy.visit("http://localhost:3000/");
      cy.get("#filters").select(["Alan Minter"]);

      cy.get("#opponents").select(["Thomas Hearns"]);
      cy.contains("button", "Box").click();
      cy.contains("#winnerIs", "Alan Minter won");
      cy.get("#imageOne").should(
        "have.css",
        "background-color",
        "rgb(0, 128, 0)"
      );
      cy.get("#imageTwo").should(
        "have.css",
        "background-color",
        "rgb(255, 0, 0)"
      );
    });

  it("opponent Boxer Wins", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Thomas Hearns"]);

    cy.get("#opponents").select(["Sugar Ray Robinson"]);
    cy.contains("button", "Box").click();
    cy.contains("#winnerIs", "Sugar Ray Robinson won");
  });
  it("It is a draw", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Marvelous Marvin Hagler"]);

    cy.get("#opponents").select(["Sugar Ray Leonard"]);
    cy.contains("button", "Box").click();
    cy.contains("#winnerIs", "it's a draw");
  });
  it("Image Div color refreshes when another boxer is selected", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#filters").select(["Marvelous Marvin Hagler"]);

    cy.get("#opponents").select(["Sugar Ray Leonard"]);
    cy.contains("button", "Box").click();
    cy.contains("#winnerIs", "it's a draw");

    cy.get("#opponents").select(["Thomas Hearns"]);
    cy.get("#imageOne").should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)"
    );
    cy.get("#imageTwo").should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)"
    );
  });
});
