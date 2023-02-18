import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  @Input() title: string = 'Item Delete';
  @Input() description: string = 'Are you sure to permanently delete this Item?';

  constructor(
    public modal: NgbActiveModal
  ) { }

}
