import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeaturesService } from './services/features.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    NgxDatatableModule
  ],
  providers: [FeaturesService],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, OnDestroy {

  features: Feature[] = [];
  columns: any[] = [
    { prop: 'id', name: 'ID' },
    { prop: 'name', name: 'Name' }
  ];

  ColumnMode = ColumnMode;
  editing: any = {};

  private subscription: Subscription = new Subscription();

  constructor(
    private toastr: ToastrService,
    private featuresService: FeaturesService
  ) { }

  ngOnInit(): void {
    this.getFeatures();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getFeatures(): void {
    this.featuresService.getFeatures()
      .subscribe({
        next: res => {
          this.features = res.data;
        },
        error: err => {
          this.toastr.success(err.message, '');
        }
      })
  }

  addFeature(featureForm: NgForm): void {
    if (featureForm.valid) {
      this.subscription.add(this.featuresService.addFeature(featureForm.value)
        .subscribe({
          next: res => {
            featureForm.reset();
            this.toastr.success(res.message, '');
            this.getFeatures();
          }
        }))
    } else {
      this.toastr.error('Name is required!', '');
    }
  }

  updateValue(event: any, cell: string, rowIndex: number): void {
    this.editing[rowIndex + '-' + cell] = false;
    this.features[rowIndex].name = event.target.value;
    this.features = [...this.features];
  }

}
