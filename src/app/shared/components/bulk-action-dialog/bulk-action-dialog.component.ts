import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bulk-action-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    NgbModule,
    NgFor
  ],
  templateUrl: './bulk-action-dialog.component.html',
  styleUrls: ['./bulk-action-dialog.component.scss']
})
export class BulkActionDialogComponent {

  selectedAction: string = '';

  constructor(
    private modalService: NgbModal,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<BulkActionDialogComponent>
  ) { }

  submit() {
    if (!this.selectedAction) return;

    import('../confirm/confirm.component').then(
      ({ ConfirmComponent }) => {
        const modalRef = this.modalService.open(ConfirmComponent);
        modalRef.componentInstance.title = `Action ${this.selectedAction}`;
        modalRef.componentInstance.description = 'Are you sure you want to take this action?';
        modalRef.result.then(
          () => { },
          (result) => {
            if (result) {
              this.matDialogRef.close(this.selectedAction);
            }
          }
        );
      }
    )
  }

}
