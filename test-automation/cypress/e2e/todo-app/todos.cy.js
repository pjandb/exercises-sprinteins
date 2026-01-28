describe("To-Do App - Cypress Tests", () => {
  beforeEach(() => {
    // Besuche die App vor jedem Test
    cy.visit("http://localhost:3000");
  });

  it("should add a new task", () => {
    cy.get('#todo-input').type("Buy milk");
    cy.get("#category-select").select("Personal");
    cy.get("#todo-form button[type='submit']").click();

    cy.contains("Buy milk").should("be.visible");
    
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass eine neue Aufgabe hinzugefügt wird.
  });

  it("should mark a task as completed", () => {
    // click Complete button
    
  cy.get("#todo-list")
      .contains("Buy milk")
      .parent()
      .within(() => {
        cy.contains("Complete").click();
      });

  // check if className was updated to li.todo.completed from li.todo

  cy.get("#todo-list li.todo.completed").contains("Buy milk");
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass eine Aufgabe als "completed" markiert wird.
  });

  it("should delete a task", () => {
    // cy.wait(2000)

    cy.get("#todo-list")
      .contains("Buy milk")
      .parent()
      .within(() => {
        cy.contains("Delete").click();
      });

    cy.get("#todo-list").contains("Buy milk").should("not.exist");
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass eine Aufgabe gelöscht wird.
  });

  // create new todo
  it("should edit a task", () => {

    // override prompt function with stub
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("Buy Honey")
    });

    // create new to do to edit
    cy.get('#todo-input').type("Buy Cheese");
    cy.get("#category-select").select("Personal");
    cy.get("#todo-form button[type='submit']").click();



    // click edit button
    cy.get("#todo-list")
      .contains("Buy Cheese")
      .parent()
      .within(() => {
        cy.contains("Edit").click();
      });

    // reset complete status (is changed in BE on put request)
    cy.contains("Buy Honey")
      .parent()
      .within(() => {
        cy.contains("Undo").click();
    });

    cy.get("#todo-list").contains("Buy Honey");
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass der Titel einer Aufgabe bearbeitet werden kann.
  });

  it("should search for tasks", () => {
    cy.get('#search-input').type("Ca");

    cy.wait(3000);

    cy.get("#todo-list").contains("Call mom");

    // Add: test that only one list entry exists

    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass die Suchfunktion korrekt funktioniert.
  });

  it("should persist tasks after page reload", () => {
    cy.get("#todo-list li.todo").then(($items) => {
    const count = $items.length;

    cy.reload();
    cy.get("#todo-list").contains("Buy Honey");  

    cy.get("#todo-list li.todo").should("have.length", count);


    });
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass Aufgaben nach einem Seiten-Reload erhalten bleiben.
  });

  it("should show validation error for empty input", () => {

    // clear input field, click submit
    cy.get("#todo-input").clear();
    cy.get("#category-select").select("Work");
    cy.get("#todo-form button[type='submit']").click();

    // check validity of input to be false
     cy.get("#todo-input")
    .then($input => {
      expect($input[0].checkValidity()).to.be.false;
    });
    // Aufgabe: Schreibe einen Test, um sicherzustellen, dass keine leeren Aufgaben hinzugefügt werden können.
  });
});
