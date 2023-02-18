import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { Product } from 'src/app/core/models/product';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    NgbModule,
    MatDialogModule,
    NgSelectModule
  ],
  providers: [ProductsService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  features: Feature[] = [];
  ColumnMode = ColumnMode;

  private subscription: Subscription = new Subscription();

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getFeatures();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getFeatures(): void {
    this.subscription.add(this.productsService.getFeatures()
      .subscribe({
        next: res => {
          this.features = res.data;
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  getProducts(): void {
    this.subscription.add(this.productsService.getProducts()
      .subscribe({
        next: res => {
          this.products = this.filteredProducts = res.data;
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  deleteProduct(id: number): void {
    import('../../shared/components/confirm/confirm.component').then(
      ({ ConfirmComponent }) => {
        const modalRef = this.modalService.open(ConfirmComponent);
        modalRef.componentInstance.title = 'Feature Delete';
        modalRef.componentInstance.description = 'Are you sure to permanently delete this Feature?';
        modalRef.result.then(
          () => { },
          (result) => {
            if (result) {
              this.delete([id]);
            }
          }
        );
      }
    )
  }

  delete(ids: any[]): void {
    this.subscription.add(this.productsService.deleteProduct(ids)
      .subscribe({
        next: res => {
          this.getProducts();
          this.toastr.success(res.message, '');
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  checkBulkAction(): boolean {
    for (let index = 0; index < this.products.length; index++) {
      const element: any = this.products[index];
      if (element.selection) {
        return false;
      }
    }
    return true;
  }

  bulkAction(): void {
    import('../../shared/components/bulk-action-dialog/bulk-action-dialog.component').then(
      ({ BulkActionDialogComponent }) => {
        const dialogRef = this.matDialog.open(BulkActionDialogComponent, {
          width: "600px",
          data: {
            actions: ['delete']
          }
        })

        this.subscription.add(dialogRef.afterClosed().subscribe((result: any) => {
          if (result == 'delete') {
            this.delete(this.products.filter((product: any) => product.selection).map(product => product.id));
          }
        }))
      }
    )
  }

  filterProducts(filterForm: NgForm): void {
    let hasFilter: boolean = false;
    this.filteredProducts = this.products;
    let filtered: any[] = [];
    const formValue: any = filterForm.value;
    Object.keys(formValue).forEach((key: any) => {
      if (formValue[key] && formValue[key].toString().length) {
        hasFilter = true;
        filtered.push(...this.products.filter((product: any) => product[key].toString().toLowerCase().includes(formValue[key])));
      }
    })

    hasFilter ?
      this.filteredProducts = [...filtered.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)] :
      this.filteredProducts = [...this.products];
  }

  getFeatureName(featureId: number): any {
    return this.features.find(feature => feature.id == featureId)?.name;
  }

}
