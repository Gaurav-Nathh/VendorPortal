import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
import { PSOMain, SODetail, SOMain } from '../../Models/SalesOrder/SalesOrder';
import { SalesOrderService } from '../../services/customer-service/sales-order/sales-order.service';
import { debounceTime, elementAt, filter, Subject, Subscription } from 'rxjs';
import { Product } from '../../Models/customer/product.model';
import { CatalougeType } from '../../Models/customer/catalougeType.modal';
import { UserService } from '../../services/shared/user-service/user.service';
import { ApiConfigService } from '../../services/api-config/api-config.service';

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

@Component({
  selector: 'app-shopping-cart',
  imports: [NgFor, NgIf, FormsModule, NgClass, NgxSliderModule, TooltipModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  @ViewChild('cartModalRef') cartModalRef!: ElementRef;
  @ViewChild('filterModalRef') filterModalRef!: ElementRef;
  @ViewChild('cardSectionRef') cardSectionRef!: ElementRef;
  @ViewChild('catalougeSearchBox') catalougeSerachBoxRef!: ElementRef;
  @ViewChild('categoryCatalougeContainer')
  categoryCatalougeContainer!: ElementRef;

  private editingSubscription!: Subscription;

  private filterModalInstance: any;
  private cartModalInstance: any;

  get anyFilterSlected(): boolean {
    return Object.values(this.selectedFilters).some(
      (filters) => filters.length > 0
    );
  }

  searchText: string = '';
  somType: string = 'Customer Order';
  somDocType: string = 'DIRECT';
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
  inStock: boolean = true;
  withImage: boolean = true;
  productImgUrl: string = '';
  products: any[] = [];
  cart: any[] = [];
  catalougeProducts: any[] = [];
  itemDetailsResponse: any[] = [];
  // salesOrder: PSOMain = {} as PSOMain;
  salesOrder: SOMain = {} as SOMain;
  isCartEditing = false;
  catalougeSuggestions: any[] = [];
  catalougeSearchString: Subject<string> = new Subject<string>();
  itemCatalougeList: any[] = [];
  selectedCatalouges: any[] = [];
  catalougeDropdownOpen = false;
  actId = 1;
  brnId: number = 0;
  CartMode: string = '';
  VoucherTypeList: any = [];
  BtpCode: string = 'SO';
  modelVnoPrefix: string = '';
  modelVtype: string = '';
  bookType: string = 'SO';
  somTId: string = '';
  filteredCatalogueList: any[] = [];
  showSearch = false;
  searchCatalogue: string = '';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private sharedService: SharedService,
    private salesOrderService: SalesOrderService,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService,
    private config: ApiConfigService
  ) {
    this.filters.forEach((filter) => {
      this.selectedFilters[filter.title] = [];
    });
  }

  ngOnInit() {
    this.productImgUrl = this.config.getAWSS3BucketUrl();
    this.brnId = this.userService._user?.UsrBrnId ?? 0;
    this.sharedService.cartMode$.subscribe((mode) => {
      this.CartMode = mode;
    });

    this.editingSubscription = this.shoppingCartService.isEditing$.subscribe(
      (value) => {
        this.isCartEditing = value;
      }
    );
    this.BindDropDown(this.BtpCode);
    this.GetVoucherPrefix();
    this.GetTId();
    // this.setEditableItems();
    this.setEditableItemsSO();

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

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-box')) {
      this.toggleSearch(false);
    }
  }

  handleOutsideClick(event: any) {
    if (!event.target.closest('.catalouge-dropdown')) {
      this.catalougeDropdownOpen = false;
    }
  }

  toggleCatalougeDropdown() {
    this.catalougeDropdownOpen = true;
  }

  // isCatalougeSelected(item: any): boolean {
  //   return this.selectedCatalougeItems.some(
  //     (selected) => selected.Id === item.Id
  //   );
  // }

  // selectCatalouge(catalouge: CatalougeType): void {
  //   const exists = this.selectedCatalouges.some((c) => c.Id === catalouge.Id);
  //   if (!exists) {
  //     this.selectedCatalouges.push(catalouge);
  //     this.getCatalougeItems();
  //   }
  // }

  selectCatalouges(item: any) {
    this.selectCatalouge(item); // your existing function
    this.toggleSearch(false);   // switch back to button after select
  }

  selectCatalouge(item: any): void {
    this.searchCatalogue = item.Text; // Show selected text
    this.categoryDropDownOpen = false; // Close dropdown
    const exists = this.selectedCatalouges.some((c) => c.Id === item.Id);
    if (!exists) {
      this.selectedCatalouges.push(item);
      this.getCatalougeItems();
    }
  }

  removeCatalogue(catalouge: CatalougeType): void {
    this.selectedCatalouges = this.selectedCatalouges.filter(
      (c) => c.Id !== catalouge.Id
    );
    this.getCatalougeItems();
  }

  getCatalougeItems() {
    this.filterPayload.orderCatelogName = this.selectedCatalouges
      .map((i) => i.Id)
      .join(', ');
    this.applyFilters();
  }

  getCatalougeList() {
    this.shoppingCartService
      .getItemCatalougeList(this.actId)
      .subscribe((response) => {
        this.itemCatalougeList = response?.OctCatList || [];
        this.filteredCatalogueList = [...this.itemCatalougeList];
      });
  }

  // selectedCatalougeSuggestion(mkey: string) {
  //   this.catalougeSuggestions = [];
  //   this.shoppingCartService
  //     .getItemCatalougeByMkey(mkey)
  //     .subscribe((response) => {
  //       const details = response?.OrdCat?.OcdCatDetails ?? [];
  //       this.products = details.map((item: any) => ({
  //         ItmId: item.OcdItmId,
  //         ItmCode: item.OcdItmCode,
  //         ItmName: item.OcdItmName,
  //         ItmPrintAs: item.OcdItmName,
  //         ItmSpec: item.OcdSpec || '',
  //         ItmImageFile: '',
  //         ItmImage: item.OcdItmImage || '',
  //         ItmMrp: item.OcdMrp || 0.0,
  //         ItmQty: item.OcdQty || 0,
  //         ItmPackUntCode: item.OcdItmPackUntCode || '',
  //         ItmUntId: item.OcdUntId,
  //         ItmBaseUntId: item.OcdBaseUntId,
  //         ItmBaseUntCode: item.OcdBaseUntCode,

  //         Itemprices: [
  //           {
  //             Batch: null,
  //             Vstock: item.OcdVStock || 0,
  //             Astock: item.OcdAStock || 0,
  //             Rstock: 0,
  //             Fstock: item.OcdFStock || 0,
  //             Ocstock: 0,
  //             Expdate: null,
  //             Pack: item.OcdPack || '',
  //             Saleprice: item.OcdSaleprice || 0,
  //             Trfprice: item.OcdTrfprice || 0,
  //             Dlrprice: item.OcdDlrprice || 0,
  //             Onlprice: item.OcdSaleprice || 0,
  //             Costprice: item.OcdCostprice || 0,
  //             MarginType: null,
  //             GstRate: item.OcdGstRate || 0,
  //             PriceCode: null,
  //             MRP: item.OcdMrp || 0,
  //             MarginCode: null,
  //             MarginRate: 0.0,
  //             AvgCostprice: item.OcdCostprice || 0,
  //             WogCost: item.OcdCostprice || 0,
  //             Mkey: null,
  //             Rowno: 0,
  //             Subrowno: 0,
  //             Code: null,
  //             Description: null,
  //             Qty: 0,
  //             Unit: null,
  //             ItmPriceMethod: item.OcdItmPriceMethod || null,
  //             OnlMarkRate: 0.0,
  //             DlrMarkRate: 0.0,
  //             TrfMarkRate: 0.0,
  //             SaleMarkRate: 0.0,
  //             SaleMarka: null,
  //             TrfMarka: null,
  //             DlrMarka: null,
  //             OnlMarka: null,
  //             ItmExpirable: item.OcdItmExpirable || false,
  //             Stock: item.OcdAStock || 0,
  //             UnitFactorType: 'X',
  //             UnitFactor: item.OcdUnitFactor || 1.0,
  //             ShowPrice: item.OcdMrp,
  //             AddDate: null,
  //             RefDate: null,
  //           },
  //         ],
  //       }));
  //     });
  // }

  @HostListener('document:click', ['$event'])
  onDoucmentClick(event: MouseEvent): void {
    if (
      this.catalougeSerachBoxRef &&
      !this.catalougeSerachBoxRef.nativeElement.contains(event.target)
    ) {
      this.catalougeSuggestions = [];
    }
    const clickedInside =
      this.categoryCatalougeContainer?.nativeElement.contains(event.target);
    if (!clickedInside && this.filterTopDropDownOpen) {
      this.filterTopDropDownOpen = false;
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
    this.router.navigate(['/sales-order']);
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
    if (this.CartMode === 'items') {
      if (this.searchText === '') {
        Swal.fire({
          toast: true,
          icon: 'warning',
          title: 'Search input cannot be empty!',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      this.filterPayload.searchType = this.selectedSearchOpitionDisplay;
      this.filterPayload.searchValue = this.searchText;
      this.applyFilters();
    } else if (this.CartMode === 'catalouge') {
      this.searchText = this.searchText.trim().toLowerCase();
      if (!this.searchText) {
        this.products = [...this.catalougeProducts];
      } else {
        this.products = this.catalougeProducts.filter((product) => {
          const name = product.ItmName?.toLowerCase();
          const code = product.ItmCode?.toLowerCase();
          return (
            name.includes(this.searchText) || code.includes(this.searchText)
          );
        });
      }
    }
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
        this.catalougeFilterPayload[payloadKey] = selected.join(',');
      } else {
        delete this.filterPayload[payloadKey];
        delete this.catalougeFilterPayload[payloadKey];
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
    if (this.CartMode === 'catalouge') {
      this.filterPayload.priceAt = '';
    } else {
      this.filterPayload.priceAt = 'MRP';
    }
    this.filterPayload.brnId = String(this.brnId);
    const filters = JSON.stringify(this.filterPayload);
    console.log(filters);

    this.shoppingCartService.getItems(filters).subscribe({
      // next: (res: any) => {
      //   const items = res?.ShopCartItemCatgoryList ?? [];
      //   items.forEach((item: any) => {
      //     const price = item?.Itemprices?.[0];
      //     if (price) {
      //       // price.Stock = price.Vstock + price.Fstock;
      //       if (price.UnitFactorType == '%') {
      //         price.Stock =
      //           (price.Vstock + price.Fstock) * Number(price.UnitFactor);
      //       } else {
      //         price.Stock =
      //           (price.Vstock + price.Fstock) / Number(price.UnitFactor);
      //       }
      //       if (this.CartMode === 'catalouge') {
      //         price.ShowPrice = price.Price;
      //         this.catalougeProducts.push(item);
      //       } else {
      //         price.ShowPrice = price.MRP;
      //         this.products.push(item);
      //       }
      //       this.catalougeProducts = [];
      //       this.products = [];
      //       if (this.CartMode === 'catalouge') {
      //         price.ShowPrice = price.Price;
      //         this.catalougeProducts.push(item);
      //         this.products = [...this.catalougeProducts];
      //       } else {
      //         price.ShowPrice = price.MRP;
      //         this.products.push(item);
      //       }
      //     }
      //   });
      //   this.productLoader = false;
      // },
      next: (res: any) => {
        const items = res?.ShopCartItemCatgoryList ?? [];

        this.catalougeProducts = [];
        this.products = [];

        items.forEach((item: any) => {
          const price = item?.Itemprices?.[0];
          if (price) {
            if (price.UnitFactorType == '%') {
              price.Stock =
                (price.Vstock + price.Fstock) * Number(price.UnitFactor);
            } else {
              price.Stock =
                (price.Vstock + price.Fstock) / Number(price.UnitFactor);
            }

            if (this.CartMode === 'catalouge') {
              price.ShowPrice = price.Price;
              this.catalougeProducts.push(item);
            } else {
              price.ShowPrice = price.MRP;
              this.products.push(item);
            }
          }
        });

        if (this.CartMode === 'catalouge') {
          this.products = [...this.catalougeProducts];
        }

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

  applyCatalougeFilters(): void {
    this.catalougeFilterPayload.fromPrice = this.minValue;
    this.catalougeFilterPayload.toPrice = this.maxValue;
    // Reset if no filters
    const isFilterEmpty = Object.entries(this.catalougeFilterPayload).every(
      ([key, value]) => {
        if (typeof value === 'boolean') return !value;
        // if (typeof value === 'number') return value === 0;
        return !value || value.toString().trim() === '';
      }
    );

    if (isFilterEmpty) {
      this.products = [...this.catalougeProducts]; // show all items
      return;
    }

    this.products = this.catalougeProducts.filter((product) => {
      const firstPrice = product.Itemprices?.[0];

      // Price filter
      if (
        (this.catalougeFilterPayload.fromPrice > 0 ||
          this.catalougeFilterPayload.toPrice > 0) &&
        firstPrice
      ) {
        const mrp = firstPrice.Price ?? 0;
        const from = this.catalougeFilterPayload.fromPrice || 0;
        const to = this.catalougeFilterPayload.toPrice || Infinity;
        if (mrp < from || mrp > to) return false;
      }

      // Stock filter
      if (
        this.catalougeFilterPayload.withStock &&
        (!firstPrice || firstPrice.Stock <= 0)
      ) {
        return false;
      }

      // Image filter
      if (
        this.catalougeFilterPayload.withImage === true &&
        product.ItmImageFile === ''
      ) {
        return false;
      }
      // Apply other filters
      for (const key in this.catalougeFilterPayload) {
        if (
          [
            'divFilter',
            'catFilter',
            'subCatFilter',
            'brandFilter',
            'seasonFilter',
            'occFilter',
            'genderFilter',
            'baseItmFilter',
            'varFilter',
            'sizeFilter',
            'colorFilter',
            'atrribute1Filter',
            'atrribute2Filter',
            'atrribute3Filter',
            'atrribute4Filter',
          ].includes(key)
        ) {
          const value = this.catalougeFilterPayload[key];
          if (typeof value === 'string' && value.trim() !== '') {
            const values = value.split(',').map((v) => v.trim());
            const itemValue = this.getProductProperty(product, key);
            if (!values.includes(String(itemValue))) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }

  getProductProperty(product: any, filterKey: string): number | null {
    const map: { [key: string]: string } = {
      divFilter: 'ItmDivId',
      catFilter: 'ItmCatId',
      subCatFilter: 'ItmSubCatId',
      brandFilter: 'ItmBrandId',
      seasonFilter: 'ItmSeasonId',
      occFilter: 'ItmOccaId',
      genderFilter: 'ItmGenderId',
      baseItmFilter: 'ItmBaseId',
      varFilter: 'ItmVarientId',
      sizeFilter: 'ItmSizeId',
      colorFilter: 'ItmColorId',
      atrribute1Filter: 'ItmAtt1Id',
      atrribute2Filter: 'ItmAtt2Id',
      atrribute3Filter: 'ItmAtt3Id',
      atrribute4Filter: 'ItmAtt4Id',
    };

    const prop = map[filterKey];
    return prop ? product[prop] ?? null : null;
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
    if (this.CartMode === 'catalouge') {
      this.catalougeFilterPayload.withStock = this.inStock;
    }
    this.applyFilters();
  }

  onWithImageChange(event: Event): void {
    this.withImage = (event.target as HTMLInputElement).checked;
    this.filterPayload.withImage = this.withImage;
    if (this.CartMode === 'catalouge') {
      this.catalougeFilterPayload.withImage = this.withImage;
    }
    this.applyFilters();
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

  priceFilter() { }

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

  filterPayload: {
    [key: string]: any;
    brnId?: string;
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
    priceAt?: string;
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
    fyrId: 25,
    wrhId: 0,
    vdate: '',
    cmpId: 1,
    mkey: '',
    withStock: true,
    allowNegStock: true,
    brnType: '',
    itemType: '',
    isWrhUnderIncl: false,
    btpCode: 'SO',
    getpriceCode: false,
    maxLength: 10,
    catType: '',
    catId: 0,
    // priceAt: 'MRP',
    searchType: '',
    searchValue: '',
    tempName: '',
    pageNumber: 1,
    fromPrice: 0,
    toPrice: 0,
    stockFilter: true,
    withImage: true,
    orderCatelogName: '',
  };

  catalougeFilterPayload: {
    [key: string]: any;
    withStock: boolean;
    fromPrice: number;
    toPrice: number;
    withImage: boolean;
  } = {
      withStock: true,
      fromPrice: 0,
      toPrice: 0,
      withImage: true,
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
    this.selectedSideFilter = filter;
  }

  addToCart(product: Product) {
    try {
      // if (product.Itemprices[0].Stock <= 0) {
      //   Swal.fire({
      //     toast: true,
      //     icon: 'warning',
      //     title: 'Item is out of stock',
      //     position: 'top-end',
      //     showConfirmButton: false,
      //     timer: 2000,
      //     timerProgressBar: true,
      //   });
      //   return;
      // }
      let existing: boolean = false;
      if (this.CartMode === 'catalouge') {
        existing = this.cart.find(
          (item) =>
            item.ItmId === product.ItmId ||
            item.ItemPrices?.[0]?.MRP === product.Itemprices?.[0]?.MRP
        );
      } else {
        existing = this.cart.find((item) => item.ItmId === product.ItmId);
      }
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

  increaseItmCardQty(product: Product): void {
    if (product.ItmQty >= product.Itemprices[0].Stock) {
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Quantity exceeds available stock',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    product.ItmQty = (product.ItmQty || 1) + 1;
  }

  decreaseItmCardQty(product: Product): void {
    if (product.ItmQty && product.ItmQty > 1) {
      product.ItmQty--;
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

    // if (this.isCartEditing) {
    //   const editableItem = this.salesOrderService.getEditableItem();
    //   this.salesOrder = {
    //     psomMKey: editableItem.mkey,
    //     psomItmCount: this.cart.length,
    //     psomItmQty: this.cart.reduce(
    //       (sum, item) => sum + (item.ItmQty || 0),
    //       0
    //     ),
    //     psomNetAmount: this.cart.reduce(
    //       (sum, item) =>
    //         sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
    //       0
    //     ),
    //     psomModUser: this.userService._user?.UsrAddUser,
    //     psoDetails: this.cart.map((item) => {
    //       const price = item.Itemprices[0];
    //       const qty = item.ItmQty || 1;
    //       const rate = price?.MRP || 0;

    //       return {
    //         psodItmId: item.ItmId,
    //         psodPack: price?.Pack || '',
    //         psodMRP: rate,
    //         psodRate: rate,
    //         psodQty: qty,
    //         psodUnitId: item.ItmUntId || 0,
    //         psodUnitFactor: price?.UnitFactor || 1,
    //         psodNetAmount: qty * rate,
    //         psodStock: price?.Stock || 0,
    //         psodBaseQty: qty * (price?.UnitFactor || 1),
    //         psodBaseUnitId: item.ItmBaseUntId || 0,
    //         psodRemarks: '',
    //       };
    //     }),
    //   };
    //   this.salesOrderService.updateSalesOrder(this.salesOrder).subscribe({
    //     next: (res) => {
    //       this.closeCartModal();
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Checkout successful',
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //       this.salesOrderService.clearEditableItem();
    //       this.cart = [];
    //       this.router.navigate(['/all-orders']);
    //     },
    //     error: (err) => {
    //       Swal.fire({
    //         toast: true,
    //         icon: 'error',
    //         title: 'We were not able to update your order.',
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
    //     },
    //   });
    // }else {
    //   this.salesOrder = {
    //     // psomCmpId: Number(sessionStorage.getItem('UsrCtrlCmpId')),
    //     psomCmpId: this.userService._user?.UsrCCmpId,
    //     // psomBrnId: Number(sessionStorage.getItem('UsrBrnId')),
    //     psomBrnId: this.userService._user?.UsrBrnId,
    //     // psomAcmId: Number(sessionStorage.getItem('UsrLinkAcmId')),
    //     psomAcmId: this.userService._user?.UsrLinkAcmId,
    //     psomVtype: 'PSO',
    //     psomItmCount: this.cart.length,
    //     psomItmQty: this.cart.reduce(
    //       (sum, item) => sum + (item.ItmQty || 0),
    //       0
    //     ),
    //     psomNetAmount: this.cart.reduce(
    //       (sum, item) =>
    //         sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
    //       0
    //     ),
    //     psomOrderType: sessionStorage.getItem('cartMode') || '',
    //     psomStatus: 'CREATED',
    //     psomStatusCode: 1,
    //     // psomAddUser: sessionStorage.getItem('UsrAddUser') || '',
    //     psomAddUser: this.userService._user?.UsrAddUser,
    //     psomModUser: '',
    //     psoDetails: this.cart.map((item) => {
    //       const price = item.Itemprices[0];
    //       const qty = item.ItmQty || 1;
    //       const rate = price?.MRP || 0;

    //       return {
    //         psodItmId: item.ItmId,
    //         psodPack: price?.Pack || '',
    //         psodMRP: rate,
    //         psodRate: rate,
    //         psodQty: qty,
    //         psodUnitId: item.ItmUntId || 0,
    //         psodUnitFactor: price?.UnitFactor || 1,
    //         psodNetAmount: qty * rate,
    //         psodStock: price?.Stock || 0,
    //         psodBaseQty: qty * (price?.UnitFactor || 1),
    //         psodBaseUnitId: item.ItmBaseUntId || 0,
    //         psodRemarks: '',
    //       };
    //     }),
    // };

    //   this.salesOrderService.postSalesOrder(this.salesOrder).subscribe({
    //     next: (res) => {
    //       this.closeCartModal();
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Checkout successful',
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //       this.cart = [];
    //       this.router.navigate(['/all-orders']);
    //     },
    //     error: (err) => {
    //       Swal.fire({
    //         toast: true,
    //         icon: 'error',
    //         title: 'We were not able to create your order.',
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
    //     },
    //   });
    // }
    const now = new Date();
    const somFyrId = now.getFullYear() % 100;
    const gstRateMap: Record<number, number> = {
      0: 4,
      5: 1,
      12: 2,
      18: 3,
      28: 5,
      40: 6
    };
    if (this.isCartEditing) {
      const editableItem = this.salesOrderService.getEditableItem();
      // console.log('ed',editableItem)
      this.salesOrder = {
        SomMkey: editableItem.SO.SomMkey,
        SomCmpId:
          this.userService._user?.UsrCCmpId &&
          this.userService._user?.UsrCCmpId !== 0
            ? this.userService._user.UsrCCmpId
            : 1,
        SomBrnId: this.userService._user?.UsrBrnId ?? 0,
        SomAcmId: this.userService._user?.UsrLinkAcmId ?? 0,
        SomVtype: this.modelVtype,
        SomShpBrnId: this.userService._user?.UsrBrnId ?? 0,
        SomNetAmt: this.cart.reduce(
          (sum, item) =>
            sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
          0
        ),
        SomStsCode: 0,
        SomFyrId: somFyrId,
        SomIsJSonBase: true,
        SomVdate: now,
        SomBtpCode: this.BtpCode,
        SomModUser: this.userService._user?.UsrAddUser,
        SoDetails: this.cart.map((item, index) => {
          const price = item.Itemprices[0];
          const qty = item.ItmQty || 1;
          const rate = price?.MRP || 0;
          // const gst = parseFloat(price.Gst.match(/\d+(\.\d+)?/)![0]);
          // console.log('p',price)
          return {
            SodItmId: item.ItmId,
            SodRowNo: index + 1,
            SodSomMkey: item.ItmSodMKey,
            SodQty: qty,
            SodUntId: item.ItmPackUntId,
            SodPack: item.ItmUntId,
            SodNetAmt: qty * rate,
            SodBaseUntId: 1,
            SodStock: 2,
            SodRemarks: '',
            SodGstId: price.GstId || 0,
            SodMrp: rate,
            SodRate: rate,
            SodUnitFactor: price?.UnitFactor || 1,
            SodBaseQty: qty * (price?.UnitFactor || 1),
            SodItmName: item.ItmName || '',
            SodItmCode: item.ItmCode || '',
            // SodItmUnitFactorType: price.UnitFactorType || '',
            SodBaseUntCode: item.ItmBaseUntCode,
          };
        }),
      };
      this.salesOrderService.updateSO(this.salesOrder).subscribe({
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
          this.router.navigate(['/all-orders']);
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
      // console.log('Cart before creating SO:', this.cart);
      this.salesOrder = {
        SomCmpId:
          this.userService._user?.UsrCCmpId &&
          this.userService._user?.UsrCCmpId !== 0
            ? this.userService._user.UsrCCmpId
            : 1,
        SomBrnId: this.userService._user?.UsrBrnId ?? 0,
        SomAcmId: this.userService._user?.UsrLinkAcmId ?? 0,
        SomVtype: this.modelVtype,
        SomType: this.somType,
        SomDocType: this.somDocType,
        SomVnoPrefix: this.modelVnoPrefix,
        SomNetAmt: this.cart.reduce(
          (sum, item) =>
            sum + (item.ItmQty || 0) * (item.Itemprices[0]?.MRP || 0),
          0
        ),
        SomStsCode: 0,
        SomAddUser: this.userService._user?.UsrAddUser,
        SomFyrId: somFyrId,
        SomModUser: '',
        SomIsJSonBase: true,
        SomAddDate: now,
        SomShpDlvDate: now,
        SomLcDate: now,
        SomLcExpDate: now,
        SomTId: this.somTId,
        SomRemarks: '',
        SomDlvDate: now,
        SomVdate: now,
        SomBtpCode: this.BtpCode,
        SomShpBrnId: this.userService._user?.UsrBrnId ?? 0,
        SoDetails: this.cart.map((item, index) => {
          const price = item.Itemprices[0];
          const qty = item.ItmQty || 1;
          const rate = price?.MRP || 0;
          const gstRate = item.Itemprices[0];
          const sodGstId = gstRate.GstRate;
          const StokcValue = this.cart[0].Itemprices[0].Stock;
          const remarks =
            StokcValue < 0 ? 'STOCK NOT AVAILABLE' : 'STOCK AVAILABLE';
          // console.log('cart', this.cart[0].Itemprices[0].Stock)
          return {
            SodItmId: item.ItmId,
            SodRowNo: index + 1,
            SodPack: price?.Pack || '',
            SodMrp: rate,
            SodRate: rate,
            SodQty: qty,
            SodUntId: item.ItmPackUntId || 0,
            SodUnitFactor: price?.UnitFactor || 1,
            SodNetAmt: qty * rate,
            SodStock: price?.Stock || 0,
            SodBaseQty: qty * (price?.UnitFactor || 1),
            SodBaseUntId: item.ItmBaseUntId || 0,
            SodRemarks: remarks,
            SodGstId: gstRateMap[sodGstId],
            SodItmName: price.ItmName || '',
            SodItmCode: item.ItmCode || '',
            SodItmUnitFactorType: price.UnitFactorType || '',
            SodBaseUntCode: item.ItmBaseUntCode || '',
          } as SODetail;
        }),
      };
      // console.log('creating..', this.salesOrder);

      this.salesOrderService.postSO(this.salesOrder).subscribe({
        next: (res) => {
          this.closeCartModal();
          Swal.fire({
            icon: 'success',
            title: 'Checkout successful',
            showConfirmButton: false,
            timer: 1000,
          });
          this.cart = [];
          this.router.navigate(['/all-orders']);
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

  // setEditableItems() {
  //   const editableItem = this.salesOrderService.getEditableItem();
  //   if (!editableItem?.psoItems?.length) return;

  //   this.cart = editableItem.psoItems.map((psoItem: any) => {
  //     const item: any = {
  //       ItmId: psoItem.itmId,
  //       ItmCode: psoItem.itmCode,
  //       ItmName: psoItem.itmName,
  //       ItmMrp: 0.0,
  //       ItmQty: psoItem.qty,
  //       Itemprices: [
  //         {
  //           MRP: psoItem.mrp,
  //           ShowPrice: psoItem.mrp,
  //         },
  //       ],
  //     };
  //     return item;
  //   });
  // }

  setEditableItemsSO() {
    const editableItem = this.salesOrderService.getEditableItem();
    // console.log("editables", editableItem)
    if (!editableItem?.SO?.SoDetails?.length) return;

    this.cart = editableItem.SO.SoDetails.map((detail: any) => {
      const item: any = {
        ItmId: detail.SodItmId,
        ItmSodMKey: detail.SodSomMkey,
        ItmUntId: detail.SodPack,
        ItmCode: detail.SodItmCode,
        ItmName: detail.SodItmName,
        ItmMrp: 0.0,
        ItmQty: detail.SodQty,
        ItmStock: detail.SodStock,
        ItmBaseUntCode: detail.SodBaseUntCode,
        ItmBaseUntId: detail.SodBaseUntId,
        ItmPackUntId: detail.SodUntId,
        Itemprices: [
          {
            MRP: detail.SodMrp,
            ShowPrice: detail.SodMrp,
            GstId: detail.SodGstId,
            UnitFactor: detail.SodUnitFactor,
          },
        ],
      };
      // console.log('item', item)
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

  BindDropDown(BtpCode: any) {
    this.salesOrderService.BindDropDown(BtpCode).subscribe((res: any) => {
      // console.log('voucher list', res.VoucherTypeList);

      this.VoucherTypeList = res.VoucherTypeList;
      this.modelVtype = res.VoucherTypeList[1]['Id'];
      // console.log('saleorder ', this.salesOrder);
    });
  }

  GetVoucherPrefix() {
    const now = new Date();
    var Vtype = 'SOM';
    var BrnId = this.userService._user?.UsrBrnId ?? 0;
    var FyrId = now.getFullYear() % 100;
    var Vdate = now;
    var AcmId = this.userService._user?.UsrLinkAcmId ?? 0;

    this.salesOrderService.GetVoucherPrefix(Vtype, BrnId, FyrId, Vdate, AcmId).subscribe((res: any) => {
      // console.log('res', res);
      this.modelVnoPrefix = res.VNOPREFFIX;
      // console.log('saleorder ', this.salesOrder);
    })
  }

  GetTId() {
    var TrnId = this.GetTransactionNumber();
    this.somTId = TrnId ? this.bookType + TrnId : '';
  }

  GetTransactionNumber() {
    var Date1 = new Date();
    return Date1.getTime();
  }
   filterCatalogues() {
    const search = this.searchCatalogue.toLowerCase();
    this.filteredCatalogueList = this.itemCatalougeList.filter((item) =>
      item.Text.toLowerCase().includes(search)
    );
  }

  toggleSearch(show: boolean) {
    this.showSearch = show;
    this.categoryDropDownOpen = show;
    if (show) {
      this.filteredCatalogueList = [...this.itemCatalougeList];
    } else {
      this.searchCatalogue = '';
    }
  }
}
