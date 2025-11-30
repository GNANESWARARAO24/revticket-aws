describe('Screens Configuration', () => {
  const API_URL = 'http://localhost:8080/api';
  
  const mockTheatres = [
    { id: '1', name: 'PVR Cinemas', location: 'Mumbai', totalScreens: 5 },
    { id: '2', name: 'INOX', location: 'Delhi', totalScreens: 3 }
  ];

  const mockScreens = [
    { id: 's1', name: 'Screen 1', totalSeats: 100, theaterId: '1', isActive: true },
    { id: 's2', name: 'Screen 2', totalSeats: 150, theaterId: '1', isActive: true }
  ];

  const mockScreenConfig = {
    id: 's1',
    name: 'Screen 1',
    theatreId: '1',
    rows: 10,
    seatsPerRow: 10,
    totalSeats: 100,
    categories: [
      { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6', inheriting: false },
      { id: 'c2', name: 'Regular', price: 150, color: '#3B82F6', inheriting: false }
    ],
    seatMap: []
  };

  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/admin/theatres`, mockTheatres).as('getTheatres');
    cy.intercept('GET', `${API_URL}/admin/theatres/1/screens`, mockScreens).as('getScreens');
    cy.intercept('GET', `${API_URL}/admin/screens/s1`, mockScreenConfig).as('getScreenConfig');
    cy.visit('/admin/screens');
    cy.wait('@getTheatres');
  });

  it('should complete full screen configuration workflow', () => {
    cy.get('#theatre-select').select('PVR Cinemas');
    cy.wait('@getScreens');
    cy.get('#screen-select').select('+ Create New Screen');
    cy.get('#screen-name').clear().type('Screen 3');
    cy.get('#rows-input').clear().type('8');
    cy.get('#seats-input').clear().type('12');
    cy.contains('96').should('be.visible');
    cy.contains('button', 'Add Category').click();
    cy.get('#new-cat-name').type('VIP');
    cy.get('#new-cat-price').clear().type('350');
    cy.contains('button', 'Add Category').click();
    cy.contains('VIP').should('be.visible');
    cy.get('#assign-category').select('Premium');
    cy.get('#from-row').select('Row A');
    cy.get('#to-row').select('Row B');
    cy.contains('button', 'Apply to Rows').click();
    cy.get('.seat').first().click();
    cy.get('.seat').eq(1).click();
    cy.get('.sticky-bottom').should('be.visible');
    cy.intercept('POST', `${API_URL}/admin/screens`, {
      statusCode: 200,
      body: { ...mockScreenConfig, id: 's3', name: 'Screen 3' }
    }).as('saveScreen');
    cy.contains('button', 'Save Configuration').click();
    cy.wait('@saveScreen');
    cy.contains('Screen configuration saved successfully').should('be.visible');
  });

  it('should handle save error gracefully', () => {
    cy.get('#theatre-select').select('PVR Cinemas');
    cy.wait('@getScreens');
    cy.get('#screen-select').select('+ Create New Screen');
    cy.intercept('POST', `${API_URL}/admin/screens`, {
      statusCode: 400,
      body: { message: 'Invalid configuration' }
    }).as('saveError');
    cy.get('#screen-name').clear().type('Test Screen');
    cy.contains('button', 'Save Configuration').click();
    cy.wait('@saveError');
    cy.contains('Failed to save screen configuration').should('be.visible');
  });
});
