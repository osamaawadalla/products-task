import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { BulkActionDialogComponent } from 'src/app/shared/components/bulk-action-dialog/bulk-action-dialog.component';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';
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
    ConfirmComponent,
    BulkActionDialogComponent,
    MatDialogModule
  ],
  providers: [FeaturesService],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit, OnDestroy {

  features: Feature[] = [];
  columns: any[] = [
    { prop: 'id', name: 'ID' },
    { prop: 'name', name: 'Name' },
    { name: 'Actions' }
  ];

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
          }
        }))
    } else {
      this.editing[rowIndex + '-' + cell] = false;
    }
  }

  deleteFeature(id: number, rowIndex: number): void {
    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.componentInstance.itemType = 'Feature';
    modalRef.result.then(
      () => { },
      (result) => {
        if (result) {
          this.delete(id, rowIndex);
        }
      }
    );
  }

  delete(id: number, rowIndex: number) {
    this.subscription.add(this.featuresService.deleteFeature(id)
      .subscribe({
        next: res => {
          this.features.splice(rowIndex, 1);
          this.features = [...this.features];
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

  bulkAction() {
    const dialogRef = this.matDialog.open(BulkActionDialogComponent, {
      width: "600px",
      data: {
        selectedRow: this.features.filter((feature: any) => feature.selection)
      }
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      // if (res == 'updated') {
      //   this.selection.clear();
      //   let data: TableActions = {
      //     actionType: 'update_bulk_action',
      //     payload: {}
      //   }
      //   this.onAction.emit(data);
      // }
    })
  }

}
