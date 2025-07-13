import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
import Swal from 'sweetalert2';
import { ShoppingCartService } from '../../services/shoppingCart-service/shopping-cart.service';
import { Router } from '@angular/router';
import { PSOMain } from '../../Models/SalesOrder/SalesOrder';
import { SalesOrderService } from '../../services/customer-service/sales-order/sales-order.service';
import { debounceTime, elementAt, Subject, Subscription } from 'rxjs';

declare var bootstrap: any;

// https://apptest-bng.s3.ap-south-1.amazonaws.com/Efacto+Test/ITEM/RM0000045831_N4AXL.jpeg

interface FilterOption {
  BrnCode: string;
  BrnId: string;
  BrnName: string;
  Id: string;
  Text: string;
  Value: string;
  Value1: string | null;
  Value2: string | null;
  Value3: string | null;
  Value4: string | null;
}

interface FilterCategory {
  title: string;
  options: FilterOption[];
  key: string;
  loading?: boolean;
}

interface ProductFilters {
  division?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  season?: string[];
  occasion?: string[];
  gender?: string;
  baseItem?: string;
  variant?: string;
  colors?: string[];
}

interface Product {
  name: string;
  stockId: string;
  price: number;
  stock: number;
  imageUrl: string;
  quantity?: number;
  filters?: ProductFilters;
}

@Component({
  selector: 'app-shopping-cart',
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    NgClass,
    NgxSliderModule,
    NgbTooltipModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  @ViewChild('cartModalRef') cartModalRef!: ElementRef;
  @ViewChild('filterModalRef') filterModalRef!: ElementRef;
  @ViewChild('cardSectionRef') cardSectionRef!: ElementRef;
  @ViewChild('catalougeSearchBox') catalougeSerachBoxRef!: ElementRef;

  private editingSubscription!: Subscription;

  private filterModalInstance: any;
  private cartModalInstance: any;

  get anyFilterSlected(): boolean {
    return Object.values(this.selectedFilters).some(
      (filters) => filters.length > 0
    );
  }

  searchText: string = '';
  sortByDropDownOpen = false;
  categoryDropDownOpen = false;
  filterTopDropDownOpen = false;
  filterTopList = false;
  sideFilterMobile = false;
  cartCloseBtn = false;
  sortByOptions: any = [
    { title: 'Popularity', key: '101' },
    { title: 'All Products', key: '102' },
    { title: 'Price: High to Low', key: '103' },
    { title: 'Price: Low to High', key: '104' },
    { title: 'Discount', key: '105' },
  ];
  selectedOption = 'All Products';
  selectedCategoryOption: string = '';

  selectedFilters: { [key: string]: string[] } = {
    Division: [],
    Category: [],
  };
  currentModalFilter: FilterCategory | null = null;
  inStock: boolean = false;
  withImage: boolean = false;
  // productImgUrl: string =
  //   'https://apptest-bng.s3.ap-south-1.amazonaws.com/Efacto%20Test/ITEM/';
  productImgUrl: string = 'https://apptest-bng.s3.ap-south-1.amazonaws.com/';
  products: any[] = [];
  cart: any[] = [];
  itemDetailsResponse: any[] = [];
  salesOrder: PSOMain = {} as PSOMain;
  isCartEditing = false;
  catalougeSuggestions: any[] = [];
  catalougeSearchString: Subject<string> = new Subject<string>();
  itemCatalougeList: any[] = [];
  selectedCatalougeItems: any[] = [];
  catalougeDropdownOpen = false;
  actId = 1;
  CartMode: string = '';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private sharedService: SharedService,
    private salesOrderService: SalesOrderService,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.filters.forEach((filter) => {
      this.selectedFilters[filter.title] = [];
    });
    // this.catalougeSearchString
    //   .pipe(debounceTime(1000))
    //   .subscribe((searchText) => {
    //     if (searchText) {
    //       this.shoppingCartService
    //         .getItemCatalougeList(searchText, this.actId)
    //         .subscribe((response) => {
    //           this.catalougeSuggestions = response?.OrdCatSearchList || [];
    //         });
    //     } else {
    //       this.catalougeSuggestions = [];
    //     }
    //   });
  }

  ngOnInit() {
    this.sharedService.cartMode$.subscribe((mode) => {
      this.CartMode = mode;
    });

    this.editingSubscription = this.shoppingCartService.isEditing$.subscribe(
      (value) => {
        this.isCartEditing = value;
      }
    );

    this.setEditableItems();

    this.getCatalougeList();

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngAfterViewInit() {
    const cartModalElement = this.cartModalRef.nativeElement;
    const filterModalElement = this.filterModalRef.nativeElement;
    this.renderer.appendChild(document.body, cartModalElement);
    this.renderer.appendChild(document.body, filterModalElement);
  }

  ngOnDestroy() {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: any) {
    if (!event.target.closest('.catalouge-dropdown')) {
      this.catalougeDropdownOpen = false;
    }
  }

  toggleCatalougeDropdown() {
    this.catalougeDropdownOpen = true;
    console.log(this.catalougeDropdownOpen);
  }

  isCatalougeSelected(item: any): boolean {
    return this.selectedCatalougeItems.some(
      (selected) => selected.Id === item.Id
    );
  }

  getSelectedCatalogueItemsText() {
    const names = this.selectedCatalougeItems
      .slice(0, 5)
      .map((item) => item.Text);
    const extra =
      this.selectedCatalougeItems.length > 5
        ? ` +${this.selectedCatalougeItems.length - 5} more`
        : '';
    return names.join(', ') + extra;
  }

  selectedCatalogueItems: any[] = [];

  selectCatalouge(item: any): void {
    const exists = this.selectedCatalougeItems.some((i) => i.Id === item.Id);
    if (!exists) {
      this.selectedCatalogueItems.push(item);
    }
  }

  removeCatalogue(item: any): void {
    this.selectedCatalogueItems = this.selectedCatalogueItems.filter(
      (i) => i.Id !== item.Id
    );
  }

  onCatalougeCheckboxChange(event: Event, item: any) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCatalougeItems.push(item);
    } else {
      this.selectedCatalougeItems = this.selectedCatalougeItems.filter(
        (i) => i.Id !== item.Id
      );
    }
    this.products = [];
    this.productLoader = true;
    this.filterPayload.fromPrice = this.minValue;
    this.filterPayload.toPrice = this.maxValue;
    this.filterPayload.catId = 0;
    this.filterPayload.catType = '';
    this.filterPayload.pageNumber = 1;
    this.filterPayload.orderCatelogName = this.selectedCatalougeItems
      .map((i) => i.Id)
      .join(', ');
    this.filterPayload.vdate = new Date().toLocaleDateString('en-US');
    const filters = JSON.stringify(this.filterPayload);

    this.shoppingCartService.getItems(filters).subscribe({
      next: (res: any) => {
        const items = res?.ShopCartItemCatgoryList ?? [];
        items.forEach((item: any) => {
          const price = item?.Itemprices?.[0];
          if (price) {
            price.ShowPrice = price.MRP;
            price.Stock = price.Vstock + price.Fstock;
            this.products.push(item);
          }
        });
        this.productLoader = false;
      },
      error: (err) => {
        this.productLoader = false;
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error getting Items',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      },
    });
  }

  itemCatalougeSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.catalougeSearchString.next(input.value);
  }

  // itemCatalougeListChange(event: Event) {
  //   const selectedOption = (event.target as HTMLSelectElement).selectedOptions;
  //   this.selectedCatalougeListItems = Array.from(selectedOption).map(
  //     (option) => {
  //       const id = option.value;
  //       return this.itemCatalougeList.find((item) => item.Id === id);
  //     }
  //   );
  //   console.log('Selected Items: ', this.selectedCatalougeListItems);
  // }

  getCatalougeList() {
    this.shoppingCartService
      .getItemCatalougeList(this.actId)
      .subscribe((response) => {
        this.itemCatalougeList = response?.OctCatList || [];
        console.log(this.itemCatalougeList);
      });
  }

  selectedCatalougeSuggestion(mkey: string) {
    this.catalougeSuggestions = [];
    this.shoppingCartService
      .getItemCatalougeByMkey(mkey)
      .subscribe((response) => {
        const details = response?.OrdCat?.OcdCatDetails ?? [];
        this.products = details.map((item: any) => ({
          ItmId: item.OcdItmId,
          ItmCode: item.OcdItmCode,
          ItmName: item.OcdItmName,
          ItmPrintAs: item.OcdItmName,
          ItmSpec: item.OcdSpec || '',
          ItmImageFile: '',
          ItmImage: item.OcdItmImage || '',
          ItmMrp: item.OcdMrp || 0.0,
          ItmQty: item.OcdQty || 0,
          ItmPackUntCode: item.OcdItmPackUntCode || '',
          ItmUntId: item.OcdUntId,
          ItmBaseUntId: item.OcdBaseUntId,
          ItmBaseUntCode: item.OcdBaseUntCode,

          Itemprices: [
            {
              Batch: null,
              Vstock: item.OcdVStock || 0,
              Astock: item.OcdAStock || 0,
              Rstock: 0,
              Fstock: item.OcdFStock || 0,
              Ocstock: 0,
              Expdate: null,
              Pack: item.OcdPack || '',
              Saleprice: item.OcdSaleprice || 0,
              Trfprice: item.OcdTrfprice || 0,
              Dlrprice: item.OcdDlrprice || 0,
              Onlprice: item.OcdSaleprice || 0,
              Costprice: item.OcdCostprice || 0,
              MarginType: null,
              GstRate: item.OcdGstRate || 0,
              PriceCode: null,
              MRP: item.OcdMrp || 0,
              MarginCode: null,
              MarginRate: 0.0,
              AvgCostprice: item.OcdCostprice || 0,
              WogCost: item.OcdCostprice || 0,
              Mkey: null,
              Rowno: 0,
              Subrowno: 0,
              Code: null,
              Description: null,
              Qty: 0,
              Unit: null,
              ItmPriceMethod: item.OcdItmPriceMethod || null,
              OnlMarkRate: 0.0,
              DlrMarkRate: 0.0,
              TrfMarkRate: 0.0,
              SaleMarkRate: 0.0,
              SaleMarka: null,
              TrfMarka: null,
              DlrMarka: null,
              OnlMarka: null,
              ItmExpirable: item.OcdItmExpirable || false,
              Stock: item.OcdAStock || 0,
              UnitFactorType: 'X',
              UnitFactor: item.OcdUnitFactor || 1.0,
              ShowPrice: item.OcdMrp,
              AddDate: null,
              RefDate: null,
            },
          ],
        }));
      });
  }

  @HostListener('document:click', ['$event'])
  onDoucmentClick(event: MouseEvent): void {
    if (
      this.catalougeSerachBoxRef &&
      !this.catalougeSerachBoxRef.nativeElement.contains(event.target)
    ) {
      this.catalougeSuggestions = [];
    }
  }

  toggleDropdown() {
    this.sortByDropDownOpen = !this.sortByDropDownOpen;
  }
  toggleCategoryDropdown() {
    this.categoryDropDownOpen = !this.categoryDropDownOpen;
  }

  selectOption(option: any) {
    this.selectedOption = option.title;
    this.sortByDropDownOpen = false;
    switch (option.key) {
      case '103':
        this.products.sort((a, b) => {
          const priceA = a?.Itemprices?.[0]?.ShowPrice ?? 0;
          const priceB = b?.Itemprices?.[0]?.ShowPrice ?? 0;
          return priceB - priceA;
        });
        break;
      case '104':
        this.products.sort((a, b) => {
          const priceA = a?.Itemprices?.[0]?.ShowPrice ?? 0;
          const priceB = b?.Itemprices?.[0]?.ShowPrice ?? 0;
          return priceA - priceB;
        });
        break;
      default:
        break;
    }
  }

  selectCategoryOption(option: string) {
    this.selectedCategoryOption = option;
    this.categoryDropDownOpen = false;
  }

  filterSingleDropdownOpen = false;

  toggleFilterSingleDropdown() {
    this.filterSingleDropdownOpen = !this.filterSingleDropdownOpen;
  }

  toggleFilterTopDropdown() {
    this.filterTopDropDownOpen = !this.filterTopDropDownOpen;
  }

  toggleFilterTopList() {
    this.filterTopList = !this.filterTopList;
  }

  closeShoppingCart() {
    this.router.navigate(['/customer/sales-order']);
  }

  toggleSideFilterMobile() {
    this.sideFilterMobile = !this.sideFilterMobile;
  }

  openFilterModal(filter: any) {
    this.currentModalFilter = filter;
    this.filterModalInstance = new bootstrap.Modal(
      this.filterModalRef.nativeElement,
      {
        backdrop: false,
      }
    );
    this.filterModalInstance.show();
  }

  closeFilterModal() {
    if (this.filterModalInstance) {
      this.filterModalInstance.hide();
    }
  }

  searchOptions: any = [
    { title: 'All' },
    { title: 'Division' },
    { title: 'Category' },
    { title: 'Sub Category' },
    { title: 'Brand' },
    { title: 'Season' },
    { title: 'Occasion' },
    { title: 'Gender' },
    { title: 'Base' },
    { title: 'Variant' },
    { title: 'size' },
    { title: 'Color' },
    { title: 'Attribute1' },
    { title: 'Attribute2' },
    { title: 'Attribute3' },
    { title: 'Attribute4' },
  ];

  selectedSearchOpitionDisplay: string = 'All';

  searchOption(option: string) {
    this.selectedSearchOpitionDisplay = option;
  }

  searchProducts() {
    if (this.searchText === '') {
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Search input cannot be empty!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
    } else {
      this.filterPayload.searchType = this.selectedSearchOpitionDisplay;
      this.filterPayload.searchValue = this.searchText;
    }
    this.applyFilters();
    this.searchText === '';
  }

  onFilterChange(title: string, optionId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (!this.selectedFilters[title]) {
      this.selectedFilters[title] = [];
    }
    if (isChecked) {
      if (!this.selectedFilters[title].includes(optionId)) {
        this.selectedFilters[title].push(optionId);
      }
    } else {
      this.selectedFilters[title] = this.selectedFilters[title].filter(
        (id) => id !== optionId
      );
    }
    const filterMap: { [key: string]: string } = {
      Division: 'divFilter',
      Category: 'catFilter',
      'Sub Category': 'subCatFilter',
      Brand: 'brandFilter',
      Season: 'seasonFilter',
      Occasion: 'occFilter',
      Gender: 'genderFilter',
      'Base Item': 'baseItmFilter',
      Variant: 'varFilter',
      Size: 'sizeFilter',
      Color: 'colorFilter',
      Attribute1: 'atrribute1Filter',
      Attribute2: 'atrribute2Filter',
      Attribute3: 'atrribute3Filter',
      Attribute4: 'atrribute4Filter',
    };

    const payloadKey = filterMap[title];

    if (payloadKey) {
      const selected = this.selectedFilters[title];
      if (selected.length > 0) {
        this.filterPayload[payloadKey] = selected.join(',');
      } else {
        delete this.filterPayload[payloadKey];
      }
    }
  }

  applyFilters(): void {
    this.products = [];
    this.productLoader = true;
    this.filterPayload.fromPrice = this.minValue;
    this.filterPayload.toPrice = this.maxValue;
    this.filterPayload.catId = 0;
    this.filterPayload.catType = '';
    this.filterPayload.pageNumber = 1;
    this.filterPayload.vdate = new Date().toLocaleDateString('en-US');
    const filters = JSON.stringify(this.filterPayload);

    this.shoppingCartService.getItems(filters).subscribe({
      next: (res: any) => {
        const items = res?.ShopCartItemCatgoryList ?? [];
        items.forEach((item: any) => {
          const price = item?.Itemprices?.[0];
          if (price) {
            price.ShowPrice = price.MRP;
            price.Stock = price.Vstock + price.Fstock;
            this.products.push(item);
          }
        });
        this.productLoader = false;
      },
      error: (err) => {
        this.productLoader = false;
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error getting Items',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      },
    });
  }

  isDataLoading = false;
  hasMoreData = true;

  onScrollDataLoad() {
    const el = this.cardSectionRef.nativeElement;
    if (!el || !this.hasMoreData || this.isDataLoading) return;

    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom) {
      this.isDataLoading = true;
      this.filterPayload.pageNumber += 1;
      this.filterPayload.vdate = new Date().toLocaleDateString('en-US');
      const filters = JSON.stringify(this.filterPayload);

      this.shoppingCartService.getItems(filters).subscribe({
        next: (res: any) => {
          if (res?.ShopCartItemCatgoryList.length === 0) {
            this.hasMoreData = false;
          } else {
            const items = res?.ShopCartItemCatgoryList ?? [];
            items.forEach((item: any) => {
              const price = item?.Itemprices?.[0];
              if (price) {
                price.ShowPrice = price.MRP;
                price.Stock = price.Vstock + price.Fstock;
                this.products.push(item);
              }
            });
          }
          this.isDataLoading = false;
        },
        error: () => {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Error getting Items',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        },
      });
    }
  }

  onInStockChange(event: Event): void {
    this.inStock = (event.target as HTMLInputElement).checked;
    this.filterPayload.withStock = this.inStock;
  }

  onWithImageChange(event: Event): void {
    this.withImage = (event.target as HTMLInputElement).checked;
    this.filterPayload.withImage = this.withImage;
  }

  minValue: number = 1;
  maxValue: number = 100000;
  options: Options = {
    floor: 1,
    ceil: 100000,
    step: 1,
    enforceRange: true,
    translate: (value: number): string => {
      return '₹' + value.toLocaleString();
    },
  };

  priceFilter() {}

  resetFilterSection(title: string, key: string): void {
    this.selectedFilters[title] = [];
    const checkboxes = document.querySelectorAll(
      `input[type="checkbox"][id^="${title.replace(
        ' ',
        '-'
      )}-"], input[type="checkbox"][id^="modal-"]`
    );
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
    delete this.filterPayload[key];
  }

  resetFilters(): void {
    this.filters.forEach((filter) => {
      this.selectedFilters[filter.title] = [];
      delete this.filterPayload[filter.key];
    });
    this.inStock = true;
    this.currentModalFilter = null;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
    // const inStockToggle = document.getElementById(
    //   'inStockToggle'
    // ) as HTMLInputElement;
    // if (inStockToggle) inStockToggle.checked = false;
    // const withImgToggle = document.getElementById(
    //   'inStockToggle'
    // ) as HTMLInputElement;
    // if (withImgToggle) inStockToggle.checked = false;
  }

  filterProducts(): void {
    // const searchTerm = this.searchText.toLowerCase().trim();
    // // First apply all filters
    // let filtered = this.products.filter((product) => {
    //   // Price range filter
    //   if (
    //     product.price < this.priceRange.min ||
    //     product.price > this.priceRange.max
    //   ) {
    //     return false;
    //   }
    //   // Search text filter (if search term exists)
    //   if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
    //     return false;
    //   }
    //   // In Stock filter
    //   if (this.inStock && product.stock <= 0) {
    //     return false;
    //   }
    //   //Priace RangeFilter
    //   // Category filters
    //   return this.filters.every((filter) => {
    //     const selectedOptionIds = this.selectedFilters[filter.title];
    //     if (!selectedOptionIds.length) return true;
    //     const selectedLabels = filter.options
    //       .filter((option) => selectedOptionIds.includes(option.id))
    //       .map((option) => option.label);
    //     if (
    //       !product.filters ||
    //       !product.filters[
    //         filter.title.toLowerCase().replace(' ', '') as keyof ProductFilters
    //       ]
    //     ) {
    //       return selectedOptionIds.length === 0;
    //     }
    //     if (
    //       filter.title === 'Color' ||
    //       filter.title === 'Season' ||
    //       filter.title === 'Occasion'
    //     ) {
    //       const productValues =
    //         (product.filters[
    //           filter.title
    //             .toLowerCase()
    //             .replace(' ', '') as keyof ProductFilters
    //         ] as string[]) || [];
    //       return productValues.some((value) => selectedLabels.includes(value));
    //     }
    //     const productValue =
    //       product.filters[
    //         filter.title.toLowerCase().replace(' ', '') as keyof ProductFilters
    //       ];
    //     return selectedLabels.includes(productValue as string);
    //   });
    // });
    // // sorting based on selectedOption
    // switch (this.selectedOption) {
    //   case 'Price: High to Low':
    //     filtered = filtered.sort((a, b) => b.price - a.price);
    //     break;
    //   case 'Price: Low to High':
    //     filtered = filtered.sort((a, b) => a.price - b.price);
    //     break;
    //   case 'Popularity':
    //     // Implement popularity sorting if you have a popularity metric
    //     // For now, we'll just sort by name as an example
    //     filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    //     break;
    //   case 'Discount':
    //     filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    //     break;
    //   case 'All Products':
    //   default:
    //     break;
    // }
    // this.filteredProducts = filtered;
  }
  // localStorage.setItem(
  //   'UsrBrnId',

  filterPayload: {
    [key: string]: any;
    brnId: string;
    fyrId: number;
    wrhId: number;
    vdate: string;
    cmpId: number;
    mkey: string;
    withStock: boolean;
    allowNegStock: boolean;
    brnType: string;
    itemType: string;
    isWrhUnderIncl: boolean;
    btpCode: string;
    getpriceCode: boolean;
    priceAt: string;
    maxLength: number;
    catType: string;
    catId: number;
    searchType?: string;
    searchValue?: string;
    tempName: string;
    pageNumber: number;
    fromPrice: number;
    toPrice: number;
    stockFilter: boolean;
    withImage: boolean;
    orderCatelogName: string;
  } = {
    brnId: sessionStorage.getItem('UsrBrnId') || '',
    fyrId: 25,
    wrhId: 0,
    vdate: '',
    cmpId: 1,
    mkey: '',
    withStock: false,
    allowNegStock: true,
    brnType: '',
    itemType: '',
    isWrhUnderIncl: false,
    btpCode: 'SO',
    getpriceCode: false,
    maxLength: 10,
    catType: '',
    catId: 0,
    priceAt: 'MRP',
    searchType: '',
    searchValue: '',
    tempName: '',
    pageNumber: 1,
    fromPrice: 0,
    toPrice: 0,
    stockFilter: true,
    withImage: false,
    orderCatelogName: '',
  };

  selectedNavFilterTitleDisplay = 'Select a filter';
  selectedNavFilterTitle: any = null;
  selectedNavFilterOptionId = '';
  productLoader: boolean = false;

  selectNavFilterTitle(filter: any) {
    this.filterTopDropDownOpen = !this.filterTopDropDownOpen;
    this.selectedNavFilterTitleDisplay = filter.title;
    this.selectedNavFilterOptionId = '';

    this.onDropDownOpen(filter);
    this.selectedNavFilterTitle = this.filters.find(
      (f) => f.title === filter.title
    );
  }

  selectNavFilterOption(optionId: string) {
    this.productLoader = true;
    if (this.filterTopList === true) {
      this.filterTopList = false;
    }
    this.products = [];
    this.selectedNavFilterOptionId = optionId;
    this.filterPayload.pageNumber = 1;
    this.filterPayload.fromPrice = this.minValue;
    this.filterPayload.toPrice = this.maxValue;
    this.filterPayload.vdate = new Date().toLocaleDateString('en-US');
    this.filterPayload.catType = this.selectedNavFilterTitle?.title || '';
    this.filterPayload.catId = optionId ? parseInt(optionId, 10) : 0;

    const filters = JSON.stringify(this.filterPayload);

    this.shoppingCartService.getItems(filters).subscribe({
      next: (res: any) => {
        const items = res?.ShopCartItemCatgoryList ?? [];
        items.forEach((item: any) => {
          const price = item?.Itemprices?.[0];
          if (price) {
            price.ShowPrice = price.MRP;
            price.Stock = price.Vstock + price.Fstock;
            this.products.push(item);
          }
        });
        console.log(res);
        this.productLoader = false;
      },
      error: (err) => {
        this.productLoader = false;
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Error getting Items',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      },
    });
  }

  // selectNavFilterTitle(filter: any) {
  //   this.selectedNavFilterTitleDisplay = filter.title;
  //   this.selectedNavFilterTitle = filter;
  //   this.selectedNavFilterOptionId = '';
  // }
  selectedSideFilter: any = null;

  filterSideModal(filter: any) {
    console.log(filter);
    this.selectedSideFilter = filter;
  }

  addToCart(product: any) {
    try {
      const existing = this.cart.find((item) => item.ItmId === product.ItmId);
      if (existing) {
        Swal.fire({
          toast: true,
          icon: 'warning',
          title: 'Item already in cart',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      } else {
        this.cart.push(product);
        Swal.fire({
          toast: true,
          position: 'top',
          title: 'Product added successfully',
          iconHtml: '<div style="font-size: 1.5rem">🛒</div>',
          background: '#f8f9fa',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            // popup: 'swal-toast',
            // icon: 'no-border',
            // title: 'swal-title',
          },
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  increaseItmCardQty(product: any): void {
    product.ItmQty = (product.ItmQty || 1) + 1;
  }

  decreaseItmCardQty(product: any): void {
    if (product.ItmQty && product.ItmQty > 1) {
      product.ItmQty--;
    }
  }

  buyNow(product: Product) {
    // Check if product is already in cart
    const existingProduct = this.cart.find(
      (item) => item.stockId === product.stockId
    );

    if (existingProduct) {
      this.openCartModal();
    } else {
      this.addToCart(product);
      this.openCartModal();
    }
  }

  openCartModal() {
    if (this.cart === null || this.cart.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Cart is empty',
        text: 'Please add items to the cart before proceeding.',
      });
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Cart is empty',
        // text: 'Please add items to the cart before proceeding.',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      return;
    }
    this.cartModalInstance = new bootstrap.Modal(
      this.cartModalRef.nativeElement,
      {
        backdrop: false,
      }
    );
    this.cartModalInstance.show();
  }

  closeCartModal() {
    if (this.cartModalInstance) {
      this.cartModalInstance.hide();
    }
  }

  removeItem(item: any) {
    this.cart = this.cart.filter((i) => i !== item);
  }

  incrementQty(product: any) {
    if (!product.ItmQty) product.ItmQty = 1;
    product.ItmQty++;
  }

  decrementQty(product: any) {
    if (!product.ItmQty) product.ItmQty = 1;
    if (product.ItmQty > 1) product.ItmQty--;
  }

  get cartQty() {
    return this.cart.length;
  }
  get totalQty() {
    return this.cart.reduce((sum, item) => sum + (item.ItmQty || 1), 0);
  }

  get totalAmount(): number {
    return this.cart.reduce(
      (total, item) => total + item.Itemprices[0].MRP * (item.ItmQty || 1),
      0
    );
  }
  checkout() {
    if (this.cart.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Cart is empty',
        text: 'Please add items to the cart before proceeding.',
      });
      return;
    }

    if (this.isCartEditing) {
      const editableItem = this.salesOrderService.getEditableItem();
      this.salesOrder = {
        mKey: editableItem.mkey,
        itmCount: this.cart.length,
        itmQty: this.cart.reduce((sum, item) => sum + (item.ItmQty || 0), 0),
        netAmount: this.cart.reduce(
          (sum, item) =>
            sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
          0
        ),
        modUser: sessionStorage.getItem('UsrAddUser') || '',
        psoItems: this.cart.map((item) => {
          const price = item.Itemprices[0];
          const qty = item.ItmQty || 1;
          const rate = price?.MRP || 0;

          return {
            itmId: item.ItmId,
            pack: price?.Pack || '',
            mrp: rate,
            rate: rate,
            qty: qty,
            unitId: item.ItmUntId || 0,
            unitFactor: price?.UnitFactor || 1,
            netAmount: qty * rate,
            stock: price?.Stock || 0,
            baseQty: qty * (price?.UnitFactor || 1),
            baseUnitId: item.ItmBaseUntId || 0,
            remarks: '',
          };
        }),
      };
      this.salesOrderService.updateSalesOrder(this.salesOrder).subscribe({
        next: (res) => {
          this.closeCartModal();
          Swal.fire({
            icon: 'success',
            title: 'Checkout successful',
            showConfirmButton: false,
            timer: 1000,
          });
          this.salesOrderService.clearEditableItem();
          this.cart = [];
          this.router.navigate(['/customer/sales-order']);
        },
        error: (err) => {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'We were not able to update your order.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        },
      });
    } else {
      this.salesOrder = {
        cmpId: Number(sessionStorage.getItem('UsrCtrlCmpId')),
        brnId: Number(sessionStorage.getItem('UsrBrnId')),
        acmId: Number(sessionStorage.getItem('UsrLinkAcmId')),
        vtype: 'PSO',
        itmCount: this.cart.length,
        itmQty: this.cart.reduce((sum, item) => sum + (item.ItmQty || 0), 0),
        netAmount: this.cart.reduce(
          (sum, item) =>
            sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
          0
        ),
        status: 'CREATED',
        statusCode: 1,
        addUser: sessionStorage.getItem('UsrAddUser') || '',
        modUser: '',
        psoItems: this.cart.map((item) => {
          const price = item.Itemprices[0];
          const qty = item.ItmQty || 1;
          const rate = price?.MRP || 0;

          return {
            itmId: item.ItmId,
            pack: price?.Pack || '',
            mrp: rate,
            rate: rate,
            qty: qty,
            unitId: item.ItmUntId || 0,
            unitFactor: price?.UnitFactor || 1,
            netAmount: qty * rate,
            stock: price?.Stock || 0,
            baseQty: qty * (price?.UnitFactor || 1),
            baseUnitId: item.ItmBaseUntId || 0,
            remarks: '',
          };
        }),
      };

      this.salesOrderService.postSalesOrder(this.salesOrder).subscribe({
        next: (res) => {
          this.closeCartModal();
          Swal.fire({
            icon: 'success',
            title: 'Checkout successful',
            showConfirmButton: false,
            timer: 1000,
          });
          this.cart = [];
          this.router.navigate(['/customer/sales-order']);
        },
        error: (err) => {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'We were not able to create your order.',
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
        },
      });
    }
  }

  setEditableItems() {
    const editableItem = this.salesOrderService.getEditableItem();
    if (!editableItem?.psoItems?.length) return;

    this.cart = editableItem.psoItems.map((psoItem: any) => {
      const item: any = {
        ItmId: psoItem.itmId,
        ItmCode: psoItem.itmCode,
        ItmName: psoItem.itmName,
        ItmMrp: 0.0,
        ItmQty: psoItem.qty,
        Itemprices: [
          {
            MRP: psoItem.mrp,
            ShowPrice: psoItem.mrp,
          },
        ],
      };

      return item;
    });
  }

  filters: FilterCategory[] = [
    {
      title: 'Division',
      options: [],
      key: 'divFilter',
    },
    { title: 'Category', options: [], key: 'catFilter' },
    { title: 'Sub Category', options: [], key: 'subCatFilter' },
    { title: 'Brand', options: [], key: 'brandFilter' },
    { title: 'Season', options: [], key: 'seasonFilter' },
    { title: 'Occasion', options: [], key: 'occFilter' },
    { title: 'Gender', options: [], key: 'genderFilter' },
    { title: 'Base Item', options: [], key: 'baseItmFilter' },
    { title: 'Variant', options: [], key: 'VarFilter' },
    { title: 'size', options: [], key: 'sizeFilter' },
    { title: 'Color', options: [], key: 'colorFilter' },
    { title: 'Attribute1', options: [], key: 'atrribute1Filter' },
    { title: 'Attribute2', options: [], key: 'atrribute2Filter' },
    { title: 'Attribute3', options: [], key: 'atrribute3Filter' },
    { title: 'Attribute4', options: [], key: 'atrribute4Filter' },
  ];

  onDropDownOpen(filter: any) {
    if (filter.options.length === 0) {
      filter.loading = true;
      this.shoppingCartService.getFilterOptionsTop(filter.title).subscribe({
        next: (res: any) => {
          filter.options = res?.ShopCartCatgoryList || [];
          filter.loading = false;
        },
        error: (err) => {
          console.error('Failed to load options:', err);
        },
        complete: () => {
          filter.loading = false;
        },
      });
    }
  }
}
