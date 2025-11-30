import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ScreensComponent } from './screens.component';
import { AlertService } from '../../../core/services/alert.service';
import { environment } from '../../../../environments/environment';

describe('ScreensComponent', () => {
  let component: ScreensComponent;
  let fixture: ComponentFixture<ScreensComponent>;
  let httpMock: HttpTestingController;
  let alertService: jasmine.SpyObj<AlertService>;

  const mockTheatres = [
    { id: '1', name: 'Theatre 1', location: 'Location 1', totalScreens: 3, defaultCategories: [] },
    { id: '2', name: 'Theatre 2', location: 'Location 2', totalScreens: 2, defaultCategories: [] }
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
      { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
    ],
    seatMap: []
  };

  beforeEach(async () => {
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [ScreensComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreensComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load theatres on init', () => {
      component.ngOnInit();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/theatres`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTheatres);

      expect(component.theatres().length).toBe(2);
      expect(component.theatres()[0].name).toBe('Theatre 1');
    });

    it('should handle theatre loading error', () => {
      component.ngOnInit();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/theatres`);
      req.error(new ProgressEvent('error'));

      expect(component.theatres().length).toBe(0);
      expect(alertService.error).toHaveBeenCalledWith('Failed to load theatres');
    });
  });

  describe('Theatre Selection', () => {
    beforeEach(() => {
      component.theatres.set(mockTheatres);
    });

    it('should load screens when theatre is selected', () => {
      component.selectedTheatreId.set('1');
      component.onTheatreChange();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/theatres/1/screens`);
      expect(req.request.method).toBe('GET');
      req.flush(mockScreens);

      expect(component.screens().length).toBe(2);
    });

    it('should reset screen selection when theatre changes', () => {
      component.selectedScreenId.set('s1');
      component.seatMap.set([{ seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: null, status: 'available' }]);

      component.onTheatreChange();

      expect(component.selectedScreenId()).toBe('');
      expect(component.seatMap().length).toBe(0);
    });

    it('should load default categories when theatre is selected', () => {
      component.selectedTheatreId.set('1');
      component.loadDefaultCategories();

      expect(component.categories().length).toBeGreaterThan(0);
      expect(component.categories()[0].name).toBeTruthy();
    });
  });

  describe('Screen Configuration', () => {
    it('should create new screen configuration', () => {
      component.screens.set(mockScreens);
      component.selectedScreenId.set('new');
      component.createNewScreen();

      expect(component.screenName()).toBe('Screen 3');
      expect(component.hasUnsavedChanges()).toBe(true);
    });

    it('should load existing screen configuration', () => {
      component.selectedScreenId.set('s1');
      component.loadScreenConfig('s1');

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/screens/s1`);
      req.flush(mockScreenConfig);

      expect(component.screenName()).toBe('Screen 1');
      expect(component.rows()).toBe(10);
      expect(component.seatsPerRow()).toBe(10);
    });

    it('should generate seat map based on layout', () => {
      component.rows.set(5);
      component.seatsPerRow.set(10);
      component.generateSeatMap();

      expect(component.seatMap().length).toBe(50);
      expect(component.seatMap()[0].label).toBe('A1');
      expect(component.seatMap()[10].label).toBe('B1');
    });

    it('should warn before changing layout with existing seats', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.seatMap.set([{ seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: 'c1', status: 'available' }]);

      component.onLayoutChange();

      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('Category Management', () => {
    beforeEach(() => {
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' },
        { id: 'c2', name: 'Regular', price: 150, color: '#3B82F6' }
      ]);
    });

    it('should add new category', () => {
      component.addCategory();

      expect(component.categories().length).toBe(3);
      expect(component.categories()[2].name).toBe('New Category');
      expect(component.hasUnsavedChanges()).toBe(true);
    });

    it('should update category', () => {
      component.updateCategory('c1', 'name', 'Super Premium');

      expect(component.categories()[0].name).toBe('Super Premium');
      expect(component.hasUnsavedChanges()).toBe(true);
    });

    it('should delete category', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteCategory('c1');

      expect(component.categories().length).toBe(1);
      expect(component.categories()[0].id).toBe('c2');
    });

    it('should not delete last category', () => {
      component.categories.set([{ id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }]);
      component.deleteCategory('c1');

      expect(alertService.error).toHaveBeenCalledWith('At least one category is required');
      expect(component.categories().length).toBe(1);
    });

    it('should unassign seats when category is deleted', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.seatMap.set([
        { seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: 'c1', status: 'available' }
      ]);

      component.deleteCategory('c1');

      expect(component.seatMap()[0].categoryId).toBeNull();
    });
  });

  describe('Quick Assign', () => {
    beforeEach(() => {
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
      ]);
      component.rows.set(5);
      component.seatsPerRow.set(10);
      component.generateSeatMap();
    });

    it('should apply category to row range', () => {
      component.quickAssignCategory.set('c1');
      component.quickAssignFromRow.set(0);
      component.quickAssignToRow.set(2);
      component.applyQuickAssign();

      const assignedSeats = component.seatMap().filter(s => s.categoryId === 'c1');
      expect(assignedSeats.length).toBe(30);
      expect(alertService.success).toHaveBeenCalled();
    });

    it('should not apply without category selection', () => {
      component.quickAssignCategory.set('');
      component.applyQuickAssign();

      expect(alertService.error).toHaveBeenCalledWith('Please select a category');
    });

    it('should validate row range', () => {
      component.quickAssignCategory.set('c1');
      component.quickAssignFromRow.set(3);
      component.quickAssignToRow.set(1);
      component.applyQuickAssign();

      expect(alertService.error).toHaveBeenCalledWith('From row must be less than or equal to To row');
    });

    it('should not override booked seats', () => {
      component.seatMap.update(seats =>
        seats.map((s, i) => i === 0 ? { ...s, status: 'booked' as const } : s)
      );

      component.quickAssignCategory.set('c1');
      component.quickAssignFromRow.set(0);
      component.quickAssignToRow.set(0);
      component.applyQuickAssign();

      expect(component.seatMap()[0].categoryId).toBeNull();
    });
  });

  describe('Seat Assignment', () => {
    beforeEach(() => {
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
      ]);
      component.rows.set(2);
      component.seatsPerRow.set(2);
      component.generateSeatMap();
    });

    it('should assign category to seat', () => {
      const seat = component.seatMap()[0];
      component.assignCategory(seat, 'c1');

      expect(component.seatMap()[0].categoryId).toBe('c1');
      expect(component.hasUnsavedChanges()).toBe(true);
    });

    it('should not assign category to booked seats', () => {
      component.seatMap.update(seats =>
        seats.map((s, i) => i === 0 ? { ...s, status: 'booked' as const } : s)
      );

      const seat = component.seatMap()[0];
      component.assignCategory(seat, 'c1');

      expect(component.seatMap()[0].categoryId).toBeNull();
    });

    it('should toggle seat disabled status', () => {
      const seat = component.seatMap()[0];
      component.toggleSeatDisabled(seat);

      expect(component.seatMap()[0].status).toBe('disabled');
      expect(component.hasUnsavedChanges()).toBe(true);
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      component.selectedTheatreId.set('1');
      component.screenName.set('Screen 1');
      component.rows.set(10);
      component.seatsPerRow.set(10);
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
      ]);
      component.generateSeatMap();
    });

    it('should validate successfully with valid data', () => {
      expect(component.validate()).toBe(true);
      expect(component.validationErrors().length).toBe(0);
    });

    it('should fail validation without theatre', () => {
      component.selectedTheatreId.set('');
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('Please select a theatre');
    });

    it('should fail validation without screen name', () => {
      component.screenName.set('');
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('Screen name is required');
    });

    it('should fail validation with invalid rows', () => {
      component.rows.set(0);
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('Rows must be between 1 and 26');
    });

    it('should fail validation with invalid seats per row', () => {
      component.seatsPerRow.set(100);
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('Seats per row must be between 1 and 50');
    });

    it('should fail validation without categories', () => {
      component.categories.set([]);
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('At least one category is required');
    });

    it('should fail validation with invalid category price', () => {
      component.categories.update(cats =>
        cats.map(c => ({ ...c, price: 0 }))
      );
      expect(component.validate()).toBe(false);
      expect(component.validationErrors()).toContain('All category prices must be greater than 0');
    });
  });

  describe('Save Configuration', () => {
    beforeEach(() => {
      component.selectedTheatreId.set('1');
      component.screenName.set('Screen 1');
      component.rows.set(10);
      component.seatsPerRow.set(10);
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
      ]);
      component.generateSeatMap();
    });

    it('should save new screen configuration', () => {
      component.selectedScreenId.set('new');
      component.saveScreen();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/screens`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.name).toBe('Screen 1');
      expect(req.request.body.theatreId).toBe('1');

      req.flush({ ...mockScreenConfig, id: 's3' });

      expect(alertService.success).toHaveBeenCalledWith('Screen saved successfully');
      expect(component.hasUnsavedChanges()).toBe(false);
    });

    it('should update existing screen configuration', () => {
      component.selectedScreenId.set('s1');
      component.saveScreen();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/screens/s1`);
      expect(req.request.method).toBe('PUT');

      req.flush(mockScreenConfig);

      expect(alertService.success).toHaveBeenCalled();
    });

    it('should not save with validation errors', () => {
      component.screenName.set('');
      component.saveScreen();

      expect(alertService.error).toHaveBeenCalledWith('Please fix validation errors');
      httpMock.expectNone(`${environment.apiUrl}/admin/screens`);
    });

    it('should handle save error', () => {
      component.selectedScreenId.set('new');
      component.saveScreen();

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/screens`);
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      expect(alertService.error).toHaveBeenCalled();
      expect(component.saving()).toBe(false);
    });
  });

  describe('Computed Properties', () => {
    it('should compute selected theatre', () => {
      component.theatres.set(mockTheatres);
      component.selectedTheatreId.set('1');

      expect(component.selectedTheatre()?.name).toBe('Theatre 1');
    });

    it('should compute total seats excluding disabled', () => {
      component.seatMap.set([
        { seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: null, status: 'available' },
        { seatId: 'A2', label: 'A2', row: 0, col: 1, categoryId: null, status: 'disabled' },
        { seatId: 'A3', label: 'A3', row: 0, col: 2, categoryId: null, status: 'available' }
      ]);

      expect(component.totalSeats()).toBe(2);
    });
  });

  describe('Helper Methods', () => {
    it('should get row label correctly', () => {
      expect(component.getRowLabel(0)).toBe('A');
      expect(component.getRowLabel(1)).toBe('B');
      expect(component.getRowLabel(25)).toBe('Z');
    });

    it('should get seats for specific row', () => {
      component.rows.set(3);
      component.seatsPerRow.set(5);
      component.generateSeatMap();

      const row1Seats = component.getRowSeats(1);
      expect(row1Seats.length).toBe(5);
      expect(row1Seats[0].label).toBe('B1');
    });

    it('should get seat price from category', () => {
      component.categories.set([
        { id: 'c1', name: 'Premium', price: 250, color: '#8B5CF6' }
      ]);

      const seat = { seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: 'c1', status: 'available' as const };
      expect(component.getSeatPrice(seat)).toBe(250);
    });

    it('should return 0 for seat without category', () => {
      const seat = { seatId: 'A1', label: 'A1', row: 0, col: 0, categoryId: null, status: 'available' as const };
      expect(component.getSeatPrice(seat)).toBe(0);
    });
  });
});
