import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductService } from './services/add-product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [AddProductService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {

  productId: any;
  product: any;
  features: Feature[] = [];
  formGroup!: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addProductService: AddProductService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkParams();
    this.getFeatures();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkParams(): void {
    this.subscription.add(this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
        this.getProductById(this.productId);
      }
    }))
  }

  initForm() {
    this.formGroup = this.fb.group({
      code: ['', Validators.compose([])],
      name: ['', Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required, Validators.min(1)])],
      features: [[], Validators.compose([Validators.required])]
    })
  }

  getProductById(id: any): void {
    this.subscription.add(this.addProductService.getProductById(id)
      .subscribe({
        next: res => {
          this.product = res.item;
          this.formGroup?.patchValue(this.product);
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  getFeatures(): void {
    this.subscription.add(this.addProductService.getFeatures()
      .subscribe({
        next: res => {
          this.features = res.data;
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  submitForm(): void {
    if (this.productId) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct(): void {
    if (this.formGroup.valid) {
      this.subscription.add(this.addProductService.addProduct(this.formGroup.value)
        .subscribe({
          next: res => {
            this.toastr.success(res.message, '');
            this.router.navigate(['/products']);
          },
          error: err => {
            this.toastr.error(err.message, '');
          }
        }))
    } else {
      this.toastr.error('Please fill required fields!', '');
    }
  }

  updateProduct(): void {
    if (this.formGroup.valid) {
      this.subscription.add(this.addProductService.updateProduct(this.productId, this.formGroup.value)
        .subscribe({
          next: res => {
            this.toastr.success(res.message, '');
            this.router.navigate(['/products']);
          },
          error: err => {
            this.toastr.error(err.message, '');
          }
        }))
    } else {
      this.toastr.error('Please fill required fields!', '');
    }
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

}
