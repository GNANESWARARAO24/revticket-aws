# Angular Signals Quick Reference Guide

## Why Signals?

This app uses **Angular's Zoneless Change Detection** which requires signals for reactive state management.

---

## Basic Signal Usage

### Creating Signals

```typescript
import { signal, computed } from '@angular/core';

// Primitive values
loading = signal(false);
count = signal(0);
name = signal('');

// Objects
user = signal<User | null>(null);

// Arrays
items = signal<Item[]>([]);
```

### Reading Signal Values

```typescript
// In TypeScript
if (this.loading()) {
  console.log('Loading...');
}

const currentCount = this.count();
const userName = this.user()?.name;

// In Templates (automatic unwrapping)
<div *ngIf="loading()">Loading...</div>
<p>{{ count() }}</p>
<p>{{ user()?.name }}</p>
```

### Updating Signals

```typescript
// Set new value
this.loading.set(true);
this.count.set(42);
this.name.set('John');

// Update based on current value
this.count.update(current => current + 1);
this.items.update(items => [...items, newItem]);

// For objects
this.user.set({ id: '1', name: 'John' });
this.user.update(user => ({ ...user, name: 'Jane' }));
```

---

## Computed Signals

Automatically recalculate when dependencies change:

```typescript
// Simple computed
doubleCount = computed(() => this.count() * 2);

// Computed with multiple dependencies
fullName = computed(() => {
  const first = this.firstName();
  const last = this.lastName();
  return `${first} ${last}`;
});

// Computed with filtering
filteredItems = computed(() => {
  const search = this.searchTerm().toLowerCase();
  return this.items().filter(item => 
    item.name.toLowerCase().includes(search)
  );
});

// Computed with complex logic
summary = computed(() => {
  const items = this.items();
  return {
    total: items.length,
    active: items.filter(i => i.active).length,
    sum: items.reduce((acc, i) => acc + i.value, 0)
  };
});
```

---

## Common Patterns

### Loading Data

```typescript
export class MyComponent implements OnInit {
  data = signal<Data[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    this.service.getData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
```

### Search & Filter

```typescript
export class ListComponent {
  allItems = signal<Item[]>([]);
  searchTerm = signal('');
  selectedCategory = signal('');
  
  // Automatically updates when dependencies change
  filteredItems = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    
    return this.allItems().filter(item => {
      const matchesSearch = !search || 
        item.name.toLowerCase().includes(search);
      const matchesCategory = !category || 
        item.category === category;
      return matchesSearch && matchesCategory;
    });
  });
  
  onSearch(term: string) {
    this.searchTerm.set(term);
  }
  
  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
  }
}
```

### Pagination

```typescript
export class PaginatedComponent {
  items = signal<Item[]>([]);
  currentPage = signal(1);
  itemsPerPage = signal(10);
  
  totalPages = computed(() => 
    Math.ceil(this.items().length / this.itemsPerPage())
  );
  
  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.items().slice(start, end);
  });
  
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
  
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
```

### Form State

```typescript
export class FormComponent {
  formData = signal({
    name: '',
    email: '',
    age: 0
  });
  
  submitting = signal(false);
  errors = signal<Record<string, string>>({});
  
  updateField(field: string, value: any) {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }
  
  submit() {
    this.submitting.set(true);
    this.errors.set({});
    
    this.service.submit(this.formData()).subscribe({
      next: () => {
        this.submitting.set(false);
        // Reset form
        this.formData.set({ name: '', email: '', age: 0 });
      },
      error: (err) => {
        this.errors.set(err.errors);
        this.submitting.set(false);
      }
    });
  }
}
```

### Toggle State

```typescript
export class ToggleComponent {
  isOpen = signal(false);
  
  toggle() {
    this.isOpen.update(open => !open);
  }
  
  open() {
    this.isOpen.set(true);
  }
  
  close() {
    this.isOpen.set(false);
  }
}
```

### Array Operations

```typescript
export class ArrayComponent {
  items = signal<Item[]>([]);
  
  // Add item
  addItem(item: Item) {
    this.items.update(items => [...items, item]);
  }
  
  // Remove item
  removeItem(id: string) {
    this.items.update(items => 
      items.filter(item => item.id !== id)
    );
  }
  
  // Update item
  updateItem(id: string, updates: Partial<Item>) {
    this.items.update(items =>
      items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }
  
  // Clear all
  clearItems() {
    this.items.set([]);
  }
  
  // Sort
  sortItems(compareFn: (a: Item, b: Item) => number) {
    this.items.update(items => [...items].sort(compareFn));
  }
}
```

---

## Template Usage

### Displaying Signal Values

```html
<!-- Simple value -->
<p>{{ count() }}</p>

<!-- Object property -->
<p>{{ user()?.name }}</p>

<!-- Array length -->
<p>Total: {{ items().length }}</p>

<!-- Computed signal -->
<p>{{ filteredItems().length }} results</p>
```

### Conditional Rendering

```html
<!-- *ngIf -->
<div *ngIf="loading()">Loading...</div>
<div *ngIf="!loading() && items().length > 0">
  <!-- Content -->
</div>

<!-- *ngFor -->
<div *ngFor="let item of items()">
  {{ item.name }}
</div>

<!-- *ngFor with computed -->
<div *ngFor="let item of filteredItems()">
  {{ item.name }}
</div>
```

### Event Handlers

```html
<!-- Direct signal update -->
<button (click)="loading.set(true)">Load</button>

<!-- Method call -->
<button (click)="toggle()">Toggle</button>

<!-- With parameter -->
<input (input)="searchTerm.set($event.target.value)">
```

### Class & Style Binding

```html
<!-- Class binding -->
<div [class.active]="isActive()">Content</div>
<div [class.loading]="loading()">Content</div>

<!-- Style binding -->
<div [style.display]="isVisible() ? 'block' : 'none'">
  Content
</div>
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This

```typescript
// Forgetting to call signal as function
if (this.loading) { } // Wrong!

// Direct assignment
this.count = 5; // Wrong!

// Mutating array directly
this.items().push(newItem); // Wrong!

// Not using computed for derived state
filterItems() {
  this.filteredItems = this.items.filter(...); // Wrong!
}
```

### ✅ Do This Instead

```typescript
// Call signal as function
if (this.loading()) { }

// Use .set()
this.count.set(5);

// Use .update() with new array
this.items.update(items => [...items, newItem]);

// Use computed signal
filteredItems = computed(() => 
  this.items().filter(...)
);
```

---

## Migration Checklist

When converting a component to signals:

- [ ] Replace all state properties with signals
- [ ] Convert derived state to computed signals
- [ ] Update all reads to call signal as function: `value()`
- [ ] Update all writes to use `.set()` or `.update()`
- [ ] Remove manual filtering/calculation methods
- [ ] Update template to call signals: `{{ value() }}`
- [ ] Test all user interactions
- [ ] Verify data loads on first navigation

---

## Performance Tips

1. **Use computed for derived state** - They only recalculate when dependencies change
2. **Avoid unnecessary signal calls in loops** - Store value in variable if used multiple times
3. **Use .update() for transformations** - More efficient than get + set
4. **Keep computed signals pure** - No side effects
5. **Don't create signals in loops** - Create them at component level

---

## Debugging

### Check Signal Value

```typescript
console.log('Current value:', this.mySignal());
```

### Track Signal Changes

```typescript
effect(() => {
  console.log('Signal changed:', this.mySignal());
});
```

### Verify Computed Dependencies

```typescript
myComputed = computed(() => {
  console.log('Recomputing...');
  return this.dependency1() + this.dependency2();
});
```

---

## Resources

- [Angular Signals Documentation](https://angular.io/guide/signals)
- [Zoneless Change Detection](https://angular.io/guide/experimental/zoneless)
- Project: `NAVIGATION_FIX_SUMMARY.md` for implementation examples

---

## Quick Reference Card

| Operation | Code |
|-----------|------|
| Create | `signal(initialValue)` |
| Read | `mySignal()` |
| Write | `mySignal.set(newValue)` |
| Update | `mySignal.update(fn)` |
| Computed | `computed(() => ...)` |
| Effect | `effect(() => ...)` |

---

**Remember**: In zoneless mode, signals are not optional - they're required for reactive UI updates!
