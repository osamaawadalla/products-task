import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeaturesService } from './services/features.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [FeaturesService],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, OnDestroy {

  features: Feature[] = [];

  ColumnMode = ColumnMode;
  editing: any = {};

  private subscription: Subscription = new Subscription();

  constructor(
    private toastr: ToastrService,
    private featuresService: FeaturesService,
    private modalService: NgbModal,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getFeatures();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getFeatures(): void {
    this.subscription.add(this.featuresService.getFeatures()
      .subscribe({
        next: res => {
          this.features = res.data;
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
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
    if (event.target.value) {
      this.subscription.add(this.featuresService.updateFeatures(this.features[rowIndex].id!, event.target.value)
        .subscribe({
          next: res => {
            this.editing[rowIndex + '-' + cell] = false;
            this.features[rowIndex].name = event.target.value;
            this.features = [...this.features];
            this.toastr.success(res.message, '');
          },
          error: err => {
            this.toastr.error(err.message, '');
            this.editing[rowIndex + '-' + cell] = false;
          }
        }))
    } else {
      this.editing[rowIndex + '-' + cell] = false;
    }
  }

  deleteFeature(id: number): void {
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
    this.subscription.add(this.featuresService.deleteFeature(ids)
      .subscribe({
        next: res => {
          this.getFeatures();
          this.toastr.success(res.message, '');
        },
        error: err => {
          this.toastr.error(err.message, '');
        }
      }))
  }

  checkBulkAction(): boolean {
    for (let index = 0; index < this.features.length; index++) {
      const element: any = this.features[index];
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
            this.delete(this.features.filter((feature: any) => feature.selection).map(feature => feature.id));
          }
        }))
      }
    )
  }

}
