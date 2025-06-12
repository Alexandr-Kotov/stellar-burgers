describe('Конструктор бургера — добавление ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('ингредиент можно перетащить в конструктор', () => {
    cy.get('[data-cy="ingredient-card"]').first().as('ingredient');

    cy.get('[data-cy="constructor-area"]').as('constructor');

    cy.get('[data-cy="ingredient-card"]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();
    cy.get('[data-cy="constructor-area"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3 (верх)'
    );
    cy.get('[data-cy="constructor-area"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3 (низ)'
    );

    cy.get('[data-cy="ingredient-card"]')
      .contains('Хрустящие минеральные кольца')
      .parent()
      .find('button')
      .click();
    cy.get('[data-cy="constructor-area"]').contains(
      'Хрустящие минеральные кольца'
    );

    cy.get('[data-cy="ingredient-card"]')
      .contains('Говяжий метеорит (отбивная)')
      .parent()
      .find('button')
      .click();
    cy.get('[data-cy="constructor-area"]').contains(
      'Говяжий метеорит (отбивная)'
    );

    cy.get('[data-cy="ingredient-card"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();
    cy.get('[data-cy="constructor-area"]').contains('Соус Spicy-X');
  });
});
describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('открывается при клике на ингредиент', () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains('Флюоресцентная булка R2-D3')
      .click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"] h3').should('contain.text', 'Детали ингредиента');
  });

  it('закрывается по крестику', () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains('Флюоресцентная булка R2-D3')
      .click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывается по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains('Флюоресцентная булка R2-D3')
      .click();

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Процесс создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Заказ оформлен',
        order: { number: 12345 }
      },
    }).as('createOrder');

    cy.setCookie('accessToken', 'fake-access-token');
    cy.setCookie('refreshToken', 'fake-refresh-token');

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-access-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: { user: { name: 'Test User', email: 'test@example.com' } },
    }).as('getUser');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('создает заказ, открывает модалку с номером заказа и очищает конструктор', () => {
    cy.get('[data-cy="ingredient-card"]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();

    cy.get('[data-cy="constructor-area"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3 (верх)'
    );
    cy.get('[data-cy="constructor-area"]').should(
      'contain.text',
      'Флюоресцентная булка R2-D3 (низ)'
    );

    cy.get('[data-cy="ingredient-card"]')
      .contains('Говяжий метеорит (отбивная)')
      .parent()
      .find('button')
      .click();

    cy.get('[data-cy="constructor-area"]').should(
      'contain.text',
      'Говяжий метеорит (отбивная)'
    );

    cy.contains('button', 'Оформить заказ').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('h2.text_type_digits-large').should('contain.text', '12345');

    cy.get('[data-cy="modal-close-button"]').click();

    cy.get('[data-cy="constructor-area"]').should(
      'not.contain.text',
      'Флюоресцентная булка R2-D3'
    );
    cy.get('[data-cy="constructor-area"]').should(
      'not.contain.text',
      'Хрустящие минеральные кольца'
    );
  });
});

